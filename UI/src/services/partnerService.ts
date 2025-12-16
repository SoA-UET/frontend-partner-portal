import apiClient from './apiClient';
import {
  PartnerInfoResponse,
  UpdatePartnerInfoRequest,
  CoreConnectionTestRequest,
  CoreConnectionTestResponse,
} from '@/types/partner.types';

class PartnerService {
  private readonly PARTNER_BASE = '/api/partner';

  /**
   * H25 Endpoint 1: GET /api/partner/info
   * Get current partner general information
   */
  async getPartnerInfo(): Promise<PartnerInfoResponse> {
    const response = await apiClient.get<PartnerInfoResponse>(
      `${this.PARTNER_BASE}/info`
    );
    return response.data;
  }

  /**
   * H25 Endpoint 2: PATCH /api/partner/info
   * Update partner general information
   */
  async updatePartnerInfo(data: UpdatePartnerInfoRequest): Promise<PartnerInfoResponse> {
    const response = await apiClient.patch<PartnerInfoResponse>(
      `${this.PARTNER_BASE}/info`,
      data
    );
    return response.data;
  }

  /**
   * H26 Endpoint: POST /api/partner/core-connection/test
   * Test the connection to Telcenter Core
   */
  async testCoreConnection(data: CoreConnectionTestRequest): Promise<CoreConnectionTestResponse> {
    const response = await apiClient.post<CoreConnectionTestResponse>(
      `${this.PARTNER_BASE}/core-connection/test`,
      data
    );
    return response.data;
  }
}

export default new PartnerService();
