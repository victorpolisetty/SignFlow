"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import PDFViewer from "@/components/PdfViewer";
import axios from "axios";
import { Typography } from "@mui/material";

export default function Home() {
    const [pdfFile, setPdfFile] = useState<string | null>(null);
    const [highlightedText, setHighlightedText] = useState<string>("");
    const [userQuery, setUserQuery] = useState<string>("");
    const [aiResponse, setAiResponse] = useState<string>("");
    const [fullText, setFullText] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [fullTextAnalysis, setFullTextAnalysis] = useState<string>("");

    const signerSituation = "The signer is being offered an employment contract from GTAWYB Tech Services Ltd. This is a contracting offer for development work starting at $80/hr.";

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

    const cleanHighlightedText = (text) => {
        return text.replace(/(?<=\w) (?=\w)/g, ""); // Removes spaces between letters but retains spaces between words
    };

    const handleHighlight = useCallback((text) => {
        const cleanedText = cleanHighlightedText(text);
        setHighlightedText(cleanedText);
    }, []);

    const handleExtractText = async () => {
        if (!pdfFile) {
            alert("Please upload a PDF first.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post("http://127.0.0.1:5000/contract/extract_text", { pdfFile });
            setFullText(response.data.fullText);
            handleAnalyzeContract(response.data.fullText);
        } catch (error) {
            console.error("Error extracting text:", error);
            alert("Failed to extract text from the PDF. Please try again.");
        }
        setLoading(false);
    };

    const handleAnalyzeContract = async (extractedText) => {
        if (!extractedText) {
            alert("No text available for analysis.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post("http://127.0.0.1:5000/contract/analyze_contract", {
                fullText: extractedText,
                signerSituation,
            });
            setFullTextAnalysis(response.data.analysis);
        } catch (error) {
            console.error("Error analyzing contract:", error);
            setFullTextAnalysis("⚠️ Error analyzing the contract. Please try again.");
        }
        setLoading(false);
    };

    const handleAskAI = async () => {
        if (!highlightedText.trim()) {
            alert("Please highlight text in the PDF first!");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post("http://127.0.0.1:5000/contract/gpt_highlight", {
                text: highlightedText,
                question: userQuery || "What does this mean? Keep it super short.",
            });
            setAiResponse(response.data.explanation);
        } catch (error) {
            console.error("Error fetching explanation:", error);
            setAiResponse("⚠️ Error fetching AI response. Please try again.");
        }
        setLoading(false);
    };

    return (
        <div className="container mx-auto p-8 min-h-screen bg-gray-100">
            <Typography variant="h4" gutterBottom style={{ textAlign: "center", color: "#333" }}>
                SignFlow AI Contract Viewer
            </Typography>
            {!pdfFile && (
                <div className="mb-6 flex justify-center">
                    <Input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="block w-full max-w-md p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            )}

            {pdfFile && (
                <div className="flex gap-6">
                    {/* Left Column: PDF Viewer */}
                    <div className="w-1/2 bg-white p-6 rounded-lg shadow">
                        <h2 className="text-lg font-semibold mb-4 text-gray-800">Uploaded PDF</h2>
                        <PDFViewer file={pdfFile} onHighlight={handleHighlight} />
                    </div>

                    {/* Middle Column: Highlighted Text & Ask AI */}
                    <div className="w-1/4 bg-white p-6 rounded-lg shadow">
                        <h2 className="text-lg font-semibold mb-4 text-gray-800">Highlighted Text</h2>
                        <p className="text-sm bg-gray-100 p-4 rounded-lg">
                            {highlightedText || "Select text in the PDF to highlight it."}
                        </p>
                        {highlightedText && (
                            <div className="mt-6">
                                <h3 className="text-md font-semibold mb-2 text-gray-800">Ask AI About This</h3>
                                <textarea
                                    className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Ask AI something about the text..."
                                    value={userQuery}
                                    onChange={(e) => setUserQuery(e.target.value)}
                                />
                                <button
                                    onClick={handleAskAI}
                                    className="w-full mt-4 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                >
                                    {loading ? "Asking AI..." : "Ask AI"}
                                </button>
                                {aiResponse && (
                                    <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                                        <h3 className="text-md font-semibold mb-2 text-gray-800">AI Explanation</h3>
                                        <p className="text-sm">{aiResponse}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Full PDF Analysis */}
                    <div className="w-1/4 bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Full PDF Analysis</h3>
                        <p className="text-sm bg-gray-100 p-4 rounded-lg mb-4">{signerSituation}</p>
                        <button
                            onClick={handleExtractText}
                            className="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        >
                            {loading ? "Extracting Text..." : "Scan Full PDF"}
                        </button>
                        {fullTextAnalysis && (
                            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                                <h3 className="text-md font-semibold mb-2 text-gray-800">AI Analysis</h3>
                                <p>{fullTextAnalysis}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
