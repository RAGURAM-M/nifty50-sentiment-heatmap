import React, { useState } from 'react';
import { Sparkles, Cpu, Send, CheckCircle2, AlertCircle, TrendingUp, TrendingDown, RefreshCw, Zap } from 'lucide-react';

const PRESET_HEADLINES = [
  {
    symbol: 'TATAMOTORS',
    text: 'Tata Motors Q3 net profit surges 45% YoY; EV exports double with record order wins',
    tag: 'Strong Bullish'
  },
  {
    symbol: 'ADANIENT',
    text: 'SEBI issues probe notice; promoter pledge increases amid debt repayment concerns',
    tag: 'Strong Bearish'
  },
  {
    symbol: 'HCLTECH',
    text: 'HCL Technologies secures $650M European AI cloud deal; raises revenue guidance',
    tag: 'Bullish'
  },
  {
    symbol: 'DRREDDY',
    text: 'US FDA issues Form 483 with 4 procedural observations for Hyderabad API facility',
    tag: 'Bearish'
  },
  {
    symbol: 'HDFCBANK',
    text: 'HDFC Bank deposits jump 16.5% YoY; cost-to-income ratio improves post merger',
    tag: 'Bullish'
  }
];

export default function NlpPlayground({ stocks, onApplySentiment, activeStock }) {
  const [selectedSymbol, setSelectedSymbol] = useState(activeStock?.symbol || 'TATAMOTORS');
  const [headline, setHeadline] = useState('Tata Motors Q3 net profit surges 45% YoY; EV exports double with record order wins');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [commitMessage, setCommitMessage] = useState(null);

  const selectedStock = stocks.find(s => s.symbol === selectedSymbol) || stocks[0];

  const handleAnalyze = async (textToAnalyze, symbolToAnalyze) => {
    const text = textToAnalyze || headline;
    const symbol = symbolToAnalyze || selectedSymbol;
    if (!text.trim()) return;

    setIsAnalyzing(true);
    setCommitMessage(null);
    try {
      const response = await fetch('http://localhost:5000/api/nlp/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ headline: text, symbol })
      });
      const data = await response.json();
      if (data.success) {
        setAnalysisResult(data.data);
      }
    } catch (err) {
      console.error('NLP Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApplyToLiveMarket = async () => {
    if (!analysisResult || !headline.trim()) return;
    setIsApplying(true);
    try {
      const response = await fetch('http://localhost:5000/api/nlp/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          headline,
          symbol: selectedSymbol,
          source: 'AI Analyst Sandbox'
        })
      });
      const data = await response.json();
      if (data.success) {
        setCommitMessage(`✅ Catalyst committed! Heatmap and ${selectedSymbol} sentiment have been updated in real-time.`);
        if (onApplySentiment) onApplySentiment();
      }
    } catch (err) {
      console.error('Error committing catalyst:', err);
      setCommitMessage('❌ Failed to commit catalyst to live feed.');
    } finally {
      setIsApplying(false);
    }
  };

  const handlePresetClick = (preset) => {
    setSelectedSymbol(preset.symbol);
    setHeadline(preset.text);
    handleAnalyze(preset.text, preset.symbol);
  };

  const analysis = analysisResult?.analysis;
  const isBullish = analysis?.label === 'Bullish';
  const isBearish = analysis?.label === 'Bearish';

  return (
    <div style={{ padding: '1.5rem 1.75rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '1.25rem 1.5rem',
          marginBottom: '1.5rem',
          background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.12), rgba(99, 102, 241, 0.12))',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(56, 189, 248, 0.4)'
            }}
          >
            <Cpu size={22} color="#0f172a" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc' }}>
                NLP Financial Sentiment Engine & Catalyst Simulator
              </h2>
              <span className="brand-badge">Innovation Hook 5/5</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Test any custom Indian market headline. Inspect lexical token weights, polarity score, and simulated price movement.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Zap size={16} color="var(--accent-amber)" />
          <span style={{ fontSize: '0.8rem', color: 'var(--accent-amber)', fontWeight: 600 }}>
            Real-time VADER + Indian Market Lexicon
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem' }}>
        {/* Left Column: Input Form & Presets */}
        <div className="glass-panel" style={{ padding: '1.4rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '1rem' }}>
            1. Configure Headline Catalyst
          </h3>

          {/* Target Stock Selector */}
          <div style={{ marginBottom: '1.1rem' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Target Nifty 50 Stock:
            </label>
            <select
              value={selectedSymbol}
              onChange={(e) => setSelectedSymbol(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.9rem',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontSize: '0.88rem',
                fontFamily: 'var(--font-mono)',
                outline: 'none'
              }}
            >
              {stocks.map(s => (
                <option key={s.symbol} value={s.symbol}>
                  {s.symbol} — {s.name} (₹{s.price})
                </option>
              ))}
            </select>
          </div>

          {/* Headline Input */}
          <div style={{ marginBottom: '1.1rem' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              News Headline / Corporate Announcement:
            </label>
            <textarea
              rows={3}
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Infosys wins $1.2B cloud transformation deal; raises revenue forecast..."
              style={{
                width: '100%',
                padding: '0.75rem 0.9rem',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontSize: '0.88rem',
                outline: 'none',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Action Button */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <button
              className="btn-primary"
              onClick={() => handleAnalyze()}
              disabled={isAnalyzing}
              style={{ flex: 1, justifyContent: 'center' }}
            >
              <Sparkles size={16} />
              <span>{isAnalyzing ? 'Running NLP Engine...' : 'Analyze Sentiment & Impact'}</span>
            </button>
          </div>

          {/* Quick Presets */}
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
              Or choose a realistic market scenario to test:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {PRESET_HEADLINES.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => handlePresetClick(preset)}
                  style={{
                    padding: '0.55rem 0.75rem',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.07)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)')}
                >
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <strong className="font-mono" style={{ color: 'var(--accent-cyan)', marginRight: '0.4rem' }}>{preset.symbol}:</strong>
                    {preset.text}
                  </div>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '0.15rem 0.4rem',
                      borderRadius: '4px',
                      whiteSpace: 'nowrap',
                      background: preset.tag.includes('Bullish') ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      color: preset.tag.includes('Bullish') ? 'var(--bullish-light)' : 'var(--bearish-light)'
                    }}
                  >
                    {preset.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Analysis Breakdown */}
        <div className="glass-panel" style={{ padding: '1.4rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '1rem' }}>
            2. NLP Engine Analysis Output
          </h3>

          {analysis ? (
            <div>
              {/* Score Meter & Badge */}
              <div
                style={{
                  padding: '1.1rem',
                  borderRadius: '12px',
                  background: isBullish ? 'rgba(16, 185, 129, 0.12)' : (isBearish ? 'rgba(239, 68, 68, 0.12)' : 'rgba(100, 116, 139, 0.12)'),
                  border: `1px solid ${isBullish ? 'var(--bullish-border)' : (isBearish ? 'var(--bearish-border)' : 'var(--neutral-border)')}`,
                  marginBottom: '1.25rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span
                      style={{
                        padding: '0.2rem 0.6rem',
                        borderRadius: '6px',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        background: isBullish ? 'var(--bullish-vibrant)' : (isBearish ? 'var(--bearish-vibrant)' : 'var(--neutral-color)'),
                        color: '#ffffff'
                      }}
                    >
                      {analysis.label.toUpperCase()}
                    </span>
                    <span className="font-mono" style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>
                      {analysis.score > 0 ? '+' : ''}{analysis.score}
                    </span>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Confidence Score</div>
                    <div className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                      {analysis.confidence}%
                    </div>
                  </div>
                </div>

                {/* Score Progress Bar */}
                <div style={{ position: 'relative', height: '8px', background: '#1e293b', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      left: '50%',
                      width: `${Math.abs(analysis.score) * 50}%`,
                      transform: analysis.score < 0 ? 'translateX(-100%)' : 'none',
                      background: analysis.score >= 0 ? 'var(--bullish-vibrant)' : 'var(--bearish-vibrant)',
                      borderRadius: '4px',
                      transition: 'all 0.4s ease'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                  <span>-1.0 Bearish</span>
                  <span>0.0 Neutral</span>
                  <span>+1.0 Bullish</span>
                </div>
              </div>

              {/* Predicted Price Impact Simulation */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
                  gap: '0.85rem',
                  marginBottom: '1.25rem'
                }}
              >
                <div className="glass-panel" style={{ padding: '0.85rem' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Simulated Price Impact</div>
                  <div
                    className="font-mono"
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      color: analysis.predictedImpact >= 0 ? 'var(--bullish-light)' : 'var(--bearish-light)',
                      marginTop: '0.2rem'
                    }}
                  >
                    {analysis.predictedImpact > 0 ? '+' : ''}{analysis.predictedImpact}%
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '0.85rem' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Projected Stock Price</div>
                  <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginTop: '0.2rem' }}>
                    ₹{analysis.targetPriceRange?.high || selectedStock.price}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                    Current: ₹{selectedStock.price}
                  </div>
                </div>
              </div>

              {/* Extracted Financial Lexicon Tokens */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  Detected Indian Market Lexical Catalysts & Word Weights:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                  {analysis.tokens && analysis.tokens.length > 0 ? (
                    analysis.tokens.map((tok, i) => (
                      <span
                        key={i}
                        className="font-mono"
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.25rem 0.55rem',
                          borderRadius: '6px',
                          background: tok.weight > 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                          border: `1px solid ${tok.weight > 0 ? 'var(--bullish-border)' : 'var(--bearish-border)'}`,
                          color: tok.weight > 0 ? 'var(--bullish-light)' : 'var(--bearish-light)'
                        }}
                      >
                        "{tok.word}": {tok.weight > 0 ? '+' : ''}{tok.weight}
                      </span>
                    ))
                  ) : (
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      No direct financial triggers matched. Baseline VADER polarity applied.
                    </span>
                  )}
                </div>
              </div>

              {/* Commit to Live Market Feed Button */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.1rem' }}>
                <button
                  className="btn-primary"
                  onClick={handleApplyToLiveMarket}
                  disabled={isApplying}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <Send size={15} />
                  <span>{isApplying ? 'Updating Database...' : `Commit Catalyst & Update ${selectedSymbol} Heatmap Tile`}</span>
                </button>

                {commitMessage && (
                  <div
                    style={{
                      marginTop: '0.75rem',
                      fontSize: '0.8rem',
                      color: commitMessage.startsWith('✅') ? 'var(--bullish-light)' : 'var(--bearish-light)',
                      fontWeight: 600,
                      textAlign: 'center'
                    }}
                  >
                    {commitMessage}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div
              style={{
                height: '280px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                textAlign: 'center'
              }}
            >
              <Cpu size={40} style={{ opacity: 0.35, marginBottom: '0.75rem' }} />
              <p style={{ fontSize: '0.85rem' }}>Select a preset or click <strong>Analyze Sentiment</strong> to inspect NLP breakdown.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
