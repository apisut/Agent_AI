"""
Market Data Service — yfinance
ดึงข้อมูลราคาหุ้น, ดัชนี, Sector จริง
"""
import yfinance as yf
from datetime import datetime
from typing import List, Dict, Optional
import asyncio


def get_stock_quote(symbol: str) -> Dict:
    """ดึงราคาหุ้น realtime"""
    try:
        tk = yf.Ticker(symbol)
        info = tk.fast_info
        hist = tk.history(period="2d")

        if hist.empty:
            return _empty_quote(symbol)

        price = float(hist["Close"].iloc[-1])
        prev  = float(hist["Close"].iloc[-2]) if len(hist) > 1 else price
        change_pct = ((price - prev) / prev * 100) if prev else 0
        volume = float(hist["Volume"].iloc[-1]) if "Volume" in hist else 0

        return {
            "symbol": symbol,
            "price": round(price, 2),
            "change": round(price - prev, 2),
            "change_pct": round(change_pct, 2),
            "volume": int(volume),
            "prev_close": round(prev, 2),
            "market_cap": getattr(info, "market_cap", None),
            "timestamp": datetime.now().isoformat(),
        }
    except Exception as e:
        return {**_empty_quote(symbol), "error": str(e)}


def get_multiple_quotes(symbols: List[str]) -> List[Dict]:
    try:
        tickers = yf.download(symbols, period="2d", auto_adjust=True, progress=False)
        results = []
        for sym in symbols:
            try:
                if len(symbols) == 1:
                    close = tickers["Close"]
                else:
                    close = tickers["Close"][sym]

                close = close.dropna()
                if len(close) < 1:
                    results.append(_empty_quote(sym))
                    continue

                price = float(close.iloc[-1])
                prev = float(close.iloc[-2]) if len(close) > 1 else price
                change_pct = ((price - prev) / prev * 100) if prev else 0

                vol = None
                try:
                    if len(symbols) == 1:
                        vol = int(tickers["Volume"].iloc[-1])
                    else:
                        vol = int(tickers["Volume"][sym].iloc[-1])
                except Exception:
                    pass

                results.append({
                    "symbol": sym,
                    "price": round(price, 2),
                    "change": round(price - prev, 2),
                    "change_pct": round(change_pct, 2),
                    "volume": vol,
                    "prev_close": round(prev, 2),
                    "timestamp": datetime.now().isoformat(),
                })
            except Exception:
                results.append(_empty_quote(sym))
        return results
    except Exception:
        return [get_stock_quote(s) for s in symbols]


def get_market_indices() -> Dict:
    """S&P500, NASDAQ, DOW, VIX"""
    indices = {
        "sp500":  "^GSPC",
        "nasdaq": "^IXIC",
        "dow":    "^DJI",
        "vix":    "^VIX",
    }
    result = {}
    for name, sym in indices.items():
        try:
            tk = yf.Ticker(sym)
            hist = tk.history(period="2d")
            if not hist.empty:
                price = float(hist["Close"].iloc[-1])
                prev = float(hist["Close"].iloc[-2]) if len(hist) > 1 else price
                chg_pct = round((price - prev) / prev * 100, 2) if prev else 0
                result[name] = {"value": round(price, 2), "change": chg_pct}
            else:
                result[name] = {"value": 0, "change": 0}
        except Exception:
            result[name] = {"value": 0, "change": 0}

    result["market_status"] = _get_market_status()
    result["last_updated"] = datetime.now().strftime("%H:%M:%S")
    return result


def get_stock_info(symbol: str) -> Dict:
    """ข้อมูล fundamental ของหุ้น"""
    try:
        tk = yf.Ticker(symbol)
        info = tk.info
        return {
            "symbol": symbol,
            "company": info.get("longName", symbol),
            "sector": info.get("sector", "N/A"),
            "industry": info.get("industry", "N/A"),
            "market_cap": info.get("marketCap"),
            "pe_ratio": info.get("trailingPE"),
            "forward_pe": info.get("forwardPE"),
            "eps": info.get("trailingEps"),
            "revenue_growth": info.get("revenueGrowth"),
            "earnings_growth": info.get("earningsGrowth"),
            "profit_margin": info.get("profitMargins"),
            "roe": info.get("returnOnEquity"),
            "debt_to_equity": info.get("debtToEquity"),
            "52w_high": info.get("fiftyTwoWeekHigh"),
            "52w_low": info.get("fiftyTwoWeekLow"),
            "avg_volume": info.get("averageVolume"),
            "analyst_target": info.get("targetMeanPrice"),
            "recommendation": info.get("recommendationKey", "N/A"),
            "description": info.get("longBusinessSummary", "")[:300],
        }
    except Exception as e:
        return {"symbol": symbol, "error": str(e)}


def get_stock_history(symbol: str, period: str = "3mo") -> Dict:
    """ประวัติราคาสำหรับ chart"""
    try:
        tk = yf.Ticker(symbol)
        hist = tk.history(period=period)
        return {
            "symbol": symbol,
            "dates": [d.strftime("%Y-%m-%d") for d in hist.index],
            "close":  [round(v, 2) for v in hist["Close"].tolist()],
            "volume": [int(v) for v in hist["Volume"].tolist()],
            "high":   [round(v, 2) for v in hist["High"].tolist()],
            "low":    [round(v, 2) for v in hist["Low"].tolist()],
        }
    except Exception as e:
        return {"symbol": symbol, "dates": [], "close": [], "error": str(e)}


def get_ticker_news(symbol: str) -> List[Dict]:
    """ข่าวของหุ้นจาก yfinance"""
    try:
        tk = yf.Ticker(symbol)
        news = tk.news or []
        results = []
        for item in news[:8]:
            results.append({
                "title": item.get("title", ""),
                "source": item.get("publisher", ""),
                "url": item.get("link", "#"),
                "published": item.get("providerPublishTime", 0),
                "related": item.get("relatedTickers", []),
            })
        return results
    except Exception:
        return []


def scan_stocks(symbols: List[str], min_change: float = 0) -> List[Dict]:
    """สแกนหุ้นตาม criteria"""
    quotes = get_multiple_quotes(symbols)
    results = []
    for q in quotes:
        if q.get("change_pct", 0) >= min_change:
            info = {}
            try:
                tk = yf.Ticker(q["symbol"])
                i = tk.fast_info
                info = {
                    "market_cap": getattr(i, "market_cap", None),
                    "shares": getattr(i, "shares", None),
                }
            except Exception:
                pass
            results.append({**q, **info})
    return sorted(results, key=lambda x: x.get("change_pct", 0), reverse=True)


def _get_market_status() -> str:
    now = datetime.now()
    # Mon-Fri 9:30-16:00 ET (rough check, UTC-4/5)
    weekday = now.weekday()
    hour = now.hour
    if weekday < 5 and 13 <= hour < 21:  # UTC 13:30-20:00 = ET 9:30-16:00
        return "OPEN"
    return "CLOSED"


def _empty_quote(symbol: str) -> Dict:
    return {
        "symbol": symbol,
        "price": 0,
        "change": 0,
        "change_pct": 0,
        "volume": 0,
        "prev_close": 0,
        "timestamp": datetime.now().isoformat(),
    }
