"use client";

export default function CategoriesMessage({ message }: { message: { text: string; type: "success" | "error" } }) {
  return (
    <div
      className={`fixed left-1/2 top-20 z-50 -translate-x-1/2 rounded-2xl px-5 py-3 text-sm font-semibold shadow-2xl ${
        message.type === "error" ? "bg-red-500 text-white" : "bg-green-500 text-white"
      }`}
    >
      {message.text}
    </div>
  );
}
