'use client';

import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { AlertTriangle, ChevronDown, ChevronUp, TrendingUp, TrendingDown } from 'lucide-react';
import { Locale } from '@/locales/config';
import type { StockData, Factor } from './types';

const translations = {
  [Locale.EN]: {
    title: 'Stock Analysis Report',
    currentPrice: 'Price',
    fearGreedIndex: 'Fear & Greed',
    loading: 'Loading...',
    noSignals: 'No signals detected',
    technical: 'Technical',
    fundamental: 'Fundamental',
    bullishSignals: 'Bullish Signals',
    bearishSignals: 'Bearish Signals',
    expandAll: 'Expand All',
    collapseAll: 'Collapse All',
  },
  [Locale.ZH]: {
    title: '股票分析报告',
    currentPrice: '当前价格',
    fearGreedIndex: '恐惧贪婪指数',
    loading: '加载中...',
    noSignals: '暂无信号',
    technical: '技术面',
    fundamental: '基本面',
    bullishSignals: '看涨信号',
    bearishSignals: '看跌信号',
    expandAll: '展开全部',
    collapseAll: '收起全部',
  },
};

export default function StockAnalysisPage() {
  const params = useParams<{ locale: Locale }>();
  const locale = params.locale || Locale.ZH;
  const [stocksData, setStocksData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedFactors, setExpandedFactors] = useState<Set<string>>(new Set());
  const [expandedStocks, setExpandedStocks] = useState<Set<string>>(new Set());
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

  // 从 fear_greed.label 中提取 emoji
  const getEmojiFromLabel = (label: string) => {
    const emojiMatch = label.match(
      /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]/u
    );
    return emojiMatch ? emojiMatch[0] : '';
  };

  // 根据恐惧贪婪指数获取主题颜色（按 20-40-60-80 划分等级）
  const getFearGreedTheme = (index: number) => {
    if (index >= 80) {
      // 80-100: 极度贪婪
      return { bg: 'bg-emerald-50', text: 'text-emerald-700', ring: '#10b981' };
    }
    if (index >= 60) {
      // 60-80: 贪婪
      return { bg: 'bg-emerald-50', text: 'text-emerald-600', ring: '#34d399' };
    }
    if (index >= 40) {
      // 40-60: 中性
      return { bg: 'bg-amber-50', text: 'text-amber-800', ring: '#f59e0b' };
    }
    if (index >= 20) {
      // 20-40: 恐惧
      return { bg: 'bg-rose-50', text: 'text-rose-700', ring: '#f43f5e' };
    }
    // 0-20: 极度恐惧
    return { bg: 'bg-rose-50', text: 'text-rose-800', ring: '#dc2626' };
  };

  // 判断因子状态（看涨/看跌/中性）
  const getFactorStatus = (factor: Factor) => {
    const bullishCount = factor.bullish_signals.length;
    const bearishCount = factor.bearish_signals.length;
    if (bullishCount > bearishCount) return 'bullish';
    if (bearishCount > bullishCount) return 'bearish';
    return 'neutral';
  };

  // 获取因子状态样式（适配暗黑模式）
  const getFactorStatusStyle = (status: 'bullish' | 'bearish' | 'neutral') => {
    switch (status) {
      case 'bullish':
        return {
          bg: 'bg-emerald-50/50 dark:bg-emerald-900/20',
          text: 'text-emerald-700 dark:text-emerald-300',
          border: 'border-emerald-200 dark:border-emerald-800',
          dot: 'bg-emerald-500',
          detailBg: 'bg-emerald-50/30 dark:bg-emerald-900/30',
          detailText: 'text-emerald-900 dark:text-emerald-100',
        };
      case 'bearish':
        return {
          bg: 'bg-rose-50/50 dark:bg-rose-900/20',
          text: 'text-rose-700 dark:text-rose-300',
          border: 'border-rose-200 dark:border-rose-800',
          dot: 'bg-rose-500',
          detailBg: 'bg-rose-50/30 dark:bg-rose-900/30',
          detailText: 'text-rose-900 dark:text-rose-100',
        };
      default:
        return {
          bg: 'bg-amber-50/50 dark:bg-amber-900/20',
          text: 'text-amber-800 dark:text-amber-300',
          border: 'border-amber-200 dark:border-amber-800',
          dot: 'bg-amber-500',
          detailBg: 'bg-amber-50/30 dark:bg-amber-900/30',
          detailText: 'text-amber-900 dark:text-amber-100',
        };
    }
  };

  const toggleFactor = (factorKey: string) => {
    setExpandedFactors((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(factorKey)) {
        newSet.delete(factorKey);
      } else {
        newSet.add(factorKey);
      }
      return newSet;
    });
  };

  const toggleStock = (symbol: string) => {
    setExpandedStocks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(symbol)) {
        newSet.delete(symbol);
      } else {
        newSet.add(symbol);
      }
      return newSet;
    });
  };

  // 按分类分组因子
  const groupFactorsByCategory = (factors: Factor[]) => {
    const grouped: Record<string, Factor[]> = {
      技术面: [],
      基本面: [],
    };
    factors.forEach((factor) => {
      if (grouped[factor.category]) {
        grouped[factor.category].push(factor);
      }
    });
    return grouped;
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

      {/* 股票列表 */}
      {!loading && stocksData.length > 0 && (
        <div className="container mx-auto mt-8 space-y-4">
          {stocksData.map((stock) => {
            const fearGreedTheme = getFearGreedTheme(stock.fear_greed.index);
            const groupedFactors = groupFactorsByCategory(stock.factors);
            const isStockExpanded = expandedStocks.has(stock.symbol);

            return (
              <div
                key={stock.symbol}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
              >
                {/* 股票头部信息 - 可点击展开/收起 */}
                <button
                  onClick={() => toggleStock(stock.symbol)}
                  className="w-full border-b border-gray-200 bg-gray-50 px-6 py-4 text-left transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900/50 dark:hover:bg-gray-800"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      {isStockExpanded ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                      <h2 className="w-20 truncate text-2xl font-light text-gray-900 dark:text-gray-100">
                        {stock.symbol}
                      </h2>
                      <div className="text-left">
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t.currentPrice}</p>
                        <p className="text-xl font-medium text-gray-900 dark:text-gray-100">
                          ${stock.price.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* 恐惧贪婪指数 */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {t.fearGreedIndex}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {getEmojiFromLabel(stock.fear_greed.label)}
                          </span>
                          <span className={`text-sm font-medium ${fearGreedTheme.text}`}>
                            {stock.fear_greed.index.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <div className="h-12 w-1 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                      <div className="min-w-[120px]">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {stock.fear_greed.index.toFixed(1)}
                          </span>
                          <span className={`text-xs font-medium ${fearGreedTheme.text}`}>
                            {stock.fear_greed.label
                              .replace(
                                /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]/gu,
                                ''
                              )
                              .trim()}
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                          <div
                            className="h-full rounded-full transition-all duration-1000 ease-out"
                            style={{
                              width: `${stock.fear_greed.index}%`,
                              backgroundColor: fearGreedTheme.ring,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </button>

                {/* 因子列表 - 可折叠 */}
                {isStockExpanded && (
                  <div className="p-6">
                    {/* 按分类展示因子 */}
                    {Object.entries(groupedFactors).map(([category, factors]) => {
                      if (factors.length === 0) return null;

                      return (
                        <div key={category} className="mb-6 last:mb-0">
                          {/* 分类标题和展开/收起按钮在同一行 */}
                          <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                              {category}
                            </h3>
                            <div className="flex gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const categoryFactorKeys = factors.map(
                                    (f) => `${stock.symbol}-${f.key}`
                                  );
                                  const allExpanded = categoryFactorKeys.every((key) =>
                                    expandedFactors.has(key)
                                  );
                                  setExpandedFactors((prev) => {
                                    const newSet = new Set(prev);
                                    if (allExpanded) {
                                      categoryFactorKeys.forEach((key) => newSet.delete(key));
                                    } else {
                                      categoryFactorKeys.forEach((key) => newSet.add(key));
                                    }
                                    return newSet;
                                  });
                                }}
                                className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                              >
                                {factors.every((f) =>
                                  expandedFactors.has(`${stock.symbol}-${f.key}`)
                                )
                                  ? t.collapseAll
                                  : t.expandAll}
                              </button>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                            {factors.map((factor) => {
                              const factorKey = `${stock.symbol}-${factor.key}`;
                              const isExpanded = expandedFactors.has(factorKey);
                              const factorStatus = getFactorStatus(factor);
                              const statusStyle = getFactorStatusStyle(factorStatus);

                              return (
                                <div
                                  key={factor.key}
                                  className={`overflow-hidden rounded-lg border transition-all ${
                                    isExpanded
                                      ? `${statusStyle.border} ${statusStyle.bg}`
                                      : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
                                  }`}
                                >
                                  {/* 因子头部 */}
                                  <button
                                    onClick={() => toggleFactor(factorKey)}
                                    className="w-full px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                          <span
                                            className={`h-2 w-2 rounded-full ${statusStyle.dot}`}
                                          />
                                          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {factor.name}
                                          </h4>
                                        </div>
                                        <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                                          {factor.status}
                                        </p>
                                      </div>
                                      {isExpanded ? (
                                        <ChevronUp className="h-4 w-4 text-gray-400" />
                                      ) : (
                                        <ChevronDown className="h-4 w-4 text-gray-400" />
                                      )}
                                    </div>
                                  </button>

                                  {/* 因子详情（展开时显示） */}
                                  {isExpanded && (
                                    <div
                                      className={`border-t px-4 py-3 ${statusStyle.border} ${statusStyle.detailBg}`}
                                    >
                                      {/* 看涨信号 */}
                                      {factor.bullish_signals.length > 0 && (
                                        <div className="mb-3">
                                          <div className="mb-2 flex items-center gap-2">
                                            <TrendingUp className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                                            <h5
                                              className={`text-xs font-medium ${statusStyle.detailText}`}
                                            >
                                              {t.bullishSignals}
                                            </h5>
                                          </div>
                                          <ul className="space-y-1.5">
                                            {factor.bullish_signals.map((signal, idx) => (
                                              <li key={idx} className="flex items-start gap-2">
                                                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                                                <span
                                                  className={`text-xs leading-relaxed ${statusStyle.detailText}`}
                                                >
                                                  {signal.message}
                                                </span>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}

                                      {/* 看跌信号 */}
                                      {factor.bearish_signals.length > 0 && (
                                        <div>
                                          <div className="mb-2 flex items-center gap-2">
                                            <TrendingDown className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
                                            <h5
                                              className={`text-xs font-medium ${statusStyle.detailText}`}
                                            >
                                              {t.bearishSignals}
                                            </h5>
                                          </div>
                                          <ul className="space-y-1.5">
                                            {factor.bearish_signals.map((signal, idx) => (
                                              <li key={idx} className="flex items-start gap-2">
                                                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
                                                <span
                                                  className={`text-xs leading-relaxed ${statusStyle.detailText}`}
                                                >
                                                  {signal.message}
                                                </span>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}

                                      {/* 无信号提示 */}
                                      {factor.bullish_signals.length === 0 &&
                                        factor.bearish_signals.length === 0 && (
                                          <p
                                            className={`text-xs italic ${statusStyle.detailText} opacity-70`}
                                          >
                                            {t.noSignals}
                                          </p>
                                        )}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
