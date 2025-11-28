'use client';

import { TrendingUp, TrendingDown, Shield, Activity, Brain } from 'lucide-react';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export interface StockData {
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

interface StockCardProps {
  stockData: StockData;
  translations: {
    analysisScore: string;
    stopLoss: string;
    trendStatus: string;
    fearGreedIndex: string;
    bullishSignals: string;
    bearishSignals: string;
    noSignals: string;
  };
}

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

export default function StockCard({ stockData, translations: t }: StockCardProps) {
  const currentTheme = getThemeStyles(stockData.score);
  const fearGreedTheme = getThemeStyles(stockData.fear_greed_index);

  return (
    <div className="flex h-auto w-full max-w-full min-w-0 flex-col overflow-hidden rounded-[2rem] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:bg-gray-800 dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.3)]">
      {/* 头部：股票代码与建议横幅 */}
      <div className="p-8 pb-0">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-5xl font-extralight tracking-tight text-gray-900 dark:text-gray-100">
            {stockData.symbol}
          </h2>
          <div className="text-right">
            <p className="text-2xl font-light text-gray-900 dark:text-gray-100">
              ${stockData.price.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* 建议 Banner - 全宽、柔和背景色 */}
      <div className={`w-full px-8 py-4 ${currentTheme.bg} flex items-center justify-center`}>
        <p className={`text-lg font-medium ${currentTheme.text}`}>{stockData.advice}</p>
      </div>

      {/* 核心指标区域 */}
      <div className="grid grid-cols-1 items-center gap-8 border-b border-gray-100 p-8 xl:grid-cols-12 dark:border-gray-700">
        {/* 左侧：大圆环评分 */}
        <div className="flex flex-col items-center justify-center py-4 xl:col-span-5">
          <div className="h-40 w-40">
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
                <p className="text-5xl font-thin text-gray-900 dark:text-gray-100">
                  {stockData.score}
                </p>
              </div>
            </CircularProgressbarWithChildren>
          </div>
          <p className="mt-4 text-sm font-medium tracking-wide text-gray-500 dark:text-gray-400">
            {t.analysisScore}
          </p>
        </div>

        {/* 右侧：关键数据指标 - 使用更细的图标和字体 */}
        <div className="space-y-6 py-4 xl:col-span-7 xl:border-l xl:border-gray-100 xl:pl-8 dark:xl:border-gray-700">
          {/* 建议止损 */}
          <div>
            <div className="mb-2 flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Shield className="h-4 w-4" strokeWidth={1.5} />
              <p className="text-xs font-medium">{t.stopLoss}</p>
            </div>
            <p className="text-2xl font-light text-gray-900 dark:text-gray-100">
              ${stockData.stop_loss_price.toFixed(2)}
            </p>
          </div>

          {/* 趋势状态 */}
          <div>
            <div className="mb-2 flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Activity className="h-4 w-4" strokeWidth={1.5} />
              <p className="text-xs font-medium">{t.trendStatus}</p>
            </div>
            <p className="text-xl font-normal text-gray-900 dark:text-gray-100">
              {stockData.trend_status}
            </p>
          </div>

          {/* 恐惧贪婪 - 简化版 */}
          <div className="border-t border-gray-50 pt-6 dark:border-gray-700">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Brain className="h-4 w-4" strokeWidth={1.5} />
                <p className="text-xs font-medium">{t.fearGreedIndex}</p>
              </div>
              <span className={`text-sm font-medium ${fearGreedTheme.text}`}>
                {stockData.fear_greed_label}
              </span>
            </div>
            {/* 极简进度条 */}
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${stockData.fear_greed_index}%`,
                  backgroundColor: fearGreedTheme.ring,
                }}
              />
            </div>
            <p className="mt-1 text-right text-sm font-light text-gray-900 dark:text-gray-100">
              {stockData.fear_greed_index.toFixed(1)}
            </p>
          </div>
        </div>
      </div>

      {/* 底部：信号列表 - 双栏布局，使用小圆点替代大图标 */}
      <div className="relative mt-auto grid grid-cols-1 gap-8 bg-gray-50/50 p-8 xl:grid-cols-2 dark:bg-gray-900/50">
        {/* 中间分割线 */}
        <div className="absolute top-8 bottom-8 left-1/2 hidden w-px bg-gray-200 xl:block dark:bg-gray-700"></div>

        {/* 看涨信号 */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-600" strokeWidth={2} />
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {t.bullishSignals}
            </h3>
          </div>
          {stockData.bullish_signals.length > 0 ? (
            <ul className="space-y-3">
              {stockData.bullish_signals.map((signal, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  {/* 极简小圆点 */}
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  <span className="text-sm leading-relaxed font-light text-gray-600 dark:text-gray-300">
                    {signal}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400 italic dark:text-gray-500">{t.noSignals}</p>
          )}
        </div>

        {/* 看跌信号 */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-rose-600" strokeWidth={2} />
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {t.bearishSignals}
            </h3>
          </div>
          {stockData.bearish_signals.length > 0 ? (
            <ul className="space-y-3">
              {stockData.bearish_signals.map((signal, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
                  <span className="text-sm leading-relaxed font-light text-gray-600 dark:text-gray-300">
                    {signal}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400 italic dark:text-gray-500">{t.noSignals}</p>
          )}
        </div>
      </div>
    </div>
  );
}
