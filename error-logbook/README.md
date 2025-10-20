---

### ⚙️ Recent Incident Log

#### 🧩 Azure CDN Downtime & Validation Issue (20 Oct 2025)

**Status:** 🧩 In Progress | **Severity:** 🔴 Critical | **Service:** Azure Front Door / CDN

**Summary:**  
Over the weekend, the Azure CDN profile experienced **intermittent downtime and validation issues**, resulting in cached (stale) versions of the site being served to visitors.  
Azure Resource Health logged a **Critical Health Event** between **19:53–20:02 UTC** on 20 Oct, later marked as resolved.  
No deployment changes were made locally, confirming an **Azure-side validation or certificate fault**.

**Next Steps:**  
- Enable proactive alerts via **Azure Service Health**  
- Add `Cache-Control: no-store` rule for `.html` files  
- Monitor CDN propagation and future health events  

➡️ [View Full Timeline & Technical Log](error-logbook/2025-10-20-CDN-Cache.md)

---
