"use client";

import { MessageCircle } from "lucide-react";

type ChatButtonProps = {
  onClick?: () => void;
};

export default function ChatButton({
  onClick,
}: ChatButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Chat"
      className="
        fixed
        bottom-5
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
        hover:scale-105
        active:scale-95
      "
    >
      <MessageCircle
        size={26}
        strokeWidth={2.2}
      />
    </button>
  );
}
