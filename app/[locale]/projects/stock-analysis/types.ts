export interface FactorSignal {
  type: 'technical' | 'fundamental';
  message: string;
}

export interface Factor {
  key: string;
  name: string;
  category: '技术面' | '基本面';
  status: string;
  bullish_signals: FactorSignal[];
  bearish_signals: FactorSignal[];
}

export interface FearGreed {
  index: number;
  label: string;
}

export interface StockData {
  symbol: string;
  stock_name: string;
  price: number;
  factors: Factor[];
  fear_greed: FearGreed;
}
