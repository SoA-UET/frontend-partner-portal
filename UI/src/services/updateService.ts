import { updateClient } from './apiClient';
import {
  UpdateFormData,
  CreateUpdateResponse,
  DeleteUpdateResponse,
  SubmitUpdateResponse,
  SubmitUpdateRequest,
} from '@/types/update.types';

class UpdateService {
  private readonly BASE_URL = '/api/v1/updates';

  /**
   * POST /api/v1/updates/create
   * TP-14: Create new knowledge update draft
   */
  async createUpdate(data: UpdateFormData): Promise<CreateUpdateResponse> {
    const response = await updateClient.post<CreateUpdateResponse>(
      `${this.BASE_URL}/create`,
      data
    );
    return response.data;
  }

  /**
   * DELETE /api/v1/updates/{update_id}
   * TP-15: Delete draft update
   */
  async deleteUpdate(updateId: string): Promise<DeleteUpdateResponse> {
    const response = await updateClient.delete<DeleteUpdateResponse>(
      `${this.BASE_URL}/${updateId}`
    );
    return response.data;
  }

  /**
   * POST /api/v1/updates/{update_id}/submit
   * TP-16: Submit update to Telcenter Core for validation
   */
  async submitUpdate(
    updateId: string,
    data?: SubmitUpdateRequest
  ): Promise<SubmitUpdateResponse> {
    const response = await updateClient.post<SubmitUpdateResponse>(
      `${this.BASE_URL}/${updateId}/submit`,
      data || {}
    );
    return response.data;
  }

  /**
   * GET /api/v1/updates/{update_id}/status
   * Check submission status (implied from H29 status_url)
   */
  async getUpdateStatus(updateId: string): Promise<SubmitUpdateResponse> {
    const response = await updateClient.get<SubmitUpdateResponse>(
      `${this.BASE_URL}/${updateId}/status`
    );
    return response.data;
  }
}

export default new UpdateService();
