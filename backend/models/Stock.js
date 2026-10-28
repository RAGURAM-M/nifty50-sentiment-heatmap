import mongoose from 'mongoose';

const StockSchema = new mongoose.Schema({
  symbol: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  sector: { type: String, required: true, index: true },
  price: { type: Number, required: true },
  change: { type: Number, default: 0 },
  changePercent: { type: Number, default: 0 },
  marketCap: { type: Number, required: true },
  sentimentScore: { type: Number, default: 0 },
  sentimentLabel: { type: String, enum: ['Bullish', 'Bearish', 'Neutral'], default: 'Neutral' },
  confidence: { type: Number, default: 75 },
  predictedImpact: { type: Number, default: 0 },
  targetPriceRange: {
    low: { type: Number },
    high: { type: Number }
  },
  newsCount: { type: Number, default: 0 },
  sentimentHistory: [
    {
      date: String,
      price: Number,
      sentimentScore: Number,
      sentimentLabel: String
    }
  ]
}, { timestamps: true });

export default mongoose.models.Stock || mongoose.model('Stock', StockSchema);
