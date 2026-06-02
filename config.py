from dotenv import load_dotenv
import os

load_dotenv()

class Config:
    QWEN_API_KEY = os.getenv("QWEN_API_KEY", "")
    QWEN_MODEL = os.getenv("QWEN_MODEL", "qwen-plus")
    QWEN_BASE_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1"

    NEWS_API_KEY = os.getenv("NEWS_API_KEY", "")

    APP_HOST = os.getenv("APP_HOST", "0.0.0.0")
    APP_PORT = int(os.getenv("APP_PORT", 8000))
    DEBUG = os.getenv("DEBUG", "true").lower() == "true"

    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./tradepilot.db")

    # Default watchlist symbols
    DEFAULT_SYMBOLS = ["NVDA", "META", "AVGO", "MSFT", "AAPL", "TSLA", "AMZN", "GOOGL", "AMD", "SMCI"]
    MARKET_INDICES = ["^GSPC", "^IXIC", "^DJI", "^VIX"]

config = Config()
