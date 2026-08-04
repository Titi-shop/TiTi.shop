"use client";

import { useState } from "react";
import { SendHorizontal } from "lucide-react";

type ChatInputProps = {
  onSend?: (message: string) => void;
};

export default function ChatInput({
  onSend,
}: ChatInputProps) {
  const [value, setValue] =
    useState("");

  const handleSend = () => {
    const text = value.trim();

    if (!text) {
      return;
    }

    onSend?.(text);

    setValue("");
  };

  return (
    <div
      className="
        border-t
        border-[var(--border-color)]
        bg-[var(--card-bg)]
        p-3
      "
    >
      <div className="flex items-center gap-2">

        <input
          type="text"
          value={value}
          placeholder="Nhập tin nhắn..."
          onChange={(e) =>
            setValue(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
          className="
            flex-1
            rounded-full
            border
            border-[var(--border-color)]
            bg-[var(--background)]
            px-4
            py-2.5
            outline-none
          "
        />

        <button
          type="button"
          onClick={handleSend}
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-full
            bg-[var(--color-primary)]
            text-white
          "
        >
          <SendHorizontal
            size={20}
          />
        </button>

      </div>
    </div>
  );
}
