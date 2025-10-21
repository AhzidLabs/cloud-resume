# Cloud Resume Project – Automated Azure Deployment

This project shows how I built and automated my personal website using **Microsoft Azure** and **GitHub Actions**.  
It’s part of my hands-on learning toward becoming a skilled **Azure Administrator** and **Cloud Support Engineer**.

---

## What This Project Does
- Hosts a static resume website on **Azure Storage**
- Connects a **custom domain** through **Azure Front Door**
- Uses **GitHub Actions** to deploy automatically whenever I push updates from VS Code
- Sets proper **cache rules** for HTML, CSS, and JS
- Runs an automatic **Front Door purge** so the new version appears instantly worldwide

---

## Technologies Used
| Area | Tools |
|------|------------------|
| Cloud Platform | Azure Storage, Azure Front Door, Entra ID |
| Automation | GitHub Actions, Azure CLI |
| Development | VS Code, HTML, CSS, JavaScript |
| Security | HTTPS with managed certificates, Role-Based Access Control (RBAC) |

---

## ⚙️ How It Works

```text
VS Code → GitHub (Push) → GitHub Actions → Azure Storage → Azure Front Door (CDN) → Live Website
