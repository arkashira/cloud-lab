import json
import logging
from datetime import datetime

# Define the error taxonomy
ERROR_TAXONOMY = {
    "83730": {"code": "ACCOUNT_CREATION_FAILED", "description": "Failed to create AWS account"},
    # Add more error codes as needed
}

def classify_error(error_code):
    """Classify an error based on the error taxonomy"""
    if error_code in ERROR_TAXONOMY:
        return ERROR_TAXONOMY[error_code]
    else:
        return {"code": "UNKNOWN_ERROR", "description": "Unknown error"}

def log_error(error_code, request_id, raw_error_payload):
    """Log an error with timestamp, request ID, and raw error payload"""
    logging.basicConfig(filename='/opt/axentx/cloud-lab/backend/logs/aws_errors.log', level=logging.ERROR)
    logging.error(f"{datetime.now()} - Request ID: {request_id} - Error Code: {error_code} - Raw Error Payload: {raw_error_payload}")

def get_classified_error(error_code, request_id, raw_error_payload):
    """Get the classified error and log the error"""
    classified_error = classify_error(error_code)
    log_error(error_code, request_id, raw_error_payload)
    return classified_error