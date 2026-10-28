import React, { useState, useMemo } from 'react';
import { Search, Filter, TrendingUp, TrendingDown, Newspaper, ArrowUpRight, ArrowDownRight, Sparkles } from 'lucide-react';

const SECTORS = [
  'All Sectors',
  'Banking & Financials',
  'IT & Software',
  'Energy & Petrochemicals',
  'Automobile',
  'FMCG',
  'Metals & Mining',
  'Pharma & Healthcare',
  'Infrastructure',
  'Telecom'
];

export default function HeatmapView({ stocks, onSelectStock }) {
  const [selectedSector, setSelectedSector] = useState('All Sectors');
  const [sentimentFilter, setSentimentFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('marketCap');

  // Filter & Sort logic
  const filteredStocks = useMemo(() => {
    return stocks.filter(stock => {
      // Sector filter
      if (selectedSector !== 'All Sectors' && stock.sector !== selectedSector) {
        return false;
      }
      // Sentiment filter
      if (sentimentFilter !== 'All' && stock.sentimentLabel !== sentimentFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchSymbol = stock.symbol.toLowerCase().includes(query);
        const matchName = stock.name.toLowerCase().includes(query);
        const matchSector = stock.sector.toLowerCase().includes(query);
        if (!matchSymbol && !matchName && !matchSector) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'marketCap') return b.marketCap - a.marketCap;
      if (sortBy === 'bullish') return b.sentimentScore - a.sentimentScore;
      if (sortBy === 'bearish') return a.sentimentScore - b.sentimentScore;
      if (sortBy === 'gainers') return b.changePercent - a.changePercent;
      if (sortBy === 'losers') return a.changePercent - b.changePercent;
      return 0;
    });
  }, [stocks, selectedSector, sentimentFilter, searchQuery, sortBy]);

  /**
   * Calculates background color and border style based on sentiment score [-1.0 to 1.0]
   */
  const getSentimentStyle = (score) => {
    if (score >= 0.15) {
      // Bullish Green
      const intensity = Math.min(1, Math.max(0.15, score));
      const bgOpacity = 0.12 + (intensity * 0.28);
      const borderOpacity = 0.25 + (intensity * 0.45);
      return {
        background: `linear-gradient(145deg, rgba(16, 185, 129, ${bgOpacity}), rgba(6, 78, 59, 0.45))`,
        borderColor: `rgba(52, 211, 153, ${borderOpacity})`,
        glowColor: 'rgba(16, 185, 129, 0.35)'
      };
    } else if (score <= -0.15) {
      // Bearish Red
      const intensity = Math.min(1, Math.max(0.15, Math.abs(score)));
      const bgOpacity = 0.12 + (intensity * 0.28);
      const borderOpacity = 0.25 + (intensity * 0.45);
      return {
        background: `linear-gradient(145deg, rgba(239, 68, 68, ${bgOpacity}), rgba(127, 29, 29, 0.45))`,
        borderColor: `rgba(248, 113, 113, ${borderOpacity})`,
        glowColor: 'rgba(239, 68, 68, 0.35)'
      };
    } else {
      // Neutral Gray/Slate
      return {
        background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.65), rgba(15, 23, 42, 0.75))',
        borderColor: 'rgba(100, 116, 139, 0.35)',
        glowColor: 'rgba(100, 116, 139, 0.2)'
      };
    }
  };

  return (
    <div style={{ padding: '1.5rem 1.75rem' }}>
      {/* Controls Bar: Search, Filters & Sorters */}
      <div
        className="glass-panel"
        style={{
          padding: '1.1rem 1.4rem',
          marginBottom: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        {/* Top row: Search, Sentiment Pills, and Sort */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          {/* Search Input */}
          <div style={{ position: 'relative', minWidth: '280px', flex: '1 1 300px' }}>
            <Search
              size={16}
              color="var(--text-muted)"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Search ticker, company name (e.g. TCS, Tata Motors, Reliance)..."
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
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--accent-cyan)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border-color)')}
            />
          </div>

          {/* Sentiment Filter Segment */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginRight: '0.2rem' }}>Filter Mood:</span>
            {['All', 'Bullish', 'Bearish', 'Neutral'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSentimentFilter(filter)}
                style={{
                  padding: '0.4rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: '1px solid',
                  background: sentimentFilter === filter ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                  borderColor: sentimentFilter === filter ? 'var(--accent-cyan)' : 'var(--border-color)',
                  color: sentimentFilter === filter ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  transition: 'all 0.2s'
                }}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
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
              <option value="marketCap">Market Cap (Treemap Weight)</option>
              <option value="bullish">Highest Bullish Sentiment</option>
              <option value="bearish">Highest Bearish Sentiment</option>
              <option value="gainers">Top 24h Price Gainers</option>
              <option value="losers">Top 24h Price Losers</option>
            </select>
          </div>
        </div>

        {/* Bottom row: Sector Filter Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
          {SECTORS.map((sector) => (
            <button
              key={sector}
              onClick={() => setSelectedSector(sector)}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: selectedSector === sector ? 600 : 400,
                cursor: 'pointer',
                border: '1px solid',
                background: selectedSector === sector ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                borderColor: selectedSector === sector ? 'var(--accent-indigo)' : 'var(--border-color)',
                color: selectedSector === sector ? '#ffffff' : 'var(--text-secondary)',
                transition: 'all 0.2s'
              }}
            >
              {sector}
            </button>
          ))}
        </div>
      </div>

      {/* Sentiment Intensity Legend */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
          padding: '0 0.25rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span>Displaying <strong>{filteredStocks.length}</strong> stocks</span>
          <span>•</span>
          <span>Click any tile to open <strong>Price vs Sentiment correlation chart</strong></span>
        </div>

        {/* Heatmap Legend Gradient */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem' }}>
          <span style={{ color: 'var(--bearish-light)', fontWeight: 600 }}>-1.0 Bearish</span>
          <div
            style={{
              width: '140px',
              height: '8px',
              borderRadius: '4px',
              background: 'linear-gradient(to right, #dc2626, #64748b, #10b981)'
            }}
          />
          <span style={{ color: 'var(--bullish-light)', fontWeight: 600 }}>+1.0 Bullish</span>
        </div>
      </div>

      {/* Heatmap Tiles Grid */}
      <div className="heatmap-container">
        {filteredStocks.map((stock) => {
          const style = getSentimentStyle(stock.sentimentScore);
          const isGainer = stock.changePercent >= 0;

          return (
            <div
              key={stock.symbol}
              className="heatmap-tile"
              onClick={() => onSelectStock(stock)}
              style={{
                background: style.background,
                borderColor: style.borderColor,
                color: stock.sentimentScore >= 0.15 ? '#34d399' : (stock.sentimentScore <= -0.15 ? '#f87171' : '#cbd5e1')
              }}
            >
              {/* Tile Header: Symbol, Sector and News Count */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                  <span className="font-mono" style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>
                    {stock.symbol}
                  </span>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontSize: '0.7rem',
                      background: 'rgba(0, 0, 0, 0.35)',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '4px',
                      color: '#cbd5e1'
                    }}
                    title={`${stock.newsCount || 2} news articles analyzed`}
                  >
                    <Newspaper size={11} />
                    <span>{stock.newsCount || 2}</span>
                  </div>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.7)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {stock.name}
                </div>
              </div>

              {/* Middle: Stock Price & 24h Change */}
              <div style={{ margin: '0.6rem 0' }}>
                <div className="font-mono" style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
                  ₹{Number(stock.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
                <div
                  className="font-mono"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: isGainer ? 'var(--bullish-light)' : 'var(--bearish-light)'
                  }}
                >
                  {isGainer ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                  <span>{isGainer ? '+' : ''}{stock.changePercent}%</span>
                  <span style={{ opacity: 0.65, fontSize: '0.72rem' }}>({isGainer ? '+' : ''}₹{stock.change})</span>
                </div>
              </div>

              {/* Bottom: NLP Sentiment Score & Predicted Impact */}
              <div
                style={{
                  paddingTop: '0.5rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.72rem'
                }}
              >
                <div>
                  <span style={{ color: 'rgba(255, 255, 255, 0.65)' }}>Score: </span>
                  <strong className="font-mono" style={{ color: '#ffffff' }}>
                    {stock.sentimentScore > 0 ? '+' : ''}{stock.sentimentScore}
                  </strong>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem',
                    padding: '0.15rem 0.4rem',
                    borderRadius: '4px',
                    background: stock.sentimentScore >= 0.15 ? 'rgba(16, 185, 129, 0.3)' : (stock.sentimentScore <= -0.15 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(100, 116, 139, 0.3)'),
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.68rem'
                  }}
                >
                  <Sparkles size={10} />
                  <span>Impact: {stock.predictedImpact > 0 ? '+' : ''}{stock.predictedImpact}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
