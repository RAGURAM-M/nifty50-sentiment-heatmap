# 📊 Nifty 50 Financial News Sentiment Analyzer & Indian Stock Heatmap

A Full-Stack Financial Engineering and Market Sentiment Intelligence application for Indian Equities (NSE/BSE Nifty 50). It aggregates live financial news, parses headlines using web scraping and RSS feeds, processes sentiment using an advanced **Natural Language Processing (NLP)** engine with an Indian financial market lexicon, and maps sentiment against real-time stock price movements.

---

## 🌟 Key Features

### 1. Front-End (ReactJS + Modern Bloomberg Terminal Aesthetic)
- **Dynamic Stock Sentiment Heatmap**: Color-coded Treemap/Grid with green/red intensity based on NLP sentiment scores (-1.00 Bearish to +1.00 Bullish). Tile size represents market capitalization weight.
- **Interactive Stock Deep-Dive Modal**:
  - Dual-axis SVG Chart: 7-day Historical Stock Price vs. News Sentiment Polarity correlation overlay.
  - Metrics breakdown: Current Price (₹), Sentiment Confidence (%), Short-term Predicted Price Impact (%), and Target Price Range [Low ₹ - High ₹].
- **Company News Timeline**: Real-time chronological news stream with publisher badges (*The Economic Times*, *LiveMint*, *Moneycontrol*), sentiment indicators, and extracted keyword triggers.
- **Sector-Wise Filtering**: Filter across Banking & Financials, IT & Software, Energy, Automobile, FMCG, Metals & Mining, Pharma, Infrastructure, and Telecom.
- **Live Scraping & Sync Trigger**: One-click manual refresh button to trigger live scraping of market feeds.

### 2. Back-End & DB (Node.js + Express + MongoDB)
- **Web Scraping & Aggregator Module**: Built using `axios`, `cheerio`, and `rss-parser` to ingest news from Google News India Business, LiveMint, and Economic Times feeds.
- **Resilient Dual-Mode Database**:
  - Uses **Mongoose** to connect to MongoDB (`MONGODB_URI`).
  - Seamlessly falls back to an in-memory/JSON store with identical schemas if MongoDB is offline, ensuring 100% reliability during college evaluations and viva presentations.
- **RESTful Endpoints**: Full CRUD and analysis endpoints for stocks, news feeds, market summaries, and live catalyst injections.

### 3. 🧠 Innovation Hook (Designed for 5/5 in Innovation)
- **Enhanced Financial NLP Sentiment Engine**:
  - Combines **VADER Sentiment Analysis** with a **Custom Indian Stock Market Lexicon** (`financialLexicon.js`) weighted for domestic equity terminology (e.g., *profit surge, order win, RBI rate cut, FII inflow, promoter pledge, SEBI probe, NPA spike, margin squeeze*).
  - Calculates confidence ratings (0–99%) based on lexical density and token alignment.
  - **Dynamic Sentiment-to-Price Impact Algorithm**: Simulates short-term price movement percentage based on equity volatility models.
- **Instant NLP Playground & Headline Simulator**:
  - Allows professors, evaluators, and analysts to input any headline or choose one-click presets.
  - Visualizes lexical token contributions (word weights).
  - Features a **"Commit Catalyst"** button that updates the database and the live heatmap tile in real-time.

---

## 🏗️ Project Architecture

```
FULL STACK IA3/
├── backend/
│   ├── config/
│   │   └── db.js                 # Dual-mode Mongoose & memory store
│   ├── models/
│   │   ├── Stock.js              # Stock metadata and sentiment schema
│   │   ├── Article.js            # News article and NLP token schema
│   │   └── SentimentLog.js       # Sentiment update audit log
│   ├── nlp/
│   │   ├── financialLexicon.js   # Indian stock market lexicon
│   │   └── sentimentEngine.js    # NLP sentiment engine & price impact calculator
│   ├── routes/
│   │   └── api.js                # Express REST API routes
│   ├── services/
│   │   ├── scraperService.js     # Cheerio, Axios & RSS scraper
│   │   └── stockData.js          # Nifty 50 dataset & 7-day trend generator
│   ├── .env                      # Port and MongoDB configuration
│   ├── package.json              # Backend dependencies
│   └── server.js                 # Express server entrypoint
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx          # Live Nifty ticker, market mood & sync controls
│   │   │   ├── HeatmapView.jsx     # Dynamic stock sentiment heatmap & filters
│   │   │   ├── StockModal.jsx      # Deep-dive modal with 7-day SVG correlation chart
│   │   │   ├── NlpPlayground.jsx   # Innovation Hook: Custom headline NLP simulator
│   │   │   ├── NewsTimeline.jsx    # Chronological news feed with sentiment badges
│   │   │   └── SectorAnalytics.jsx # Sector ranking bars & top mover cards
│   │   ├── App.jsx                 # Root component and state manager
│   │   ├── index.css               # Dark mode Bloomberg terminal design system
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- (Optional) [MongoDB](https://www.mongodb.com/) running locally or a MongoDB Atlas URI. *Note: If MongoDB is not installed, the application automatically uses the resilient in-memory store.*

---

### Step 1: Run the Backend
1. Open a terminal in the `backend` folder:
   ```powershell
   cd backend
   npm install
   npm run dev
   ```
2. The server will start on: **`http://localhost:5000`**
3. Verify backend health:
   ```
   http://localhost:5000/api/health
   ```

---

### Step 2: Run the Frontend
1. Open a second terminal in the `frontend` folder:
   ```powershell
   cd frontend
   npm install
   npm run dev
   ```
2. Open your browser and navigate to: **`http://127.0.0.1:5173/`**

---

## 📡 REST API Documentation

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | System health check and MongoDB connection status |
| `GET` | `/api/stocks` | Fetch all Nifty 50 stocks with sentiment scores |
| `GET` | `/api/stocks/:symbol` | Fetch single stock details, target band, and 7-day trend |
| `GET` | `/api/news` | Fetch news timeline (filterable by `?symbol=` and `?sentiment=`) |
| `POST` | `/api/news/scrape` | Trigger live Cheerio / RSS web scrape for fresh news |
| `POST` | `/api/nlp/analyze` | Run custom headline through the NLP Engine |
| `POST` | `/api/nlp/apply` | Commit analyzed headline to live feed and update heatmap |
| `GET` | `/api/market-summary` | Aggregated market mood, sector breakdown, and top gainers |

---

## 🧪 Testing the Innovation Hook (Viva Demo Guide)

1. Navigate to the **"NLP Sentiment Engine (Innovation 5/5)"** tab.
2. Select **`TATAMOTORS`** as the target stock.
3. Click the preset: *"Tata Motors Q3 net profit surges 45% YoY; EV exports double with record order wins"*.
4. Click **Analyze Sentiment & Impact**:
   - Notice the polarity score (`+1.00 Bullish`).
   - Observe detected lexical triggers (`surge: +3.2`, `record: +3.5`).
   - Observe simulated price impact (`+2.40%`).
5. Click **"Commit Catalyst & Update Heatmap Tile"**.
6. Switch back to the **"Dynamic Stock Heatmap"** tab — note how Tata Motors immediately lights up in vibrant green with updated sentiment metrics!
