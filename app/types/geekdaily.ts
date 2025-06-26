export interface GeekDailyItem {
  id: number;
  attributes: {
    episode: string;
    title: string;
    author: string;
    url: string;
    time: string;
    introduce: string;
  };
}

export interface GeekDailyResponse {
  data: GeekDailyItem[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface GeekDailyParams {
  page?: number;
  pageSize?: number;
  sort?: 'asc' | 'desc';
}