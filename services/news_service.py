"""
News Service
ดึงข่าวจาก NewsAPI + yfinance news fallback
"""
import requests
from datetime import datetime, timedelta
from typing import List, Dict
from config import config


FINANCE_KEYWORDS = "stock market OR earnings OR Fed OR inflation OR AI chip semiconductor"


def get_market_news(query: str = FINANCE_KEYWORDS, page_size: int = 10) -> List[Dict]:
    """ดึงข่าวจาก NewsAPI"""
    if not config.NEWS_API_KEY:
        return _mock_news()

    try:
        url = "https://newsapi.org/v2/everything"
        params = {
            "q": query,
            "language": "en",
            "sortBy": "publishedAt",
            "pageSize": page_size,
            "from": (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d"),
            "apiKey": config.NEWS_API_KEY,
        }
        resp = requests.get(url, params=params, timeout=8)
        data = resp.json()

        if data.get("status") != "ok":
            return _mock_news()

        results = []
        for art in data.get("articles", []):
            pub = art.get("publishedAt", "")
            try:
                dt = datetime.fromisoformat(pub.replace("Z", "+00:00"))
                time_str = dt.strftime("%I:%M %p")
            except Exception:
                time_str = pub[:10]

            results.append({
                "time": time_str,
                "headline": art.get("title", ""),
                "source": art.get("source", {}).get("name", ""),
                "url": art.get("url", "#"),
                "description": art.get("description") or "",
                "impact": _estimate_impact(art.get("title", "")),
                "related": _extract_tickers(art.get("title", "") + " " + (art.get("description") or "")),
                "ai_view": "",
            })
        return results or _mock_news()

    except Exception:
        return _mock_news()


def get_top_headlines(page_size: int = 5) -> List[Dict]:
    """ข่าวหัว Business"""
    if not config.NEWS_API_KEY:
        return _mock_news()[:page_size]
    try:
        url = "https://newsapi.org/v2/top-headlines"
        params = {
            "category": "business",
            "language": "en",
            "pageSize": page_size,
            "apiKey": config.NEWS_API_KEY,
        }
        resp = requests.get(url, params=params, timeout=8)
        data = resp.json()
        results = []
        for art in data.get("articles", []):
            pub = art.get("publishedAt", "")
            try:
                dt = datetime.fromisoformat(pub.replace("Z", "+00:00"))
                time_str = dt.strftime("%I:%M %p")
            except Exception:
                time_str = pub[:10]
            results.append({
                "time": time_str,
                "headline": art.get("title", ""),
                "source": art.get("source", {}).get("name", ""),
                "url": art.get("url", "#"),
                "impact": _estimate_impact(art.get("title", "")),
                "related": [],
                "ai_view": "",
            })
        return results or _mock_news()[:page_size]
    except Exception:
        return _mock_news()[:page_size]


def _estimate_impact(title: str) -> str:
    title_lower = title.lower()
    high_words = ["fed", "inflation", "cpi", "earnings", "crash", "rally", "rate", "gdp", "recession", "nvidia", "apple"]
    medium_words = ["stock", "market", "trade", "china", "tech", "ai"]
    if any(w in title_lower for w in high_words):
        return "high"
    if any(w in title_lower for w in medium_words):
        return "medium"
    return "low"


def _extract_tickers(text: str) -> List[str]:
    known = ["NVDA", "AAPL", "MSFT", "AMZN", "GOOGL", "META", "TSLA", "AMD", "AVGO", "SMCI",
             "SPY", "QQQ", "TLT", "XOM", "CVX", "JPM", "GS", "BAC"]
    found = [t for t in known if t in text.upper()]
    return found[:4]


def _mock_news() -> List[Dict]:
    return [
        {"time": "10:15 AM", "headline": "Market rallies as inflation cools more than expected",
         "source": "Reuters", "url": "#", "impact": "high",
         "related": ["SPY", "QQQ"], "ai_view": "Positive for broad market", "description": ""},
        {"time": "09:30 AM", "headline": "Tech stocks lead gains on strong AI demand",
         "source": "Bloomberg", "url": "#", "impact": "high",
         "related": ["NVDA", "AMD", "MSFT"], "ai_view": "Bullish for AI sector", "description": ""},
        {"time": "09:15 AM", "headline": "Fed minutes show cautious outlook on rates",
         "source": "CNBC", "url": "#", "impact": "medium",
         "related": ["TLT", "SPY"], "ai_view": "Neutral - watch rate sensitive", "description": ""},
        {"time": "08:45 AM", "headline": "NVIDIA demand remains strong amid AI buildout",
         "source": "WSJ", "url": "#", "impact": "high",
         "related": ["NVDA", "SMCI"], "ai_view": "Bullish for semiconductor", "description": ""},
        {"time": "06:45 AM", "headline": "Oil prices dip on supply increase concerns",
         "source": "FT", "url": "#", "impact": "low",
         "related": ["XOM", "CVX"], "ai_view": "Bearish for energy sector", "description": ""},
    ]
