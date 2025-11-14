const { TableClient, AzureSASCredential } = require("@azure/data-tables");

/**
 * Expected app settings on the Function App:
 *  - TABLES_ENDPOINT     e.g. https://<storageaccount>.table.core.windows.net
 *  - TABLES_SAS          e.g. sv=...&ss=t&srt=... (SAS with Table permissions)
 *  - TABLE_NAME          e.g. VisitorCount
 * You can also switch to a connection string pattern if you prefer.
 */
module.exports = async function (context, req) {
  try {
    const endpoint = process.env.TABLES_ENDPOINT;
    const sas = process.env.TABLES_SAS;
    const tableName = process.env.TABLE_NAME || "VisitorCount";

    if (!endpoint || !sas) {
      context.log.error("Storage table settings missing.");
      context.res = { status: 500, body: { error: "Missing TABLES_ENDPOINT or TABLES_SAS" } };
      return;
    }

    // Init client
    const client = new TableClient(endpoint, tableName, new AzureSASCredential(sas));

    // Ensure table exists
    await client.createTable().catch(() => { /* already exists */ });

    // Single row: partition 'site', row 'home'
    const partitionKey = "site";
    const rowKey = "home";

    // Get current count (or zero)
    let current = 0;
    try {
      const entity = await client.getEntity(partitionKey, rowKey);
      current = Number(entity.count || 0);
    } catch (e) {
      // not found -> start at 0
    }

    const next = current + 1;

    await client.upsertEntity({
      partitionKey,
      rowKey,
      count: next
    }, "Replace"); // Replace to keep it tidy

    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
      body: { count: next, updated: new Date().toISOString() }
    };
  } catch (err) {
    context.log.error("Function error:", err);
    context.res = { status: 500, body: { error: "Internal error", details: String(err) } };
  }
};
