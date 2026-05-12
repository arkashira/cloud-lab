import unittest
from azure_auth import AzureAuth

class TestAzureAuth(unittest.TestCase):
    def test_authenticate(self):
        azure_auth = AzureAuth("tenant_id", "client_id", "client_secret")
        token, cloud_lab_token = azure_auth.authenticate("username", "password")
        self.assertIsNotNone(token)
        self.assertIsNotNone(cloud_lab_token)

    def test_authorize(self):
        azure_auth = AzureAuth("tenant_id", "client_id", "client_secret")
        token = "token"
        self.assertTrue(azure_auth.authorize(token, "admin"))
        self.assertFalse(azure_auth.authorize(token, "invalid_role"))

    def test_log_user_action(self):
        azure_auth = AzureAuth("tenant_id", "client_id", "client_secret")
        azure_auth.log_user_action("username", "action")

if __name__ == "__main__":
    unittest.main()