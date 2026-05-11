import boto3
from botocore.exceptions import NoCredentialsError, ClientError
from .config import AWS_ACCESS_KEY, AWS_SECRET_KEY, S3_BUCKET_NAME

class LogManager:
    def __init__(self):
        self.s3 = boto3.client('s3', aws_access_key_id=AWS_ACCESS_KEY, aws_secret_access_key=AWS_SECRET_KEY)

    def upload_to_s3(self, file_name, object_name=None):
        if object_name is None:
            object_name = file_name

        try:
            self.s3.upload_file(file_name, S3_BUCKET_NAME, object_name)
            print(f"{file_name} uploaded to {S3_BUCKET_NAME}/{object_name}")
            return True
        except FileNotFoundError:
            print("The file was not found")
            return False
        except NoCredentialsError:
            print("Credentials not available")
            return False
        except ClientError as e:
            print(f"An error occurred: {e}")
            return False