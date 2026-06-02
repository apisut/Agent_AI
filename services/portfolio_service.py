"""
Portfolio & Watchlist Service — SQLite
CRUD operations สำหรับ portfolio และ watchlist
"""
from sqlalchemy.orm import Session
from database import WatchlistItem, PortfolioPosition, TradeJournalEntry, ChatMessage
from services.market_data import get_multiple_quotes, get_stock_quote
from datetime import datetime
from typing import List, Dict, Optional


# ===== WATCHLIST =====

def get_watchlist(db: Session) -> List[Dict]:
    items = db.query(WatchlistItem).all()
    symbols = [i.symbol for i in items]
    if not symbols:
        return []

    quotes = get_multiple_quotes(symbols)
    quote_map = {q["symbol"]: q for q in quotes}

    result = []
    for item in items:
        q = quote_map.get(item.symbol, {})
        result.append({
            "id": item.id,
            "symbol": item.symbol,
            "price": q.get("price", 0),
            "change": q.get("change", 0),
            "change_pct": q.get("change_pct", 0),
            "volume": q.get("volume", 0),
            "notes": item.notes,
            "alert_price": item.alert_price,
            "added_at": item.added_at.strftime("%Y-%m-%d") if item.added_at else "",
        })
    return result


def add_to_watchlist(db: Session, symbol: str, notes: str = "", alert_price: float = None) -> Dict:
    symbol = symbol.upper().strip()
    existing = db.query(WatchlistItem).filter(WatchlistItem.symbol == symbol).first()
    if existing:
        return {"success": False, "message": f"{symbol} มีใน Watchlist แล้ว"}
    item = WatchlistItem(symbol=symbol, notes=notes, alert_price=alert_price)
    db.add(item)
    db.commit()
    return {"success": True, "message": f"เพิ่ม {symbol} แล้ว"}


def remove_from_watchlist(db: Session, symbol: str) -> Dict:
    item = db.query(WatchlistItem).filter(WatchlistItem.symbol == symbol.upper()).first()
    if not item:
        return {"success": False, "message": "ไม่พบ symbol นี้"}
    db.delete(item)
    db.commit()
    return {"success": True, "message": f"ลบ {symbol} แล้ว"}


# ===== PORTFOLIO =====

def get_portfolio(db: Session) -> Dict:
    positions = db.query(PortfolioPosition).filter(PortfolioPosition.is_open == True).all()
    if not positions:
        return {"positions": [], "total_value": 0, "total_cost": 0, "total_pnl": 0, "total_pnl_pct": 0}

    symbols = list({p.symbol for p in positions})
    quotes = {q["symbol"]: q for q in get_multiple_quotes(symbols)}

    total_value = 0
    total_cost = 0
    pos_list = []

    for p in positions:
        q = quotes.get(p.symbol, {})
        price = q.get("price", p.avg_cost)
        value = price * p.shares
        cost = p.avg_cost * p.shares
        pnl = value - cost
        pnl_pct = (pnl / cost * 100) if cost else 0

        total_value += value
        total_cost += cost

        pos_list.append({
            "id": p.id,
            "symbol": p.symbol,
            "shares": p.shares,
            "avg_cost": p.avg_cost,
            "current_price": price,
            "value": round(value, 2),
            "cost": round(cost, 2),
            "pnl": round(pnl, 2),
            "pnl_pct": round(pnl_pct, 2),
            "change_pct": q.get("change_pct", 0),
            "notes": p.notes,
            "opened_at": p.opened_at.strftime("%Y-%m-%d") if p.opened_at else "",
        })

    total_pnl = total_value - total_cost
    total_pnl_pct = (total_pnl / total_cost * 100) if total_cost else 0

    return {
        "positions": sorted(pos_list, key=lambda x: abs(x["pnl"]), reverse=True),
        "total_value": round(total_value, 2),
        "total_cost": round(total_cost, 2),
        "total_pnl": round(total_pnl, 2),
        "total_pnl_pct": round(total_pnl_pct, 2),
    }


def add_position(db: Session, symbol: str, shares: float, avg_cost: float, notes: str = "") -> Dict:
    pos = PortfolioPosition(
        symbol=symbol.upper(),
        shares=shares,
        avg_cost=avg_cost,
        notes=notes,
    )
    db.add(pos)
    db.commit()
    return {"success": True, "message": f"เพิ่ม {symbol} x{shares} @ ${avg_cost}"}


def close_position(db: Session, position_id: int, close_price: float) -> Dict:
    pos = db.query(PortfolioPosition).filter(PortfolioPosition.id == position_id).first()
    if not pos:
        return {"success": False, "message": "ไม่พบ position"}
    pos.is_open = False
    pnl = (close_price - pos.avg_cost) * pos.shares
    entry = TradeJournalEntry(
        symbol=pos.symbol,
        action="sell",
        shares=pos.shares,
        price=close_price,
        pnl=pnl,
        notes=f"ปิด position จาก avg cost ${pos.avg_cost}",
    )
    db.add(entry)
    db.commit()
    return {"success": True, "pnl": round(pnl, 2), "message": f"ปิด {pos.symbol} P&L: ${pnl:+.2f}"}


# ===== CHAT HISTORY =====

def save_message(db: Session, role: str, content: str):
    msg = ChatMessage(role=role, content=content)
    db.add(msg)
    db.commit()


def get_chat_history(db: Session, limit: int = 20) -> List[Dict]:
    msgs = db.query(ChatMessage).order_by(ChatMessage.created_at.desc()).limit(limit).all()
    return [{"role": m.role, "content": m.content, "time": m.created_at.isoformat()} for m in reversed(msgs)]
