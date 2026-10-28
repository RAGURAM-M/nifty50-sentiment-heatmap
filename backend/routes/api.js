import express from 'express';
import { DataStore } from '../config/db.js';
import { SentimentEngine } from '../nlp/sentimentEngine.js';
import { ScraperService } from '../services/scraperService.js';

const router = express.Router();

/**
 * @route   GET /api/health
 * @desc    Get system health and Database connectivity status
 */
router.get('/health', (req, res) => {
  const dbStatus = DataStore.getStatus();
  res.json({
    status: 'ONLINE',
    service: 'Financial News Sentiment Analyzer & Indian Stock Heatmap',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

/**
 * @route   GET /api/stocks
 * @desc    Get all Nifty 50 stocks with sentiment, filterable by sector
 */
router.get('/stocks', async (req, res) => {
  try {
    const { sector, sort } = req.query;
    let stocks = await DataStore.getStocks({ sector });

    if (sort === 'sentiment_desc') {
      stocks.sort((a, b) => b.sentimentScore - a.sentimentScore);
    } else if (sort === 'sentiment_asc') {
      stocks.sort((a, b) => a.sentimentScore - b.sentimentScore);
    } else if (sort === 'gainers') {
      stocks.sort((a, b) => b.changePercent - a.changePercent);
    } else if (sort === 'losers') {
      stocks.sort((a, b) => a.changePercent - b.changePercent);
    }

    res.json({ success: true, count: stocks.length, data: stocks });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * @route   GET /api/stocks/:symbol
 * @desc    Get specific stock details, sentiment trend, and target impact
 */
router.get('/stocks/:symbol', async (req, res) => {
  try {
    const stock = await DataStore.getStockBySymbol(req.params.symbol);
    if (!stock) {
      return res.status(404).json({ success: false, error: 'Stock not found' });
    }
    // Also fetch associated articles
    const articles = await DataStore.getArticles({ symbol: stock.symbol, limit: 10 });
    const aggregated = SentimentEngine.aggregateSentiment(articles, stock.price);

    res.json({
      success: true,
      data: {
        ...stock.toObject ? stock.toObject() : stock,
        aggregatedSentiment: aggregated,
        recentArticles: articles
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * @route   GET /api/news
 * @desc    Get news timeline with sentiment scores
 */
router.get('/news', async (req, res) => {
  try {
    const { symbol, sentiment, limit } = req.query;
    const articles = await DataStore.getArticles({
      symbol,
      sentiment,
      limit: limit ? parseInt(limit) : 40
    });
    res.json({ success: true, count: articles.length, data: articles });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * @route   POST /api/news/scrape
 * @desc    Trigger live web scraping & RSS ingestion
 */
router.post('/news/scrape', async (req, res) => {
  try {
    console.log('[API] Triggering live financial news scrape...');
    const freshlyScraped = await ScraperService.getAllArticles();
    
    // Add new articles to data store
    let addedCount = 0;
    for (const art of freshlyScraped) {
      await DataStore.addArticle(art);
      addedCount++;
    }

    res.json({
      success: true,
      message: `Scraping completed successfully. Ingested ${addedCount} articles.`,
      newArticlesCount: addedCount
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * @route   POST /api/nlp/analyze
 * @desc    NLP Playground: Analyze custom headline and compute sentiment + price impact
 */
router.post('/nlp/analyze', async (req, res) => {
  try {
    const { headline, symbol } = req.body;
    if (!headline) {
      return res.status(400).json({ success: false, error: 'Headline text is required' });
    }

    let targetStock = null;
    let stockPrice = 1000;
    if (symbol) {
      targetStock = await DataStore.getStockBySymbol(symbol);
      if (targetStock) stockPrice = targetStock.price;
    }

    const analysis = SentimentEngine.analyze(headline, stockPrice);
    res.json({
      success: true,
      data: {
        headline,
        targetSymbol: symbol || 'GENERAL',
        targetStock: targetStock ? { symbol: targetStock.symbol, name: targetStock.name, price: targetStock.price } : null,
        analysis
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * @route   POST /api/nlp/apply
 * @desc    Commit a custom analyzed headline to live feed & update stock sentiment
 */
router.post('/nlp/apply', async (req, res) => {
  try {
    const { headline, symbol, source = 'Live Analyst Terminal' } = req.body;
    if (!headline || !symbol) {
      return res.status(400).json({ success: false, error: 'Headline and target stock symbol are required' });
    }

    const stock = await DataStore.getStockBySymbol(symbol);
    if (!stock) {
      return res.status(404).json({ success: false, error: `Stock ${symbol} not found` });
    }

    const analysis = SentimentEngine.analyze(headline, stock.price);

    // Save as new article
    const newArticle = await DataStore.addArticle({
      title: headline,
      snippet: `Analyst sentiment injection for ${stock.name}. Calculated impact: ${analysis.predictedImpact > 0 ? '+' : ''}${analysis.predictedImpact}%`,
      source,
      url: '#',
      timeAgo: 'Just now',
      relatedStocks: [stock.symbol],
      sentiment: {
        score: analysis.score,
        label: analysis.label,
        confidence: analysis.confidence,
        predictedImpact: analysis.predictedImpact,
        tokens: analysis.tokens
      }
    });

    // Update target stock sentiment
    const updatedStock = await DataStore.updateStockSentiment(stock.symbol, {
      score: analysis.score,
      label: analysis.label,
      confidence: analysis.confidence,
      predictedImpact: analysis.predictedImpact,
      targetPriceRange: analysis.targetPriceRange
    });

    // Log the sentiment update
    await DataStore.logSentiment({
      symbol: stock.symbol,
      headline,
      sentimentScore: analysis.score,
      sentimentLabel: analysis.label,
      predictedImpact: analysis.predictedImpact,
      source: 'NLP Playground'
    });

    res.json({
      success: true,
      message: `Sentiment applied to ${stock.symbol} successfully!`,
      article: newArticle,
      stock: updatedStock
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * @route   GET /api/market-summary
 * @desc    Get aggregate Nifty 50 market sentiment overview and sector heat
 */
router.get('/market-summary', async (req, res) => {
  try {
    const stocks = await DataStore.getStocks();
    let totalScore = 0;
    let bullish = 0;
    let bearish = 0;
    let neutral = 0;

    const sectorScores = {};

    stocks.forEach(s => {
      totalScore += s.sentimentScore;
      if (s.sentimentScore >= 0.15) bullish++;
      else if (s.sentimentScore <= -0.15) bearish++;
      else neutral++;

      if (!sectorScores[s.sector]) {
        sectorScores[s.sector] = { total: 0, count: 0, bullish: 0, bearish: 0 };
      }
      sectorScores[s.sector].total += s.sentimentScore;
      sectorScores[s.sector].count += 1;
      if (s.sentimentScore >= 0.15) sectorScores[s.sector].bullish++;
      else if (s.sentimentScore <= -0.15) sectorScores[s.sector].bearish++;
    });

    const avgMarketSentiment = Number((totalScore / stocks.length).toFixed(3));
    const marketLabel = avgMarketSentiment >= 0.15 ? 'Bullish' : (avgMarketSentiment <= -0.15 ? 'Bearish' : 'Neutral');

    const sectorBreakdown = Object.entries(sectorScores).map(([sector, data]) => ({
      sector,
      avgScore: Number((data.total / data.count).toFixed(3)),
      stockCount: data.count,
      bullishCount: data.bullish,
      bearishCount: data.bearish,
      sentimentLabel: (data.total / data.count) >= 0.15 ? 'Bullish' : ((data.total / data.count) <= -0.15 ? 'Bearish' : 'Neutral')
    })).sort((a, b) => b.avgScore - a.avgScore);

    const topBullish = [...stocks].sort((a, b) => b.sentimentScore - a.sentimentScore).slice(0, 5);
    const topBearish = [...stocks].sort((a, b) => a.sentimentScore - b.sentimentScore).slice(0, 5);

    res.json({
      success: true,
      data: {
        niftyIndex: {
          level: 24865.35,
          change: 142.10,
          changePercent: 0.58,
          timestamp: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })
        },
        marketSentiment: {
          score: avgMarketSentiment,
          label: marketLabel,
          bullishCount: bullish,
          bearishCount: bearish,
          neutralCount: neutral,
          totalStocks: stocks.length
        },
        sectorBreakdown,
        topBullish,
        topBearish
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
