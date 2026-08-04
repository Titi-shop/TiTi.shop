"use client";

export default function ChatMessages() {
  return (
    <div
      className="
        flex-1
        overflow-y-auto
        bg-[var(--background)]
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
  );
}
