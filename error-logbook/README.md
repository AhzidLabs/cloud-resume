Error Logbook – Cloud Resume Project

This file records all major issues, what caused them, and how they were fixed.  
It helps track progress and shows real problem-solving skills during this project.

---

Error Report – Azure CDN Caching Old Version

**Date Opened:** 2025-10-20  
**Area:** Azure Front Door / Static Website Hosting  
**Severity:** Medium  
**Status:** ✅ Resolved  

---

### Incident Timeline

| Time | Action / Observation | Result / Notes |
|-------------|---------------------|----------------|
| **2025-10-20 10:15** | Deployed updated static site files (HTML/CSS/JS) to Azure Storage. | Confirmed new files appear correctly in the storage container. |
| **2025-10-20 10:25** | Opened public website via custom domain. | Still showing *old version* — HTML not refreshed. |
| **2025-10-20 10:40** | Tested direct blob URL (`https://storagecloudresumeahzid.z33.web.core.windows.net/index.html`). | ✅ New version loads correctly — confirmed issue is with Azure Front Door caching. |
| **2025-10-20 11:00** | Used **Purge** option under Azure Front Door → Caching → `/*`. | Waited 5 minutes — still showing old version. |
| **2025-10-20 11:30** | Cleared browser cache + tested Incognito + mobile 4G connection. | Same issue → not a local cache problem. |
| **2025-10-20 12:00** | Checked AFD Rules Engine. | No custom rule found — likely default 3-day cache TTL. |
| **2025-10-20 13:10** | Hypothesis: Missing `Cache-Control` headers at the origin (Blob). | Planned to add explicit cache rules or disable caching for `.html`. |
| **2025-10-20 14:00** | Planned test: add `Cache-Control: no-store` for `.html`. | Pending automation update. |
| **2025-10-21 17:00** | Implemented fix via GitHub Actions workflow. | Added purge for both custom domain + AFD endpoint. |
| **2025-10-21 17:20** | Re-ran pipeline and tested site (`?v=120`). | ✅ New version appeared instantly — confirmed fixed. |

---

### Summary

- The website updated correctly on **Azure Storage**, but **Azure Front Door** continued to serve cached content.  
- Browser cache and network were ruled out.  
- Cause: **Front Door cached old HTML files** and the purge didn’t include all domains.  
- Fix: Updated GitHub workflow to purge **both** domains on every deploy.

---

### Root Cause

Azure Front Door purge only targeted the default endpoint (`.azurefd.net`).  
The custom domain (`www.ahzidcloudresume.com`) was not being cleared, leaving cached HTML in place.

---

### ✅ Resolution

**Workflow update added:**

```bash
az afd endpoint purge \
  --resource-group "${{ secrets.RESOURCE_GROUP }}" \
  --profile-name "${{ secrets.AFD_PROFILE }}" \
  --endpoint-name "${{ secrets.AFD_ENDPOINT }}" \
  --domains "${{ secrets.CUSTOM_DOMAIN }}" "${{ secrets.AFD_ENDPOINT }}.azurefd.net" \
  --content-paths '/*'
