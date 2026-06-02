"""
News Service
ดึงข่าวจาก RSS Feeds ฟรี (Reuters, CNBC, MarketWatch, Yahoo Finance)
ใช้ built-in xml.etree.ElementTree — ไม่ต้อง install อะไรเพิ่ม
"""
import re
import time
import requests
from xml.etree import ElementTree as ET
from datetime import datetime
from email.utils import parsedate_to_datetime
from typing import List, Dict


RSS_FEEDS = [
    ("CNBC Markets",    "https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=20910258"),
    ("CNBC Top News",   "https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=100003114"),
    ("Yahoo Finance",   "https://finance.yahoo.com/rss/topfinstories"),
    ("MarketWatch",     "https://feeds.content.dowjones.io/public/rss/mw_topstories"),
    ("Seeking Alpha",   "https://seekingalpha.com/market_currents.xml"),
    ("Reuters Biz",     "https://feeds.reuters.com/reuters/businessNews"),
]

FINANCE_KEYWORDS = [
    "stock", "market", "fed", "inflation", "rate", "earnings", "gdp",
    "nasdaq", "s&p", "dow", "rally", "sell", "buy", "ai", "chip",
    "semiconductor", "nvidia", "apple", "microsoft", "tesla", "meta",
    "amazon", "google", "trade", "tariff", "recession", "bull", "bear",
    "ipo", "crypto", "bitcoin", "oil", "gold", "bond", "yield",
]

_HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; TradePilot/1.0; +https://github.com)"
}


def get_market_news(query: str = "", page_size: int = 10) -> List[Dict]:
    """ดึงข่าวจาก RSS Feeds หลายแหล่ง"""
    all_articles: List[Dict] = []
    for source_name, feed_url in RSS_FEEDS:
        try:
            articles = _parse_rss(feed_url, source_name)
            all_articles.extend(articles)
        except Exception:
            continue

    # prefer finance-related
    finance = [a for a in all_articles if _is_finance_related(a["headline"])]
    pool = finance if len(finance) >= page_size else all_articles

    # deduplicate
    seen: set = set()
    unique: List[Dict] = []
    for a in pool:
        key = a["headline"][:60].lower()
        if key not in seen:
            seen.add(key)
            unique.append(a)

    # sort newest first
    unique.sort(key=lambda x: x.pop("_ts", 0), reverse=True)
    result = unique[:page_size]

    return result if result else _mock_news()


def get_top_headlines(page_size: int = 5) -> List[Dict]:
    """ข่าว high-impact"""
    articles = get_market_news(page_size=page_size * 3)
    high = [a for a in articles if a.get("impact") == "high"]
    return (high if len(high) >= page_size else articles)[:page_size]


def get_ticker_news(symbol: str, page_size: int = 5) -> List[Dict]:
    """ข่าวของหุ้นเฉพาะตัวจาก yfinance"""
    try:
        import yfinance as yf
        raw = yf.Ticker(symbol).news or []
        results: List[Dict] = []
        for item in raw[:page_size]:
            content = item.get("content", {})
            title = content.get("title", item.get("title", ""))
            ts = content.get("pubDate", "")
            try:
                dt = datetime.fromisoformat(ts.replace("Z", "+00:00"))
                time_str = dt.strftime("%I:%M %p")
            except Exception:
                time_str = ""
            provider = content.get("provider", {}).get("displayName", "Yahoo Finance")
            results.append({
                "time": time_str,
                "headline": title,
                "source": provider,
                "url": content.get("canonicalUrl", {}).get("url", "#"),
                "description": content.get("summary", "")[:200],
                "impact": _estimate_impact(title),
                "related": [symbol],
                "ai_view": "",
            })
        return results
    except Exception:
        return []


# ── internal helpers ──────────────────────────────────────────────────────────

