import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import consultationService from '@/services/consultationService';
import { Conversation, Message } from '@/types/consultation.types';
import MessageBubble from '@/components/Consultation/MessageBubble';
import {
  ArrowLeft,
  Send,
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Star,
} from 'lucide-react';

const ConversationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (id) {
      loadConversation();
      loadMessages();
    }
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversation = async () => {
    if (!id) return;
    try {
      const response = await consultationService.getConversation(id);
      setConversation(response.content);
    } catch (error) {
      console.error('Error loading conversation:', error);
      // Mock data
      setConversation({
        id: id,
        title: 'Tư vấn gói cước 4G',
        customer_id: 'cust_123',
        status: 'HUMAN_AGENT_TEXTING',
        partner_id: 'partner_viettel',
        customer_satisfaction: 4,
        summary: 'Khách hàng hỏi về gói cước 4G giá rẻ cho sinh viên',
        created_at: '2025-12-17T10:30:00Z',
        updated_at: '2025-12-17T11:45:00Z',
      });
    }
  };

  const loadMessages = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const response = await consultationService.getMessages(id);
      setMessages(response.content);
    } catch (error) {
      console.error('Error loading messages:', error);
      // Mock data
      setMessages([
        {
          id: 'msg_001',
          conversation_id: id,
          sender_type: 'CUSTOMER',
          content: 'Xin chào, em muốn hỏi về gói cước 4G dành cho sinh viên ạ',
          emotion: 'Neutral',
          created_at: '2025-12-17T10:30:00Z',
        },
        {
          id: 'msg_002',
          conversation_id: id,
          sender_type: 'AI_AGENT',
          content: 'Chào bạn! Hiện tại chúng tôi có các gói cước 4G dành cho sinh viên như sau:\n- Gói ST70: 4GB/ngày, giá 70.000đ/tháng\n- Gói ST90: 6GB/ngày, giá 90.000đ/tháng',
          created_at: '2025-12-17T10:30:15Z',
        },
        {
          id: 'msg_003',
          conversation_id: id,
          sender_type: 'CUSTOMER',
          content: 'Cho em hỏi gói ST70 có miễn phí gọi nội mạng không ạ?',
          emotion: 'Positive',
          created_at: '2025-12-17T10:31:00Z',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !id || isSending) return;

    try {
      setIsSending(true);
      const response = await consultationService.sendMessage(id, {
        content: messageInput,
      });
      
      // Add message to list
      setMessages((prev) => [...prev, response.content]);
      setMessageInput('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Không thể gửi tin nhắn. Vui lòng thử lại.');
    } finally {
      setIsSending(false);
    }
  };

  const handlePickupCall = () => {
    // TODO: Implement Socket.IO call pickup
    setIsInCall(true);
    alert('Tính năng gọi thoại sẽ được triển khai với Socket.IO');
  };

  const handleEndCall = () => {
    // TODO: Implement Socket.IO call end
    setIsInCall(false);
    setIsMuted(true);
  };

  const toggleMute = () => {
    // TODO: Implement Socket.IO audio control
    setIsMuted(!isMuted);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getStatusBadge = () => {
    if (!conversation) return null;

    const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
      AI_AGENT_TEXTING: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'AI Text' },
      AI_AGENT_CALLING: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'AI Call' },
      FORWARDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Đang chuyển' },
      HUMAN_AGENT_TEXTING: { bg: 'bg-green-100', text: 'text-green-800', label: 'Đang chat' },
      HUMAN_AGENT_CALLING: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Đang gọi' },
    };

    const style = statusStyles[conversation.status] || {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      label: conversation.status,
    };

    return (
      <span className={`px-3 py-1 text-sm font-medium rounded-full ${style.bg} ${style.text}`}>
        {style.label}
      </span>
    );
  };

  if (isLoading && !conversation) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Đang tải cuộc hội thoại...</div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Không tìm thấy cuộc hội thoại</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/consultations')}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900">
              {conversation.title}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              {getStatusBadge()}
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Star className="text-yellow-500 fill-yellow-500" size={14} />
                <span>{conversation.customer_satisfaction}/5</span>
              </div>
            </div>
          </div>

          {/* Call Controls */}
          {conversation.status === 'HUMAN_AGENT_CALLING' && (
            <div className="flex items-center gap-2">
              {!isInCall ? (
                <button
                  onClick={handlePickupCall}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
                >
                  <Phone size={20} />
                  Nghe máy (TP-18)
                </button>
              ) : (
                <>
                  <button
                    onClick={toggleMute}
                    className={`p-2 rounded-md ${
                      isMuted
                        ? 'bg-gray-200 text-gray-600'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                  </button>
                  <button
                    onClick={handleEndCall}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2"
                  >
                    <PhoneOff size={20} />
                    Kết thúc
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input (TP-17) */}
      {conversation.status === 'HUMAN_AGENT_TEXTING' && (
        <div className="bg-white border-t border-gray-200 p-4">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Nhập tin nhắn..."
              disabled={isSending}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
            <button
              type="submit"
              disabled={isSending || !messageInput.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send size={20} />
              {isSending ? 'Đang gửi...' : 'Gửi'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ConversationDetail;
