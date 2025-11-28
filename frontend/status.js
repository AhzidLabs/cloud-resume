// VisitorCounter endpoint
async function updateVisitorCount() {
  try {
    const res = await fetch("https://ahzid-visitor-func.azurewebsites.net/api/VisitorCounter");
    const data = await res.json();
    document.getElementById("visitorCount").innerText = data.count;
  } catch (err) {
    console.error("VisitorCounter error:", err);
    document.getElementById("visitorCount").innerText = "error";
  }
}

// Application Insights telemetry query
async function updateTelemetry() {
  const query = "requests | summarize count() by bin(timestamp, 5m)";
  const url = `https://api.applicationinsights.io/v1/apps/3e59b746-9ae5-436c-97a4-2c5fc08be395/query?query=${encodeURIComponent(query)}`;

  try {
    const res = await fetch(url, {
      headers: {
        "x-api-key": "m8ne2venoiv3ne0ugdnzfzu6q667gnv6jfkp136u" // replace with the API key you generated in App Insights → API Access
      }
    });
    const data = await res.json();
    const latest = data.tables[0].rows.pop();
    document.getElementById("telemetryRequests").innerText = latest[1];
  } catch (err) {
    console.error("Telemetry error:", err);
    document.getElementById("telemetryRequests").innerText = "error";
  }
}

// Run both on page load
updateVisitorCount();
updateTelemetry();