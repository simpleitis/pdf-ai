import { NextResponse } from "next/server";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const PDFParser = require("pdf2json");

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

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const extractedText = await new Promise((resolve, reject) => {
      const pdfParser = new PDFParser(null, 1);
      pdfParser.on("pdfParser_dataError", (err) => reject(err.parserError));
      pdfParser.on("pdfParser_dataReady", () => {
        resolve(pdfParser.getRawTextContent());
      });
      pdfParser.parseBuffer(buffer);
    });

    

    return NextResponse.json({ extractedText: extractedText ?? "no text" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
};