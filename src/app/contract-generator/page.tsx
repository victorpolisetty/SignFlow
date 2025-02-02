"use client";

import { useState } from "react";
import axios from "axios";
import { Button, TextField, CircularProgress, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter();
    const [userInput, setUserInput] = useState("");
    const [contract, setContract] = useState("");
    const [loading, setLoading] = useState(false);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null); // ✅ Allow both string and null

    const handleGenerateContract = async () => {
        if (!userInput) return alert("Enter contract details!");

        setLoading(true);
        try {
            const response = await axios.post("http://127.0.0.1:5000/auth/generate_contract", { text: userInput });
            setContract(response.data.contract);
        } catch (error) {
            console.error("Error generating contract:", error);
        }
        setLoading(false);
    };

    const handleGeneratePDF = async () => {
        setLoading(true);
        try {
            const response = await axios.post("http://127.0.0.1:5000/auth/generate_pdf", { contract });

            if (response.status === 200 && response.data.pdf_url) {
                setPdfUrl(`http://127.0.0.1:5000/auth/${response.data.pdf_url}`);
            } else {
                console.error("Unexpected response:", response);
            }
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
        setLoading(false);
    };

    return (
        <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
            <Typography variant="h4">AI Contract Generator</Typography>

            {/* Back to Home Button */}
            <button
                onClick={() => router.push("/")}
                className="mb-4 px-4 py-2 bg-gray-500 text-white rounded"
            >
                Back to PDF Highlighter
            </button>

            <TextField
                label="Describe the contract you need"
                multiline
                rows={4}
                fullWidth
                variant="outlined"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                style={{ marginTop: "20px" }}
            />
            <Button variant="contained" color="primary" onClick={handleGenerateContract} style={{ marginTop: "20px" }}>
                Generate Contract
            </Button>

            {loading && <CircularProgress style={{ marginTop: "20px" }} />}

            {contract && (
                <div>
                    <Typography variant="h6" style={{ marginTop: "20px" }}>Generated Contract</Typography>
                    <pre style={{ backgroundColor: "#f4f4f4", padding: "10px" }}>{contract}</pre>

                    <Button variant="contained" color="secondary" onClick={handleGeneratePDF} style={{ marginTop: "20px" }}>
                        Generate PDF
                    </Button>

                    {pdfUrl && (
                        <div style={{ marginTop: "20px" }}>
                            <a href={pdfUrl} download="contract.pdf">Download Contract PDF</a>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
