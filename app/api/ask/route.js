import { NextResponse } from "next/server";
import { getGroqChatCompletion } from "../../../lib/groq";
import { supabase } from "../../../lib/supabase";

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

    const { data, error } = await supabase
      .from("documents")
      .select("extracted_text")
      .eq("id", pdfId)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    const context = data.extracted_text;

    if (!context.trim()) {
      return NextResponse.json(
        { error: "Document has no extractable text" },
        { status: 400 }
      );
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
