'use client';

import axios from 'axios';
import { useState, useEffect, Fragment } from 'react';
import { useParams } from 'next/navigation';
import { AlertTriangle, ChevronDown, ChevronUp, Table2, LayoutGrid } from 'lucide-react';
import { Locale } from '@/locales/config';
import StockCard, { StockData } from './StockCard';

type ViewMode = 'table' | 'card';

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
    symbol: 'Symbol',
    advice: 'Advice',
    viewTable: 'Table View',
    viewCard: 'Card View',
    // 简短表头
    symbolShort: 'Symbol',
    scoreShort: 'Score',
    adviceShort: 'Advice',
    fearGreedShort: 'F&G',
  },
  [Locale.ZH]: {
    title: '股票分析报告',
    currentPrice: '当前价格',
    analysisScore: '综合评分',
    trendStatus: '趋势状态',
    stopLoss: '建议止损价',
    bullishSignals: '看涨信号',
    bearishSignals: '看跌信号',
    fearGreedIndex: '恐惧贪婪指数',
    loading: '加载中...',
    noSignals: '暂无信号',
    symbol: '股票代码',
    advice: '建议',
    viewTable: '表格视图',
    viewCard: '卡片视图',
    // 简短表头
    symbolShort: '代码',
    scoreShort: '评分',
    adviceShort: '建议',
    fearGreedShort: '贪恐',
  },
};

