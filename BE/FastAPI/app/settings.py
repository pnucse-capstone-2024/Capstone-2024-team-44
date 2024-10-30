import os
import logging
import redis
import tiktoken
from pydantic_settings import BaseSettings

logs_dir = os.getenv("LOGS_DIR", "/project/logs")

env_file_path = os.path.join(os.path.dirname(__file__), ".env")

class Settings(BaseSettings):
    OPENAI_API_KEY: str
    DATABASE_URL: str
    REDIS_HOST: str
    REDIS_PORT: int
    REDIS_DB: int

    class Config:
        env_file = env_file_path

app_settings = Settings()

def reload_settings():
    global app_settings
    app_settings = Settings()

r = redis.Redis(
    host=app_settings.REDIS_HOST,
    port=app_settings.REDIS_PORT,
    db=app_settings.REDIS_DB,
    decode_responses=True
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

encoding = tiktoken.get_encoding('cl100k_base')

SECRET_KEY = "MySecretKey"
ALGORITHM = "HS512"