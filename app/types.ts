export type Document = {
  id: string;
  fileName: string;
  createdAt: string;
};

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};
