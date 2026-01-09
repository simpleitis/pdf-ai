"use client";

import { useEffect, useState } from "react";
import SidePanel from "./components/SidePanel";
import UploadSection from "./components/UploadSection";
import { Document } from "./types";
import AskSection from "./components/AskSection";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedPdfId, setSelectedPdfId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const pdfId = searchParams.get("pdfId");

  // Fetch documents
  useEffect(() => {
    const fetchDocuments = async () => {
      const res = await fetch("/api/list?userId=demo-user");
      const data = await res.json();
      setDocuments(data.documents || []);
      setLoading(false);
    };

    fetchDocuments();
  }, []);

  return (
    <div className="flex h-screen">
      <SidePanel documents={documents} loading={loading} />

      {!pdfId && <UploadSection setDocuments={setDocuments} />}
      {pdfId && <AskSection pdfId={pdfId} />}
    </div>
  );
}
