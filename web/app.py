"""
TradePilot OS — FastAPI Backend
เชื่อมต่อ Qwen, yfinance, NewsAPI, SQLite จริง
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from fastapi import FastAPI, Request, Depends, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from jinja2 import Environment, FileSystemLoader
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
import asyncio
from functools import partial

from config import config
from database import init_db, get_db, SessionLocal
from services import market_data, news_service, qwen_service, portfolio_service

app = FastAPI(title="TradePilot OS")
app.mount("/static", StaticFiles(directory="web/static"), name="static")

_jinja = Environment(loader=FileSystemLoader("web/templates"), autoescape=True)

def render(tpl: str, **ctx) -> HTMLResponse:
    return HTMLResponse(_jinja.get_template(tpl).render(**ctx))


@app.on_event("startup")
def startup():
    init_db()


# ===== HELPERS =====

async def run_sync(fn, *args):
    """รัน blocking function ใน thread pool"""
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, partial(fn, *args))


# ===== PAGES =====

@app.get("/", response_class=HTMLResponse)
async def dashboard():
    indices   = await run_sync(market_data.get_market_indices)
    db = SessionLocal()
    wl_items  = portfolio_service.get_watchlist(db)
    port_data = portfolio_service.get_portfolio(db)
    db.close()

    symbols   = config.DEFAULT_SYMBOLS
    quotes    = await run_sync(market_data.get_multiple_quotes, symbols)
    top_picks = sorted(quotes, key=lambda x: x.get("change_pct", 0), reverse=True)[:4]
    news      = await run_sync(news_service.get_top_headlines, 5)

    # Enrich top picks with action labels
    for i, p in enumerate(top_picks):
        chg = p.get("change_pct", 0)
        p["action"] = "STRONG BUY" if chg > 3 else "BUY" if chg > 1 else "HOLD" if chg > -1 else "SELL"
        p["confidence"] = min(95, max(55, int(70 + chg * 3)))
        p["company"] = p["symbol"]

    # Static portfolio summary if no real positions
    if not port_data["positions"]:
        portfolio = {
            "value": 128450.75, "change_pct": 2.35, "total_return": 18742.63,
            "return_pct": 16.89, "buying_power": 42180.44, "buying_power_pct": 58,
            "active_positions": len(wl_items), "winners": 16, "losers": 8,
            "win_rate": 72.4, "risk_score": 28, "risk_label": "Low Risk",
            "day_pnl": 2942.11,
        }
    else:
        winners = sum(1 for p in port_data["positions"] if p["pnl"] > 0)
        losers  = len(port_data["positions"]) - winners
        portfolio = {
            "value": port_data["total_value"],
            "change_pct": round(port_data["total_pnl_pct"], 2),
            "total_return": port_data["total_pnl"],
            "return_pct": round(port_data["total_pnl_pct"], 2),
            "buying_power": 0, "buying_power_pct": 0,
            "active_positions": len(port_data["positions"]),
            "winners": winners, "losers": losers,
            "win_rate": round(winners / max(len(port_data["positions"]), 1) * 100, 1),
            "risk_score": 28, "risk_label": "Low Risk",
            "day_pnl": port_data["total_pnl"],
        }

    return render("index.html",
        market=indices,
        portfolio=portfolio,
        top_picks=top_picks,
        news=news,
        watchlist=wl_items[:6],
        current_date=_today(),
        user_name="Commander",
    )


@app.get("/scanner", response_class=HTMLResponse)
async def scanner_page():
    symbols = config.DEFAULT_SYMBOLS + ["SMCI", "ARM", "PLTR", "TSM", "INTC", "QCOM", "MU", "CRWD"]
    quotes  = await run_sync(market_data.get_multiple_quotes, symbols)
    quotes  = sorted(quotes, key=lambda x: x.get("change_pct", 0), reverse=True)
    return render("scanner.html", stocks=quotes, current_date=_today())


@app.get("/news", response_class=HTMLResponse)
async def news_page():
    news = await run_sync(news_service.get_market_news, "", 20)
    return render("news.html", news=news, current_date=_today())


@app.get("/portfolio", response_class=HTMLResponse)
async def portfolio_page():
    db = SessionLocal()
    data = portfolio_service.get_portfolio(db)
    db.close()
    return render("portfolio.html", portfolio=data, current_date=_today())


@app.get("/watchlist", response_class=HTMLResponse)
async def watchlist_page():
    db = SessionLocal()
    items = portfolio_service.get_watchlist(db)
    db.close()
    return render("watchlist.html", watchlist=items, current_date=_today())


@app.get("/ceo", response_class=HTMLResponse)
async def ceo_page():
    db = SessionLocal()
    history = portfolio_service.get_chat_history(db, limit=30)
    db.close()
    return render("ceo.html", chat_history=history, current_date=_today())


@app.get("/trade-planner", response_class=HTMLResponse)
async def trade_planner_page():
    return render("trade_planner.html", current_date=_today())


@app.get("/risk", response_class=HTMLResponse)
async def risk_page():
    db = SessionLocal()
    portfolio = portfolio_service.get_portfolio(db)
    db.close()
    return render("risk.html", portfolio=portfolio, current_date=_today())


@app.get("/stock/{symbol}", response_class=HTMLResponse)
async def stock_detail(symbol: str):
    symbol = symbol.upper()
    info    = await run_sync(market_data.get_stock_info, symbol)
    hist    = await run_sync(market_data.get_stock_history, symbol, "3mo")
    news    = await run_sync(market_data.get_ticker_news, symbol)
    quote   = await run_sync(market_data.get_stock_quote, symbol)
    return render("stock_detail.html",
        symbol=symbol, info=info, history=hist, news=news, quote=quote,
        current_date=_today())


# ===== API ENDPOINTS =====

@app.get("/api/market")
async def api_market():
    return await run_sync(market_data.get_market_indices)


@app.get("/api/quotes")
async def api_quotes(symbols: str = "NVDA,AAPL,MSFT,AMZN"):
    sym_list = [s.strip().upper() for s in symbols.split(",")]
    return await run_sync(market_data.get_multiple_quotes, sym_list)


@app.get("/api/stock/{symbol}")
async def api_stock(symbol: str):
    return await run_sync(market_data.get_stock_info, symbol.upper())


@app.get("/api/news")
async def api_news(q: str = ""):
    return await run_sync(news_service.get_market_news, q, 10)


@app.get("/api/watchlist")
async def api_watchlist():
    db = SessionLocal()
    result = portfolio_service.get_watchlist(db)
    db.close()
    return result


class WatchlistAdd(BaseModel):
    symbol: str
    notes: str = ""
    alert_price: Optional[float] = None


@app.post("/api/watchlist")
async def api_watchlist_add(body: WatchlistAdd):
    db = SessionLocal()
    result = portfolio_service.add_to_watchlist(db, body.symbol, body.notes, body.alert_price)
    db.close()
    return result


@app.delete("/api/watchlist/{symbol}")
async def api_watchlist_remove(symbol: str):
    db = SessionLocal()
    result = portfolio_service.remove_from_watchlist(db, symbol)
    db.close()
    return result


class PositionAdd(BaseModel):
    symbol: str
    shares: float
    avg_cost: float
    notes: str = ""


@app.post("/api/portfolio")
async def api_portfolio_add(body: PositionAdd):
    db = SessionLocal()
    result = portfolio_service.add_position(db, body.symbol, body.shares, body.avg_cost, body.notes)
    db.close()
    return result


@app.delete("/api/portfolio/{position_id}")
async def api_portfolio_close(position_id: int, close_price: float):
    db = SessionLocal()
    result = portfolio_service.close_position(db, position_id, close_price)
    db.close()
    return result


class ChatRequest(BaseModel):
    command: str
    history: List[dict] = []


@app.post("/api/ceo/command")
async def api_ceo_command(body: ChatRequest):
    db = SessionLocal()
    portfolio_service.save_message(db, "user", body.command)

    messages = body.history[-6:] + [{"role": "user", "content": body.command}]
    reply = await run_sync(qwen_service.chat, messages)

    portfolio_service.save_message(db, "assistant", reply)
    db.close()
    return {"status": "ok", "message": reply}


class AnalyzeRequest(BaseModel):
    symbol: str


@app.post("/api/analyze")
async def api_analyze(body: AnalyzeRequest):
    symbol = body.symbol.upper()
    quote  = await run_sync(market_data.get_stock_quote, symbol)
    news   = await run_sync(market_data.get_ticker_news, symbol)
    reply  = await run_sync(qwen_service.analyze_stock, symbol, quote, news)
    return {"symbol": symbol, "analysis": reply}


class TradePlanRequest(BaseModel):
    symbol: str
    price: float
    bias: str = "bullish"


@app.post("/api/trade-plan")
async def api_trade_plan(body: TradePlanRequest):
    reply = await run_sync(qwen_service.build_trade_plan, body.symbol, body.price, body.bias)
    return {"symbol": body.symbol, "plan": reply}


# ===== UTILS =====

def _today() -> str:
    from datetime import datetime
    return datetime.now().strftime("%A, %B %d, %Y")
