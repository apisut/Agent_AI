from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Boolean, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
from config import config

engine = create_engine(config.DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()


class WatchlistItem(Base):
    __tablename__ = "watchlist"
    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, unique=True, index=True)
    added_at = Column(DateTime, default=datetime.utcnow)
    notes = Column(Text, default="")
    alert_price = Column(Float, nullable=True)


class PortfolioPosition(Base):
    __tablename__ = "portfolio"
    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, index=True)
    shares = Column(Float)
    avg_cost = Column(Float)
    opened_at = Column(DateTime, default=datetime.utcnow)
    notes = Column(Text, default="")
    is_open = Column(Boolean, default=True)


class TradeJournalEntry(Base):
    __tablename__ = "trade_journal"
    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String)
    action = Column(String)        # buy / sell
    shares = Column(Float)
    price = Column(Float)
    pnl = Column(Float, nullable=True)
    setup = Column(String, default="")
    notes = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)


class ChatMessage(Base):
    __tablename__ = "chat_history"
    id = Column(Integer, primary_key=True, index=True)
    role = Column(String)          # user / assistant
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)


def init_db():
    Base.metadata.create_all(bind=engine)
    _seed_watchlist()


def _seed_watchlist():
    db = SessionLocal()
    try:
        if db.query(WatchlistItem).count() == 0:
            defaults = ["NVDA", "META", "MSFT", "AAPL", "AMZN", "GOOGL", "AMD", "TSLA"]
            for sym in defaults:
                db.add(WatchlistItem(symbol=sym))
            db.commit()
    finally:
        db.close()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
