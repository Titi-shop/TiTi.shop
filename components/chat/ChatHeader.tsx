"use client";

import Image from "next/image";
import { X } from "lucide-react";

type ChatHeaderProps = {
  onClose: () => void;

  title?: string;

  online?: boolean;
};

export default function ChatHeader({
  onClose,
  title = "TiTi Support",
  online = true,
}: ChatHeaderProps) {
  return (
    <header
      className="
        flex
        items-center
        justify-between
        border-b
        border-[var(--border-color)]
        bg-[var(--card-bg)]
        px-4
        py-3
      "
    >
      <div className="flex items-center gap-3">

        <Image
          src="/avatar.png"
          alt="TiTi"
          width={42}
          height={42}
          className="rounded-full"
        />

        <div>

          <div className="font-semibold">
            {title}
          </div>

          <div
            className="
              flex
              items-center
              gap-2
              text-xs
              text-[var(--text-muted)]
            "
          >
            <span
              className={`
                h-2
                w-2
                rounded-full
                ${
                  online
                    ? "bg-green-500"
                    : "bg-gray-400"
                }
              `}
            />

            <span>
              {online
                ? "Online"
                : "Offline"}
            </span>

          </div>

        </div>

      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close chat"
        className="
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-full
          transition-colors
          hover:bg-black/5
        "
      >
        <X size={20} />
      </button>
    </header>
  );
}
