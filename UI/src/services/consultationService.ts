import { consultationClient } from './apiClient';
import {
  ConversationListResponse,
  ConversationDetailResponse,
  MessageListResponse,
  MessageCreateRequest,
  MessageCreateResponse,
  MessageQueryParams,
} from '@/types/consultation.types';

class ConsultationService {
  private readonly BASE_URL = '/api/v1/conversations';

  /**
   * GET /api/v1/conversations
   * Get all past conversations (TP-21)
   */
  async getConversations(): Promise<ConversationListResponse> {
    const response = await consultationClient.get<ConversationListResponse>(
      this.BASE_URL
    );
    return response.data;
  }

  /**
   * GET /api/v1/conversations/{conversation_id}
   * Get details of a conversation
   */
  async getConversation(conversationId: string): Promise<ConversationDetailResponse> {
    const response = await consultationClient.get<ConversationDetailResponse>(
      `${this.BASE_URL}/${conversationId}`
    );
    return response.data;
  }

  /**
   * GET /api/v1/conversations/{conversation_id}/messages
   * Get message history with pagination
   */
  async getMessages(
    conversationId: string,
    params?: MessageQueryParams
  ): Promise<MessageListResponse> {
    const response = await consultationClient.get<MessageListResponse>(
      `${this.BASE_URL}/${conversationId}/messages`,
      { params }
    );
    return response.data;
  }

  /**
   * POST /api/v1/conversations/{conversation_id}/messages
   * Send a text message from consultant to customer (TP-17)
   */
  async sendMessage(
    conversationId: string,
    data: MessageCreateRequest
  ): Promise<MessageCreateResponse> {
    const response = await consultationClient.post<MessageCreateResponse>(
      `${this.BASE_URL}/${conversationId}/messages`,
      data
    );
    return response.data;
  }
}

export default new ConsultationService();
