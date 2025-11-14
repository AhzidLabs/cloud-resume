const { TableClient, AzureNamedKeyCredential } = require("@azure/data-tables");

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
