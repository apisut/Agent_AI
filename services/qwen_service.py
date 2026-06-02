"""
Qwen AI Service (Alibaba DashScope)
ใช้ OpenAI-compatible API
"""
import requests
import json
from typing import List, Dict, Optional
from config import config


SYSTEM_PROMPT = """คุณคือ CEO Agent ของระบบ TradePilot OS — ผู้ช่วย AI Trading ระดับมืออาชีพ
คุณมีความเชี่ยวชาญด้าน:
- วิเคราะห์หุ้นและตลาด (Technical + Fundamental Analysis)
- สร้างแผนการเทรด (Entry, Stop Loss, Take Profit, Risk/Reward)
- ประเมินความเสี่ยง (Portfolio Risk Management)
- ติดตามข่าวและ sentiment ตลาด

กฎการตอบ:
- ตอบเป็นภาษาไทยเสมอ (ยกเว้นชื่อหุ้น ticker ให้เป็นอังกฤษ)
- กระชับ ชัดเจน ตรงประเด็น
- ถ้าถามเรื่องหุ้นให้บอก Entry / SL / TP / RR ด้วย
- เตือนความเสี่ยงทุกครั้งที่แนะนำ"""


def chat(messages: List[Dict], stream: bool = False) -> str:
    """ส่งข้อความหา Qwen และรับคำตอบ"""
    if not config.QWEN_API_KEY:
        return "⚠️ ยังไม่ได้ตั้งค่า QWEN_API_KEY ในไฟล์ .env ครับ"

    headers = {
        "Authorization": f"Bearer {config.QWEN_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": config.QWEN_MODEL,
        "messages": [{"role": "system", "content": SYSTEM_PROMPT}] + messages,
        "temperature": 0.7,
        "max_tokens": 1024,
        "stream": False,
    }

    try:
        resp = requests.post(
            f"{config.QWEN_BASE_URL}/chat/completions",
            headers=headers,
            json=payload,
            timeout=30,
        )
        resp.raise_for_status()
        data = resp.json()
        return data["choices"][0]["message"]["content"]

    except requests.exceptions.ConnectionError:
        return "❌ ไม่สามารถเชื่อมต่อ Qwen API ได้ กรุณาตรวจสอบ internet"
    except requests.exceptions.Timeout:
        return "⏱️ Qwen API ตอบช้าเกินไป กรุณาลองใหม่"
    except requests.exceptions.HTTPError as e:
        if resp.status_code == 401:
            return "🔑 API Key ไม่ถูกต้อง กรุณาตรวจสอบ QWEN_API_KEY ใน .env"
        return f"❌ API Error: {e}"
    except Exception as e:
        return f"❌ เกิดข้อผิดพลาด: {str(e)}"


def analyze_stock(symbol: str, market_data: Dict, news: List[Dict]) -> str:
    """ให้ Qwen วิเคราะห์หุ้น"""
    news_text = "\n".join([f"- {n['headline']}" for n in news[:3]])
    price = market_data.get("price", 0)
    change_pct = market_data.get("change_pct", 0)

    prompt = f"""วิเคราะห์หุ้น {symbol} ให้หน่อยครับ

ข้อมูลปัจจุบัน:
- ราคา: ${price}
- เปลี่ยนแปลง: {change_pct:+.2f}%
- ข่าวล่าสุด:
{news_text}

กรุณาให้:
1. ทิศทางระยะสั้น (Bullish/Bearish/Neutral) พร้อมเหตุผล
2. โซน Entry ที่แนะนำ
3. Stop Loss และ Take Profit
4. Risk/Reward Ratio
5. ความเสี่ยงที่ต้องระวัง"""

    return chat([{"role": "user", "content": prompt}])


def generate_market_brief(indices: Dict, top_movers: List[Dict]) -> str:
    """สรุปภาพรวมตลาดวันนี้"""
    sp500 = indices.get("sp500", {})
    nasdaq = indices.get("nasdaq", {})
    movers_text = "\n".join([
        f"- {m['symbol']}: {m['change_pct']:+.2f}%"
        for m in top_movers[:5]
    ])

    prompt = f"""สรุปภาพรวมตลาดวันนี้ให้หน่อยครับ (ไม่เกิน 3 ประโยค)

ข้อมูล:
- S&P 500: {sp500.get('value', 0)} ({sp500.get('change', 0):+.2f}%)
- NASDAQ: {nasdaq.get('value', 0)} ({nasdaq.get('change', 0):+.2f}%)
- Top Movers:
{movers_text}"""

    return chat([{"role": "user", "content": prompt}])


def build_trade_plan(symbol: str, price: float, bias: str = "bullish") -> str:
    """สร้างแผนเทรด"""
    prompt = f"""สร้างแผนเทรดสำหรับ {symbol} ราคาปัจจุบัน ${price:.2f} (bias: {bias})

กรุณาให้ข้อมูลครบ:
1. Entry Zone (ราคาที่ควรซื้อ)
2. Stop Loss (จุด cut loss)
3. Take Profit 1 (TP1)
4. Take Profit 2 (TP2)
5. Risk/Reward Ratio
6. Position Size (% ของพอร์ต)
7. Setup Type (Breakout/Pullback/Reversal ฯลฯ)
8. เงื่อนไขที่ต้องเห็นก่อนเข้า"""

    return chat([{"role": "user", "content": prompt}])
