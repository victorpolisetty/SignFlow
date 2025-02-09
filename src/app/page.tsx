"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import PDFViewer from "@/components/PdfViewer";
import axios from "axios";

export default function Home() {
    const [pdfFile, setPdfFile] = useState<string | null>(null);
    const [highlightedText, setHighlightedText] = useState<string>("");
    const [userQuery, setUserQuery] = useState<string>("");
    const [aiResponse, setAiResponse] = useState<string>("");
    const [fullText, setFullText] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [fullTextAnalysis, setFullTextAnalysis] = useState<string>("");

    const signerSituation = "The signer is being offered an employment contract at DoorDash. This is a new grad offer.";

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

    const handleExtractText = async () => {
        if (!pdfFile) {
            alert("Please upload a PDF first.");
            return;
        }
    
        setLoading(true);
        try {
            const response = await axios.post("http://127.0.0.1:5000/contract/extract_text", { pdfFile });
            console.log("Extract Text Response:", response);  // Debugging log
            setFullText(response.data.fullText);
    
            // Call handleAnalyzeContract automatically after extracting the text
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
            console.log("Analyze Contract Response:", response);  // Debugging log
            setFullTextAnalysis(response.data.analysis);
        } catch (error) {
            console.error("Error analyzing contract:", error);
            setFullTextAnalysis("⚠️ Error analyzing the contract. Please try again.");
        }
        setLoading(false);
    };

    const handleHighlight = useCallback((text) => {
        setHighlightedText(text);
    }, []);

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
        <div className="container mx-auto p-4 bg-white min-h-screen">
            <h1 className="text-2xl font-bold mb-4">AI Contract Analyzer</h1>
            {!pdfFile && (
                <div className="mb-4">
                    <Input type="file" accept=".pdf" onChange={handleFileChange} />
                </div>
            )}

            {pdfFile && (
                <div className="flex mt-4">
                    {/* Left Column: PDF Viewer */}
                    <div className="w-1/2 pr-4">
                        <PDFViewer file={pdfFile} onHighlight={handleHighlight} />
                    </div>

                    {/* Middle Column: Highlighted Text & Ask AI */}
                    <div className="w-1/4 p-4 border-l bg-gray-100 rounded">
                        <h2 className="text-lg font-semibold mb-2">Highlighted Text</h2>
                        <p className="text-sm bg-white p-2 rounded">{highlightedText || "Select text in the PDF to highlight it."}</p>
                        {highlightedText && (
                            <div className="mt-4">
                                <h3 className="text-lg font-semibold">Ask AI About This</h3>
                                <textarea
                                    className="w-full p-2 border rounded"
                                    placeholder="Ask AI something about the text..."
                                    value={userQuery}
                                    onChange={(e) => setUserQuery(e.target.value)}
                                />
                                <button onClick={handleAskAI} className="w-full mt-2 p-2 bg-green-500 text-white rounded">
                                    {loading ? "Asking AI..." : "Ask AI"}
                                </button>
                                {aiResponse && (
                                    <div className="mt-4 p-4 bg-white border rounded">
                                        <h3 className="text-lg font-semibold">AI Explanation</h3>
                                        <p className="text-sm">{aiResponse}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Full PDF Analysis */}
                    <div className="w-1/4 p-4 border-l bg-gray-100 rounded">
                        <h3 className="text-lg font-semibold">Full PDF Analysis</h3>
                        <p className="text-sm bg-gray-100 p-2 rounded">{signerSituation}</p>
                        <button onClick={handleExtractText} className="mt-4 p-2 bg-blue-500 text-white rounded w-full">
                            {loading ? "Extracting Text..." : "Scan Full PDF"}
                        </button>
                        {fullTextAnalysis && (
                            <div className="mt-4 p-4 bg-white border rounded">
                                <h3 className="text-lg font-semibold">AI Analysis</h3>
                                <p>{fullTextAnalysis}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
