import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export const runtime = "nodejs";

export const POST = async (req) => {
  try {
    const formData = await req.formData();
    const file = formData.get("pdf");
    const filename = formData.get("filename");

    if (!file || !filename) {
      return NextResponse.json(
        { error: "PDF and filename are required" },
        { status: 400 }
      );
    }

    const body = new FormData();
    body.append("pdf", file, file.name);

    const res = await fetch(`${process.env.DEV_NODE_URL}/upload`, {
      method: "POST",
      body,
    });

    const data = await res.json();

    const { data: inserted, error } = await supabase
      .from("documents")
      .insert({
        user_id: "demo-user",
        filename: filename,
        extracted_text: data.text,
      })
      .select();

    if (error || !inserted?.length) {
      console.error(error);
      return NextResponse.json(
        { error: "Failed to save document" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      documentId: inserted[0].id,
      message: "PDF uploaded",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
};
