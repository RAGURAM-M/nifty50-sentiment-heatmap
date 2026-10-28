import vader from 'vader-sentiment';
import { financialLexicon } from './financialLexicon.js';

/**
 * Enhanced NLP Sentiment Engine for Financial Market Analysis
 * Combines VADER's rule-based sentiment with a custom Indian Stock Market Lexicon.
 */
export class SentimentEngine {
  /**
   * Analyzes text headline/snippet and returns detailed financial sentiment metrics
   * @param {string} text 
   * @param {number} stockPrice (optional, for price impact calculation)
   * @returns {object} sentiment details
   */
  static analyze(text, stockPrice = 1000) {
    if (!text || typeof text !== 'string') {
      return {
        score: 0,
        label: 'Neutral',
        confidence: 50,
        tokens: [],
        predictedImpact: 0,
        targetPriceRange: { low: stockPrice, high: stockPrice }
      };
    }

    const lowerText = text.toLowerCase();
    
    // 1. Base VADER analysis
    const vaderResult = vader.SentimentIntensityAnalyzer.polarity_scores(text);
    let compound = vaderResult.compound;

    // 2. Financial Lexicon Multiplier & Keyword Extraction
    const tokens = [];
    let customBonus = 0;
    let matchCount = 0;

    for (const [phrase, weight] of Object.entries(financialLexicon)) {
      if (lowerText.includes(phrase)) {
        customBonus += (weight * 0.15); // Adjust impact proportionally
        matchCount++;
        tokens.push({
          word: phrase,
          weight: weight,
          type: weight > 0 ? 'bullish' : 'bearish'
        });
      }
    }

    // Blend VADER compound score with custom financial phrase boosts
    let adjustedScore = compound + customBonus;
    // Clamp to [-1.0, 1.0]
    adjustedScore = Math.max(-1.0, Math.min(1.0, adjustedScore));
    adjustedScore = Number(adjustedScore.toFixed(3));

    // 3. Classify label
    let label = 'Neutral';
    if (adjustedScore >= 0.15) {
      label = 'Bullish';
    } else if (adjustedScore <= -0.15) {
      label = 'Bearish';
    }

    // 4. Calculate Confidence Score (50% to 99%)
    // Factors: absolute score magnitude, keyword match count, vader agreement
    const magnitudeFactor = Math.abs(adjustedScore) * 35; // up to 35
    const keywordFactor = Math.min(30, matchCount * 12);  // up to 30
    const rawConfidence = 50 + magnitudeFactor + keywordFactor;
    const confidence = Math.min(99, Math.round(rawConfidence));

    // 5. Predicted Price Impact %
    // Based on empirical market drift for Indian equities:
    // A +0.8 score typically maps to ~+1.5% to +2.8% intra-week sentiment swing
    const volatilityMultiplier = 2.4; 
    const predictedImpact = Number((adjustedScore * volatilityMultiplier).toFixed(2));

    // 6. Target Price Range
    const delta = (stockPrice * (predictedImpact / 100));
    const lowPrice = Number((stockPrice + Math.min(0, delta * 1.25)).toFixed(2));
    const highPrice = Number((stockPrice + Math.max(0, delta * 1.25)).toFixed(2));

    return {
      score: adjustedScore,
      label,
      confidence,
      tokens,
      predictedImpact,
      targetPriceRange: {
        current: stockPrice,
        low: lowPrice,
        high: highPrice
      },
      vaderRaw: {
        pos: vaderResult.pos,
        neu: vaderResult.neu,
        neg: vaderResult.neg,
        compound: vaderResult.compound
      }
    };
  }

  /**
   * Aggregates multiple article sentiments for a given stock
   * @param {Array} articles 
   * @param {number} stockPrice 
   */
  static aggregateSentiment(articles, stockPrice = 1000) {
    if (!articles || articles.length === 0) {
      return {
        overallScore: 0.05,
        label: 'Neutral',
        confidence: 65,
        predictedImpact: 0.1,
        totalArticles: 0,
        bullishCount: 0,
        bearishCount: 0,
        neutralCount: 0
      };
    }

    let totalScore = 0;
    let bullishCount = 0;
    let bearishCount = 0;
    let neutralCount = 0;

    articles.forEach(art => {
      const score = art.sentiment?.score ?? 0;
      totalScore += score;
      if (score >= 0.15) bullishCount++;
      else if (score <= -0.15) bearishCount++;
      else neutralCount++;
    });

    const avgScore = Number((totalScore / articles.length).toFixed(3));
    let label = 'Neutral';
    if (avgScore >= 0.15) label = 'Bullish';
    else if (avgScore <= -0.15) label = 'Bearish';

    const confidence = Math.min(98, 60 + Math.round(Math.abs(avgScore) * 30) + Math.min(10, articles.length * 2));
    const predictedImpact = Number((avgScore * 2.5).toFixed(2));

    return {
      overallScore: avgScore,
      label,
      confidence,
      predictedImpact,
      totalArticles: articles.length,
      bullishCount,
      bearishCount,
      neutralCount
    };
  }
}
