"""
TradePilot OS - FastAPI Backend
AI Trading Command Center
"""

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from jinja2 import Environment, FileSystemLoader
from datetime import datetime
import random

app = FastAPI(title="TradePilot OS", version="1.0.0")

app.mount("/static", StaticFiles(directory="web/static"), name="static")

_jinja_env = Environment(loader=FileSystemLoader("web/templates"), autoescape=True)

def render(template_name: str, **ctx) -> HTMLResponse:
    t = _jinja_env.get_template(template_name)
    return HTMLResponse(t.render(**ctx))


def mock_market_data():
    return {
        "sp500": {"value": 5321.41, "change": 0.85},
        "nasdaq": {"value": 16612.53, "change": 1.21},
        "dow": {"value": 39872.99, "change": 0.62},
        "vix": {"value": 15.21, "change": -2.31},
        "market_status": "OPEN",
        "market_closes": "04:31:24",
        "last_updated": datetime.now().strftime("%H:%M:%S AM"),
    }


def mock_portfolio():
    return {
        "value": 128450.75,
        "change_pct": 2.35,
        "total_return": 18742.63,
        "return_pct": 16.89,
        "buying_power": 42180.44,
        "buying_power_pct": 58,
        "active_positions": 24,
        "winners": 16,
        "losers": 8,
        "win_rate": 72.4,
        "risk_score": 28,
        "risk_label": "Low Risk",
        "day_pnl": 2942.11,
    }


def mock_agents():
    return [
        {"id": "ceo", "name": "CEO", "role": "หัวหน้าทีม", "status": "active", "task": "Monitoring", "progress": 100, "emoji": "👑"},
        {"id": "scanner", "name": "Scanner", "role": "ทีมสแกน", "status": "active", "task": "128 stocks", "progress": 67, "emoji": "🔍"},
        {"id": "news", "name": "News", "role": "ทีมข่าว", "status": "active", "task": "24 feeds", "progress": 90, "emoji": "📰"},
        {"id": "analysis", "name": "Analysis", "role": "ทีมวิเคราะห์", "status": "active", "task": "5 reports", "progress": 45, "emoji": "📊"},
        {"id": "trading", "name": "Trading", "role": "ทีมเทรด", "status": "active", "task": "3 setups", "progress": 80, "emoji": "📈"},
        {"id": "risk", "name": "Risk", "role": "ความเสี่ยง", "status": "active", "task": "Risk Low", "progress": 100, "emoji": "🛡️"},
        {"id": "dev", "name": "Dev", "role": "ทีมพัฒนา", "status": "active", "task": "Optimizing", "progress": 30, "emoji": "⚙️"},
    ]


def mock_top_picks():
    return [
        {"symbol": "NVDA", "company": "NVIDIA Corp.", "price": 1052.34, "change": 3.24, "action": "STRONG BUY", "confidence": 92, "setup": "Momentum Breakout", "sector": "AI/Semiconductor"},
        {"symbol": "META", "company": "Meta Platforms", "price": 504.21, "change": 2.11, "action": "BUY", "confidence": 86, "setup": "Trend Continuation", "sector": "Social Media"},
        {"symbol": "AVGO", "company": "Broadcom Inc.", "price": 1672.89, "change": 1.87, "action": "BUY", "confidence": 84, "setup": "Volume Breakout", "sector": "Semiconductor"},
        {"symbol": "MSFT", "company": "Microsoft Corp.", "price": 420.77, "change": 1.35, "action": "BUY", "confidence": 81, "setup": "AI Trend", "sector": "Cloud/AI"},
    ]


def mock_news():
    return [
        {"time": "10:15 AM", "headline": "Market rallies as inflation cools more than expected", "impact": "high", "related": ["SPY", "QQQ"], "ai_view": "Positive for broad market"},
        {"time": "09:30 AM", "headline": "Tech stocks lead gains on strong AI demand", "impact": "high", "related": ["NVDA", "AMD", "MSFT"], "ai_view": "Bullish for AI sector"},
        {"time": "09:15 AM", "headline": "Fed minutes show cautious outlook on rates", "impact": "medium", "related": ["TLT", "SPY"], "ai_view": "Neutral - watch rate sensitive"},
        {"time": "06:45 AM", "headline": "Oil prices dip on supply increase concerns", "impact": "low", "related": ["XOM", "CVX"], "ai_view": "Bearish for energy sector"},
    ]


def mock_watchlist():
    return [
        {"symbol": "AAPL", "price": 195.87, "change": 1.18, "ai_score": 70, "trend": "Neutral", "alert": "Watch"},
        {"symbol": "TSLA", "price": 178.57, "change": -0.45, "ai_score": 58, "trend": "Bearish", "alert": "Caution"},
        {"symbol": "AMZN", "price": 186.21, "change": 0.73, "ai_score": 76, "trend": "Bullish", "alert": "Monitor"},
        {"symbol": "GOOGL", "price": 171.42, "change": 1.05, "ai_score": 74, "trend": "Uptrend", "alert": "Watch Entry"},
        {"symbol": "AMD", "price": 146.89, "change": 2.22, "ai_score": 78, "trend": "Bullish", "alert": "Volume Spike"},
    ]


@app.get("/", response_class=HTMLResponse)
async def dashboard():
    return render("index.html",
        market=mock_market_data(),
        portfolio=mock_portfolio(),
        agents=mock_agents(),
        top_picks=mock_top_picks(),
        news=mock_news(),
        watchlist=mock_watchlist(),
        current_date="Friday, May 24, 2024",
        user_name="Commander",
    )


@app.get("/api/market")
async def get_market():
    return mock_market_data()


@app.get("/api/portfolio")
async def get_portfolio():
    return mock_portfolio()


@app.get("/api/agents")
async def get_agents():
    return mock_agents()


@app.get("/api/picks")
async def get_picks():
    return mock_top_picks()


@app.post("/api/ceo/command")
async def ceo_command(request: Request):
    body = await request.json()
    cmd = body.get("command", "")
    responses = [
        f"รับคำสั่งแล้วครับ Commander กำลังวิเคราะห์: '{cmd}'...",
        "กำลังส่งคำสั่งให้ทีม Scanner และ Analysis...",
        "ผลการวิเคราะห์จะพร้อมใน 30 วินาทีครับ",
    ]
    return {"status": "ok", "message": random.choice(responses), "timestamp": datetime.now().isoformat()}
