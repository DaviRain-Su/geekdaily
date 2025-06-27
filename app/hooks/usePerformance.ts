import { useEffect } from 'react';

export function usePerformance() {
  useEffect(() => {
    // Track page load performance
    const trackPageLoad = () => {
      if (typeof window !== 'undefined' && 'performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigation) {
          const metrics = {
            // Core Web Vitals
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
            
            // Additional metrics
            domInteractive: navigation.domInteractive - navigation.fetchStart,
            dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
            tcpConnection: navigation.connectEnd - navigation.connectStart,
            serverResponse: navigation.responseEnd - navigation.requestStart,
            
            // Total page load time
            totalPageLoad: navigation.loadEventEnd - navigation.fetchStart,
          };
          
          // Log to console in development
          if (process.env.NODE_ENV === 'development') {
            console.group('🚀 Performance Metrics');
            console.log('DOM Content Loaded:', `${metrics.domContentLoaded}ms`);
            console.log('Load Complete:', `${metrics.loadComplete}ms`);
            console.log('DOM Interactive:', `${metrics.domInteractive}ms`);
            console.log('DNS Lookup:', `${metrics.dnsLookup}ms`);
            console.log('TCP Connection:', `${metrics.tcpConnection}ms`);
            console.log('Server Response:', `${metrics.serverResponse}ms`);
            console.log('Total Page Load:', `${metrics.totalPageLoad}ms`);
            console.groupEnd();
          }
        }
      }
    };

    // Track when page is fully loaded
    if (document.readyState === 'complete') {
      trackPageLoad();
    } else {
      window.addEventListener('load', trackPageLoad);
      return () => window.removeEventListener('load', trackPageLoad);
    }
  }, []);

  // Function to manually track custom events
  const trackEvent = (eventName: string, data?: Record<string, any>) => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const timestamp = performance.now();
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`📊 Event: ${eventName}`, { timestamp, ...data });
      }
    }
  };

  return { trackEvent };
}