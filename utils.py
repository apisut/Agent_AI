"""
Utility functions สำหรับ Agent AI
"""

import logging
from datetime import datetime
from typing import Dict, List, Any

logger = logging.getLogger(__name__)


def setup_logger(name: str, log_file: str = None) -> logging.Logger:
    """
    ตั้งค่า logger
    """
    logger = logging.getLogger(name)
    logger.setLevel(logging.DEBUG)
    
    # Console handler
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    
    # Formatter
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)
    
    # File handler (if specified)
    if log_file:
        file_handler = logging.FileHandler(log_file)
        file_handler.setLevel(logging.DEBUG)
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)
    
    return logger


def format_currency(value: float, symbol: str = "$") -> str:
    """
    จัดรูปแบบสกุลเงิน
    """
    return f"{symbol}{value:,.2f}"


def format_percentage(value: float, decimal_places: int = 2) -> str:
    """
    จัดรูปแบบเปอร์เซ็นต์
    """
    return f"{value:.{decimal_places}f}%"


def calculate_risk_reward_ratio(entry: float, 
                               stop_loss: float,
                               take_profit: float) -> float:
    """
    คำนวณ Risk/Reward Ratio
    """
    risk = entry - stop_loss
    reward = take_profit - entry
    
    if risk <= 0:
        return 0.0
    
    return round(reward / risk, 2)


def calculate_position_size(account_balance: float,
                           risk_percent: float,
                           entry_price: float,
                           stop_loss: float) -> float:
    """
    คำนวณขนาด Position ตามจำนวนบัญชี
    Position Size = (Account Balance * Risk %) / (Entry - Stop Loss)
    """
    risk_amount = account_balance * (risk_percent / 100)
    price_risk = entry_price - stop_loss
    
    if price_risk <= 0:
        return 0.0
    
    position_size = risk_amount / price_risk
    return round(position_size, 2)


def is_market_open() -> bool:
    """
    ตรวจสอบว่าตลาดหุ้นเปิดอยู่หรือไม่
    (ตัวอย่าง: US market)
    """
    from datetime import datetime, time
    import pytz
    
    ny_tz = pytz.timezone('America/New_York')
    now = datetime.now(ny_tz)
    
    # Market hours: 9:30 AM - 4:00 PM ET, Monday - Friday
    market_open = time(9, 30)
    market_close = time(16, 0)
    
    if now.weekday() >= 5:  # Saturday & Sunday
        return False
    
    return market_open <= now.time() <= market_close


def normalize_score(value: float, 
                   min_val: float = 0, 
                   max_val: float = 100) -> float:
    """
    ปกติ score ให้เป็น 0-1
    """
    if max_val == min_val:
        return 0.5
    
    normalized = (value - min_val) / (max_val - min_val)
    return round(max(0, min(1, normalized)), 2)


def dict_to_readable(data: Dict, indent: int = 0) -> str:
    """
    แปลง dictionary เ���็น readable text format
    """
    result = []
    indent_str = "  " * indent
    
    for key, value in data.items():
        if isinstance(value, dict):
            result.append(f"{indent_str}{key}:")
            result.append(dict_to_readable(value, indent + 1))
        elif isinstance(value, list):
            result.append(f"{indent_str}{key}:")
            for i, item in enumerate(value):
                if isinstance(item, dict):
                    result.append(dict_to_readable(item, indent + 1))
                else:
                    result.append(f"{indent_str}  - {item}")
        else:
            result.append(f"{indent_str}{key}: {value}")
    
    return "\n".join(result)


class PerformanceTracker:
    """
    เก็บประวัติการทำงาน
    """
    def __init__(self):
        self.trades = []
        self.start_balance = 0
        self.current_balance = 0
    
    def add_trade(self, symbol: str, action: str, entry: float,
                 exit_price: float, quantity: int):
        """เพิ่มบันทึกการเทรด"""
        profit_loss = (exit_price - entry) * quantity
        
        trade = {
            "timestamp": datetime.now().isoformat(),
            "symbol": symbol,
            "action": action,
            "entry": entry,
            "exit": exit_price,
            "quantity": quantity,
            "profit_loss": profit_loss
        }
        
        self.trades.append(trade)
        self.current_balance += profit_loss
    
    def get_win_rate(self) -> float:
        """คำนวณ Win Rate (%)"""
        if not self.trades:
            return 0.0
        
        wins = sum(1 for t in self.trades if t["profit_loss"] > 0)
        return round((wins / len(self.trades)) * 100, 2)
    
    def get_total_profit(self) -> float:
        """คำนวณกำไรรวม"""
        return round(sum(t["profit_loss"] for t in self.trades), 2)
    
    def get_average_profit_per_trade(self) -> float:
        """คำนวณกำไรเฉลี่ยต่อการเทรด"""
        if not self.trades:
            return 0.0
        
        return round(self.get_total_profit() / len(self.trades), 2)
    
    def get_summary(self) -> Dict[str, Any]:
        """ดึงข้อมูลสรุป"""
        return {
            "total_trades": len(self.trades),
            "win_rate": self.get_win_rate(),
            "total_profit": self.get_total_profit(),
            "average_profit_per_trade": self.get_average_profit_per_trade(),
            "starting_balance": self.start_balance,
            "current_balance": self.current_balance
        }


# ตัวอย่างการใช้งาน
if __name__ == "__main__":
    logger = setup_logger(__name__)
    logger.info("Utils loaded successfully")
