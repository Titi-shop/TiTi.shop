"use client";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
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
    

   <ChatHeader
  onClose={onClose}
/>

     <ChatMessages />

     <ChatInput />
      </div>
    </aside>
  );
}