def _parse_rss(url: str, source_name: str, timeout: int = 6) -> List[Dict]:
    resp = requests.get(url, headers=_HEADERS, timeout=timeout)
    resp.raise_for_status()
    root = ET.fromstring(resp.content)

    # handle both RSS and Atom
    ns = {"atom": "http://www.w3.org/2005/Atom"}
    items = root.findall(".//item") or root.findall(".//atom:entry", ns)

    results: List[Dict] = []
    for item in items:
        title = (item.findtext("title") or item.findtext("atom:title", namespaces=ns) or "").strip()
        if not title or title == "[Removed]":
            continue

        link = (item.findtext("link") or item.findtext("atom:link", namespaces=ns) or "#").strip()
        # atom link may be in attribute
        if not link or link == "#":
            link_el = item.find("atom:link", ns)
            if link_el is not None:
                link = link_el.get("href", "#")

        desc = (item.findtext("description") or item.findtext("atom:summary", namespaces=ns) or "")
        desc = re.sub(r"<[^>]+>", "", desc).strip()[:200]

        pub_raw = (item.findtext("pubDate") or item.findtext("dc:date")
                   or item.findtext("atom:published", namespaces=ns) or "")
        pub_ts = 0.0
        time_str = ""
        if pub_raw:
            try:
                dt = parsedate_to_datetime(pub_raw)
                pub_ts = dt.timestamp()
                time_str = dt.astimezone().strftime("%I:%M %p")
            except Exception:
                try:
                    dt = datetime.fromisoformat(pub_raw.replace("Z", "+00:00"))
                    pub_ts = dt.timestamp()
                    time_str = dt.strftime("%I:%M %p")
                except Exception:
                    time_str = pub_raw[:10]

        results.append({
            "time": time_str,
            "headline": title,
            "source": source_name,
            "url": link,
            "description": desc,
            "impact": _estimate_impact(title),
            "related": _extract_tickers(title + " " + desc),
            "ai_view": "",
            "_ts": pub_ts,
        })
    return results


def _is_finance_related(title: str) -> bool:
    tl = title.lower()
    return any(kw in tl for kw in FINANCE_KEYWORDS)


def _estimate_impact(title: str) -> str:
    tl = title.lower()
    high_words = ["fed", "inflation", "cpi", "earnings", "crash", "rally", "rate hike",
                  "rate cut", "gdp", "recession", "nvidia", "tariff", "war",
                  "bankruptcy", "ipo", "acquisition", "layoff", "surge", "plunge"]
    medium_words = ["stock", "market", "trade", "china", "tech", "ai", "chip",
                    "microsoft", "tesla", "amazon", "google", "meta", "bitcoin", "oil"]
    if any(w in tl for w in high_words):
        return "high"
    if any(w in tl for w in medium_words):
        return "medium"
    return "low"


def _extract_tickers(text: str) -> List[str]:
    known = ["NVDA", "AAPL", "MSFT", "AMZN", "GOOGL", "META", "TSLA", "AMD", "AVGO", "SMCI",
             "SPY", "QQQ", "TLT", "XOM", "CVX", "JPM", "GS", "BAC", "INTC", "ARM", "QCOM"]
    return [t for t in known if t in text.upper()][:4]


def _mock_news() -> List[Dict]:
    return [
        {"time": "10:15 AM", "headline": "Market rallies as inflation cools more than expected",
         "source": "Reuters", "url": "#", "impact": "high",
         "related": ["SPY", "QQQ"], "ai_view": "Positive for broad market", "description": ""},
        {"time": "09:30 AM", "headline": "Tech stocks lead gains on strong AI demand",
         "source": "CNBC", "url": "#", "impact": "high",
         "related": ["NVDA", "AMD", "MSFT"], "ai_view": "Bullish for AI sector", "description": ""},
        {"time": "09:15 AM", "headline": "Fed minutes show cautious outlook on rates",
         "source": "MarketWatch", "url": "#", "impact": "medium",
         "related": ["TLT", "SPY"], "ai_view": "Neutral - watch rate sensitive", "description": ""},
        {"time": "08:45 AM", "headline": "NVIDIA demand remains strong amid AI buildout",
         "source": "Yahoo Finance", "url": "#", "impact": "high",
         "related": ["NVDA", "SMCI"], "ai_view": "Bullish for semiconductor", "description": ""},
        {"time": "06:45 AM", "headline": "Oil prices dip on supply increase concerns",
         "source": "Investing.com", "url": "#", "impact": "low",
         "related": ["XOM", "CVX"], "ai_view": "Bearish for energy sector", "description": ""},
    ]
