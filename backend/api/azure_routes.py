from fastapi import APIRouter, Depends, HTTPException
from azure_integration import AzureIntegration

router = APIRouter()

@router.get("/azure/credentials")
async def get_credentials():
    azure_integration = AzureIntegration(os.environ["AZURE_API_KEY"], os.environ["AZURE_TENANT_ID"])
    return azure_integration.get_credentials()

@router.post("/azure/create-resource")
async def create_resource(resource_name: str):
    azure_integration = AzureIntegration(os.environ["AZURE_API_KEY"], os.environ["AZURE_TENANT_ID"])
    return azure_integration.create_resource(resource_name)

@router.delete("/azure/delete-resource")
async def delete_resource(resource_name: str):
    azure_integration = AzureIntegration(os.environ["AZURE_API_KEY"], os.environ["AZURE_TENANT_ID"])
    return azure_integration.delete_resource(resource_name)