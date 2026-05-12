import pytest
from azure_integration import AzureIntegration

@pytest.fixture
def azure_integration():
    return AzureIntegration("api_key", "tenant_id")

def test_get_credentials(azure_integration):
    response = azure_integration.get_credentials()
    assert response["access_token"] is not None

def test_create_resource(azure_integration):
    response = azure_integration.create_resource("resource_name")
    assert response["name"] == "resource_name"

def test_delete_resource(azure_integration):
    response = azure_integration.delete_resource("resource_name")
    assert response["status"] == "OK"