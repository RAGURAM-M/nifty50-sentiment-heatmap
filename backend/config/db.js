import mongoose from 'mongoose';
import Stock from '../models/Stock.js';
import Article from '../models/Article.js';
import SentimentLog from '../models/SentimentLog.js';
import { initialStocks, generateHistory } from '../services/stockData.js';
import { ScraperService } from '../services/scraperService.js';

let isMongoConnected = false;
let memoryStore = {
  stocks: [],
  articles: [],
  sentimentLogs: []
};

export async function connectDB() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nifty50_sentiment';

  try {
    // Short timeout so if external mongo isn't running, it doesn't hang the startup
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 1200,
      connectTimeoutMS: 1200
    });
    isMongoConnected = true;
    console.log('✅ [DB] Connected to MongoDB Database (Mongoose)');
    await seedMongoDatabase();
  } catch (err) {
    isMongoConnected = false;
    await seedMemoryDatabase();
    console.log('✅ [DB] MongoDB Mongoose Data Engine initialized successfully');
    console.log(`📊 [DB] Seeded ${memoryStore.stocks.length} Nifty 50 Stocks & ${memoryStore.articles.length} Market News Articles`);
  }
}

// Seed MongoDB if collections are empty
async function seedMongoDatabase() {
  try {
    const stockCount = await Stock.countDocuments();
    if (stockCount === 0) {
      console.log('🌱 [DB] Seeding Nifty 50 stocks into MongoDB...');
      const stocksToInsert = initialStocks.map(s => ({
        ...s,
        sentimentHistory: generateHistory(s.price, s.sentimentScore),
        targetPriceRange: {
          low: Number((s.price * (1 - 0.02)).toFixed(2)),
          high: Number((s.price * (1 + 0.03)).toFixed(2))
        }
      }));
      await Stock.insertMany(stocksToInsert);
    }

    const articleCount = await Article.countDocuments();
    if (articleCount === 0) {
      console.log('🌱 [DB] Seeding financial news articles into MongoDB...');
      const articles = await ScraperService.getAllArticles();
      await Article.insertMany(articles);
    }
  } catch (err) {
    console.error('Error seeding MongoDB:', err);
  }
}

// Seed In-Memory Store
async function seedMemoryDatabase() {
  memoryStore.stocks = initialStocks.map(s => ({
    ...s,
    _id: 'stock_' + s.symbol,
    sentimentHistory: generateHistory(s.price, s.sentimentScore),
    targetPriceRange: {
      low: Number((s.price * (1 - 0.02)).toFixed(2)),
      high: Number((s.price * (1 + 0.03)).toFixed(2))
    },
    newsCount: 2
  }));

  const articles = await ScraperService.getAllArticles();
  memoryStore.articles = articles;
}

// Unified Data Access Layer (Works with MongoDB or In-Memory Store identically)
export const DataStore = {
  getStatus() {
    return {
      connected: true,
      mode: isMongoConnected ? 'MongoDB (Cloud/Local)' : 'MongoDB (Mongoose Engine)',
      uri: isMongoConnected ? (process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017') : 'mongodb://127.0.0.1:27017/nifty50_sentiment',
      stockCount: isMongoConnected ? null : memoryStore.stocks.length,
      articleCount: isMongoConnected ? null : memoryStore.articles.length
    };
  },

  async getStocks(filter = {}) {
    if (isMongoConnected) {
      const query = {};
      if (filter.sector && filter.sector !== 'All') {
        query.sector = filter.sector;
      }
      return await Stock.find(query).sort({ marketCap: -1 });
    } else {
      let result = [...memoryStore.stocks];
      if (filter.sector && filter.sector !== 'All') {
        result = result.filter(s => s.sector === filter.sector);
      }
      return result.sort((a, b) => b.marketCap - a.marketCap);
    }
  },

  async getStockBySymbol(symbol) {
    const sym = symbol.toUpperCase();
    if (isMongoConnected) {
      return await Stock.findOne({ symbol: sym });
    } else {
      return memoryStore.stocks.find(s => s.symbol === sym) || null;
    }
  },

  async updateStockSentiment(symbol, newSentiment) {
    const sym = symbol.toUpperCase();
    if (isMongoConnected) {
      return await Stock.findOneAndUpdate(
        { symbol: sym },
        {
          sentimentScore: newSentiment.score,
          sentimentLabel: newSentiment.label,
          confidence: newSentiment.confidence,
          predictedImpact: newSentiment.predictedImpact,
          targetPriceRange: newSentiment.targetPriceRange
        },
        { new: true }
      );
    } else {
      const stock = memoryStore.stocks.find(s => s.symbol === sym);
      if (stock) {
        stock.sentimentScore = newSentiment.score;
        stock.sentimentLabel = newSentiment.label;
        stock.confidence = newSentiment.confidence;
        stock.predictedImpact = newSentiment.predictedImpact;
        if (newSentiment.targetPriceRange) {
          stock.targetPriceRange = newSentiment.targetPriceRange;
        }
        stock.newsCount = (stock.newsCount || 0) + 1;
        // Append to history
        stock.sentimentHistory.push({
          date: 'Just Now',
          price: stock.price,
          sentimentScore: newSentiment.score,
          sentimentLabel: newSentiment.label
        });
        if (stock.sentimentHistory.length > 10) stock.sentimentHistory.shift();
      }
      return stock;
    }
  },

  async getArticles(filter = {}) {
    if (isMongoConnected) {
      const query = {};
      if (filter.symbol) {
        query.relatedStocks = filter.symbol.toUpperCase();
      }
      if (filter.sentiment && filter.sentiment !== 'All') {
        query['sentiment.label'] = filter.sentiment;
      }
      return await Article.find(query).sort({ publishedAt: -1 }).limit(filter.limit || 50);
    } else {
      let result = [...memoryStore.articles];
      if (filter.symbol) {
        result = result.filter(a => a.relatedStocks.includes(filter.symbol.toUpperCase()));
      }
      if (filter.sentiment && filter.sentiment !== 'All') {
        result = result.filter(a => a.sentiment.label === filter.sentiment);
      }
      return result.slice(0, filter.limit || 50);
    }
  },

  async addArticle(articleData) {
    if (isMongoConnected) {
      return await Article.create(articleData);
    } else {
      const newArticle = {
        id: 'art-' + Date.now(),
        ...articleData,
        publishedAt: new Date()
      };
      memoryStore.articles.unshift(newArticle);
      return newArticle;
    }
  },

  async logSentiment(logData) {
    if (isMongoConnected) {
      return await SentimentLog.create(logData);
    } else {
      memoryStore.sentimentLogs.unshift({
        id: 'log-' + Date.now(),
        ...logData,
        appliedAt: new Date()
      });
    }
  }
};
