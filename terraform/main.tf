provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "resume" {
  name     = "rg-cloud-resume"
  location = "UK South"
}

resource "random_string" "suffix" {
  length  = 6
  upper   = false
  special = false
}

resource "azurerm_storage_account" "resume" {
  name                     = "cloudresumestorage${random_string.suffix.result}"
  resource_group_name      = azurerm_resource_group.resume.name
  location                 = azurerm_resource_group.resume.location
  account_tier             = "Standard"
  account_replication_type = "LRS"

  static_website {
    index_document     = "index.html"
    error_404_document = "404.html"
  }
}

resource "azurerm_cdn_profile" "resume" {
  name                = "cdn-cloud-resume"
  location            = azurerm_resource_group.resume.location
  resource_group_name = azurerm_resource_group.resume.name
  sku                 = "Standard_Microsoft"
}

resource "azurerm_cdn_endpoint" "resume" {
  name                = "cdn-endpoint-resume"
  profile_name        = azurerm_cdn_profile.resume.name
  resource_group_name = azurerm_resource_group.resume.name
  location            = azurerm_resource_group.resume.location

  origin {
    name      = "storage-origin"
    host_name = azurerm_storage_account.resume.primary_web_host
  }
}
