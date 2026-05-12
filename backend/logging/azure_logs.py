import logging
import azure.identity as identity
from azure.identity import DefaultAzureCredential
from azure.mgmt.resource import ResourceManagementClient

def log_user_action(resource_name: str, action: str, user_id: str):
    """Log user action on Azure resource."""
    logging.info(f"User {user_id} performed action '{action}' on resource '{resource_name}'")

def get_azure_credentials():
    """Get Azure credentials using DefaultAzureCredential."""
    credential = DefaultAzureCredential()
    return credential

def log_azure_resource_access(resource_name: str, user_id: str, role: str):
    """Log user access to Azure resource."""
    logging.info(f"User {user_id} accessed Azure resource '{resource_name}' with role '{role}'")

def main():
    # Initialize Azure credentials
    credentials = get_azure_credentials()

    # Initialize Azure Resource Management client
    resource_client = ResourceManagementClient(credentials, "your_subscription_id")

    # Log user action on Azure resource
    log_user_action("my_resource", "create", "user123")

    # Log user access to Azure resource
    log_azure_resource_access("my_resource", "user123", "Contributor")

if __name__ == "__main__":
    main()