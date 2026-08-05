"use client";

export interface ChatMessage {
  id: string;
  room_id: string;
  sender_id: string;
  message_type: string;
  content: string;
  created_at: string;
}

export interface ChatRoom {
  id: string;
}

export interface ChatRoomResponse {
  room: ChatRoom;
  messages: ChatMessage[];
}

export interface ChatMessagesResponse {
  messages: ChatMessage[];
}

export interface SendMessageRequest {
  roomId: string;
  content: string;
}

export interface SendMessageResponse {
  message: ChatMessage;
}