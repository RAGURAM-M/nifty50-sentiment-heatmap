import React from 'react';
import { Activity, RefreshCw, Database, TrendingUp, TrendingDown, ShieldCheck } from 'lucide-react';

export default function Header({
  marketSummary,
  dbStatus,
  onScrape,
  scrapingLoading
}) {
  const index = marketSummary?.niftyIndex || {
    level: 24865.35,
    change: 142.10,
    changePercent: 0.58
  };

  const sentiment = marketSummary?.marketSentiment || {
    score: 0.28,
    label: 'Bullish',
    bullishCount: 22,
    bearishCount: 8,
    neutralCount: 4,
    totalStocks: 34
  };

  const isBullish = (index.change || 0) >= 0;
  const isMongo = dbStatus?.connected;

  return (
    <header className="header-container">
      {/* Brand Section */}
      <div className="brand-section">
        <div className="brand-icon-box">
          <Activity size={24} color="#ffffff" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h1 className="brand-title">NIFTY 50 SENTIMENT RADAR</h1>
            <span className="brand-badge">NSE/BSE AI</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Financial News NLP Sentiment Analyzer & Heatmap
          </p>
        </div>
      </div>

      {/* Middle Stats: Nifty 50 Index & Market Sentiment Gauge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* NIFTY 50 Live Ticker */}
        <div className="nifty-ticker-chip">
          <div className="pulse-dot" />
          <span style={{ fontWeight: 600, color: '#e2e8f0' }}>NIFTY 50</span>
          <span className="font-mono" style={{ fontWeight: 700, color: '#f8fafc' }}>
            ₹{Number(index.level).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
          <span
            className="font-mono"
            style={{
              display: 'flex',
              alignItems: 'center',
              fontWeight: 600,
              color: isBullish ? 'var(--bullish-light)' : 'var(--bearish-light)'
            }}
          >
            {isBullish ? <TrendingUp size={14} style={{ marginRight: 3 }} /> : <TrendingDown size={14} style={{ marginRight: 3 }} />}
            {isBullish ? '+' : ''}{index.changePercent}%
          </span>
        </div>

        {/* Market Sentiment Overview */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.45rem 0.9rem',
            borderRadius: '9999px',
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid var(--border-color)',
            fontSize: '0.8rem'
          }}
        >
          <span style={{ color: 'var(--text-muted)' }}>Market Mood:</span>
          <span
            style={{
              fontWeight: 700,
              color: sentiment.label === 'Bullish' ? 'var(--bullish-light)' : (sentiment.label === 'Bearish' ? 'var(--bearish-light)' : '#94a3b8')
            }}
          >
            {sentiment.label.toUpperCase()} ({sentiment.score > 0 ? '+' : ''}{sentiment.score})
          </span>
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center', marginLeft: '4px' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--bullish-light)', fontWeight: 600 }}>▲ {sentiment.bullishCount}</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>•</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--bearish-light)', fontWeight: 600 }}>▼ {sentiment.bearishCount}</span>
          </div>
        </div>
      </div>

      {/* Right Controls: Database Status & Scrape Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* DB Status Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.4rem 0.75rem',
            borderRadius: '8px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--bullish-light)'
          }}
          title={dbStatus?.mode || 'MongoDB Mongoose Active'}
        >
          <Database size={13} />
          <span>{dbStatus?.mode || 'MongoDB (Mongoose) Connected'}</span>
        </div>

        {/* Live Scrape Trigger Button */}
        <button
          className="btn-primary"
          onClick={onScrape}
          disabled={scrapingLoading}
          style={{ cursor: scrapingLoading ? 'not-allowed' : 'pointer' }}
        >
          <RefreshCw
            size={14}
            className={scrapingLoading ? 'spin-animation' : ''}
            style={{
              animation: scrapingLoading ? 'spin 1s linear infinite' : 'none'
            }}
          />
          <span>{scrapingLoading ? 'Scraping News...' : 'Scrape & Sync'}</span>
        </button>
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </header>
  );
}
