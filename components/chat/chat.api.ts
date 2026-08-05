import { apiAuthFetch } from "@/lib/api/apiAuthFetch";

import type {
  ChatMessage,
  ChatMessagesResponse,
  ChatRoomResponse,
  SendMessageRequest,
  SendMessageResponse,
} from "./chat.types";

/* =========================================================
   LOAD ROOM
========================================================= */

export async function fetchChatRoom(): Promise<ChatRoomResponse> {
  const res = await apiAuthFetch(
    "/api/chat/room"
  );

  if (!res.ok) {
    throw new Error(
      "LOAD_ROOM_FAILED"
    );
  }

  const data: ChatRoomResponse =
    await res.json();

  return data;
}

/* =========================================================
   LOAD MESSAGES
========================================================= */

export async function fetchChatMessages(
  roomId: string
): Promise<ChatMessage[]> {
  const res = await apiAuthFetch(
    `/api/chat/messages?roomId=${roomId}`
  );

  if (!res.ok) {
    throw new Error(
      "LOAD_MESSAGES_FAILED"
    );
  }

  const data: ChatMessagesResponse =
    await res.json();

  return data.messages ?? [];
}

/* =========================================================
   SEND MESSAGE
========================================================= */

export async function sendChatMessage(
  payload: SendMessageRequest
): Promise<ChatMessage> {
  const res = await apiAuthFetch(
    "/api/chat/messages",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(
        payload
      ),
    }
  );

  if (!res.ok) {
    throw new Error(
      "SEND_MESSAGE_FAILED"
    );
  }

  const data: SendMessageResponse =
    await res.json();

  return data.message;
}