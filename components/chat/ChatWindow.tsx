"use client";

type ChatWindowProps = {
  onClose: () => void;
};

export default function ChatWindow({
  onClose,
}: ChatWindowProps) {
  return (
    <div className="fixed inset-0 z-[1000] bg-[var(--background)]">

      <div className="flex h-14 items-center justify-between border-b px-4">

        <h2 className="font-semibold">
          TiTi Support
        </h2>

        <button
          type="button"
          onClick={onClose}
        >
          ✕
        </button>

      </div>

      <div className="flex h-[calc(100%-56px)] items-center justify-center">

        Chat đang phát triển...

      </div>

    </div>
  );
}
