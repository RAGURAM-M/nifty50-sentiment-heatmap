import mongoose from 'mongoose';

const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  snippet: { type: String },
  source: { type: String, default: 'Financial News Feed' },
  url: { type: String },
  publishedAt: { type: Date, default: Date.now },
  timeAgo: { type: String },
  relatedStocks: [{ type: String, index: true }],
  sentiment: {
    score: { type: Number, required: true },
    label: { type: String, enum: ['Bullish', 'Bearish', 'Neutral'], default: 'Neutral' },
    confidence: { type: Number, default: 70 },
    predictedImpact: { type: Number, default: 0 },
    tokens: [
      {
        word: String,
        weight: Number,
        type: { type: String }
      }
    ]
  }
}, { timestamps: true });

export default mongoose.models.Article || mongoose.model('Article', ArticleSchema);
