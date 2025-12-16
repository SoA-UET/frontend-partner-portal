import { metricsClient } from './apiClient';
import {
  ConversationMetricsResponse,
  SatisfactionMetricsResponse,
  OffloadMetricsResponse,
  DateRange,
} from '@/types/metrics.types';

class MetricsService {
  private readonly BASE_URL = '/api/v1/partner/metrics';

  /**
   * H30.1: GET /api/v1/partner/metrics/conversations
   * Get conversation statistics (total, texting, calling)
   */
  async getConversationMetrics(params?: DateRange): Promise<ConversationMetricsResponse> {
    const response = await metricsClient.get<ConversationMetricsResponse>(
      `${this.BASE_URL}/conversations`,
      { params }
    );
    return response.data;
  }

  /**
   * H30.2: GET /api/v1/partner/metrics/satisfaction-rate
   * Get customer satisfaction distribution and average rating
   */
  async getSatisfactionMetrics(params?: DateRange): Promise<SatisfactionMetricsResponse> {
    const response = await metricsClient.get<SatisfactionMetricsResponse>(
      `${this.BASE_URL}/satisfaction-rate`,
      { params }
    );
    return response.data;
  }

  /**
   * H30.3: GET /api/v1/partner/metrics/offload-rate
   * Get consultation offload rate
   */
  async getOffloadMetrics(params?: DateRange): Promise<OffloadMetricsResponse> {
    const response = await metricsClient.get<OffloadMetricsResponse>(
      `${this.BASE_URL}/offload-rate`,
      { params }
    );
    return response.data;
  }

  /**
   * Fetch all metrics at once
   */
  async getAllMetrics(params?: DateRange): Promise<{
    conversations: ConversationMetricsResponse;
    satisfaction: SatisfactionMetricsResponse;
    offload: OffloadMetricsResponse;
  }> {
    const [conversations, satisfaction, offload] = await Promise.all([
      this.getConversationMetrics(params),
      this.getSatisfactionMetrics(params),
      this.getOffloadMetrics(params),
    ]);

    return { conversations, satisfaction, offload };
  }
}

export default new MetricsService();
