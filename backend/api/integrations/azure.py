import os
import requests

class AzureIntegration:
    def __init__(self, api_key, tenant_id):
        self.api_key = api_key
        self.tenant_id = tenant_id

    def get_credentials(self):
        response = requests.get(
            f"https://login.microsoftonline.com/{self.tenant_id}/oauth2/v2.0/token",
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            data={"grant_type": "client_credentials", "client_id": os.environ["AZURE_CLIENT_ID"], "client_secret": os.environ["AZURE_CLIENT_SECRET"]},
        )
        return response.json()

    def create_resource(self, resource_name):
        response = requests.post(
            f"https://management.azure.com/subscriptions/{os.environ['AZURE_SUBSCRIPTION_ID']}/resourcegroups/{os.environ['AZURE_RESOURCE_GROUP']}/providers/Microsoft.Compute/virtualMachines/{resource_name}",
            headers={"Authorization": f"Bearer {self.get_credentials()['access_token']}", "Content-Type": "application/json"},
            json={"location": os.environ["AZURE_LOCATION"], "properties": {"hardwareProfile": {"vmSize": "Standard_DS2_v2"}}},
        )
        return response.json()

    def delete_resource(self, resource_name):
        response = requests.delete(
            f"https://management.azure.com/subscriptions/{os.environ['AZURE_SUBSCRIPTION_ID']}/resourcegroups/{os.environ['AZURE_RESOURCE_GROUP']}/providers/Microsoft.Compute/virtualMachines/{resource_name}",
            headers={"Authorization": f"Bearer {self.get_credentials()['access_token']}", "Content-Type": "application/json"},
        )
        return response.json()