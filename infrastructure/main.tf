terraform {
  required_providers {
     azurerm = {
         source = "hashicorp/azurerm"
         version = "~>3.100" 
        } 
    }
}

provider "azurerm" {
     features {

     } 
}

#-------------------------------------------------------------- 
# Resource Group + Storage Account
data "azurerm_resource_group" "rg" {
  name = "rg-cloudresume-ahzidmahmood"
}

data "azurerm_storage_account" "sa" {
  name                = "storagecloudresumeahzid"
  resource_group_name = data.azurerm_resource_group.rg.name
}

#--------------------------------------------------------------
# Table to store counts
resource "azurerm_storage_table" "visitors" {
  name                 = "visitorCount"
  storage_account_name = data.azurerm_storage_account.sa.name
}

#--------------------------------------------------------------
# Serverless plan for the Function
resource "azurerm_service_plan" "plan" {
  name                = "ahzid-func-plan"
  location            = data.azurerm_resource_group.rg.location
  resource_group_name = data.azurerm_resource_group.rg.name
  os_type             = "Linux"
  sku_name            = "Y1"
}

#--------------------------------------------------------------
# Function App (Node 20)
resource "azurerm_linux_function_app" "func" {
  name                       = "ahzid-visitor-func"
  location                   = data.azurerm_resource_group.rg.location
  resource_group_name        = data.azurerm_resource_group.rg.name
  service_plan_id            = azurerm_service_plan.plan.id
  storage_account_name       = data.azurerm_storage_account.sa.name
  storage_account_access_key = data.azurerm_storage_account.sa.primary_access_key

  site_config {
    application_stack { node_version = "20" }
  }

  app_settings = {
    AzureWebJobsStorage      = data.azurerm_storage_account.sa.primary_connection_string
    STORAGE_TABLE_NAME       = azurerm_storage_table.visitors.name
    WEBSITE_RUN_FROM_PACKAGE = "1"
    STORAGE_TABLE_URL        = "https://${data.azurerm_storage_account.sa.name}.table.core.windows.net"
    STORAGE_SAS_TOKEN        = "sv=2022-11-02&ss=t&srt=co&sp=rwd&se=2030-01-01T00:00:00Z&spr=https&sig=..."
  }
}