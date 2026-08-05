"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useAuth } from "@/context/AuthContext";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

import type { ChatMessage } from "./chat.types";

import {
  fetchChatRoom,
  fetchChatMessages,
  sendChatMessage,
} from "./chat.api";

type ChatWindowProps = {
  onClose: () => void;
};

export default function ChatWindow({
  onClose,
}: ChatWindowProps) {
  const {
    user,
    loading,
  } = useAuth();

  const [roomId, setRoomId] =
    useState<string | null>(null);

  const [messages, setMessages] =
    useState<ChatMessage[]>([]);

  const bottomRef =
    useRef<HTMLDivElement>(null);

  const [loadingRoom, setLoadingRoom] =
  useState(true);
  const [sending, setSending] =
  useState(false);
  /* ==========================================
     LOAD MESSAGES
  ========================================== */

  async function loadMessages(
    roomId: string
  ) {
    try {
      const newMessages =
  await fetchChatMessages(
    roomId
  );

      setMessages((old) => {
        if (
          old.length ===
            newMessages.length &&
          old.at(-1)?.id ===
            newMessages.at(-1)?.id
        ) {
          return old;
        }

        return newMessages;
      });
    } catch (err) {
      console.error(
        "[CHAT][LOAD]",
        err
      );
    }
  }

  /* ==========================================
     LOAD ROOM
  ========================================== */

  async function loadRoom() {
  setLoadingRoom(true);

  try {
    const data = await fetchChatRoom();
    setRoomId(
      data.room.id
    );

    setMessages(
      data.messages ?? []
    );

  } catch (err) {
    console.error(
      "[CHAT][ROOM]",
      err
    );
  } finally {
    setLoadingRoom(false);
  }
}
    /* ==========================================
     SEND MESSAGE
  ========================================== */

  async function handleSend(
  content: string
) {
  if (
    !roomId ||
    !user ||
    sending
  ) {
    return;
  }

  const text =
    content.trim();

  if (!text) {
    return;
  }

  setSending(true);

    const optimisticMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      room_id: roomId,
      sender_id: user.id,
      message_type: "text",
      content: text,
      created_at:
        new Date().toISOString(),
    };

    setMessages((prev) => [
      ...prev,
      optimisticMessage,
    ]);

    try {
  const message =
  await sendChatMessage({
    roomId,
    content: text,
  });


  setMessages((prev) =>
  prev.map((item) =>
    item.id === optimisticMessage.id
      ? message
      : item
  )
);

  await loadMessages(roomId);

} catch (err) {
  setMessages((prev) =>
    prev.filter(
      (message) =>
        message.id !==
        optimisticMessage.id
    )
  );

  console.error(
    "[CHAT][SEND]",
    err
  );

} finally {
  setSending(false);
}
}

  /* ==========================================
     LOAD ROOM
  ========================================== */

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      return;
    }

    void loadRoom();
  }, [
    loading,
    user,
  ]);

  /* ==========================================
     POLLING
  ========================================== */

  useEffect(() => {
    if (!roomId) {
      return;
    }

    const timer =
      setInterval(() => {
        if (
          document.visibilityState ===
          "visible"
        ) {
          void loadMessages(
            roomId
          );
        }
      }, 2000);

    return () => {
      clearInterval(timer);
    };
  }, [roomId]);

  /* ==========================================
     AUTO SCROLL
  ========================================== */

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);
    return (
    <aside
  className="
    fixed
    bottom-20
    right-4
    z-[1000]

    flex
    h-[560px]
    w-[calc(100vw-24px)]
    max-w-[390px]
    flex-col

    overflow-hidden

    rounded-3xl

    border
    border-slate-200

    bg-white

    ring-1
    ring-black/5

    shadow-[0_24px_64px_rgba(15,23,42,0.18)]

    transition-all
    duration-300
  "
>
      {/* =========================
          HEADER
      ========================== */}

      <ChatHeader
        onClose={onClose}
      />

      {/* =========================
          MESSAGE LIST
      ========================== */}

      <div
        className="
          flex
          flex-1
          flex-col
          overflow-hidden
        "
      >
        {loadingRoom ? (
  <div
    className="
      flex
      flex-1
      items-center
      justify-center
      text-sm
      text-[var(--text-muted)]
    "
  >
    Đang tải cuộc trò chuyện...
  </div>
) : (
  <ChatMessages
    messages={messages}
    currentUserId={user?.id}
  />
)}

        <div ref={bottomRef} />
      </div>

      {/* =========================
          INPUT
      ========================== */}
<ChatInput
  disabled={
    loadingRoom ||
    !roomId ||
    sending
  }
  onSend={handleSend}
/>
    </aside>
  );
}