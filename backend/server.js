import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import apiRouter from './routes/api.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allows frontend connections from any port (e.g. Vite 5173/5174)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Serve static assets from public directory (without auto-serving index.html at root)
app.use(express.static(path.join(__dirname, 'public'), { index: false }));

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api', apiRouter);

// Root Route: Graphical Dashboard or JSON API info
app.get('/', (req, res) => {
  // If explicitly requested as JSON or via non-browser API client
  if (
    req.query.format === 'json' ||
    (req.headers.accept && req.headers.accept.includes('application/json') && !req.headers.accept.includes('text/html'))
  ) {
    return res.json({
      message: 'Nifty 50 Financial News Sentiment Analyzer & Indian Stock Heatmap API',
      status: 'ONLINE',
      endpoints: {
        health: '/api/health',
        stocks: '/api/stocks',
        singleStock: '/api/stocks/:symbol',
        news: '/api/news',
        scrape: 'POST /api/news/scrape',
        nlpAnalyze: 'POST /api/nlp/analyze',
        nlpApply: 'POST /api/nlp/apply',
        marketSummary: '/api/market-summary'
      }
    });
  }

  // Deliver the graphical dashboard UI to browser
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server & Connect to DB
async function startServer() {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`
===============================================================
🚀 NIFTY 50 FINANCIAL SENTIMENT ENGINE & STOCK HEATMAP SERVER
📡 Server running on: http://localhost:${PORT}
🌐 API Health Check:  http://localhost:${PORT}/api/health
📈 Stocks Endpoint:   http://localhost:${PORT}/api/stocks
📰 News Timeline:     http://localhost:${PORT}/api/news
🧠 NLP Engine:        POST http://localhost:${PORT}/api/nlp/analyze
===============================================================
    `);
  });
}

startServer();
