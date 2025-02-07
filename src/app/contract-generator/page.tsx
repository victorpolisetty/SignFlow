"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Button, TextField, CircularProgress, Typography, Card, CardContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";

// Dynamically import PDFViewer to prevent SSR conflicts
import { PDFViewer } from "@react-pdf/renderer";

export default function ContractGenerator() {
    const [userInput, setUserInput] = useState("");
    const [sections, setSections] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [pdfKey, setPdfKey] = useState(0); // Key to force re-render on state changes

    // Clean GPT-style responses before splitting into sections
    const cleanContractText = (text: string) => {
        return text
            .replace(/^Sure! I'll make one for you[\s\S]*?Agreement Title:/, "Agreement Title:") // Remove intro text
            .trim();
    };

    // Fetch contract dynamically from API
    const handleGenerateContract = async () => {
        if (!userInput) return alert("Enter contract details!");

        setLoading(true);
        try {
            const response = await axios.post("http://127.0.0.1:5000/contract/generate_contract", { text: userInput });
            const cleanedText = cleanContractText(response.data.contract);
            const contractSections = cleanedText.split("\n\n").filter(section => section.trim() !== ""); // Remove empty sections
            setSections(contractSections);
        } catch (error) {
            console.error("Error generating contract:", error);
            alert("Failed to generate contract. Please try again.");
        }
        setLoading(false);
    };

    // Remove a section from the contract and re-render PDF
    const handleRemoveSection = (index: number) => {
        setSections(prevSections => prevSections.filter((_, i) => i !== index));
        setPdfKey(prevKey => prevKey + 1); // Force re-render of the PDF when sections change
    };

    // Handle manual PDF download
    const handleDownloadPDF = async () => {
        try {
            const blob = await pdf(<ContractPDF sections={sections} />).toBlob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "contract.pdf";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    };

    // PDF Component - Uses dynamically updated contract sections
    const ContractPDF = ({ sections }: { sections: string[] }) => (
        <Document key={pdfKey}>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text style={styles.title}>Generated Contract</Text>
                    {sections.length > 0 ? (
                        sections.map((section, index) => (
                            <View key={index} style={styles.paragraph}>
                                <Text style={styles.text}>{section}</Text>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.text}>No content available.</Text> // Prevent crash
                    )}
                </View>
            </Page>
        </Document>
    );

    return (
        <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
            <Typography variant="h4" gutterBottom>
                AI Contract Generator
            </Typography>

            {/* Navigation back to home */}
            

            <TextField
                label="Describe the contract you need"
                multiline
                rows={4}
                fullWidth
                variant="outlined"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                style={{ marginBottom: "20px" }}
            />
            <Button variant="contained" color="primary" onClick={handleGenerateContract}>
                Generate Contract
            </Button>

            {loading && <CircularProgress style={{ marginTop: "20px" }} />}

            {/* Display contract sections */}
            {sections.length > 0 && (
                <Card style={{ marginTop: "20px", padding: "20px", backgroundColor: "#f9f9f9", borderRadius: "8px" }}>
                    <CardContent>
                        <Typography variant="h5" gutterBottom style={{ textAlign: "center", fontWeight: "bold" }}>
                            Generated Contract
                        </Typography>
                        {sections.map((section, index) => (
                            <div key={index} style={{ position: "relative", padding: "10px", borderBottom: "1px solid #ddd" }}>
                                {/* Remove Section Button */}
                                <IconButton
                                    style={{ position: "absolute", top: 5, right: 5 }}
                                    onClick={() => handleRemoveSection(index)}
                                    size="small"
                                >
                                    <CloseIcon fontSize="small" />
                                </IconButton>

                                <Typography variant="body1" style={{ whiteSpace: "pre-line", fontFamily: "monospace" }}>
                                    {section}
                                </Typography>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Only show PDF options if sections exist */}
            {sections.length > 0 && (
                <>
                    {/* Live PDF Preview */}
                    <PDFViewer key={pdfKey} style={{ width: "100%", height: "500px", marginTop: "20px" }}>
                        <ContractPDF sections={sections} />
                    </PDFViewer>

                    {/* Manual Download Button */}
                    <Button
                        variant="contained"
                        color="secondary"
                        style={{ marginTop: "20px", backgroundColor: "#007bff", color: "white" }}
                        onClick={handleDownloadPDF}
                    >
                        Download PDF
                    </Button>
                </>
            )}
        </div>
    );
}

// PDF Styling
const styles = StyleSheet.create({
    page: { padding: 20, fontFamily: "Times-Roman" },
    section: { marginBottom: 10 },
    paragraph: { marginBottom: 10 },
    title: { fontSize: 20, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
    text: { fontSize: 12, marginBottom: 5, textAlign: "justify" },
});
