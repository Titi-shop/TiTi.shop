"use client";

type ChatWindowProps = {
  onClose: () => void;
};

export default function ChatWindow({
  onClose,
}: ChatWindowProps) {
  return (
    <div
      className="
        fixed
        bottom-36
        right-5
        z-[998]
        flex
        h-[600px]
        w-[380px]
        flex-col
        overflow-hidden
        rounded-2xl
        border
        border-[var(--border-color)]
        bg-[var(--card-bg)]
        shadow-2xl
      "
    >
      {/* Header */}

      <div
        className="
          flex
          items-center
          justify-between
          border-b
          border-[var(--border-color)]
          px-4
          py-3
        "
      >
        <h2 className="font-semibold">
          TiTi Support
        </h2>

        <button
          onClick={onClose}
          className="text-xl"
        >
          ✕
        </button>
      </div>

      {/* Messages */}

      <div className="flex-1 overflow-y-auto p-4">
        Chat messages...
      </div>

      {/* Input */}

      <div
        className="
          border-t
          border-[var(--border-color)]
          p-3
        "
      >
        <input
          className="
            w-full
            rounded-xl
            border
            border-[var(--border-color)]
            px-3
            py-2
          "
          placeholder="Nhập tin nhắn..."
        />
      </div>
    </div>
  );
}
