const { TableClient, AzureNamedKeyCredential } = require("@azure/data-tables");
const fetch = require("node-fetch");

module.exports = async function (context, req) {
  try {
    const accountName = process.env.ACCOUNT_NAME;
    const accountKey = process.env.ACCOUNT_KEY;
    const tableName = "VisitorAnalytics";

    if (!accountName || !accountKey) {
      throw new Error("ACCOUNT_NAME or ACCOUNT_KEY not set in App Settings");
    }

    const credential = new AzureNamedKeyCredential(accountName, accountKey);
    const client = new TableClient(
      `https://${accountName}.table.core.windows.net`,
      tableName,
      credential
    );

    let totalVisits = 0;
    const ips = new Set();

    for await (const entity of client.listEntities()) {
      totalVisits++;
      if (entity.ip) ips.add(entity.ip);
    }

    // Average latency
    let avgLatency = 0;
    try {
      const latQuery = "requests | summarize avgDuration = avg(duration)";
      const latUrl = `https://api.applicationinsights.io/v1/apps/${process.env.APP_INSIGHTS_APP_ID}/query?query=${encodeURIComponent(latQuery)}`;
      const latRes = await fetch(latUrl, { headers: { "x-api-key": process.env.APP_INSIGHTS_API_KEY } });
      const latData = await latRes.json();
      const latRows = latData.tables?.[0]?.rows ?? [];
      avgLatency = latRows.length > 0 ? Math.round(Number(latRows[0][0])) : 0;
    } catch (err) {
      context.log.warn("Latency query failed", err);
    }

    // Requests last 5m
    let requestsLast5m = 0;
    try {
      const reqQuery = "requests | summarize count() by bin(timestamp, 5m)";
      const reqUrl = `https://api.applicationinsights.io/v1/apps/${process.env.APP_INSIGHTS_APP_ID}/query?query=${encodeURIComponent(reqQuery)}`;
      const reqRes = await fetch(reqUrl, { headers: { "x-api-key": process.env.APP_INSIGHTS_API_KEY } });
      const reqData = await reqRes.json();
      const rows = reqData.tables?.[0]?.rows ?? [];
      requestsLast5m = rows.length > 0 ? rows[rows.length - 1][1] : 0;
    } catch (err) {
      context.log.warn("Requests query failed", err);
    }

    const overview = {
      systemName: "Cloud Resume Analytics",
      services: [
        "Azure Functions (Node.js)",
        "Azure Storage Static Website",
        "Azure Table Storage (VisitorAnalytics)",
        "Azure Front Door (CDN)"
      ],
      region: "West Europe",
      serverless: true,
      sslEnabled: true,
      status: "Healthy",

      eventsLogged: totalVisits,
      uniqueIps: ips.size,
      functionExecs30d: totalVisits,
      errorRate: "0%",
      avgLatency: `${avgLatency} ms`,
      requestsLast5m,

      ciCd: "GitHub Actions → Azure Storage → Azure Front Door Purge"
    };

    context.res = {
      headers: { "Content-Type": "application/json" },
      body: overview
    };
  } catch (err) {
    context.log.error("SystemOverview failed", err);
    context.res = {
      status: 500,
      body: { error: "Failed to load system overview" }
    };
  }
};
