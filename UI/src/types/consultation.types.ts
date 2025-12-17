// Types for S13 - Partner Consultation Service (H31)

// Conversation status
export type ConversationStatus =
  | 'AI_AGENT_TEXTING'
  | 'AI_AGENT_CALLING'
  | 'FORWARDING'
  | 'HUMAN_AGENT_TEXTING'
  | 'HUMAN_AGENT_CALLING';

// Sender type
export type SenderType = 'CUSTOMER' | 'AI_AGENT' | 'HUMAN_AGENT';

// Emotion
export type Emotion = 'Positive' | 'Neutral' | 'Negative';

// Conversation (simplified for list)
export interface ConversationListItem {
  id: string;
  title: string;
}

// Full conversation details
export interface Conversation {
  id: string;
  title: string;
  customer_id: string;
  status: ConversationStatus;
  partner_id: string;
  customer_satisfaction: number; // 1-5
  summary: string;
  created_at: string; // ISO 8601
  updated_at: string;
}

// Message
export interface Message {
  id: string;
  conversation_id: string;
  sender_type: SenderType;
  sender_id?: string; // Only for HUMAN_AGENT
  sender_name?: string; // Only for HUMAN_AGENT
  content: string;
  emotion?: Emotion;
  created_at: string; // ISO 8601
}

// API responses
export interface ConversationListResponse {
  content: ConversationListItem[];
}

export interface ConversationDetailResponse {
  content: Conversation;
}

export interface MessageListResponse {
  content: Message[];
}

export interface MessageCreateRequest {
  content: string;
}

export interface MessageCreateResponse {
  content: Message;
}

// Socket.IO event payloads

// Text message event
export interface NewMessageEvent {
  conversation_id: string;
  timestamp: number; // Unix timestamp in ms
  sender_type: SenderType;
  content: string;
}

// Consultation request event (Server → Client)
export interface ConsultationRequestEvent {
  conversation_id: string;
  title: string;
  customer_satisfaction: number;
  summary: string;
}

// Consultation response event (Client → Server)
export interface ConsultationResponseEvent {
  conversation_id: string;
  accepted: boolean;
}

// Call events
export interface IncomingCallEvent {
  conversation_id: string;
}

export interface CallPickupEvent {
  conversation_id: string;
}

export interface CallEndEvent {
  conversation_id: string;
}

// Audio events
export interface AudioStartEvent {
  conversation_id: string;
}

export interface AudioChunkEvent {
  conversation_id: string;
  timestamp: number; // Unix timestamp in ms
  audio: ArrayBuffer; // Exactly 640 bytes PCM
}

export interface AudioStopEvent {
  conversation_id: string;
}

// Query params
export interface MessageQueryParams {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
}
