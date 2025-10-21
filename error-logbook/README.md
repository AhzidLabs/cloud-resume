# 🧩 Error Report – Azure CDN Caching Old Version

**Date Opened:** 2025-10-20  
**Area:** Azure Front Door / Static Website Hosting  
**Severity:** Medium  
**Status:** 🧩 In Progress  

---

## 🕓 Incident Timeline

| Time (UTC) | Action / Observation | Result / Notes |
|-------------|---------------------|----------------|
| **2025-10-20 10:15** | Deployed updated static site files (HTML/CSS/JS) to Azure Storage. | Confirmed new files appear correctly in the storage container. |
| **2025-10-20 10:25** | Opened public website via custom domain. | Still displaying *old version* — HTML not refreshed. |
| **2025-10-20 10:40** | Tested direct blob URL (`https://<storage>.web.core.windows.net/index.html`). | ✅ New version loads correctly. Confirms CDN/Front Door caching. |
| **2025-10-20 11:00** | Used **Purge** under Azure Front Door > Caching > `/*`. | Waited 5 minutes — still loading old version. |
| **2025-10-20 11:30** | Cleared browser + tried Incognito and mobile 4G connection. | Issue persists → not a local cache problem. |
| **2025-10-20 12:00** | Checked Rules Engine for existing cache rules. | No custom rule found; likely default 3-day TTL. |
| **2025-10-20 13:10** | Hypothesis: Missing `Cache-Control` header at origin (Blob). | Need to add explicit caching headers or disable caching for `.html`. |
| **2025-10-20 14:00** | Plan next test: disable AFD caching or add rule `Cache-Control: no-store` for `.html`. | Pending implementation. |

---

## 🧠 Summary (so far)

- Azure Front Door continues to serve cached content even after purge attempts.  
- Direct blob link proves storage is updated.  
- Likely cause: **AFD cache retention due to missing headers or propagation delay.**

---

## 🚧 Next Steps

1. Add a Rules Engine rule:  
   - Condition: `Request URL ends with .html`  
   - Action: Set response header → `Cache-Control: no-store`
2. Redeploy and purge again.
3. If still unresolved, disable caching temporarily to confirm Front Door as the root cause.
4. Document outcome.

---

## 📘 Notes

- Similar issues reported by Azure community users.  
- No service-wide Azure Front Door incidents during testing.  
- This case will be updated as new tests are performed.

---

## 🔗 References

- [Azure Front Door caching overview](https://learn.microsoft.com/en-us/azure/frontdoor/front-door-caching)  
- [How to purge cache in AFD](https://learn.microsoft.com/en-us/azure/frontdoor/how-to-cache-purge)  
- [Rules Engine cache-control options](https://learn.microsoft.com/en-us/azure/frontdoor/front-door-rules-engine)
