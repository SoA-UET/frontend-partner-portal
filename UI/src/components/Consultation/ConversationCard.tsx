import React from 'react';
import { Conversation } from '@/types/consultation.types';
import { MessageSquare, Star } from 'lucide-react';

interface ConversationCardProps {
  conversation: Conversation;
  onClick: () => void;
}

const ConversationCard: React.FC<ConversationCardProps> = ({
  conversation,
  onClick,
}) => {
  const getStatusBadge = () => {
    const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
      AI_AGENT_TEXTING: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'AI Text' },
      AI_AGENT_CALLING: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'AI Call' },
      FORWARDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Đang chuyển' },
      HUMAN_AGENT_TEXTING: { bg: 'bg-green-100', text: 'text-green-800', label: 'Chat' },
      HUMAN_AGENT_CALLING: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Gọi' },
    };

    const style = statusStyles[conversation.status] || {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      label: conversation.status,
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${style.bg} ${style.text}`}>
        {style.label}
      </span>
    );
  };

  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4 cursor-pointer border border-gray-200"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 flex-1">
          <MessageSquare className="text-blue-600" size={20} />
          <h3 className="text-base font-semibold text-gray-900 truncate">
            {conversation.title}
          </h3>
        </div>
        {getStatusBadge()}
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <p className="line-clamp-2">{conversation.summary}</p>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <Star className="text-yellow-500 fill-yellow-500" size={16} />
            <span className="font-medium">{conversation.customer_satisfaction}/5</span>
          </div>
          <span className="text-xs text-gray-500">
            {formatDateTime(conversation.updated_at)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ConversationCard;
