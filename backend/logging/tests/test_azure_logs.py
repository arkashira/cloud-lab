import unittest
from unittest.mock import Mock
from azure.identity import DefaultAzureCredential
from azure.mgmt.resource import ResourceManagementClient
from logging import getLogger
from logging.config import dictConfig
from opt.axentx.cloud_lab.backend.logging.azure_logs import log_user_action, log_azure_resource_access

class TestAzureLogs(unittest.TestCase):
    def setUp(self):
        # Configure logging
        dictConfig({
            'version': 1,
            'formatters': {
                'default': {
                    'format': '[%(asctime)s] %(levelname)s in %(module)s: %(message)s',
                }
            },
            'handlers': {
                'console': {
                    'class': 'logging.StreamHandler',
                    'level': 'INFO',
                    'formatter': 'default',
                    'stream': 'ext://sys.stdout',
                },
            },
            'root': {
                'level': 'INFO',
                'handlers': ['console']
            }
        })

        # Mock Azure credentials and client
        self.credential = Mock(spec=DefaultAzureCredential)
        self.resource_client = Mock(spec=ResourceManagementClient)

    def test_log_user_action(self):
        # Test logging user action
        log_user_action("my_resource", "create", "user123")
        self.assertEqual(getLogger().info.call_count, 1)

    def test_log_azure_resource_access(self):
        # Test logging user access to Azure resource
        log_azure_resource_access("my_resource", "user123", "Contributor")
        self.assertEqual(getLogger().info.call_count, 2)

if __name__ == "__main__":
    unittest.main()