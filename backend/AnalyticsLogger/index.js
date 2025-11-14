const { TableClient, AzureNamedKeyCredential } = require("@azure/data-tables");

module.exports = async function (context, req) {
    try {
        // -------------------------------
        // 1. Get visitor data
        // -------------------------------
        const ip =
            req.headers["x-forwarded-for"]?.split(",")[0] ||
            req.headers["client-ip"] ||
            req.headers["x-real-ip"] ||
            "0.0.0.0";

        const userAgent = req.headers["user-agent"] || "Unknown";

        const timestamp = new Date().toISOString();

        // -------------------------------
        // 2. Save data to Table Storage
        // -------------------------------
        const accountName = process.env.ACCOUNT_NAME;
        const accountKey = process.env.ACCOUNT_KEY;
        const tableName = "VisitorAnalytics";

        const credential = new AzureNamedKeyCredential(accountName, accountKey);
        const client = new TableClient(
            `https://${accountName}.table.core.windows.net`,
            tableName,
            credential
        );

        // Ensure table exists
        await client.createTable({ onResponse: () => {} }).catch(() => {});

        const entity = {
            partitionKey: ip,
            rowKey: timestamp,
            IP: ip,
            Timestamp: timestamp,
            UserAgent: userAgent
        };

        await client.createEntity(entity);

        // -------------------------------
        // 3. Count UNIQUE visitors
        // -------------------------------
        let uniqueVisitors = 0;
        for await (const entity of client.listEntities()) {
            if (entity.rowKey.endsWith("T00:00:00.000Z")) {
                uniqueVisitors++;
            }
        }

        // -------------------------------
        // 4. Count ALL visits
        // -------------------------------
        let totalVisits = 0;
        for await (const entity of client.listEntities()) {
            totalVisits++;
        }

        // -------------------------------
        // 5. Return analytics result
        // -------------------------------
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
        context.res = {
            status: 500,
            body: { error: err.message }
        };
    }
};
