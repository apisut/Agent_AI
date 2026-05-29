"""
🎯 TRADER AGENT
ตัดสินใจจุดเข้า จุดออก หลังจากรวบรวมข้อมูลทั้งหมด
ตัดสินใจ: Entry Signal, Exit Signal, Position Sizing, Risk Management
"""

from datetime import datetime
from typing import Dict, List
from enum import Enum

class TradeAction(Enum):
    STRONG_BUY = "strong_buy"
    BUY = "buy"
    HOLD = "hold"
    SELL = "sell"
    STRONG_SELL = "strong_sell"

class TraderAgent:
    def __init__(self):
        self.name = "TRADER"
        self.role = "เทรด & จัดการ Risk"
        self.status = "idle"
        self.portfolio = []
    
    async def make_trade_decision(self, 
                                  symbol: str,
                                  technical_analysis: Dict,
                                  fundamental_analysis: Dict,
                                  social_sentiment: Dict,
                                  news_analysis: Dict,
                                  current_price: float) -> Dict:
        """
        ตัดสินใจเทรดจากข้อมูลทั้งหมด
        """
        self.status = "deciding"
        
        decision = {
            "symbol": symbol,
            "timestamp": datetime.now().isoformat(),
            "current_price": current_price,
            "recommendation": "hold",
            "entry_price": None,
            "exit_price": None,
            "stop_loss": None,
            "take_profit": None,
            "position_size": None,
            "risk_reward_ratio": None,
            "confidence": 0.0,
            "reasoning": []
        }
        
        # คะแนนจากแต่ละด้าน
        scores = {
            "technical": self._score_technical(technical_analysis),
            "fundamental": self._score_fundamental(fundamental_analysis),
            "sentiment": self._score_sentiment(social_sentiment),
            "news": self._score_news(news_analysis)
        }
        
        decision["scores"] = scores
        
        # คำนวณ weighted score
        weighted_score = (
            scores["technical"] * 0.35 +
            scores["fundamental"] * 0.25 +
            scores["sentiment"] * 0.20 +
            scores["news"] * 0.20
        )
        
        decision["weighted_score"] = round(weighted_score, 2)
        
        # ตัดสินใจ Action
        decision["recommendation"] = self._get_action(weighted_score)
        decision["confidence"] = self._get_confidence(weighted_score)
        
        # คำนวณ Entry/Exit prices
        if decision["recommendation"] in ["buy", "strong_buy"]:
            entry, exit_p, sl, tp = self._calculate_levels(
                current_price,
                technical_analysis,
                fundamental_analysis
            )
            decision["entry_price"] = entry
            decision["exit_price"] = exit_p
            decision["stop_loss"] = sl
            decision["take_profit"] = tp
            
            # Risk-Reward Ratio
            risk = entry - sl
            reward = tp - entry
            if risk > 0:
                decision["risk_reward_ratio"] = round(reward / risk, 2)
        
        # Position sizing (ตัวอย่าง)
        if decision["recommendation"] in ["buy", "strong_buy"]:
            decision["position_size"] = self._calculate_position_size(
                risk=decision.get("stop_loss", current_price * 0.95),
                reward=decision.get("take_profit", current_price * 1.05),
                confidence=decision["confidence"]
            )
        
        # Reasoning
        decision["reasoning"] = self._generate_reasoning(
            decision,
            scores,
            technical_analysis,
            fundamental_analysis
        )
        
        self.status = "idle"
        return decision
    
    def _score_technical(self, analysis: Dict) -> float:
        """ให้คะแนน Technical Analysis (0-100)"""
        score = 50  # Neutral base
        
        signal = analysis.get("signal", "neutral")
        confidence = analysis.get("confidence", 0.5)
        
        if signal == "bullish":
            score += confidence * 50
        elif signal == "bearish":
            score -= confidence * 50
        
        # RSI adjustment
        rsi = analysis.get("indicators", {}).get("rsi")
        if rsi:
            if rsi < 30:
                score += 10  # Oversold
            elif rsi > 70:
                score -= 10  # Overbought
        
        return min(100, max(0, score))
    
    def _score_fundamental(self, analysis: Dict) -> float:
        """ให้คะแนน Fundamental Analysis (0-100)"""
        score = 50
        
        rating = analysis.get("rating", "Hold")
        
        if rating == "Strong Buy":
            score = 95
        elif rating == "Buy":
            score = 75
        elif rating == "Hold":
            score = 50
        elif rating == "Sell":
            score = 25
        elif rating == "Strong Sell":
            score = 5
        
        return score
    
    def _score_sentiment(self, analysis: Dict) -> float:
        """ให้คะแนน Social Sentiment (0-100)"""
        score = 50
        
        hype = analysis.get("hype_score", 0.5)
        sentiment = analysis.get("sentiment", {}).get("overall", "neutral")
        
        if sentiment == "bullish":
            score = 50 + (hype * 50)
        elif sentiment == "bearish":
            score = 50 - (hype * 50)
        
        return score
    
    def _score_news(self, analysis: Dict) -> float:
        """ให้คะแนน News Analysis (0-100)"""
        score = 50
        
        sentiment = analysis.get("sentiment_overview", "neutral")
        
        if sentiment == "bullish":
            score = 75
        elif sentiment == "bearish":
            score = 25
        
        return score
    
    def _get_action(self, weighted_score: float) -> str:
        """ตัดสินใจ Action จาก weighted score"""
        if weighted_score >= 75:
            return "strong_buy"
        elif weighted_score >= 60:
            return "buy"
        elif weighted_score >= 40:
            return "hold"
        elif weighted_score >= 25:
            return "sell"
        else:
            return "strong_sell"
    
    def _get_confidence(self, weighted_score: float) -> float:
        """คำนวณ Confidence level"""
        # ความมั่นใจสูงเมื่อคะแนนห่างจาก neutral (50)
        distance = abs(weighted_score - 50)
        confidence = distance / 50
        return round(min(1.0, confidence), 2)
    
    def _calculate_levels(self, current_price: float,
                         technical: Dict,
                         fundamental: Dict) -> tuple:
        """
        คำนวณ Entry, Exit, Stop Loss, Take Profit
        """
        # Entry: slightly below resistance หรือ support break
        support = technical.get("support_levels", [current_price * 0.95])[0]
        entry = support * 0.99  # 1% below support
        
        # Stop Loss: below support
        stop_loss = support * 0.97
        
        # Take Profit: based on risk-reward ratio
        resistance = technical.get("resistance_levels", [current_price * 1.05])[0]
        take_profit = resistance * 1.03
        
        # ปรับตาม fundamental rating
        rating = fundamental.get("rating", "Hold")
        if rating == "Strong Buy":
            take_profit *= 1.1
        elif rating == "Strong Sell":
            take_profit *= 0.9
        
        exit_price = (entry + take_profit) / 2
        
        return entry, exit_price, stop_loss, take_profit
    
    def _calculate_position_size(self, risk: float, 
                                reward: float, 
                                confidence: float) -> float:
        """
        คำนวณขนาด Position
        Position size ∝ Confidence * (Reward/Risk)
        """
        if risk <= 0:
            return 0.01  # ขั้นต่ำ
        
        rrr = reward / risk if risk > 0 else 0
        position_size = confidence * (rrr / 10)  # ปกติ
        
        # จำกัดไม่เกิน 5% ต่อครั้ง
        return round(min(0.05, max(0.01, position_size)), 3)
    
    def _generate_reasoning(self, decision: Dict,
                           scores: Dict,
                           technical: Dict,
                           fundamental: Dict) -> List[str]:
        """สร้าง Reasoning สำหรับการตัดสินใจ"""
        reasoning = []
        
        # Technical reasoning
        technical_score = scores["technical"]
        if technical_score > 70:
            signal = technical.get("signal", "unknown")
            rsi = technical.get("indicators", {}).get("rsi")
            if rsi and rsi < 30:
                reasoning.append(f"📊 เทคนิค: RSI oversold ({rsi})")
            reasoning.append(f"📊 เทคนิค: สัญญาณ {signal} แข็งแกร่ง")
        
        # Fundamental reasoning
        fundamental_score = scores["fundamental"]
        rating = fundamental.get("rating", "Hold")
        if fundamental_score > 70:
            reasoning.append(f"📈 พื้นฐาน: Rating {rating}")
        
        # Sentiment reasoning
        sentiment_score = scores["sentiment"]
        if sentiment_score > 70:
            hype = fundamental.get("hype_score", 0)
            reasoning.append(f"💬 ความเห็น: Bullish ({hype:.0%} hype)")
        
        return reasoning


# ตัวอย่างการใช้งาน
if __name__ == "__main__":
    agent = TraderAgent()
    # result = asyncio.run(agent.make_trade_decision(...))
