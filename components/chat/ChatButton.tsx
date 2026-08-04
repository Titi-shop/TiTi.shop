"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";

import ChatWindow from "./ChatWindow";

export interface ChatButtonProps {
  unreadCount?: number;
  disabled?: boolean;
}

export default function ChatButton({
  unreadCount = 0,
  disabled = false,
}: ChatButtonProps) {
  const [open, setOpen] =
    useState(false);

  const badge =
    unreadCount > 99
      ? "99+"
      : unreadCount;

  return (
  <>
    {!open && (
      <button
        type="button"
        aria-label="Open chat"
        title="Chat"
        disabled={disabled}
        onClick={() => setOpen(true)}
        className="
          fixed
          bottom-20
          right-5
          z-[999]
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-full
          bg-[var(--color-primary)]
          text-white
          shadow-xl
          transition-all
          duration-200
          hover:scale-105
          active:scale-95
          disabled:pointer-events-none
          disabled:opacity-60
        "
      >
        <MessageCircle
          size={26}
          strokeWidth={2.2}
        />

        {unreadCount > 0 && (
          <span
            className="
              absolute
              -right-1
              -top-1
              flex
              min-h-5
              min-w-5
              items-center
              justify-center
              rounded-full
              bg-red-500
              px-1
              text-[10px]
              font-bold
              text-white
              ring-2
              ring-[var(--background)]
            "
          >
            {badge}
          </span>
        )}
      </button>
    )}

    {open && (
      <ChatWindow
        onClose={() => setOpen(false)}
      />
    )}
  </>
);
}
