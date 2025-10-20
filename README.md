# cloud-resume
<<<<<<< HEAD
A# 🌐 Cloud Resume Challenge — Azure Remix

This project is a real-world implementation of the [Cloud Resume Challenge](https://cloudresumechallenge.dev/) using **Azure Static Website Hosting**, **Azure CDN**, and **GitHub Actions** for full CI/CD automation.

## 🚀 Live Site

👉 [View My Resume](https://<your-storage-account-name>.z13.web.core.windows.net/)  
Hosted on Azure Blob Storage with CDN acceleration and automated deployment.

## 🧰 Tech Stack

- **Azure Storage Static Website** — HTML/CSS resume hosted in `$web` container
- **Azure CDN** — Global content delivery with cache purging on deploy
- **GitHub Actions** — CI/CD pipeline for automatic deployment and CDN purge
- **Azure CLI** — Used in workflow to upload files and manage CDN
- **Service Principal** — Secure authentication via GitHub Secrets

## 🔄 CI/CD Workflow

Every push to the `main` branch triggers:

1. ✅ Azure CLI installation
2. ✅ Login via service principal (`AZURE_CREDENTIALS`)
3. ✅ Upload of resume files to `$web` container
4. ✅ CDN purge to clear cached content

No manual uploads. No stale assets. Just clean, automated deployment.

## 🔐 Secrets Used

| Name | Purpose |
|------|---------|
| `AZURE_CREDENTIALS` | Service principal JSON for Azure login |
| `AZURE_STORAGE_ACCOUNT` | Name of the storage account |
| `AZURE_STORAGE_KEY` | Access key for blob upload |

## 📸 Portfolio Milestones

- Shadowed CV layout with centered container
- GitHub Actions deployment pipeline
- CDN purge integration
- Screenshot-worthy visual polish

## 🧠 Lessons Learned

- Azure CLI quirks (e.g. unsupported `--exclude` flag)
- Importance of correct resource naming and syntax
- Real-world debugging of CI/CD workflows
- How to turn frustration into deeper learning

## 📌 Next Steps

- Add visual timeline or badge to mark CI/CD phase complete
- Explore GitHub Pages or Azure Front Door for enhanced routing
- Consider adding a blog section to document technical wins

---

Built by **Ahzid Mahmood** — aspiring Azure engineer, detail-driven, and quietly relentless.  
📍 Leigh-on-Sea, UK | 💼 Open to junior cloud roles across South Essex & East London
=======
Azure-hosted resume site with CI/CD and serverless features
<!-- Trigger GitHub Actions -->
>>>>>>> e34bafac71e323a45f2552e38b3ea00d75a1e35f
