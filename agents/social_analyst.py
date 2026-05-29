"""
💬 SOCIAL ANALYST AGENT
ดูข่าวจาก Social Media และนักวิเคราะห์เก่งๆ
ติดตาม: StockTwits, Twitter/X, Reddit, Seeking Alpha
"""

from datetime import datetime
from typing import List, Dict

class SocialAnalystAgent:
    def __init__(self):
        self.name = "SOCIAL_ANALYST"
        self.role = "วิเคราะห์สังคม"
        self.status = "idle"
        self.expert_sources = [
            "stocktwits",
            "twitter_fintwit",
            "reddit_stocks",
            "seeking_alpha"
        ]
    
    async def analyze_social_sentiment(self, symbol: str) -> Dict:
        """
        วิเคราะห์ sentiment จากสังคมออนไลน์
        """
        self.status = "analyzing"
        
        analysis = {
            "symbol": symbol,
            "timestamp": datetime.now().isoformat(),
            "sentiment": {
                "overall": "neutral",
                "bullish_count": 0,
                "bearish_count": 0,
                "neutral_count": 0
            },
            "top_discussions": [],
            "expert_opinions": [],
            "trending": False,
            "hype_score": 0.0,
            "reliability_score": 0.0
        }
        
        # เก็บข้อมูลจากแต่ละแหล่ง
        for source in self.expert_sources:
            posts = await self._fetch_from_source(symbol, source)
            analysis["top_discussions"].extend(posts)
        
        # วิเคราะห์ sentiment
        self._analyze_sentiment(analysis)
        
        # หา expert opinions ที่น่าเชื่อถือ
        analysis["expert_opinions"] = self._find_expert_opinions(
            analysis["top_discussions"]
        )
        
        # คำนวณ hype score
        analysis["hype_score"] = self._calculate_hype_score(analysis)
        
        # Check trending
        analysis["trending"] = analysis["hype_score"] > 0.7
        
        self.status = "idle"
        return analysis
    
    async def _fetch_from_source(self, symbol: str, source: str) -> List[Dict]:
        """ดึงข้อมูลจากแต่ละแหล่ง"""
        posts = []
        
        if source == "stocktwits":
            posts = await self._fetch_stocktwits(symbol)
        elif source == "twitter_fintwit":
            posts = await self._fetch_twitter(symbol)
        elif source == "reddit_stocks":
            posts = await self._fetch_reddit(symbol)
        elif source == "seeking_alpha":
            posts = await self._fetch_seeking_alpha(symbol)
        
        return posts
    
    async def _fetch_stocktwits(self, symbol: str) -> List[Dict]:
        """ดึงจาก StockTwits"""
        # TODO: ใช้ StockTwits API
        return [
            {
                "source": "stocktwits",
                "symbol": symbol,
                "author": "user123",
                "content": "Sample post",
                "sentiment": "bullish",
                "likes": 45,
                "timestamp": datetime.now().isoformat(),
                "is_expert": False
            }
        ]
    
    async def _fetch_twitter(self, symbol: str) -> List[Dict]:
        """ดึงจาก Twitter/X"""
        # TODO: ใช้ Twitter API v2
        return []
    
    async def _fetch_reddit(self, symbol: str) -> List[Dict]:
        """ดึงจาก Reddit"""
        # TODO: ใช้ PRAW
        return []
    
    async def _fetch_seeking_alpha(self, symbol: str) -> List[Dict]:
        """ดึงจาก Seeking Alpha"""
        # TODO: Web scraping หรือ API
        return []
    
    def _analyze_sentiment(self, analysis: Dict) -> None:
        """วิเคราะห์ sentiment จากความเห็นต่างๆ"""
        discussions = analysis["top_discussions"]
        
        bullish = sum(1 for d in discussions if d.get("sentiment") == "bullish")
        bearish = sum(1 for d in discussions if d.get("sentiment") == "bearish")
        neutral = len(discussions) - bullish - bearish
        
        analysis["sentiment"]["bullish_count"] = bullish
        analysis["sentiment"]["bearish_count"] = bearish
        analysis["sentiment"]["neutral_count"] = neutral
        
        if bullish > bearish:
            analysis["sentiment"]["overall"] = "bullish"
        elif bearish > bullish:
            analysis["sentiment"]["overall"] = "bearish"
        else:
            analysis["sentiment"]["overall"] = "neutral"
    
    def _find_expert_opinions(self, discussions: List[Dict]) -> List[Dict]:
        """หาความเห็นจากผู้เชี่ยวชาญ"""
        experts = [d for d in discussions if d.get("is_expert", False)]
        
        # เรียงตามจำนวน engagement (likes, retweets)
        experts = sorted(experts, 
                        key=lambda x: x.get("engagement", 0), 
                        reverse=True)
        
        return experts[:5]
    
    def _calculate_hype_score(self, analysis: Dict) -> float:
        """
        คำนวณ Hype Score (0-1)
        พิจารณา:
        - ปริมาณการพูดคุย
        - Sentiment ratio
        - Trending status
        """
        discussions = analysis["top_discussions"]
        sentiment = analysis["sentiment"]
        
        # Volume score
        volume_score = min(len(discussions) / 100, 1.0)  # Max 100 posts
        
        # Sentiment score (bias towards bullish)
        total = sentiment["bullish_count"] + sentiment["bearish_count"]
        if total > 0:
            sentiment_ratio = sentiment["bullish_count"] / total
        else:
            sentiment_ratio = 0.5
        
        # Calculate hype
        hype = (volume_score * 0.5) + (sentiment_ratio * 0.5)
        
        return round(hype, 2)
    
    def _get_reliability_score(self, discussions: List[Dict]) -> float:
        """คำนวณ Reliability Score ของข้อมูล"""
        if not discussions:
            return 0.0
        
        experts = sum(1 for d in discussions if d.get("is_expert", False))
        verified = sum(1 for d in discussions if d.get("verified", False))
        
        score = (experts / len(discussions) * 0.7) + \
                (verified / len(discussions) * 0.3)
        
        return round(score, 2)


# ตัวอย่างการใช้งาน
if __name__ == "__main__":
    agent = SocialAnalystAgent()
    # result = asyncio.run(agent.analyze_social_sentiment("AAPL"))
