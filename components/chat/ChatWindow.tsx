"use client";
import ChatHeader from "./ChatHeader";
type ChatWindowProps = {
  onClose: () => void;
};

export default function ChatWindow({
  onClose,
}: ChatWindowProps) {
  return (
    <aside
      className="
        fixed
        bottom-20
        right-4
        z-[998]

        flex
        h-[520px]
        w-[calc(100vw-24px)]
        max-w-[380px]
        flex-col

        overflow-hidden
        rounded-2xl

        border
        border-[var(--border-color)]

        bg-[var(--card-bg)]

        shadow-2xl

        transition-all
        duration-300
      "
    >
      {/* HEADER */}

   <ChatHeader
  onClose={onClose}
/>

      {/* MESSAGES */}

      <div
        className="
          flex-1
          overflow-y-auto
          p-4
        "
      >
        <div
          className="
            flex
            h-full
            items-center
            justify-center

            text-sm
            text-[var(--text-muted)]
          "
        >
          Chưa có tin nhắn
        </div>
      </div>

      {/* INPUT */}

      <div
        className="
          border-t
          border-[var(--border-color)]

          p-3
        "
      >
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Nhập tin nhắn..."
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
            className="
              rounded-full

              bg-[var(--color-primary)]

              px-5

              text-white
            "
          >
            Gửi
          </button>
        </div>
      </div>
    </aside>
  );
}
