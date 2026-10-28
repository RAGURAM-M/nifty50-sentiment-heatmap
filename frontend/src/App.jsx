import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import HeatmapView from './components/HeatmapView';
import StockModal from './components/StockModal';
import NlpPlayground from './components/NlpPlayground';
import NewsTimeline from './components/NewsTimeline';
import SectorAnalytics from './components/SectorAnalytics';
import { LayoutGrid, Newspaper, Cpu, BarChart3, Bell } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('heatmap');
  const [stocks, setStocks] = useState([]);
  const [articles, setArticles] = useState([]);
  const [marketSummary, setMarketSummary] = useState(null);
  const [dbStatus, setDbStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scrapingLoading, setScrapingLoading] = useState(false);
  const [selectedStockForModal, setSelectedStockForModal] = useState(null);
  const [nlpPreloadedStock, setNlpPreloadedStock] = useState(null);
  const [notification, setNotification] = useState(null);

  // Fetch all core datasets
  const fetchMarketData = useCallback(async () => {
    try {
      const [stocksRes, newsRes, summaryRes, healthRes] = await Promise.all([
        fetch(`${API_BASE}/stocks`).then(r => r.json()),
        fetch(`${API_BASE}/news?limit=60`).then(r => r.json()),
        fetch(`${API_BASE}/market-summary`).then(r => r.json()),
        fetch(`${API_BASE}/health`).then(r => r.json())
      ]);

      if (stocksRes.success) setStocks(stocksRes.data);
      if (newsRes.success) setArticles(newsRes.data);
      if (summaryRes.success) setMarketSummary(summaryRes.data);
      if (healthRes.database) setDbStatus(healthRes.database);
    } catch (err) {
      console.error('Error fetching market data from backend:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarketData();
  }, [fetchMarketData]);

  // Trigger Live Scraping
  const handleScrape = async () => {
    setScrapingLoading(true);
    try {
      const res = await fetch(`${API_BASE}/news/scrape`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setNotification(`⚡ ${data.message}`);
        setTimeout(() => setNotification(null), 5000);
        await fetchMarketData();
      }
    } catch (err) {
      console.error('Error triggering scrape:', err);
      setNotification('❌ Failed to trigger live scraper.');
      setTimeout(() => setNotification(null), 5000);
    } finally {
      setScrapingLoading(false);
    }
  };

  // Switch to NLP playground from stock modal
  const handleOpenNlpForStock = (stock) => {
    setNlpPreloadedStock(stock);
    setActiveTab('nlp');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header */}
      <Header
        marketSummary={marketSummary}
        dbStatus={dbStatus}
        onScrape={handleScrape}
        scrapingLoading={scrapingLoading}
      />

      {/* Floating Notification Toast */}
      {notification && (
        <div
          style={{
            position: 'fixed',
            top: '75px',
            right: '25px',
            zIndex: 150,
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid var(--accent-cyan)',
            borderRadius: '10px',
            padding: '0.75rem 1.25rem',
            boxShadow: 'var(--shadow-glow-cyan)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#f8fafc',
            animation: 'fadeIn 0.25s ease'
          }}
        >
          <Bell size={16} color="var(--accent-cyan)" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Navigation Subheader */}
      <div
        style={{
          padding: '0.75rem 1.75rem',
          background: 'rgba(15, 23, 42, 0.5)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}
      >
        <div className="tabs-container">
          <button
            className={`tab-btn ${activeTab === 'heatmap' ? 'active' : ''}`}
            onClick={() => setActiveTab('heatmap')}
          >
            <LayoutGrid size={16} />
            <span>Dynamic Stock Heatmap</span>
          </button>

          <button
            className={`tab-btn ${activeTab === 'news' ? 'active' : ''}`}
            onClick={() => setActiveTab('news')}
          >
            <Newspaper size={16} />
            <span>Company News Timeline</span>
          </button>

          <button
            className={`tab-btn ${activeTab === 'nlp' ? 'active' : ''}`}
            onClick={() => setActiveTab('nlp')}
          >
            <Cpu size={16} />
            <span>NLP Sentiment Engine (Innovation 5/5)</span>
          </button>

          <button
            className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <BarChart3 size={16} />
            <span>Sector Heat & Correlation</span>
          </button>
        </div>

        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {stocks.length} NIFTY 50 Stocks Loaded • Real-Time AI Sentiment Scoring
        </div>
      </div>

      {/* Main Content View */}
      <main style={{ flex: 1 }}>
        {loading ? (
          <div
            style={{
              height: '50vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem'
            }}
          >
            <div className="pulse-dot" style={{ width: '18px', height: '18px' }} />
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Loading Nifty 50 Market Sentiment Feed...
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'heatmap' && (
              <HeatmapView
                stocks={stocks}
                onSelectStock={(stock) => setSelectedStockForModal(stock)}
              />
            )}

            {activeTab === 'news' && (
              <NewsTimeline
                articles={articles}
                stocks={stocks}
                onSelectStock={(stock) => setSelectedStockForModal(stock)}
              />
            )}

            {activeTab === 'nlp' && (
              <NlpPlayground
                stocks={stocks}
                activeStock={nlpPreloadedStock}
                onApplySentiment={fetchMarketData}
              />
            )}

            {activeTab === 'analytics' && (
              <SectorAnalytics
                marketSummary={marketSummary}
                stocks={stocks}
                onSelectStock={(stock) => setSelectedStockForModal(stock)}
              />
            )}
          </>
        )}
      </main>

      {/* Interactive Stock Deep-Dive Modal */}
      {selectedStockForModal && (
        <StockModal
          stock={selectedStockForModal}
          onClose={() => setSelectedStockForModal(null)}
          onTestHeadline={handleOpenNlpForStock}
        />
      )}

      {/* Footer */}
      <footer
        style={{
          padding: '1rem 1.75rem',
          borderTop: '1px solid var(--border-color)',
          background: 'rgba(15, 23, 42, 0.8)',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}
      >
        <div>
          Full Stack IA3 Project • <strong>Financial News Sentiment Analyzer & Indian Stock Heatmap</strong>
        </div>
        <div>
          Stack: ReactJS + CSS3 Modern Design • Node.js + Express • Cheerio/Axios Scraper • MongoDB (Mongoose) + VADER NLP Engine
        </div>
      </footer>
    </div>
  );
}
