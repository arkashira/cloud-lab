import logging
from datetime import datetime

class AzureLogger:
    def __init__(self):
        self.logger = logging.getLogger('azure_logger')
        self.logger.setLevel(logging.INFO)
        handler = logging.FileHandler('/var/log/azure_actions.log')
        formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
        handler.setFormatter(formatter)
        self.logger.addHandler(handler)

    def log_action(self, user_id, action, resource, status):
        message = f"User {user_id} performed {action} on {resource}. Status: {status}"
        self.logger.info(message)

def log_user_action(user_id, action, resource, status):
    azure_logger = AzureLogger()
    azure_logger.log_action(user_id, action, resource, status)

# Example usage
if __name__ == "__main__":
    log_user_action("user123", "read", "storage_account", "success")