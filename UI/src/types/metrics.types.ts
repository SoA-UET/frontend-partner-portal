// Types for S14 - Partner Metrics Service (H30)

// Common response wrapper
export interface MetricsResponse<T> {
  status: 'success';
  data?: T;
}

// Date range for queries
export interface DateRange {
  from_date?: string; // ISO 8601 format
  to_date?: string;   // ISO 8601 format
}

// H30.1: GET /api/v1/partner/metrics/conversations
export interface ConversationMetrics {
  total_conversations: number;
  texting_conversations: number;
  calling_conversations: number;
  from_date: string;
  to_date: string;
}

export interface ConversationMetricsResponse {
  status: 'success';
  total_conversations: number;
  texting_conversations: number;
  calling_conversations: number;
  from_date: string;
  to_date: string;
}

// H30.2: GET /api/v1/partner/metrics/satisfaction-rate
export interface SatisfactionDistribution {
  satisfaction_1: number;
  satisfaction_2: number;
  satisfaction_3: number;
  satisfaction_4: number;
  satisfaction_5: number;
}

export interface SatisfactionMetrics {
  total_conversations: number;
  satisfaction_distribution: SatisfactionDistribution;
  average_rating: number;
  from_date: string;
  to_date: string;
}

export interface SatisfactionMetricsResponse {
  status: 'success';
  total_conversations: number;
  satisfaction_distribution: SatisfactionDistribution;
  average_rating: number;
  from_date: string;
  to_date: string;
}

// H30.3: GET /api/v1/partner/metrics/offload-rate
export interface OffloadMetrics {
  total_conversations: number;
  ai_failed_conversation: number;
  offloaded_conversations: number;
  offload_rate_percentage: number;
  from_date: string;
  to_date: string;
}

export interface OffloadMetricsResponse {
  status: 'success';
  total_conversations: number;
  ai_failed_conversation: number;
  offloaded_conversations: number;
  offload_rate_percentage: number;
  from_date: string;
  to_date: string;
}

// Error response
export interface MetricsErrorResponse {
  status: 'error';
  error_code: string;
  message: string;
  details?: string;
}

// Combined metrics for dashboard
export interface DashboardMetrics {
  conversations?: ConversationMetrics;
  satisfaction?: SatisfactionMetrics;
  offload?: OffloadMetrics;
}
