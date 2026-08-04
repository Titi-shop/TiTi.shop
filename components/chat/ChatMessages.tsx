"use client";

export interface ChatMessage {
  id: string;
  room_id: string;
  sender_id: string;
  message_type: string;
  content: string;
  created_at: string;
}

type ChatMessagesProps = {
  messages: ChatMessage[];

  currentUserId?: string;
};

export default function ChatMessages({
  messages,
  currentUserId,
}: ChatMessagesProps) {
  if (messages.length === 0) {
    return (
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
    );
  }

  return (
    <div
      className="
        flex-1
        overflow-y-auto
        p-4
      "
    >
      <div className="flex flex-col gap-3">

        {messages.map((message) => {
          const isMine =
            message.sender_id ===
            currentUserId;

          return (
            <div
              key={message.id}
              className={`flex ${
                isMine
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`
                  max-w-[80%]
                  rounded-2xl
                  px-4
                  py-3
                  text-sm
                  ${
                    isMine
                      ? "bg-[var(--color-primary)] text-white"
                      : "bg-[var(--background)]"
                  }
                `}
              >
                <p className="whitespace-pre-wrap">
                  {message.content}
                </p>

                <div
                  className={`
                    mt-2
                    text-[11px]
                    ${
                      isMine
                        ? "text-white/70"
                        : "text-[var(--text-muted)]"
                    }
                  `}
                >
                  {new Date(
                    message.created_at
                  ).toLocaleTimeString()}
                </div>
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}
