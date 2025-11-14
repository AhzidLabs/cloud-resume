const { TableClient, AzureNamedKeyCredential } = require("@azure/data-tables");

module.exports = async function (context, req) {
  try {
    // 1. Visitor data
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.headers["client-ip"] ||
      req.headers["x-real-ip"] ||
      "0.0.0.0";

    const userAgent = req.headers["user-agent"] || "Unknown";
    const timestamp = new Date().toISOString();

    // 2. Table Storage setup
    const accountName = process.env.ACCOUNT_NAME;
    const accountKey = process.env.ACCOUNT_KEY;
    const tableName = "VisitorAnalytics";

    const credential = new AzureNamedKeyCredential(accountName, accountKey);
    const client = new TableClient(
      `https://${accountName}.table.core.windows.net`,
      tableName,
      credential
    );

    // Make sure table exists (ignore "already exists" error)
    await client.createTable().catch(() => {});

    // 3. Insert this visit
    const entity = {
      partitionKey: ip,      // groups all visits from same IP
      rowKey: timestamp,     // each visit is unique
      IP: ip,
      Timestamp: timestamp,
      UserAgent: userAgent
    };

    await client.createEntity(entity);

    // 4. Stats: total visits + unique IPs
    let totalVisits = 0;
    const uniqueIps = new Set();

    for await (const e of client.listEntities()) {
      totalVisits++;
      uniqueIps.add(e.partitionKey);
    }

    const uniqueVisitors = uniqueIps.size;

    // 5. Return analytics
    context.res = {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: {
        message: "Analytics logged",
        visitor: {
          ip,
          timestamp,
          userAgent
        },
        stats: {
          totalVisits,
          uniqueVisitors
        }
      }
    };
  } catch (err) {
    context.log.error("AnalyticsLogger error:", err);
    context.res = {
      status: 500,
      body: { error: err.message }
    };
  }
};
