
import logging
import time
from boto3.exceptions import Boto3Error

from fastapi import FastAPI, HTTPException
from starlette.middleware.base import RequestResponseEndpoint

app = FastAPI()

logger = logging.getLogger(__name__)

class AWSErrorInterceptor:
    def __init__(self, next_app):
        self.next_app = next_app

    async def __call__(self, request):
        try:
            response = await self.next_app(request)
        except Boto3Error as e:
            timestamp = time.time()
            request_id = request.headers.get("X-Amz-Request-Id")
            error_payload = str(e)
            logger.error(f"AWS account creation error: {error_payload}")
            await self.classify_error(timestamp, request_id, error_payload)
            raise HTTPException(status_code=500, detail="AWS account creation error")
        return response

    async def classify_error(self, timestamp, request_id, error_payload):
        # TODO: Implement error classification logic
        pass

def setup_middleware():
    app.middleware("http")(AWSErrorInterceptor(app))

# src/middleware/__init__.py

from .aws_error_interceptor import AWSErrorInterceptor, setup_middleware

__all__ = ["AWSErrorInterceptor", "setup_middleware"]

# src/main.py

from fastapi import FastAPI
from starlette.middleware.logger import LoggerMiddleware
from src.middleware import AWSErrorInterceptor, setup_middleware

app = FastAPI()

if __name__ == "__main__":
    setup_middleware()
    app.include_router(router)
    app.add_middleware(LoggerMiddleware)
    app.run(host="0.0.0.0", port=8000)

# /opt/axentx/cloud-lab/backend/logs/aws_errors.log

# This is not a code file, but a log file for storing AWS errors