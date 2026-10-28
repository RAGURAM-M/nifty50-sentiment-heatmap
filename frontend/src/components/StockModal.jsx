import React, { useState } from 'react';
import { X, TrendingUp, TrendingDown, Target, ShieldCheck, Sparkles, Newspaper, ExternalLink, ArrowRight } from 'lucide-react';

export default function StockModal({ stock, onClose, onTestHeadline }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  if (!stock) return null;

  const isGainer = stock.changePercent >= 0;
  const isBullish = stock.sentimentScore >= 0.15;
  const isBearish = stock.sentimentScore <= -0.15;

  const history = stock.sentimentHistory || [];

  // SVG Chart geometry calculation
  const chartWidth = 680;
  const chartHeight = 180;
  const padding = 25;

  let minPrice = Infinity;
  let maxPrice = -Infinity;
  history.forEach(h => {
    if (h.price < minPrice) minPrice = h.price;
    if (h.price > maxPrice) maxPrice = h.price;
  });

  const priceRange = (maxPrice - minPrice) || 1;

  // Build SVG path points for stock price line
  const points = history.map((item, index) => {
    const x = padding + (index / (history.length - 1 || 1)) * (chartWidth - padding * 2);
    const y = chartHeight - padding - ((item.price - minPrice) / priceRange) * (chartHeight - padding * 2);
    return { x, y, ...item };
  });

  const pathD = points.length > 0 
    ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')
    : '';

  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z`
    : '';

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(15, 23, 42, 0.9)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '8px',
                background: isBullish ? 'rgba(16, 185, 129, 0.18)' : (isBearish ? 'rgba(239, 68, 68, 0.18)' : 'rgba(100, 116, 139, 0.18)'),
                border: `1px solid ${isBullish ? 'var(--bullish-border)' : (isBearish ? 'var(--bearish-border)' : 'var(--neutral-border)')}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <span className="font-mono" style={{ fontWeight: 800, fontSize: '0.85rem', color: isBullish ? 'var(--bullish-light)' : (isBearish ? 'var(--bearish-light)' : '#94a3b8') }}>
                {stock.symbol.substring(0, 3)}
              </span>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2 className="font-mono" style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc' }}>
                  {stock.symbol}
                </h2>
                <span
                  style={{
                    fontSize: '0.72rem',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '4px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: 'var(--text-secondary)'
                  }}
                >
                  {stock.sector}
                </span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {stock.name}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div className="font-mono" style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>
                ₹{Number(stock.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
              <div
                className="font-mono"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '0.2rem',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: isGainer ? 'var(--bullish-light)' : 'var(--bearish-light)'
                }}
              >
                {isGainer ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                <span>{isGainer ? '+' : ''}{stock.changePercent}% (₹{stock.change})</span>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: 'none',
                borderRadius: '8px',
                padding: '0.5rem',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem' }}>
          {/* Key Metrics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.85rem', marginBottom: '1.5rem' }}>
            {/* Sentiment Score */}
            <div className="glass-panel" style={{ padding: '0.9rem 1rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                NLP Sentiment Score
              </div>
              <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: isBullish ? 'var(--bullish-light)' : (isBearish ? 'var(--bearish-light)' : '#cbd5e1') }}>
                {stock.sentimentScore > 0 ? '+' : ''}{stock.sentimentScore}
              </div>
              <div style={{ fontSize: '0.72rem', color: isBullish ? 'var(--bullish-light)' : (isBearish ? 'var(--bearish-light)' : '#94a3b8'), fontWeight: 600 }}>
                {stock.sentimentLabel} Sentiment
              </div>
            </div>

            {/* Confidence */}
            <div className="glass-panel" style={{ padding: '0.9rem 1rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                NLP Confidence
              </div>
              <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                {stock.confidence || 85}%
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                <ShieldCheck size={12} color="var(--accent-cyan)" />
                <span>High reliability</span>
              </div>
            </div>

            {/* Predicted Price Impact */}
            <div className="glass-panel" style={{ padding: '0.9rem 1rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                Predicted Impact
              </div>
              <div
                className="font-mono"
                style={{
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  color: (stock.predictedImpact || 0) >= 0 ? 'var(--bullish-light)' : 'var(--bearish-light)'
                }}
              >
                {(stock.predictedImpact || 0) > 0 ? '+' : ''}{stock.predictedImpact}%
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Short-term drift estimate
              </div>
            </div>

            {/* Target Price Range */}
            <div className="glass-panel" style={{ padding: '0.9rem 1rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                Projected Price Band
              </div>
              <div className="font-mono" style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginTop: '0.35rem' }}>
                ₹{stock.targetPriceRange?.low || stock.price} - ₹{stock.targetPriceRange?.high || (stock.price * 1.02).toFixed(2)}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--accent-indigo)' }}>
                Based on sentiment delta
              </div>
            </div>
          </div>

          {/* Interactive 7-Day Price vs Sentiment Correlation Chart */}
          <div className="glass-panel" style={{ padding: '1.2rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <div>
                <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f1f5f9' }}>
                  7-Day Price vs. News Sentiment Correlation Overlay
                </h3>
                <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  Interactive price trajectory (cyan line) vs. recorded sentiment polarity (points)
                </p>
              </div>

              {hoveredPoint && (
                <div
                  className="font-mono"
                  style={{
                    background: 'rgba(15, 23, 42, 0.9)',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.75rem'
                  }}
                >
                  <span style={{ color: 'var(--text-muted)' }}>{hoveredPoint.date}: </span>
                  <strong style={{ color: '#ffffff' }}>₹{hoveredPoint.price}</strong> |{' '}
                  <span style={{ color: hoveredPoint.sentimentScore >= 0.15 ? 'var(--bullish-light)' : (hoveredPoint.sentimentScore <= -0.15 ? 'var(--bearish-light)' : '#94a3b8') }}>
                    Sentiment: {hoveredPoint.sentimentScore > 0 ? '+' : ''}{hoveredPoint.sentimentScore} ({hoveredPoint.sentimentLabel})
                  </span>
                </div>
              )}
            </div>

            {/* SVG Interactive Canvas */}
            <div style={{ width: '100%', overflowX: 'auto' }}>
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
              >
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal reference lines */}
                <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="rgba(255,255,255,0.06)" strokeDasharray="4" />
                <line x1={padding} y1={chartHeight / 2} x2={chartWidth - padding} y2={chartHeight / 2} stroke="rgba(255,255,255,0.06)" strokeDasharray="4" />
                <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="rgba(255,255,255,0.06)" strokeDasharray="4" />

                {/* Area under curve */}
                {areaD && <path d={areaD} fill="url(#priceGradient)" />}

                {/* Line path */}
                {pathD && (
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Data points */}
                {points.map((p, i) => {
                  const pointColor = p.sentimentScore >= 0.15 ? '#10b981' : (p.sentimentScore <= -0.15 ? '#ef4444' : '#94a3b8');
                  const isHovered = hoveredPoint?.date === p.date;

                  return (
                    <g key={i} onMouseEnter={() => setHoveredPoint(p)} onMouseLeave={() => setHoveredPoint(null)} style={{ cursor: 'pointer' }}>
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={isHovered ? 7 : 4.5}
                        fill={pointColor}
                        stroke="#0f172a"
                        strokeWidth="2"
                        style={{ transition: 'r 0.15s ease' }}
                      />
                      <text
                        x={p.x}
                        y={chartHeight - 6}
                        textAnchor="middle"
                        fill="rgba(255,255,255,0.4)"
                        fontSize="10"
                        fontFamily="var(--font-mono)"
                      >
                        {p.date}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Action Row: Test in NLP Engine */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.1), rgba(99, 102, 241, 0.1))',
              border: '1px solid rgba(56, 189, 248, 0.25)'
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#f8fafc' }}>
                Test Custom Headline Catalyst on {stock.symbol}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Simulate earnings release, regulatory notices, or order wins in the NLP Engine
              </div>
            </div>

            <button
              className="btn-primary"
              onClick={() => {
                onClose();
                onTestHeadline(stock);
              }}
            >
              <span>Launch NLP Simulator</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