export default function StockAnalysisPage() {
  const params = useParams<{ locale: Locale }>();
  const locale = params.locale || Locale.ZH;
  const [stocksData, setStocksData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSymbol, setExpandedSymbol] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const t = translations[locale];
  const [symbols, setSymbols] = useState([
    'TQQQ',
    'TECL',
    'NVDA',
    'GOOGL',
    'TSLA',
    'AAPL',
    'YINN',
    'BABA',
    'CONL',
  ]);

  // 获取股票数据的函数
  const fetchStockData = async () => {
    try {
      setLoading(true);
      setError(null);

      const isDev = process.env.NODE_ENV === 'development';
      const apiUrl = isDev
        ? `/proxy/stock/analyze`
        : `https://stock-analyzer-service-55638944338.us-central1.run.app/stock/analyze`;

      const response = await axios.post<StockData[]>(apiUrl, {
        symbols,
      });

      setStocksData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching stock data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData();
  }, [symbols]);

  const themeColors = {
    bullish: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      ring: '#10b981',
      dot: 'bg-emerald-500',
    },
    neutral: {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      ring: '#f59e0b',
      dot: 'bg-amber-500',
    },
    bearish: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      ring: '#f43f5e',
      dot: 'bg-rose-500',
    },
  };

  // 根据评分获取主题样式
  const getThemeStyles = (score: number) => {
    if (score >= 70) return themeColors.bullish;
    if (score <= 40) return themeColors.bearish;
    return themeColors.neutral;
  };

  // 从 fear_greed_label 中提取 emoji
  const getEmojiFromLabel = (label: string) => {
    // 匹配 emoji（包括各种 emoji 范围）
    const emojiMatch = label.match(
      /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]/u
    );
    return emojiMatch ? emojiMatch[0] : '';
  };

  const toggleExpand = (symbol: string) => {
    setExpandedSymbol(expandedSymbol === symbol ? null : symbol);
  };

  return (
    <div className="min-h-screen px-4 py-12 font-sans sm:px-6 lg:px-8">
      <div className="container mx-auto text-center">
        <h1 className="text-3xl font-light tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
          {t.title}
        </h1>
      </div>

      <div className="container mx-auto mt-4 flex items-center justify-center gap-1 text-center text-xs text-gray-400 dark:text-gray-500">
        <AlertTriangle className="h-3 w-3" />
        <p>投资有风险，入市需谨慎。此报告仅供参考。</p>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="container mx-auto mt-8 max-w-2xl rounded-lg border border-rose-200 bg-rose-50 p-4 dark:border-rose-800 dark:bg-rose-900/20">
          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400">
            <AlertTriangle className="h-4 w-4" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* 加载状态 */}
      {loading && stocksData.length === 0 && (
        <div className="container mx-auto mt-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900 dark:border-gray-100"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400">{t.loading}</p>
        </div>
      )}

      {/* 无数据提示 */}
      {!loading && stocksData.length === 0 && !error && (
        <div className="container mx-auto mt-8 text-center text-gray-500 dark:text-gray-400">
          <p>暂无股票数据</p>
        </div>
      )}

      {/* 视图切换按钮 */}
      {!loading && stocksData.length > 0 && (
        <div className="container mx-auto mt-8 flex justify-end gap-2">
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              viewMode === 'table'
                ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <Table2 className="h-4 w-4" />
            {t.viewTable}
          </button>
          <button
            onClick={() => setViewMode('card')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              viewMode === 'card'
                ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            {t.viewCard}
          </button>
        </div>
      )}

      {/* 表格视图 */}
      {!loading && stocksData.length > 0 && viewMode === 'table' && (
        <div className="container mx-auto mt-8 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  <span className="md:hidden">{t.symbolShort}</span>
                  <span className="hidden md:inline">{t.symbol}</span>
                </th>
                <th className="hidden px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase md:table-cell dark:text-gray-400">
                  {t.currentPrice}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  <span className="md:hidden">{t.scoreShort}</span>
                  <span className="hidden md:inline">{t.analysisScore}</span>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  <span className="md:hidden">{t.adviceShort}</span>
                  <span className="hidden md:inline">{t.advice}</span>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  <span className="md:hidden">{t.fearGreedShort}</span>
                  <span className="hidden md:inline">{t.fearGreedIndex}</span>
                </th>
                <th className="hidden px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase md:table-cell dark:text-gray-400">
                  {t.trendStatus}
                </th>
                <th className="hidden px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase md:table-cell dark:text-gray-400">
                  {t.stopLoss}
                </th>
                <th className="hidden px-4 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase md:table-cell dark:text-gray-400">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
              {stocksData.map((stockData) => {
                const currentTheme = getThemeStyles(stockData.score);
                const fearGreedTheme = getThemeStyles(stockData.fear_greed_index);
                const isExpanded = expandedSymbol === stockData.symbol;

                return (
                  <Fragment key={stockData.symbol}>
                    <tr
                      className="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      onClick={() => toggleExpand(stockData.symbol)}
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-base font-medium text-gray-900 dark:text-gray-100">
                          {stockData.symbol}
                        </div>
                      </td>
                      {/* 价格 - PC端显示，移动端隐藏 */}
                      <td className="hidden px-4 py-4 whitespace-nowrap md:table-cell">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          ${stockData.price.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-medium ${currentTheme.bg} ${currentTheme.text}`}
                          >
                            {stockData.score}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                          {/* 移动端：只显示英文建议（BUY/HOLD/SELL等，包括小写） */}
                          <span className="md:hidden">
                            {stockData.advice.match(/[A-Za-z]+/)?.[0] || stockData.advice}
                          </span>
                          {/* PC端：显示完整建议 */}
                          <span className="hidden md:inline">{stockData.advice}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {/* 移动端：显示数字和emoji图标 */}
                        <div className="flex items-center gap-1.5 md:hidden">
                          <span className="text-base">
                            {getEmojiFromLabel(stockData.fear_greed_label)}
                          </span>
                          <span className={`text-sm font-medium ${fearGreedTheme.text}`}>
                            {stockData.fear_greed_index.toFixed(1)}
                          </span>
                        </div>
                        {/* PC端：显示完整进度条 */}
                        <div className="hidden items-center gap-3 md:flex">
                          <div className="min-w-[120px] flex-1">
                            <div className="mb-1 flex items-center justify-between">
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {stockData.fear_greed_index.toFixed(1)}
                              </span>
                              <span className={`text-xs font-medium ${fearGreedTheme.text}`}>
                                {stockData.fear_greed_label}
                              </span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                              <div
                                className="h-full rounded-full transition-all duration-1000 ease-out"
                                style={{
                                  width: `${stockData.fear_greed_index}%`,
                                  backgroundColor: fearGreedTheme.ring,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </td>
                      {/* 趋势 - PC端显示，移动端隐藏 */}
                      <td className="hidden px-4 py-4 whitespace-nowrap md:table-cell">
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                          {stockData.trend_status}
                        </div>
                      </td>
                      {/* 止损价 - PC端显示，移动端隐藏 */}
                      <td className="hidden px-4 py-4 whitespace-nowrap md:table-cell">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          ${stockData.stop_loss_price.toFixed(2)}
                        </div>
                      </td>
                      {/* 操作列 - PC端显示，移动端隐藏 */}
                      <td className="hidden px-4 py-4 text-right whitespace-nowrap md:table-cell">
                        {isExpanded ? (
                          <ChevronUp className="ml-auto h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="ml-auto h-5 w-5 text-gray-400" />
                        )}
                      </td>
                    </tr>
                    {isExpanded && (
                      <>
                        {/* 移动端：colSpan=4（代码、评分、建议、贪恐指数） */}
                        <tr className="md:hidden">
                          <td colSpan={4} className="bg-gray-50 px-4 py-6 dark:bg-gray-900/50">
                            {/* 移动端：显示价格、趋势、止损价 */}
                            <div className="mb-4 grid grid-cols-1 gap-4 border-b border-gray-200 pb-4 md:hidden dark:border-gray-700">
                              <div>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {t.currentPrice}:
                                </span>
                                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                                  ${stockData.price.toFixed(2)}
                                </p>
                              </div>
                              <div>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {t.trendStatus}:
                                </span>
                                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {stockData.trend_status}
                                </p>
                              </div>
                              <div>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {t.stopLoss}:
                                </span>
                                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                                  ${stockData.stop_loss_price.toFixed(2)}
                                </p>
                              </div>
                            </div>

                            {/* 涨跌信号 - PC和移动端都显示 */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                              {/* 看涨信号 */}
                              <div>
                                <h4 className="mb-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {t.bullishSignals}
                                </h4>
                                {stockData.bullish_signals.length > 0 ? (
                                  <ul className="space-y-2">
                                    {stockData.bullish_signals.map((signal, idx) => (
                                      <li key={idx} className="flex items-start gap-2">
                                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                                        <span className="text-sm text-gray-600 dark:text-gray-300">
                                          {signal}
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-sm text-gray-400 italic dark:text-gray-500">
                                    {t.noSignals}
                                  </p>
                                )}
                              </div>

                              {/* 看跌信号 */}
                              <div>
                                <h4 className="mb-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {t.bearishSignals}
                                </h4>
                                {stockData.bearish_signals.length > 0 ? (
                                  <ul className="space-y-2">
                                    {stockData.bearish_signals.map((signal, idx) => (
                                      <li key={idx} className="flex items-start gap-2">
                                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
                                        <span className="text-sm text-gray-600 dark:text-gray-300">
                                          {signal}
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-sm text-gray-400 italic dark:text-gray-500">
                                    {t.noSignals}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                        {/* PC端：colSpan=8 */}
                        <tr className="hidden md:table-row">
                          <td colSpan={8} className="bg-gray-50 px-4 py-6 dark:bg-gray-900/50">
                            {/* 涨跌信号 - PC端只显示信号 */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                              {/* 看涨信号 */}
                              <div>
                                <h4 className="mb-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {t.bullishSignals}
                                </h4>
                                {stockData.bullish_signals.length > 0 ? (
                                  <ul className="space-y-2">
                                    {stockData.bullish_signals.map((signal, idx) => (
                                      <li key={idx} className="flex items-start gap-2">
                                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                                        <span className="text-sm text-gray-600 dark:text-gray-300">
                                          {signal}
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-sm text-gray-400 italic dark:text-gray-500">
                                    {t.noSignals}
                                  </p>
                                )}
                              </div>

                              {/* 看跌信号 */}
                              <div>
                                <h4 className="mb-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {t.bearishSignals}
                                </h4>
                                {stockData.bearish_signals.length > 0 ? (
                                  <ul className="space-y-2">
                                    {stockData.bearish_signals.map((signal, idx) => (
                                      <li key={idx} className="flex items-start gap-2">
                                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
                                        <span className="text-sm text-gray-600 dark:text-gray-300">
                                          {signal}
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-sm text-gray-400 italic dark:text-gray-500">
                                    {t.noSignals}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      </>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 卡片列表视图 */}
      {!loading && stocksData.length > 0 && viewMode === 'card' && (
        <div className="container mx-auto mt-8 columns-1 gap-6 md:columns-2">
          {stocksData.map((stockData) => (
            <div key={stockData.symbol} className="mb-6 break-inside-avoid">
              <StockCard stockData={stockData} translations={t} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
