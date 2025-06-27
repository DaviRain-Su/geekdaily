import { GeekDailyResponse, GeekDailyParams } from '@/app/types/geekdaily';

// Determine API URL based on environment
const getApiUrl = () => {
  // Check if we should use the API proxy
  const useProxy = process.env.NEXT_PUBLIC_USE_API_PROXY !== 'false';
  
  // Custom API endpoint from environment variable
  const customEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
  
  // In production or when proxy is enabled
  if (useProxy || process.env.NODE_ENV === 'production') {
    // In browser, use relative URL
    if (typeof window !== 'undefined') {
      return '/api/geekdailies';
    }
    
    // For server-side rendering in production
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}/api/geekdailies`;
    }
    
    // For local development server-side with proxy
    const port = process.env.PORT || 3000;
    return `http://localhost:${port}/api/geekdailies`;
  }
  
  // Use direct API URL (for development without proxy)
  return customEndpoint || 'http://101.33.75.240:1337/api/v1/geekdailies';
};

export async function fetchGeekDailies(params: GeekDailyParams = {}): Promise<GeekDailyResponse> {
  const { page = 1, pageSize = 25, sort = 'desc' } = params;
  
  // Get the appropriate API URL
  const baseUrl = getApiUrl();
  
  // Build URL with proper base
  let url: URL;
  if (baseUrl.startsWith('http')) {
    url = new URL(baseUrl);
  } else {
    // For relative URLs, we need a base
    const base = typeof window !== 'undefined' 
      ? window.location.origin 
      : `http://localhost:${process.env.PORT || 3000}`;
    url = new URL(baseUrl, base);
  }
  
  // Add query parameters
  url.searchParams.append('pagination[page]', page.toString());
  url.searchParams.append('pagination[pageSize]', pageSize.toString());
  url.searchParams.append('sort', `id:${sort}`);
  
  try {
    const response = await fetch(url.toString(), {
      next: { revalidate: 300 }, // Cache for 5 minutes
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }
    
    const data: GeekDailyResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching geek dailies:', error);
    // Provide more helpful error message
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('网络连接失败，请检查您的网络连接');
    }
    throw error;
  }
}

export async function fetchAllPages(maxPages?: number): Promise<GeekDailyResponse['data']> {
  const firstPage = await fetchGeekDailies({ page: 1, pageSize: 100 });
  const allItems = [...firstPage.data];
  
  const totalPages = maxPages ? Math.min(firstPage.meta.pagination.pageCount, maxPages) : firstPage.meta.pagination.pageCount;
  
  if (totalPages > 1) {
    const promises = [];
    for (let page = 2; page <= totalPages; page++) {
      promises.push(fetchGeekDailies({ page, pageSize: 100 }));
    }
    
    const results = await Promise.all(promises);
    results.forEach(result => {
      allItems.push(...result.data);
    });
  }
  
  return allItems;
}