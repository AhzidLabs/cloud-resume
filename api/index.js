const { TableClient, AzureNamedKeyCredential } = require("@azure/data-tables");

module.exports = async function (context, req) {
  const tableName = process.env.STORAGE_TABLE_NAME || "visitorCount";

  // derive account creds from connection string
  const cs = process.env.AzureWebJobsStorage;
  const accountName = /AccountName=([^;]+)/.exec(cs)[1];
  const accountKey  = /AccountKey=([^;]+)/.exec(cs)[1];

  const client = new TableClient(
    `https://${accountName}.table.core.windows.net`,
    tableName,
    new AzureNamedKeyCredential(accountName, accountKey)
  );

  const pk = "cv", rk = "visitor";
  try {
    const e = await client.getEntity(pk, rk);
    e.count = (e.count || 0) + 1;
    await client.updateEntity(e, "Replace");
    context.res = { body: { count: e.count } };
  } catch {
    await client.createEntity({ partitionKey: pk, rowKey: rk, count: 1 });
    context.res = { body: { count: 1 } };
  }
};
