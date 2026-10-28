import React, { useState, useMemo } from 'react';
import { Newspaper, Search, Filter, ExternalLink, Sparkles, TrendingUp, TrendingDown, Clock } from 'lucide-react';

export default function NewsTimeline({ articles, stocks, onSelectStock }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSentiment, setSelectedSentiment] = useState('All');
  const [selectedStock, setSelectedStock] = useState('All Stocks');

  const filteredArticles = useMemo(() => {
    return articles.filter(art => {
      // Sentiment filter
      if (selectedSentiment !== 'All' && art.sentiment?.label !== selectedSentiment) {
        return false;
      }
      // Stock filter
      if (selectedStock !== 'All Stocks') {
        if (!art.relatedStocks || !art.relatedStocks.includes(selectedStock)) {
          return false;
        }
      }
      // Text search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = art.title?.toLowerCase().includes(query);
        const matchSnippet = art.snippet?.toLowerCase().includes(query);
        const matchSource = art.source?.toLowerCase().includes(query);
        if (!matchTitle && !matchSnippet && !matchSource) return false;
      }
      return true;
    });
  }, [articles, selectedSentiment, selectedStock, searchQuery]);

  return (
    <div style={{ padding: '1.5rem 1.75rem', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Controls Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '1.1rem 1.4rem',
          marginBottom: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}
      >
        {/* Search Input */}
        <div style={{ position: 'relative', minWidth: '260px', flex: '1 1 280px' }}>
          <Search
            size={16}
            color="var(--text-muted)"
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            placeholder="Search news by headline, keywords or publisher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem 0.9rem 0.6rem 2.25rem',
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          />
        </div>

        {/* Sentiment Filter Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {['All', 'Bullish', 'Bearish', 'Neutral'].map((sent) => (
            <button
              key={sent}
              onClick={() => setSelectedSentiment(sent)}
              style={{
                padding: '0.4rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                border: '1px solid',
                background: selectedSentiment === sent ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                borderColor: selectedSentiment === sent ? 'var(--accent-cyan)' : 'var(--border-color)',
                color: selectedSentiment === sent ? 'var(--accent-cyan)' : 'var(--text-secondary)'
              }}
            >
              {sent}
            </button>
          ))}
        </div>

        {/* Stock Filter Dropdown */}
        <select
          value={selectedStock}
          onChange={(e) => setSelectedStock(e.target.value)}
          style={{
            padding: '0.5rem 0.8rem',
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            color: 'var(--text-primary)',
            fontSize: '0.82rem',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          <option value="All Stocks">All Nifty 50 Stocks</option>
          {stocks.map(s => (
            <option key={s.symbol} value={s.symbol}>
              {s.symbol} ({s.name})
            </option>
          ))}
        </select>
      </div>

      {/* Article Count Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', padding: '0 0.25rem' }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Showing <strong>{filteredArticles.length}</strong> financial news articles with NLP sentiment mapping
        </div>
      </div>

      {/* Articles Stream */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredArticles.map((art) => {
          const sent = art.sentiment || {};
          const isBullish = sent.label === 'Bullish';
          const isBearish = sent.label === 'Bearish';

          return (
            <div
              key={art.id || art._id}
              className="glass-panel-interactive"
              style={{
                padding: '1.25rem 1.4rem',
                borderLeft: `4px solid ${isBullish ? 'var(--bullish-vibrant)' : (isBearish ? 'var(--bearish-vibrant)' : 'var(--neutral-color)')}`
              }}
            >
              {/* Header meta */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: 'var(--accent-cyan)',
                      background: 'rgba(56, 189, 248, 0.1)',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '4px'
                    }}
                  >
                    {art.source || 'Financial News'}
                  </span>

                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    <Clock size={12} />
                    <span>{art.timeAgo || 'Recent'}</span>
                  </span>
                </div>

                {/* Sentiment Badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span
                    className={isBullish ? 'badge-bullish' : (isBearish ? 'badge-bearish' : 'badge-neutral')}
                  >
                    {isBullish ? <TrendingUp size={12} /> : (isBearish ? <TrendingDown size={12} /> : null)}
                    <span>{sent.label || 'Neutral'} ({sent.score > 0 ? '+' : ''}{sent.score})</span>
                  </span>

                  {sent.predictedImpact !== undefined && (
                    <span
                      style={{
                        fontSize: '0.72rem',
                        padding: '0.15rem 0.45rem',
                        borderRadius: '4px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      Impact: {sent.predictedImpact > 0 ? '+' : ''}{sent.predictedImpact}%
                    </span>
                  )}
                </div>
              </div>

              {/* Title */}
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem', lineHeight: 1.4 }}>
                {art.title}
              </h3>

              {/* Snippet */}
              {art.snippet && (
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.85rem', lineHeight: 1.5 }}>
                  {art.snippet}
                </p>
              )}

              {/* Footer: Related stocks and triggers */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '0.65rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Affected Stocks:</span>
                  {art.relatedStocks?.map((sym) => {
                    const match = stocks.find(s => s.symbol === sym);
                    return (
                      <button
                        key={sym}
                        onClick={() => match && onSelectStock(match)}
                        className="font-mono"
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '0.15rem 0.45rem',
                          borderRadius: '4px',
                          background: 'rgba(99, 102, 241, 0.15)',
                          border: '1px solid rgba(99, 102, 241, 0.3)',
                          color: '#a5b4fc',
                          cursor: 'pointer'
                        }}
                      >
                        {sym}
                      </button>
                    );
                  })}
                </div>

                {art.url && art.url !== '#' && (
                  <a
                    href={art.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontSize: '0.75rem',
                      color: 'var(--accent-cyan)',
                      textDecoration: 'none'
                    }}
                  >
                    <span>Read Source</span>
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
