'use client';

import { useState, useEffect } from 'react';

interface PerformanceData {
  memory?: {
    used: number;
    total: number;
  };
  timing?: {
    domContentLoaded: number;
    loadComplete: number;
    firstPaint: number;
    firstContentfulPaint: number;
  };
  networkInfo?: {
    effectiveType: string;
    downlink: number;
    rtt: number;
  };
}

export default function PerformancePanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [performanceData, setPerformanceData] = useState<PerformanceData>({});

  useEffect(() => {
    if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') {
      return;
    }

    const updatePerformanceData = () => {
      const data: PerformanceData = {};

      // Memory information
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        data.memory = {
          used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
          total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
        };
      }

      // Timing information
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        data.timing = {
          domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart),
          loadComplete: Math.round(navigation.loadEventEnd - navigation.fetchStart),
          firstPaint: 0,
          firstContentfulPaint: 0,
        };

        // Paint timing
        const paintEntries = performance.getEntriesByType('paint');
        paintEntries.forEach((entry) => {
          if (entry.name === 'first-paint') {
            data.timing!.firstPaint = Math.round(entry.startTime);
          } else if (entry.name === 'first-contentful-paint') {
            data.timing!.firstContentfulPaint = Math.round(entry.startTime);
          }
        });
      }

      // Network information
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        data.networkInfo = {
          effectiveType: connection.effectiveType || 'unknown',
          downlink: connection.downlink || 0,
          rtt: connection.rtt || 0,
        };
      }

      setPerformanceData(data);
    };

    updatePerformanceData();
    const interval = setInterval(updatePerformanceData, 5000);

    return () => clearInterval(interval);
  }, []);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full shadow-lg transition-colors"
        title="性能监控"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute bottom-12 left-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-4 w-80 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              性能监控
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            {/* Memory Usage */}
            {performanceData.memory && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  内存使用
                </h4>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span>已使用:</span>
                    <span className="font-mono">{performanceData.memory.used} MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>总计:</span>
                    <span className="font-mono">{performanceData.memory.total} MB</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(performanceData.memory.used / performanceData.memory.total) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Page Load Timing */}
            {performanceData.timing && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  页面加载时间
                </h4>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span>DOM就绪:</span>
                    <span className="font-mono">{performanceData.timing.domContentLoaded}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>完全加载:</span>
                    <span className="font-mono">{performanceData.timing.loadComplete}ms</span>
                  </div>
                  {performanceData.timing.firstPaint > 0 && (
                    <div className="flex justify-between">
                      <span>首次绘制:</span>
                      <span className="font-mono">{performanceData.timing.firstPaint}ms</span>
                    </div>
                  )}
                  {performanceData.timing.firstContentfulPaint > 0 && (
                    <div className="flex justify-between">
                      <span>首次内容绘制:</span>
                      <span className="font-mono">{performanceData.timing.firstContentfulPaint}ms</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Network Information */}
            {performanceData.networkInfo && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  网络信息
                </h4>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span>网络类型:</span>
                    <span className="font-mono">{performanceData.networkInfo.effectiveType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>下行速度:</span>
                    <span className="font-mono">{performanceData.networkInfo.downlink} Mbps</span>
                  </div>
                  <div className="flex justify-between">
                    <span>RTT:</span>
                    <span className="font-mono">{performanceData.networkInfo.rtt}ms</span>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                🚀 开发模式性能监控
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}