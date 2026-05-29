"""
🔍 SCANNER AGENT
สแกนหาหุ้นใหม่ที่มีศักยภาพ
"""

from datetime import datetime
from typing import List, Dict

class ScannerAgent:
    def __init__(self):
        self.name = "SCANNER"
        self.role = "สแกนโอกาสใหม่"
        self.status = "idle"
    
    async def scan_for_opportunities(self,
                                    min_revenue_growth: float = 15.0,
                                    min_earnings_growth: float = 10.0,
                                    max_pe: float = 30.0) -> Dict:
        """
        สแกนหาหุ้นใหม่ที่ตรงเกณฑ์
        """
        self.status = "scanning"
        
        results = {
            "timestamp": datetime.now().isoformat(),
            "criteria": {
                "min_revenue_growth": min_revenue_growth,
                "min_earnings_growth": min_earnings_growth,
                "max_pe": max_pe
            },
            "opportunities": [],
            "total_found": 0
        }
        
        # สแกนหุ้นจากฐานข้อมูล
        all_stocks = await self._fetch_all_stocks()
        
        # กรองตามเกณฑ์
        opportunities = self._filter_opportunities(
            all_stocks,
            min_revenue_growth,
            min_earnings_growth,
            max_pe
        )
        
        # จัดลำดับตามคะแนนศักยภาพ
        opportunities = sorted(opportunities,
                              key=lambda x: x["potential_score"],
                              reverse=True)
        
        results["opportunities"] = opportunities
        results["total_found"] = len(opportunities)
        
        self.status = "idle"
        return results
    
    async def _fetch_all_stocks(self) -> List[Dict]:
        """ดึงข้อมูลหุ้นทั้งหมด"""
        # TODO: ดึงจาก database หรือ API
        stocks = [
            {
                "symbol": "AAPL",
                "company": "Apple Inc",
                "sector": "Technology",
                "revenue_growth": 20.0,
                "earnings_growth": 25.0,
                "pe_ratio": 25,
                "market_cap": 3000000000000
            },
            {
                "symbol": "TSLA",
                "company": "Tesla Inc",
                "sector": "Automotive",
                "revenue_growth": 35.0,
                "earnings_growth": 40.0,
                "pe_ratio": 40,
                "market_cap": 1200000000000
            }
        ]
        return stocks
    
    def _filter_opportunities(self,
                             stocks: List[Dict],
                             min_revenue_growth: float,
                             min_earnings_growth: float,
                             max_pe: float) -> List[Dict]:
        """
        กรองหุ้นตามเกณฑ์ที่กำหนด
        """
        opportunities = []
        
        for stock in stocks:
            # ตรวจสอบเกณฑ์
            revenue_ok = stock.get("revenue_growth", 0) >= min_revenue_growth
            earnings_ok = stock.get("earnings_growth", 0) >= min_earnings_growth
            pe_ok = stock.get("pe_ratio", 999) <= max_pe
            market_cap_ok = stock.get("market_cap", 0) > 1000000000  # > $1B
            
            if revenue_ok and earnings_ok and pe_ok and market_cap_ok:
                # คำนวณ potential score
                potential_score = self._calculate_potential_score(stock)
                
                opportunity = {
                    "symbol": stock["symbol"],
                    "company": stock["company"],
                    "sector": stock["sector"],
                    "revenue_growth": stock["revenue_growth"],
                    "earnings_growth": stock["earnings_growth"],
                    "pe_ratio": stock["pe_ratio"],
                    "potential_score": potential_score
                }
                
                opportunities.append(opportunity)
        
        return opportunities
    
    def _calculate_potential_score(self, stock: Dict) -> float:
        """
        คำนวณ Potential Score
        score = (Revenue Growth + Earnings Growth) / 2 - PE Ratio / 10
        """
        revenue_growth = stock.get("revenue_growth", 0)
        earnings_growth = stock.get("earnings_growth", 0)
        pe_ratio = stock.get("pe_ratio", 30)
        
        # Normalize scores
        growth_score = (revenue_growth + earnings_growth) / 2
        pe_penalty = (pe_ratio / 30) * 20  # Penalty for high PE
        
        score = growth_score - pe_penalty
        
        return round(max(0, score), 2)


# ตัวอย่างการใช้งาน
if __name__ == "__main__":
    agent = ScannerAgent()
    # result = asyncio.run(agent.scan_for_opportunities())
