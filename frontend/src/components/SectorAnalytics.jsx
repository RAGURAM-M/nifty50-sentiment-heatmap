import React from 'react';
import { BarChart3, TrendingUp, TrendingDown, Layers, Sparkles, ArrowRight } from 'lucide-react';

export default function SectorAnalytics({ marketSummary, stocks, onSelectStock }) {
  const sectors = marketSummary?.sectorBreakdown || [];
  const topBullish = marketSummary?.topBullish || [];
  const topBearish = marketSummary?.topBearish || [];
  const sentiment = marketSummary?.marketSentiment || {};

  return (
    <div style={{ padding: '1.5rem 1.75rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Top Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.1rem 1.25rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Market-Wide Sentiment</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.3rem' }}>
            <span
              className="font-mono"
              style={{
                fontSize: '1.6rem',
                fontWeight: 800,
                color: (sentiment.score || 0) >= 0.15 ? 'var(--bullish-light)' : ((sentiment.score || 0) <= -0.15 ? 'var(--bearish-light)' : '#94a3b8')
              }}
            >
              {(sentiment.score || 0) > 0 ? '+' : ''}{sentiment.score}
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                background: (sentiment.score || 0) >= 0.15 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                color: (sentiment.score || 0) >= 0.15 ? 'var(--bullish-light)' : 'var(--bearish-light)'
              }}
            >
              {sentiment.label || 'Neutral'}
            </span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Aggregated across 50 top index equities
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.1rem 1.25rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Bullish vs Bearish Ratio</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <TrendingUp size={18} color="var(--bullish-light)" />
              <span className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--bullish-light)' }}>
                {sentiment.bullishCount || 0}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Bullish</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <TrendingDown size={18} color="var(--bearish-light)" />
              <span className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--bearish-light)' }}>
                {sentiment.bearishCount || 0}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Bearish</span>
            </div>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            {sentiment.neutralCount || 0} stocks in neutral range
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.1rem 1.25rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Leading Sector</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--bullish-light)', marginTop: '0.3rem' }}>
            {sectors[0]?.sector || 'Automobile'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Average sentiment score: +{sectors[0]?.avgScore || '0.62'}
          </div>
        </div>
      </div>

      {/* Main Grid: Sector Rankings & Top Movers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem' }}>
        {/* Sector Sentiment Ranking Bar Chart */}
        <div className="glass-panel" style={{ padding: '1.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Layers size={18} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#f8fafc' }}>
              Sector-Wise Sentiment Ranking
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {sectors.map((sec) => {
              const score = sec.avgScore;
              const isPositive = score >= 0;
              const barWidth = Math.min(100, Math.max(8, Math.abs(score) * 100));

              return (
                <div key={sec.sector}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 600, color: '#e2e8f0' }}>{sec.sector}</span>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>({sec.stockCount} stocks)</span>
                      <span className="font-mono" style={{ fontWeight: 700, color: score >= 0.15 ? 'var(--bullish-light)' : (score <= -0.15 ? 'var(--bearish-light)' : '#94a3b8') }}>
                        {score > 0 ? '+' : ''}{score}
                      </span>
                    </div>
                  </div>

                  {/* Horizontal Bar */}
                  <div style={{ height: '7px', background: '#1e293b', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${barWidth}%`,
                        height: '100%',
                        background: score >= 0.15 ? 'linear-gradient(to right, #059669, #10b981)' : (score <= -0.15 ? 'linear-gradient(to right, #dc2626, #ef4444)' : '#64748b'),
                        borderRadius: '4px',
                        transition: 'width 0.4s ease'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Bullish & Top Bearish Stocks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Top Bullish */}
          <div className="glass-panel" style={{ padding: '1.2rem 1.4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
              <TrendingUp size={16} color="var(--bullish-light)" />
              <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--bullish-light)' }}>
                Top 5 Bullish Catalysts of the Day
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {topBullish.map((stk) => (
                <div
                  key={stk.symbol}
                  onClick={() => onSelectStock(stk)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '8px',
                    background: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(16, 185, 129, 0.16)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(16, 185, 129, 0.08)')}
                >
                  <div>
                    <span className="font-mono" style={{ fontWeight: 800, color: '#f8fafc', marginRight: '0.5rem' }}>
                      {stk.symbol}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{stk.name}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="font-mono" style={{ fontWeight: 700, color: 'var(--bullish-light)', fontSize: '0.85rem' }}>
                      +{stk.sentimentScore}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      ₹{stk.price} ({stk.changePercent >= 0 ? '+' : ''}{stk.changePercent}%)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Bearish */}
          <div className="glass-panel" style={{ padding: '1.2rem 1.4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
              <TrendingDown size={16} color="var(--bearish-light)" />
              <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--bearish-light)' }}>
                Top 5 Bearish Catalysts of the Day
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {topBearish.map((stk) => (
                <div
                  key={stk.symbol}
                  onClick={() => onSelectStock(stk)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '8px',
                    background: 'rgba(239, 68, 68, 0.08)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.16)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)')}
                >
                  <div>
                    <span className="font-mono" style={{ fontWeight: 800, color: '#f8fafc', marginRight: '0.5rem' }}>
                      {stk.symbol}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{stk.name}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="font-mono" style={{ fontWeight: 700, color: 'var(--bearish-light)', fontSize: '0.85rem' }}>
                      {stk.sentimentScore}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      ₹{stk.price} ({stk.changePercent >= 0 ? '+' : ''}{stk.changePercent}%)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
