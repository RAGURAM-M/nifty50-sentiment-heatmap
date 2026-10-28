import mongoose from 'mongoose';

const SentimentLogSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  headline: { type: String, required: true },
  sentimentScore: { type: Number, required: true },
  sentimentLabel: { type: String, required: true },
  predictedImpact: { type: Number },
  appliedAt: { type: Date, default: Date.now },
  source: { type: String, default: 'Scraper' }
}, { timestamps: true });

export default mongoose.models.SentimentLog || mongoose.model('SentimentLog', SentimentLogSchema);
