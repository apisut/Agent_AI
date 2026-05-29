# AI Agent Trading Platform - Installation Guide

## 📋 Table of Contents
1. [ความต้องการของระบบ](#ความต้องการของระบบ)
2. [การติดตั้ง](#การติดตั้ง)
3. [การตั้งค่า](#การตั้งค่า)
4. [การใช้งาน](#การใช้งาน)
5. [API Keys](#api-keys)
6. [Troubleshooting](#troubleshooting)

## ความต้องการของระบบ

- **Python**: 3.9 หรือสูงกว่า
- **pip**: Python package manager
- **git**: สำหรับ clone repository
- **Virtual Environment**: (ส่วนเสริมแนะนำ)

## การติดตั้ง

### 1. Clone Repository
```bash
git clone https://github.com/apisut/Agent_AI.git
cd Agent_AI
```

### 2. สร้าง Virtual Environment
```bash
# บน Windows
python -m venv venv
venv\Scripts\activate

# บน macOS/Linux
python -m venv venv
source venv/bin/activate
```

### 3. ติดตั้ง Dependencies
```bash
pip install -r requirements.txt
```

## การตั้งค่า

### 1. สร้างไฟล์ .env
```bash
cp .env.example .env
```

### 2. แก้ไขไฟล์ .env ใส่ API Keys
```bash
# API Keys
ALPHA_VANTAGE_API_KEY=your_key_here
NEWSAPI_KEY=your_key_here
TWITTER_API_KEY=your_key_here
TWITTER_API_SECRET=your_key_here
TWITTER_BEARER_TOKEN=your_token_here

# Reddit (PRAW)
REDDIT_CLIENT_ID=your_id_here
REDDIT_CLIENT_SECRET=your_secret_here
REDDIT_USER_AGENT=agent-ai

# StockTwits
STOCKTWITS_API_KEY=your_key_here

# Trading Settings
DEFAULT_POSITION_SIZE=0.02
MAX_POSITION_SIZE=0.05
MAX_POSITIONS=10
RISK_PER_TRADE=0.01

# Server
SERVER_HOST=0.0.0.0
SERVER_PORT=8000
DEBUG=False
```

## การใช้งาน

### 1. รันโปรแกรม
```bash
python main.py
```

### 2. เลือกตัวเลือกจาก Menu
```
📋 เลือกสิ่งที่ต้องการทำ:
1. 📊 วิเคราะห์หุ้นทั้งวัน
2. 🔍 สแกนหาโอกาสใหม่
3. 📈 ดูสถานะของ Agents
4. ❌ ออกจากโปรแกรม
```

### 3. รันการวิเคราะห์เฉพาะ
```python
import asyncio
from agents import CEOAgent

async def main():
    ceo = CEOAgent()
    
    # วิเคราะห์หุ้นเฉพาะ
    symbols = ["AAPL", "TSLA", "NVDA"]
    results = await ceo.run_daily_analysis(symbols)
    
    # พิมพ์ผลลัพธ์
    for rec in results["recommendations"]:
        print(f"{rec['symbol']}: {rec['action']} ({rec['confidence']:.0%})")

asyncio.run(main())
```

## API Keys

### Alpha Vantage
1. ไปที่: https://www.alphavantage.co/
2. สมัครสมาชิกฟรี
3. คัดลอก API Key

### NewsAPI
1. ไปที่: https://newsapi.org/
2. สมัครสมาชิก
3. คัดลอก API Key

### Twitter API (Bearer Token)
1. ไปที่: https://developer.twitter.com/
2. สมัครสมาชิก Developer
3. สร้าง App
4. คัดลอก Bearer Token

### Reddit (PRAW)
1. ไปที่: https://www.reddit.com/prefs/apps
2. สร้าง App ใหม่
3. คัดลอก Client ID และ Client Secret

### StockTwits API
1. ไปที่: https://api.stocktwits.com/
2. สมัครสมาชิก
3. คัดลอก API Key

## Troubleshooting

### ปัญหา: ModuleNotFoundError
**สาเหตุ**: ไม่ได้ติดตั้ง dependencies หรือไม่ใช้ virtual environment

**วิธีแก้**:
```bash
# ตรวจสอบว่า virtual environment ถูกเปิดใช้งาน
pip install -r requirements.txt
```

### ปัญหา: API Key ไม่ถูกต้อง
**สาเหตุ**: ไฟล์ .env ไม่ถูกต้อง

**วิธีแก้**:
```bash
# ตรวจสอบไฟล์ .env
cat .env

# สร้างใหม่
cp .env.example .env
# แก้ไข API Keys อีกครั้ง
```

### ปัญหา: Rate limit จากแหล่งข้อมูล
**สาเหตุ**: เรียก API มากเกินไป

**วิธีแก้**:
- ลดจำนวน symbols ที่วิเคราะห์
- เพิ่มเวลารอ (delay) ระหว่าง API calls

## Project Structure
```
Agent_AI/
├── 📁 agents/              # AI Agents
│   ├── ceo_agent.py
│   ├── trader_agent.py
│   ├── technical_analyst.py
│   ├── fundamental_analyst.py
│   ├── social_analyst.py
│   ├── news_scanner.py
│   └── scanner_agent.py
│
├── 📁 logs/                # Log files
├── 📁 data/                # Data files
│
├── 📄 main.py              # Entry point
├── 📄 config.py            # Configuration
├── 📄 utils.py             # Utility functions
├── 📄 requirements.txt      # Dependencies
├── 📄 .env.example         # Environment template
└── 📄 .gitignore           # Git ignore
```

## Features

✅ **Multi-Agent System**
- CEO Agent (บริหารจัดการ)
- Trader Agent (ตัดสินใจเทรด)
- Technical Analyst (วิเคราะห์เทคนิค)
- Fundamental Analyst (วิเคราะห์พื้นฐาน)
- Social Analyst (วิเคราะห์สังคม)
- News Scanner (ค้นหาข่าว)
- Scanner Agent (สแกนโอกาสใหม่)

✅ **Analysis Features**
- Technical Analysis (RSI, MACD, MA, Bollinger Bands)
- Fundamental Analysis (P/E, ROE, Growth rates)
- Social Sentiment Analysis
- News Sentiment Analysis
- Risk Management (Position sizing, Stop loss, Take profit)

✅ **Data Sources**
- Yahoo Finance
- Alpha Vantage
- NewsAPI
- StockTwits
- Twitter/X
- Reddit
- Seeking Alpha

## Contributing

ยินดีรับ Pull Requests และ Issues

## License

MIT License

## Contact

สำหรับคำถามหรือข้อเสนอแนะ: apisutme@gmail.com

---

**Happy Trading! 🚀📈**
