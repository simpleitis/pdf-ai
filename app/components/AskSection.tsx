"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendHorizontal } from "lucide-react";
import { useState } from "react";
import MessageList from "./MessageList";
import { Message } from "../types";
import { toast } from "sonner";

type AskSectionProps = {
  pdfId: string;
};

export default function AskSection({ pdfId }: AskSectionProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAskRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!question.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: question,
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question, pdfId }),
      });

      if (!response.ok) {
        toast.error("Request failed! Please try again after sometime.");
        return;
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { content: data.answer, id: crypto.randomUUID(), role: "assistant" },
      ]);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Error asking question:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const displayMessages = isLoading
    ? [
        ...messages,
        {
          id: "loading-indicator",
          role: "assistant",
          content: "Thinking...",
        } as Message,
      ]
    : messages;

  return (
    <div className="flex flex-col w-full justify-between">
      <MessageList messages={displayMessages} />
      <form
        onSubmit={handleAskRequest}
        className="flex gap-2 px-32 py-10 w-full"
      >
        <Input
          type="text"
          placeholder="Ask a question about your PDF..."
          className="h-12"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={isLoading}
        />
        <Button
          type="submit"
          variant="outline"
          className="h-12 button-transition hover:bg-white hover:text-black"
          disabled={isLoading || !question.trim()}
        >
          <SendHorizontal />
        </Button>
      </form>
    </div>
  );
}
