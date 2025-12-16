export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
}

export interface ApiError {
  status: string;
  error_code: string;
  message: string;
}

export interface PaginatedResponse<T> {
  status: string;
  data: T[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
}
