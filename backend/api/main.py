from fastapi import FastAPI
from azure_routes import router

app = FastAPI()

app.include_router(router)