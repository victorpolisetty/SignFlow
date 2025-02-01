"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import PDFViewer from "@/components/PdfViewer";

export default function Home() {
    const [pdfFile, setPdfFile] = useState<string | null>(null);
    const [highlightedText, setHighlightedText] = useState<string>("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result;
                if (typeof result === "string") {
                    setPdfFile(result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="container mx-auto p-4 bg-white min-h-screen">
            <h1 className="text-2xl font-bold mb-4">PDF Highlighter</h1>

            {!pdfFile && (
                <div className="mb-4">
                    <Input type="file" accept=".pdf" onChange={handleFileChange} />
                </div>
            )}

            {pdfFile && (
                <div className="flex">
                    <div className="w-3/4 pr-4">
                        {/* Pass a callback to update the highlighted text */}
                        <PDFViewer file={pdfFile} onHighlight={setHighlightedText} />
                    </div>

                    <div className="w-1/4 p-4 border-l bg-gray-100 rounded">
                        <h2 className="text-lg font-semibold mb-2">Highlighted Text</h2>
                        <p className="text-sm">
                            {highlightedText || "Select text in the PDF to highlight it."}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
