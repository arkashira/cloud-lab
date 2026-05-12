import unittest
from unittest.mock import patch
from backend.logging.azure_logs import log_user_action

class TestAzureLogs(unittest.TestCase):
    @patch('backend.logging.azure_logs.AzureLogger.log_action')
    def test_log_user_action(self, mock_log_action):
        user_id = "user123"
        action = "read"
        resource = "storage_account"
        status = "success"
        
        log_user_action(user_id, action, resource, status)
        
        mock_log_action.assert_called_once_with(user_id, action, resource, status)

if __name__ == '__main__':
    unittest.main()