"use client";
import { Message } from "../types";
import { useSearchParams } from "next/navigation";
import { FileText, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

type MessageListProps = {
  messages: Message[];
};

export default function MessageList({ messages }: MessageListProps) {
  const searchParams = useSearchParams();
  const pdfName = searchParams.get("pdfName");

  return (
    <div className="flex-1 overflow-y-auto px-32 py-10 ">
      {pdfName && (
        <div className="mb-6 flex w-max items-center gap-2 rounded-md border p-2">
          <FileText className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium">{pdfName}</span>
        </div>
      )}

      {messages.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <p className="text-center text-lg text-gray-500">
            To get started, ask a question about this PDF
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex gap-3",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {msg.role === "assistant" && (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black">
                  <Bot className="h-5 w-5 text-white  rounded-full" />
                </div>
              )}

              <div
                className={cn(
                  "max-w-[70%] rounded-2xl px-4 py-3 leading-relaxed shadow-sm",
                  msg.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-neutral-800 text-white"
                )}
              >
                {msg.content}
              </div>

              {msg.role === "user" && (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-300">
                  <User className="h-5 w-5 text-black rounded-full" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
