import { GeekDailyResponse, GeekDailyParams } from '@/app/types/geekdaily';

const API_BASE_URL = 'http://101.33.75.240:1337/api/v1';

export async function fetchGeekDailies(params: GeekDailyParams = {}): Promise<GeekDailyResponse> {
  const { page = 1, pageSize = 25, sort = 'desc' } = params;
  
  const url = new URL(`${API_BASE_URL}/geekdailies`);
  url.searchParams.append('pagination[page]', page.toString());
  url.searchParams.append('pagination[pageSize]', pageSize.toString());
  url.searchParams.append('sort', `id:${sort}`);
  
  try {
    const response = await fetch(url.toString(), {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }
    
    const data: GeekDailyResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching geek dailies:', error);
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