import os
import json
from azure.identity import DefaultAzureCredential
from azure.core.exceptions import ClientAuthenticationError
from cloud_lab_auth import CloudLabAuth

class AzureAuth:
    def __init__(self, tenant_id, client_id, client_secret):
        self.tenant_id = tenant_id
        self.client_id = client_id
        self.client_secret = client_secret
        self.credential = DefaultAzureCredential()

    def authenticate(self, username, password):
        try:
            # Authenticate using Azure credentials
            token = self.credential.get_token(f"https://graph.microsoft.com/.default")
            # Authenticate using cloud-lab credentials
            cloud_lab_auth = CloudLabAuth()
            cloud_lab_token = cloud_lab_auth.authenticate(username, password)
            return token, cloud_lab_token
        except ClientAuthenticationError as e:
            print(f"Authentication failed: {e}")
            return None, None

    def authorize(self, token, role):
        # Check if the user has the required role
        if token and role in self.get_user_roles(token):
            return True
        return False

    def get_user_roles(self, token):
        # Get the user's roles from Azure
        # This is a placeholder, you would need to implement the actual logic to get the user's roles
        return ["admin", "user"]

    def log_user_action(self, username, action):
        # Log the user's action for audit purposes
        # This is a placeholder, you would need to implement the actual logic to log the user's action
        print(f"User {username} performed action {action}")