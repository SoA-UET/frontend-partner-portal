import React from 'react';
import { Message } from '@/types/consultation.types';
import { User, Bot, HeadphonesIcon } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isCustomer = message.sender_type === 'CUSTOMER';
  const isAI = message.sender_type === 'AI_AGENT';
  const isHuman = message.sender_type === 'HUMAN_AGENT';

  const getSenderIcon = () => {
    if (isCustomer) return <User size={16} />;
    if (isAI) return <Bot size={16} />;
    if (isHuman) return <HeadphonesIcon size={16} />;
    return null;
  };

  const getSenderName = () => {
    if (isCustomer) return 'Khách hàng';
    if (isAI) return 'AI Agent';
    if (isHuman) return message.sender_name || 'Tư vấn viên';
    return 'Unknown';
  };

  const getBackgroundColor = () => {
    if (isCustomer) return 'bg-gray-100';
    if (isAI) return 'bg-blue-50';
    if (isHuman) return 'bg-green-50';
    return 'bg-gray-100';
  };

  const getBorderColor = () => {
    if (isCustomer) return 'border-gray-200';
    if (isAI) return 'border-blue-200';
    if (isHuman) return 'border-green-200';
    return 'border-gray-200';
  };

  const getEmotionColor = () => {
    if (!message.emotion) return '';
    switch (message.emotion) {
      case 'Positive':
        return 'text-green-600';
      case 'Neutral':
        return 'text-gray-600';
      case 'Negative':
        return 'text-red-600';
      default:
        return '';
    }
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`flex ${isCustomer ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className={`max-w-2xl ${isCustomer ? 'mr-auto' : 'ml-auto'}`}>
        {/* Sender info */}
        <div className={`flex items-center gap-2 mb-1 ${isCustomer ? '' : 'justify-end'}`}>
          <div className="flex items-center gap-1 text-xs text-gray-600">
            {getSenderIcon()}
            <span className="font-medium">{getSenderName()}</span>
          </div>
          <span className="text-xs text-gray-400">{formatTime(message.created_at)}</span>
          {message.emotion && (
            <span className={`text-xs font-medium ${getEmotionColor()}`}>
              {message.emotion}
            </span>
          )}
        </div>

        {/* Message content */}
        <div
          className={`px-4 py-2 rounded-lg border ${getBackgroundColor()} ${getBorderColor()}`}
        >
          <p className="text-sm text-gray-900 whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
