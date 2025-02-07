"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { Input } from "@/components/ui/input";
import PDFViewer from "@/components/PdfViewer";
import axios from "axios";

export default function Home() {
    const router = useRouter(); // Initialize router for navigation
    const [pdfFile, setPdfFile] = useState<string | null>(null);
    const [highlightedText, setHighlightedText] = useState<string>("");
    const [userQuery, setUserQuery] = useState<string>("");
    const [aiResponse, setAiResponse] = useState<string>("");

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

    // Wrap the setter in a callback to avoid direct calls during rendering
    const handleHighlight = useCallback((text) => {
        setHighlightedText(text);
    }, []);

    // Send highlighted text to AI
    const handleAskAI = async () => {
        if (!highlightedText.trim()) {
            alert("Please highlight text in the PDF first!");
            return;
        }

        try {
            const response = await axios.post("http://127.0.0.1:5000/contract/gpt_highlight", {
                text: highlightedText,
                question: userQuery || "What does this mean? keep it super short",
            });
            setAiResponse(response.data.explanation);
        } catch (error) {
            console.error("Error fetching explanation:", error);
            setAiResponse("⚠️ Error fetching AI response. Please try again.");
        }
    };

    return (
        <div className="container mx-auto p-4 bg-white min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Signing with an AI PDF Highlighter</h1>
            {!pdfFile && (
                <div className="mb-4">
                    <Input type="file" accept=".pdf" onChange={handleFileChange} />
                </div>
            )}
            {pdfFile && (
                <div className="flex">
                    <div className="w-3/4 pr-4">
                        <PDFViewer file={pdfFile} onHighlight={handleHighlight} />
                    </div>
                    <div className="w-1/4 p-4 border-l bg-gray-100 rounded">
                        <h2 className="text-lg font-semibold mb-2">Highlighted Text</h2>
                        <p className="text-sm bg-white p-2 rounded">{highlightedText || "Select text in the PDF to highlight it."}</p>
                        {highlightedText && (
                            <div className="mt-4">
                                <h3 className="text-lg font-semibold">Ask AI About This</h3>
                                <textarea className="w-full p-2 border rounded" placeholder="Ask AI something about the text..." value={userQuery} onChange={(e) => setUserQuery(e.target.value)} />
                                <button onClick={handleAskAI} className="w-full mt-2 p-2 bg-blue-500 text-white rounded">Ask AI</button>
                            </div>
                        )}
                        {aiResponse && (
                            <div className="mt-4 p-2 bg-white border rounded">
                                <h3 className="text-lg font-semibold">AI Explanation</h3>
                                <p className="text-sm">{aiResponse}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
