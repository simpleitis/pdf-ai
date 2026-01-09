"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Document } from "../types";
import { useRouter } from "next/navigation";

type UploadSectionProps = {
  setDocuments: Dispatch<SetStateAction<Document[]>>;
};

type UploadResponse = {
  documentId: string;
  fileName: string;
  createdAt: string;
};

export default function UploadSection({ setDocuments }: UploadSectionProps) {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;

    if (selectedFile && selectedFile.type !== "application/pdf") {
      toast.error("Please select a PDF file");
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file || !fileName.trim()) {
      toast.error("PDF and file name are required!");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("pdf", file);
      formData.append("filename", fileName.trim());

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Upload failed: ${res.status}`);
      }

      const data = (await res.json()) as UploadResponse;

      const newDocumentData: Document = {
        id: data.documentId,
        fileName: data.fileName,
        createdAt: data.createdAt,
      };
      setDocuments((prev) => [newDocumentData, ...prev]);

      toast.success("PDF uploaded successfully!");

      router.push(`?pdfId=${data.documentId}`);

      setFile(null);
      setFileName("");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={
        "p-10 flex flex-col justify-center items-center border-2 w-full gap-10 "
      }
    >
      <h1 className="scroll-m-20 text-center text-6xl font-extrabold tracking-tight text-balance max-w-200">
        Upload your PDF, to get started with your questions
      </h1>

      <div className="flex flex-col gap-2">
        <Label htmlFor="filename">File name</Label>
        <Input
          id="filename"
          type="text"
          placeholder="File name"
          className="w-96"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="file">Upload file</Label>
        <Input
          id="file"
          type="file"
          accept="application/pdf"
          className="w-96"
          onChange={handleFileChange}
          disabled={loading}
        />
      </div>

      <Button
        onClick={handleUpload}
        disabled={loading || !file || !fileName.trim()}
      >
        {loading ? "Uploading..." : "Upload"}
      </Button>
    </div>
  );
}
