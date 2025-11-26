'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { TrendingUp, TrendingDown, Shield, Activity, Brain, AlertTriangle } from 'lucide-react';
import { Locale } from '@/locales/config';

import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface StockData {
  symbol: string;
  price: number;
  score: number;
  advice: string;
  trend_status: string;
  stop_loss_price: number;
  bullish_signals: string[];
  bearish_signals: string[];
  fear_greed_index: number;
  fear_greed_label: string;
}

const translations = {
  [Locale.EN]: {
    title: 'Stock Analysis Report',
    currentPrice: 'Price',
    analysisScore: 'Overall Score',
    trendStatus: 'Trend',
    stopLoss: 'Stop Loss Buy',
    bullishSignals: 'Bullish Signals',
    bearishSignals: 'Bearish Signals',
    fearGreedIndex: 'Fear & Greed',
    loading: 'Loading...',
    noSignals: 'No signals detected',
  },
  [Locale.ZH]: {
    title: '智能股票分析报告',
    currentPrice: '当前价格',
    analysisScore: '综合评分',
    trendStatus: '趋势状态',
    stopLoss: '建议止损价',
    bullishSignals: '看涨信号',
    bearishSignals: '看跌信号',
    fearGreedIndex: '恐惧贪婪指数',
    loading: '加载中...',
    noSignals: '暂无信号',
  },
};

