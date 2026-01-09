import { NextResponse } from "next/server";
import { getGroqChatCompletion } from "../../../lib/groq";
import { supabase } from "../../../lib/supabase";
import { redis } from "../../../lib/redis";

export const runtime = "nodejs";

export const POST = async (req) => {
  try {
    const { question, pdfId } = await req.json();

    if (!question || !pdfId) {
      return NextResponse.json(
        { error: "Question and pdf id are required" },
        { status: 400 }
      );
    }

    const cached = await redis.get(pdfId);
    let context = cached?.extracted_text;

    if (!context) {
      const { data, error } = await supabase
        .from("documents")
        .select()
        .eq("id", pdfId)
        .single();

      console.log(data);

      if (error || !data) {
        return NextResponse.json(
          { error: "Document not found" },
          { status: 404 }
        );
      }

      context = data.extracted_text;

      if (!context.trim()) {
        return NextResponse.json(
          { error: "Document has no extractable text" },
          { status: 400 }
        );
      }

      const redisData = {
        extracted_text: data.extracted_text,
        created_at: data.created_at,
        user_id: data.user_id,
        filename: data.filename,
        id: data.id,
      };

      await redis.set(pdfId, redisData, { ex: 24 * 60 * 60 });
    }

    const MAX_CHARS = 6000;
    const safeContext = context.slice(0, MAX_CHARS);

    const messages = [
      {
        role: "system",
        content: `Answer questions using ONLY the context below.
If the answer is not in the context, say you don't know.

Context:
\`\`\`
${safeContext}
\`\`\``,
      },
      {
        role: "user",
        content: question,
      },
    ];

    const response = await getGroqChatCompletion({ messages });

    return NextResponse.json({
      answer: response.choices[0]?.message?.content,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Ask failed" }, { status: 500 });
  }
};
