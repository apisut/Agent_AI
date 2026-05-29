"""
🚀 Entry Point สำหรับ Agent AI Trading Platform
"""

import asyncio
import logging
from datetime import datetime

from agents import CEOAgent
from config import config

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


async def run_daily_analysis():
    """
    รันการวิเคราะห์รายวัน
    """
    logger.info("=" * 60)
    logger.info("🚀 เริ่มการวิเคราะห์รายวัน")
    logger.info("=" * 60)
    
    # สร้าง CEO Agent
    ceo = CEOAgent()
    
    # สัญลักษณ์หุ้นที่ต้องการวิเคราะห์
    symbols = config.SYMBOLS_TO_ANALYZE
    logger.info(f"📊 วิเคราะห์: {', '.join(symbols)}")
    
    try:
        # รันการวิเคราะห์
        results = await ceo.run_daily_analysis(symbols)
        
        # แสดงผลลัพธ์
        print("\n" + "=" * 60)
        print("📈 ผลการวิเคราะห์")
        print("=" * 60)
        
        for rec in results["recommendations"]:
            action = rec["action"].upper()
            confidence = rec["confidence"]
            symbol = rec["symbol"]
            
            # เลือก icon ตามการตัดสินใจ
            if rec["action"] == "strong_buy":
                icon = "🟢🟢"
            elif rec["action"] == "buy":
                icon = "🟢"
            elif rec["action"] == "hold":
                icon = "🟡"
            elif rec["action"] == "sell":
                icon = "🔴"
            else:
                icon = "🔴🔴"
            
            print(f"\n{icon} {symbol}")
            print(f"   ตัดสินใจ: {action}")
            print(f"   ความมั่นใจ: {confidence:.0%}")
            
            if rec.get("entry"):
                print(f"   Entry: ${rec['entry']:.2f}")
            if rec.get("target"):
                print(f"   Target: ${rec['target']:.2f}")
            if rec.get("stop_loss"):
                print(f"   Stop Loss: ${rec['stop_loss']:.2f}")
        
        print("\n" + "=" * 60)
        print(f"⏱️  เวลาที่ใช้: {results['execution_time']:.2f} วินาที")
        print("=" * 60 + "\n")
        
        # บันทึก results
        logger.info(f"✅ เสร็จสิ้นการวิเคราะห์: {len(results['recommendations'])} สัญลักษณ์")
        
        return results
        
    except Exception as e:
        logger.error(f"❌ เกิดข้อผิดพลาด: {str(e)}", exc_info=True)
        raise


async def scan_opportunities():
    """
    สแกนหาโอกาสใหม่
    """
    logger.info("=" * 60)
    logger.info("🔍 สแกนหาโอกาสใหม่")
    logger.info("=" * 60)
    
    ceo = CEOAgent()
    
    try:
        results = await ceo.scan_new_opportunities(
            min_revenue_growth=config.MIN_REVENUE_GROWTH,
            min_earnings_growth=config.MIN_EARNINGS_GROWTH,
            max_pe=config.MAX_PE_RATIO
        )
        
        print("\n" + "=" * 60)
        print("🎯 โอกาสใหม่ที่พบ")
        print("=" * 60)
        
        for i, opp in enumerate(results["opportunities"][:10], 1):
            print(f"\n{i}. {opp['symbol']} - {opp.get('company', 'N/A')}")
            print(f"   ภาค: {opp.get('sector', 'N/A')}")
            print(f"   Revenue Growth: {opp['revenue_growth']:.1f}%")
            print(f"   Earnings Growth: {opp['earnings_growth']:.1f}%")
            print(f"   P/E Ratio: {opp['pe_ratio']:.1f}")
            print(f"   Potential Score: {opp['potential_score']:.2f}")
        
        print("\n" + "=" * 60)
        print(f"💡 พบโอกาสใหม่ทั้งหมด: {results['total_found']} อัน")
        print("=" * 60 + "\n")
        
        logger.info(f"✅ พบโอกาสใหม่: {results['total_found']} อัน")
        
        return results
        
    except Exception as e:
        logger.error(f"❌ เกิดข้อผิดพลาด: {str(e)}", exc_info=True)
        raise


def main():
    """
    Main function
    """
    print("""
    ╔══════════════════════════════════════════════════╗
    ║   🚀 AGENT AI TRADING PLATFORM                   ║
    ║   Multi-Agent Stock Analysis System              ║
    ╚══════════════════════════════════════════════════╝
    """)
    
    print("\n📋 เลือกสิ่งที่ต้องการทำ:")
    print("1. 📊 วิเคราะห์หุ้นทั้งวัน")
    print("2. 🔍 สแกนหาโอกาสใหม่")
    print("3. 📈 ดูสถานะของ Agents")
    print("4. ❌ ออกจากโปรแกรม")
    
    choice = input("\nเลือก (1-4): ").strip()
    
    if choice == "1":
        asyncio.run(run_daily_analysis())
    elif choice == "2":
        asyncio.run(scan_opportunities())
    elif choice == "3":
        ceo = CEOAgent()
        status = ceo.get_status()
        print("\n" + "=" * 60)
        print("🤖 สถานะ Agents")
        print("=" * 60)
        for agent in status["agents"]:
            print(f"\n{agent['name']} ({agent['role']})")
            print(f"  สถานะ: {agent['status']}")
        print("\n" + "=" * 60 + "\n")
    elif choice == "4":
        print("\n👋 ลาก่อนครับ!\n")
    else:
        print("\n❌ ตัวเลือกไม่ถูกต้อง\n")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  หยุดโปรแกรม")
    except Exception as e:
        logger.error(f"❌ ข้อผิดพลาด: {str(e)}", exc_info=True)
