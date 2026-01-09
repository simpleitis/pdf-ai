"use client";

import { MessageCirclePlus } from "lucide-react";
import { Document } from "../types";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Dot from "./Dot";

type SidePanelProps = {
  documents: Document[];
  loading: boolean;
};

export default function SidePanel({ documents, loading }: SidePanelProps) {
  const router = useRouter();

  const searchParams = useSearchParams();
  const pdfId = searchParams.get("pdfId");

  const handleClick = ({ id, name }: { id: string; name: string }) => {
    router.push(`?pdfId=${id}&pdfName=${encodeURIComponent(name)}`);
  };

  if (loading)
    return (
      <aside className="w-64 p-4 min-h-screen border-r border-white">
        <p className="text-sm text-gray-500">Loading documents...</p>
      </aside>
    );

  return (
    <div className="min-w-80 max-w-80 border-r border-white p-4 space-y-2 min-h-screen">
      <button
        className="p-2 font-bold border rounded-lg w-full hover:cursor-pointer hover:bg-white hover:text-black button-transition flex items-center gap-2 justify-center"
        onClick={() => router.push("/")}
      >
        <MessageCirclePlus />
        Upload pdf
      </button>

      <hr className="my-5" />

      <h3 className="text-lg font-semibold text-gray-200">Saved Documents</h3>
      {documents.map((doc) => (
        <button
          key={doc.id}
          onClick={() => handleClick({ id: doc.id, name: doc.fileName })}
          className={`text-sm w-full p-3 rounded-lg min-h-10 button-transition flex items-center gap-2 ${
            pdfId === doc.id ? "bg-neutral-800" : "hover:bg-neutral-900"
          }`}
        >
          <span className="flex items-center gap-2 min-w-0 flex-1">
            <span className="shrink-0">📄</span>
            <span className="truncate" title={doc.fileName}>
              {doc.fileName}
            </span>
          </span>
          {pdfId === doc.id && <Dot />}
        </button>
      ))}
    </div>
  );
}
