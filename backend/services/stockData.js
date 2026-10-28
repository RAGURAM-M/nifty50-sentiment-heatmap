// Top Nifty 50 Companies across Key Market Sectors
export const initialStocks = [
  // Banking & Financials
  {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Ltd.',
    sector: 'Banking & Financials',
    price: 1742.50,
    change: 18.20,
    changePercent: 1.05,
    marketCap: 1325400, // ₹ Cr
    keywords: ['hdfc bank', 'hdfc', 'hdfcbank', 'housing development finance'],
    sentimentScore: 0.42,
    sentimentLabel: 'Bullish',
    confidence: 86,
    predictedImpact: 1.25
  },
  {
    symbol: 'ICICIBANK',
    name: 'ICICI Bank Ltd.',
    sector: 'Banking & Financials',
    price: 1264.30,
    change: 14.80,
    changePercent: 1.18,
    marketCap: 890350,
    keywords: ['icici bank', 'icici', 'icicibank', 'sandeep bakhshi'],
    sentimentScore: 0.58,
    sentimentLabel: 'Bullish',
    confidence: 91,
    predictedImpact: 1.62
  },
  {
    symbol: 'SBIN',
    name: 'State Bank of India',
    sector: 'Banking & Financials',
    price: 814.75,
    change: -4.30,
    changePercent: -0.52,
    marketCap: 727100,
    keywords: ['sbi', 'state bank of india', 'sbin', 'dinesh khara'],
    sentimentScore: 0.18,
    sentimentLabel: 'Bullish',
    confidence: 79,
    predictedImpact: 0.45
  },
  {
    symbol: 'AXISBANK',
    name: 'Axis Bank Ltd.',
    sector: 'Banking & Financials',
    price: 1180.20,
    change: -8.90,
    changePercent: -0.75,
    marketCap: 365200,
    keywords: ['axis bank', 'axis', 'axisbank', 'amitabh chaudhry'],
    sentimentScore: -0.12,
    sentimentLabel: 'Neutral',
    confidence: 68,
    predictedImpact: -0.28
  },
  {
    symbol: 'BAJFINANCE',
    name: 'Bajaj Finance Ltd.',
    sector: 'Banking & Financials',
    price: 6850.00,
    change: 95.40,
    changePercent: 1.41,
    marketCap: 423800,
    keywords: ['bajaj finance', 'bajfinance', 'sanjiv bajaj', 'bajaj finserv'],
    sentimentScore: 0.49,
    sentimentLabel: 'Bullish',
    confidence: 84,
    predictedImpact: 1.35
  },
  {
    symbol: 'KOTAKBANK',
    name: 'Kotak Mahindra Bank',
    sector: 'Banking & Financials',
    price: 1735.60,
    change: -12.40,
    changePercent: -0.71,
    marketCap: 345000,
    keywords: ['kotak mahindra', 'kotak bank', 'uday kotak', 'kotakbank'],
    sentimentScore: -0.22,
    sentimentLabel: 'Bearish',
    confidence: 77,
    predictedImpact: -0.55
  },

  // Information Technology (IT)
  {
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    sector: 'IT & Software',
    price: 4120.80,
    change: 32.50,
    changePercent: 0.80,
    marketCap: 1491200,
    keywords: ['tcs', 'tata consultancy services', 'krithi krithivasan'],
    sentimentScore: 0.38,
    sentimentLabel: 'Bullish',
    confidence: 88,
    predictedImpact: 0.95
  },
  {
    symbol: 'INFY',
    name: 'Infosys Ltd.',
    sector: 'IT & Software',
    price: 1874.15,
    change: -16.20,
    changePercent: -0.86,
    marketCap: 778400,
    keywords: ['infosys', 'infy', 'salil parekh', 'narayana murthy'],
    sentimentScore: 0.25,
    sentimentLabel: 'Bullish',
    confidence: 82,
    predictedImpact: 0.65
  },
  {
    symbol: 'HCLTECH',
    name: 'HCL Technologies Ltd.',
    sector: 'IT & Software',
    price: 1845.00,
    change: 22.10,
    changePercent: 1.21,
    marketCap: 501300,
    keywords: ['hcl tech', 'hcltech', 'hcl technologies', 'c vijayakumar'],
    sentimentScore: 0.61,
    sentimentLabel: 'Bullish',
    confidence: 92,
    predictedImpact: 1.55
  },
  {
    symbol: 'WIPRO',
    name: 'Wipro Ltd.',
    sector: 'IT & Software',
    price: 548.70,
    change: -5.10,
    changePercent: -0.92,
    marketCap: 286700,
    keywords: ['wipro', 'srini pallia', 'rishad premji'],
    sentimentScore: -0.28,
    sentimentLabel: 'Bearish',
    confidence: 76,
    predictedImpact: -0.72
  },
  {
    symbol: 'TECHM',
    name: 'Tech Mahindra Ltd.',
    sector: 'IT & Software',
    price: 1680.40,
    change: 14.60,
    changePercent: 0.88,
    marketCap: 164000,
    keywords: ['tech mahindra', 'techm', 'mohit joshi'],
    sentimentScore: 0.31,
    sentimentLabel: 'Bullish',
    confidence: 80,
    predictedImpact: 0.78
  },

  // Oil, Gas & Energy
  {
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd.',
    sector: 'Energy & Petrochemicals',
    price: 2785.40,
    change: 38.60,
    changePercent: 1.41,
    marketCap: 1884500,
    keywords: ['reliance', 'ril', 'mukesh ambani', 'jio', 'reliance retail'],
    sentimentScore: 0.64,
    sentimentLabel: 'Bullish',
    confidence: 94,
    predictedImpact: 1.75
  },
  {
    symbol: 'ONGC',
    name: 'Oil & Natural Gas Corp',
    sector: 'Energy & Petrochemicals',
    price: 268.20,
    change: -2.80,
    changePercent: -1.03,
    marketCap: 337400,
    keywords: ['ongc', 'oil and natural gas', 'crude oil ongc'],
    sentimentScore: -0.18,
    sentimentLabel: 'Bearish',
    confidence: 72,
    predictedImpact: -0.42
  },
  {
    symbol: 'NTPC',
    name: 'NTPC Ltd.',
    sector: 'Energy & Petrochemicals',
    price: 412.30,
    change: 6.40,
    changePercent: 1.58,
    marketCap: 399800,
    keywords: ['ntpc', 'national thermal power', 'ntpc green'],
    sentimentScore: 0.55,
    sentimentLabel: 'Bullish',
    confidence: 89,
    predictedImpact: 1.40
  },
  {
    symbol: 'POWERGRID',
    name: 'Power Grid Corp of India',
    sector: 'Energy & Petrochemicals',
    price: 335.60,
    change: 2.10,
    changePercent: 0.63,
    marketCap: 312100,
    keywords: ['power grid', 'powergrid', 'transmission'],
    sentimentScore: 0.22,
    sentimentLabel: 'Bullish',
    confidence: 74,
    predictedImpact: 0.55
  },
  {
    symbol: 'BPCL',
    name: 'Bharat Petroleum Corp',
    sector: 'Energy & Petrochemicals',
    price: 312.90,
    change: -4.50,
    changePercent: -1.42,
    marketCap: 135800,
    keywords: ['bpcl', 'bharat petroleum', 'fuel refining'],
    sentimentScore: -0.34,
    sentimentLabel: 'Bearish',
    confidence: 81,
    predictedImpact: -0.85
  },

  // Automobile & EV
  {
    symbol: 'TATAMOTORS',
    name: 'Tata Motors Ltd.',
    sector: 'Automobile',
    price: 928.60,
    change: 18.70,
    changePercent: 2.05,
    marketCap: 341800,
    keywords: ['tata motors', 'tatamotors', 'jlr', 'jaguar land rover', 'tata ev'],
    sentimentScore: 0.72,
    sentimentLabel: 'Bullish',
    confidence: 95,
    predictedImpact: 1.95
  },
  {
    symbol: 'MARUTI',
    name: 'Maruti Suzuki India',
    sector: 'Automobile',
    price: 11450.00,
    change: -85.00,
    changePercent: -0.74,
    marketCap: 359800,
    keywords: ['maruti', 'maruti suzuki', 'rc bhargava'],
    sentimentScore: 0.08,
    sentimentLabel: 'Neutral',
    confidence: 70,
    predictedImpact: 0.18
  },
  {
    symbol: 'M&M',
    name: 'Mahindra & Mahindra Ltd.',
    sector: 'Automobile',
    price: 2980.50,
    change: 45.20,
    changePercent: 1.54,
    marketCap: 370400,
    keywords: ['mahindra', 'm&m', 'anand mahindra', 'thar', 'scorpio'],
    sentimentScore: 0.68,
    sentimentLabel: 'Bullish',
    confidence: 93,
    predictedImpact: 1.82
  },
  {
    symbol: 'BAJAJ-AUTO',
    name: 'Bajaj Auto Ltd.',
    sector: 'Automobile',
    price: 9850.00,
    change: 110.00,
    changePercent: 1.13,
    marketCap: 278500,
    keywords: ['bajaj auto', 'chetak ev', 'rajiv bajaj'],
    sentimentScore: 0.45,
    sentimentLabel: 'Bullish',
    confidence: 85,
    predictedImpact: 1.15
  },

  // FMCG & Consumer
  {
    symbol: 'HINDUNILVR',
    name: 'Hindustan Unilever Ltd.',
    sector: 'FMCG',
    price: 2420.00,
    change: -14.30,
    changePercent: -0.59,
    marketCap: 568700,
    keywords: ['hul', 'hindustan unilever', 'fmcg demand', 'rohit jawa'],
    sentimentScore: -0.05,
    sentimentLabel: 'Neutral',
    confidence: 65,
    predictedImpact: -0.12
  },
  {
    symbol: 'ITC',
    name: 'ITC Ltd.',
    sector: 'FMCG',
    price: 488.40,
    change: 3.80,
    changePercent: 0.78,
    marketCap: 610200,
    keywords: ['itc', 'itc hotel demerger', 'sanjiv puri', 'itc cigarettes'],
    sentimentScore: 0.35,
    sentimentLabel: 'Bullish',
    confidence: 82,
    predictedImpact: 0.82
  },
  {
    symbol: 'NESTLEIND',
    name: 'Nestle India Ltd.',
    sector: 'FMCG',
    price: 2280.00,
    change: -28.00,
    changePercent: -1.21,
    marketCap: 220000,
    keywords: ['nestle', 'nestle india', 'maggi', 'cerelac'],
    sentimentScore: -0.38,
    sentimentLabel: 'Bearish',
    confidence: 85,
    predictedImpact: -0.92
  },
  {
    symbol: 'BRITANNIA',
    name: 'Britannia Industries',
    sector: 'FMCG',
    price: 5120.00,
    change: 15.00,
    changePercent: 0.29,
    marketCap: 123400,
    keywords: ['britannia', 'good day biscuit', 'varun berry'],
    sentimentScore: 0.14,
    sentimentLabel: 'Neutral',
    confidence: 71,
    predictedImpact: 0.32
  },

  // Metals & Mining
  {
    symbol: 'TATASTEEL',
    name: 'Tata Steel Ltd.',
    sector: 'Metals & Mining',
    price: 154.60,
    change: 2.80,
    changePercent: 1.84,
    marketCap: 193000,
    keywords: ['tata steel', 'tatasteel', 'tv narendran', 'uk plant'],
    sentimentScore: 0.44,
    sentimentLabel: 'Bullish',
    confidence: 83,
    predictedImpact: 1.10
  },
  {
    symbol: 'JSWSTEEL',
    name: 'JSW Steel Ltd.',
    sector: 'Metals & Mining',
    price: 980.50,
    change: 12.40,
    changePercent: 1.28,
    marketCap: 239800,
    keywords: ['jsw steel', 'sajjan jindal', 'jswsteel'],
    sentimentScore: 0.41,
    sentimentLabel: 'Bullish',
    confidence: 81,
    predictedImpact: 1.02
  },
  {
    symbol: 'HINDALCO',
    name: 'Hindalco Industries',
    sector: 'Metals & Mining',
    price: 665.30,
    change: -9.20,
    changePercent: -1.36,
    marketCap: 149500,
    keywords: ['hindalco', 'novelis', 'aluminium prices'],
    sentimentScore: -0.29,
    sentimentLabel: 'Bearish',
    confidence: 78,
    predictedImpact: -0.68
  },

  // Pharmaceuticals & Healthcare
  {
    symbol: 'SUNPHARMA',
    name: 'Sun Pharmaceutical',
    sector: 'Pharma & Healthcare',
    price: 1860.00,
    change: 24.50,
    changePercent: 1.33,
    marketCap: 446200,
    keywords: ['sun pharma', 'sunpharma', 'dilip shanghvi', 'us fda'],
    sentimentScore: 0.52,
    sentimentLabel: 'Bullish',
    confidence: 87,
    predictedImpact: 1.30
  },
  {
    symbol: 'DRREDDY',
    name: "Dr. Reddy's Laboratories",
    sector: 'Pharma & Healthcare',
    price: 1285.40,
    change: -18.60,
    changePercent: -1.43,
    marketCap: 107300,
    keywords: ['dr reddy', 'drreddys', 'fda 483', 'generic drugs'],
    sentimentScore: -0.42,
    sentimentLabel: 'Bearish',
    confidence: 86,
    predictedImpact: -1.05
  },
  {
    symbol: 'CIPLA',
    name: 'Cipla Ltd.',
    sector: 'Pharma & Healthcare',
    price: 1540.20,
    change: 8.50,
    changePercent: 0.55,
    marketCap: 124300,
    keywords: ['cipla', 'respiratory drugs', 'umang vohra'],
    sentimentScore: 0.28,
    sentimentLabel: 'Bullish',
    confidence: 79,
    predictedImpact: 0.65
  },

  // Infrastructure, Telecom & Conglomerates
  {
    symbol: 'LT',
    name: 'Larsen & Toubro Ltd.',
    sector: 'Infrastructure',
    price: 3625.00,
    change: 48.00,
    changePercent: 1.34,
    marketCap: 498300,
    keywords: ['l&t', 'larsen & toubro', 'sn subrahmanyan', 'order book win'],
    sentimentScore: 0.65,
    sentimentLabel: 'Bullish',
    confidence: 92,
    predictedImpact: 1.68
  },
  {
    symbol: 'BHARTIARTL',
    name: 'Bharti Airtel Ltd.',
    sector: 'Telecom',
    price: 1690.00,
    change: 22.00,
    changePercent: 1.32,
    marketCap: 994000,
    keywords: ['bharti airtel', 'airtel', 'sunil mittal', 'arpu hike', '5g rollout'],
    sentimentScore: 0.62,
    sentimentLabel: 'Bullish',
    confidence: 90,
    predictedImpact: 1.58
  },
  {
    symbol: 'ADANIENT',
    name: 'Adani Enterprises Ltd.',
    sector: 'Conglomerates',
    price: 2980.00,
    change: -42.00,
    changePercent: -1.39,
    marketCap: 339700,
    keywords: ['adani enterprises', 'adanient', 'gautam adani', 'adani airport'],
    sentimentScore: -0.32,
    sentimentLabel: 'Bearish',
    confidence: 80,
    predictedImpact: -0.82
  },
  {
    symbol: 'ADANIPORTS',
    name: 'Adani Ports and SEZ',
    sector: 'Infrastructure',
    price: 1410.50,
    change: 15.50,
    changePercent: 1.11,
    marketCap: 304700,
    keywords: ['adani ports', 'karan adani', 'cargo volume'],
    sentimentScore: 0.46,
    sentimentLabel: 'Bullish',
    confidence: 84,
    predictedImpact: 1.18
  }
];

// Helper to generate 7-day historical sentiment & price correlation trend
export function generateHistory(currentPrice, sentimentScore) {
  const days = ['Day -6', 'Day -5', 'Day -4', 'Day -3', 'Day -2', 'Yesterday', 'Today'];
  const history = [];
  let basePrice = currentPrice * (1 - (sentimentScore * 0.04));
  let baseSent = sentimentScore * 0.3;

  for (let i = 0; i < 7; i++) {
    const drift = (i / 6);
    const dayPrice = Number((basePrice + (currentPrice - basePrice) * drift + (Math.sin(i) * basePrice * 0.008)).toFixed(2));
    const daySent = Number((baseSent + (sentimentScore - baseSent) * drift + (Math.cos(i) * 0.08)).toFixed(2));
    
    history.push({
      date: days[i],
      price: dayPrice,
      sentimentScore: Math.max(-1, Math.min(1, daySent)),
      sentimentLabel: daySent >= 0.15 ? 'Bullish' : (daySent <= -0.15 ? 'Bearish' : 'Neutral')
    });
  }
  return history;
}
