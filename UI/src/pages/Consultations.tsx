import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import consultationService from '@/services/consultationService';
import { Conversation } from '@/types/consultation.types';
import ConversationCard from '@/components/Consultation/ConversationCard';
import { MessageSquare } from 'lucide-react';

const Consultations: React.FC = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      const response = await consultationService.getConversations();
      
      // Fetch full details for each conversation
      const detailedConversations = await Promise.all(
        response.content.map(async (item) => {
          const detail = await consultationService.getConversation(item.id);
          return detail.content;
        })
      );
      
      setConversations(detailedConversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
      
      // Mock data for development
      setConversations([
        {
          id: 'conv_001',
          title: 'Tư vấn gói cước 4G',
          customer_id: 'cust_123',
          status: 'HUMAN_AGENT_TEXTING',
          partner_id: 'partner_viettel',
          customer_satisfaction: 4,
          summary: 'Khách hàng hỏi về gói cước 4G giá rẻ cho sinh viên',
          created_at: '2025-12-17T10:30:00Z',
          updated_at: '2025-12-17T11:45:00Z',
        },
        {
          id: 'conv_002',
          title: 'Hỗ trợ đổi SIM 5G',
          customer_id: 'cust_456',
          status: 'FORWARDING',
          partner_id: 'partner_viettel',
          customer_satisfaction: 3,
          summary: 'Khách hàng muốn đổi từ SIM 4G sang 5G',
          created_at: '2025-12-17T09:15:00Z',
          updated_at: '2025-12-17T09:20:00Z',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConversationClick = (conversationId: string) => {
    navigate(`/consultations/${conversationId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Đang tải danh sách tư vấn...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Lịch sử tư vấn</h1>
        <p className="mt-1 text-sm text-gray-500">
          TP-21: Xem các phiên tư vấn được chuyển tiếp từ Core
        </p>
      </div>

      {/* Conversations List */}
      {conversations.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Chưa có phiên tư vấn nào
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Các cuộc hội thoại được chuyển từ Core sẽ hiển thị ở đây
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {conversations.map((conversation) => (
            <ConversationCard
              key={conversation.id}
              conversation={conversation}
              onClick={() => handleConversationClick(conversation.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Consultations;
