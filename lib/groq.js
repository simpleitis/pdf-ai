import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function getGroqChatCompletion({
  messages,
  model = "openai/gpt-oss-20b",
}) {
  return groq.chat.completions.create({
    messages: messages,
    model: model,
  });
}