export default function StockAnalysisPage() {
  const params = useParams<{ locale: Locale }>();
  const locale = params.locale || Locale.ZH;
  const [stocksData, setStocksData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const t = translations[locale];

  // 获取股票数据的函数
  const fetchStockData = async (symbol: string) => {
    try {
      setLoading(true);
      setError(null);

      // 使用代理路径避免 CORS 问题
      const response = await fetch(`/proxy/stock/analyze/${symbol}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch data for ${symbol}: ${response.statusText}`);
      }

      const data: StockData = await response.json();

      setStocksData((prev) => {
        const existingIndex = prev.findIndex(stock => stock.symbol === data.symbol);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = data;
          return updated;
        }
        return [...prev, data];
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching stock data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData('NVDA');
  }, []);

  const themeColors = {
    bullish: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      ring: '#10b981', // emerald-500
      dot: 'bg-emerald-500',
    },
    neutral: {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      ring: '#f59e0b', // amber-500
      dot: 'bg-amber-500',
    },
    bearish: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      ring: '#f43f5e', // rose-500
      dot: 'bg-rose-500',
    },
  };

  // 根据评分获取主题样式
  const getThemeStyles = (score: number) => {
    if (score >= 70) return themeColors.bullish;
    if (score <= 40) return themeColors.bearish;
    return themeColors.neutral;
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="container mx-auto text-center">
        <h1 className="text-3xl font-light tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
          {t.title}
        </h1>
      </div>

      <div className="container mt-4 mx-auto text-center flex items-center justify-center gap-1 text-gray-400 dark:text-gray-500 text-xs">
        <AlertTriangle className="h-3 w-3" />
        <p>投资有风险，入市需谨慎。此报告仅供参考。</p>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="container mt-8 mx-auto max-w-2xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-lg p-4">
          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400">
            <AlertTriangle className="h-4 w-4" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* 加载状态 */}
      {loading && stocksData.length === 0 && (
        <div className="container mt-8 mx-auto text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400">{t.loading}</p>
        </div>
      )}

      {/* 无数据提示 */}
      {!loading && stocksData.length === 0 && !error && (
        <div className="container mt-8 mx-auto text-center text-gray-500 dark:text-gray-400">
          <p>暂无股票数据</p>
        </div>
      )}

      <div className="container mt-8 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 auto-rows-max">
        {stocksData.map((stockData, index) => {
          const currentTheme = getThemeStyles(stockData.score);
          const fearGreedTheme = getThemeStyles(stockData.fear_greed_index);

          return (
            <div key={stockData.symbol} className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] overflow-hidden transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.3)] min-w-0 lg:min-w-[450px] max-w-full w-full">

              {/* 头部：股票代码与建议横幅 */}
              <div className="p-8 pb-0">
                <div className="flex justify-between items-baseline mb-6">
                  <h2 className="text-5xl font-extralight tracking-tight text-gray-900 dark:text-gray-100">
                    {stockData.symbol}
                  </h2>
                  <div className="text-right">
                    <p className="text-2xl font-light text-gray-900 dark:text-gray-100">${stockData.price.toFixed(2)}</p>
                    {/* <p className="text-sm text-gray-500">{t.currentPrice}</p> */}
                  </div>
                </div>
              </div>

              {/* 建议 Banner - 全宽、柔和背景色 */}
              <div className={`w-full py-4 px-8 ${currentTheme.bg} flex items-center justify-center`}>
                <p className={`text-lg font-medium ${currentTheme.text}`}>
                  {stockData.advice}
                </p>
              </div>

              {/* 核心指标区域 */}
              <div className="p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-b border-gray-100 dark:border-gray-700">

                {/* 左侧：大圆环评分 */}
                <div className="md:col-span-5 flex flex-col items-center justify-center py-4">
                  <div className="w-40 h-40">
                    {/* 使用 react-circular-progressbar 实现极细圆环 */}
                    <CircularProgressbarWithChildren
                      value={stockData.score}
                      strokeWidth={3} // 极细线条
                      styles={buildStyles({
                        pathColor: currentTheme.ring,
                        trailColor: '#f3f4f6', // 非常浅的灰色轨迹
                        strokeLinecap: 'round',
                        pathTransitionDuration: 1,
                      })}
                    >
                      <div className="text-center">
                        <p className="text-5xl font-thin text-gray-900 dark:text-gray-100">{stockData.score}</p>
                      </div>
                    </CircularProgressbarWithChildren>
                  </div>
                  <p className="mt-4 text-sm font-medium text-gray-500 dark:text-gray-400 tracking-wide">{t.analysisScore}</p>
                </div>

                {/* 右侧：关键数据指标 - 使用更细的图标和字体 */}
                <div className="md:col-span-7 space-y-6 py-4 md:border-l md:border-gray-100 dark:md:border-gray-700 md:pl-8">

                  {/* 建议止损 */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-gray-500 dark:text-gray-400">
                      <Shield className="w-4 h-4" strokeWidth={1.5} />
                      <p className="text-xs font-medium">{t.stopLoss}</p>
                    </div>
                    <p className="text-2xl font-light text-gray-900 dark:text-gray-100">${stockData.stop_loss_price.toFixed(2)}</p>
                  </div>

                  {/* 趋势状态 */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-gray-500 dark:text-gray-400">
                      <Activity className="w-4 h-4" strokeWidth={1.5} />
                      <p className="text-xs font-medium">{t.trendStatus}</p>
                    </div>
                    <p className="text-xl font-normal text-gray-900 dark:text-gray-100">{stockData.trend_status}</p>
                  </div>

                  {/* 恐惧贪婪 - 简化版 */}
                  <div className="pt-6 border-t border-gray-50 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        <Brain className="w-4 h-4" strokeWidth={1.5} />
                        <p className="text-xs font-medium">{t.fearGreedIndex}</p>
                      </div>
                      <span className={`text-sm font-medium ${fearGreedTheme.text}`}>{stockData.fear_greed_label}</span>
                    </div>
                    {/* 极简进度条 */}
                    <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${stockData.fear_greed_index}%`,
                          backgroundColor: fearGreedTheme.ring
                        }}
                      />
                    </div>
                    <p className="mt-1 text-right text-sm font-light text-gray-900 dark:text-gray-100">{stockData.fear_greed_index.toFixed(1)}</p>
                  </div>

                </div>
              </div>

              {/* 底部：信号列表 - 双栏布局，使用小圆点替代大图标 */}
              <div className="p-8 bg-gray-50/50 dark:bg-gray-900/50 grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                {/* 中间分割线 */}
                <div className="hidden md:block absolute left-1/2 top-8 bottom-8 w-px bg-gray-200 dark:bg-gray-700"></div>

                {/* 看涨信号 */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-4 w-4 text-emerald-600" strokeWidth={2} />
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">{t.bullishSignals}</h3>
                  </div>
                  {stockData.bullish_signals.length > 0 ? (
                    <ul className="space-y-3">
                      {stockData.bullish_signals.map((signal, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          {/* 极简小圆点 */}
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                          <span className="text-sm text-gray-600 dark:text-gray-300 font-light leading-relaxed">{signal}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-400 dark:text-gray-500 italic">{t.noSignals}</p>
                  )}
                </div>

                {/* 看跌信号 */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingDown className="h-4 w-4 text-rose-600" strokeWidth={2} />
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">{t.bearishSignals}</h3>
                  </div>
                  {stockData.bearish_signals.length > 0 ? (
                    <ul className="space-y-3">
                      {stockData.bearish_signals.map((signal, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />
                          <span className="text-sm text-gray-600 dark:text-gray-300 font-light leading-relaxed">{signal}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-400 dark:text-gray-500 italic">{t.noSignals}</p>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
