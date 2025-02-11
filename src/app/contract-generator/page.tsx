"use client";

import { useState } from "react";
import axios from "axios";
import { Button, TextField, CircularProgress, Typography, Card, IconButton, Dialog, DialogContent, DialogActions, DialogTitle } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";
import { PDFViewer } from "@react-pdf/renderer";

export default function ContractGenerator() {
    const [userInput, setUserInput] = useState("");
    const [sections, setSections] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [autofillLoading, setAutofillLoading] = useState(false);
    const [pdfKey, setPdfKey] = useState(0);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [infoDialogOpen, setInfoDialogOpen] = useState(false);

    const placeholderData: Record<string, string> = {
        "[LLC Name]": "Pragmatism Labs Ltd",
        "[Company Type]": "Private limited Company",
        "[Office Address]": "71-75 Shelton Street, Covent Garden, London, United Kingdom, WC2H 9JQ",
        "[Company Number]": "14026607"
    };

    const placeholderRegex = /\[(Description of Services|Client Name|Payment Amount|Payment Due Date|LLC Name|Company Type|Office Address|Company Number|Second Party Name|Second Party Address|Describe Services|Total Amount|Payment Schedule|Currency|Start Date|End Date|Notice Period|Governing Law Jurisdiction|Authorized Person's Name|Authorized Person's Title|Signing Date|Authorized Second Party Person's Name|Authorized Second Party Person's Title)\]/g;

    const cleanContractText = (text: string) => {
        return text.replace(/^Sure! I'll make one for you[\s\S]*?Agreement Title:/, "Agreement Title:").trim();
    };

    const highlightFillableParts = (text: string) => {
        return text.replace(placeholderRegex, (match) => {
            return `<span style="background-color: yellow; font-weight: bold;">${match}</span>`;
        });
    };

    const handleGenerateContract = async () => {
        if (!userInput) return alert("Enter contract details!");

        setLoading(true);

        setTimeout(async () => {
            try {
                const response = await axios.post("http://127.0.0.1:5000/contract/generate_contract", { text: userInput });
                const cleanedText = cleanContractText(response.data.contract);
                const contractSections = cleanedText.split("\n\n").filter((section) => section.trim() !== "");
                setSections(contractSections);
                setPdfKey((prevKey) => prevKey + 1); // Force PDF reload
            } catch (error) {
                console.error("Error generating contract:", error);
                alert("Failed to generate contract. Please try again.");
            }
            setLoading(false);
        }, 5000);
    };

    const handleAutofillTemplate = async () => {
        if (sections.length === 0) {
            alert("No contract available to autofill.");
            return;
        }

        setInfoDialogOpen(true); // Open the dialog
    };

    const confirmAutofill = async () => {
        setInfoDialogOpen(false); // Close the dialog
        setAutofillLoading(true);

        try {
            const response = await axios.post("http://127.0.0.1:5000/contract/autofill", {
                contractText: sections.join("\n\n"),
                autofillData: placeholderData
            });

            const filledContract = response.data.filledContract;
            const autofilledSections = filledContract.split("\n\n").filter((section) => section.trim() !== "");

            setSections(autofilledSections);
            setPdfKey((prevKey) => prevKey + 1); // Ensure the PDF re-renders
        } catch (error) {
            console.error("Error autofilling template:", error);
            alert("Failed to autofill the template. Please try again.");
        } finally {
            setAutofillLoading(false);
        }
    };

    const handleRemoveSection = (index: number) => {
        setSections((prevSections) => prevSections.filter((_, i) => i !== index));
        setPdfKey((prevKey) => prevKey + 1);
    };

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

    const handlePreviewPDF = () => {
        setPreviewOpen(true);
    };

    const styles = StyleSheet.create({
        page: { padding: 20, backgroundColor: "#ffffff", color: "#333" },
        section: { marginBottom: 10 },
        paragraph: { marginBottom: 10 },
        title: { fontSize: 20, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
        text: { fontSize: 12, marginBottom: 5, textAlign: "justify" },
    });

    const ContractPDF = ({ sections }: { sections: string[] }) => (
        <Document key={pdfKey}>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text style={styles.title}>Generated Contract</Text>
                    {sections.map((section, index) => (
                        <View key={index} style={styles.paragraph}>
                            <Text style={styles.text}>{section}</Text>
                        </View>
                    ))}
                </View>
            </Page>
        </Document>
    );

    return (
        <div className="container mx-auto p-8 min-h-screen bg-gray-100">
            <Typography variant="h4" gutterBottom style={{ textAlign: "center", color: "#333" }}>
                SignFlow AI Contract Generator
            </Typography>

            <Card style={{ padding: "20px", marginBottom: "20px", backgroundColor: "#fff", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>
                <Typography variant="body1" style={{ marginBottom: "10px", color: "#555" }}>
                    Enter details about the contract you need:
                </Typography>
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
                <div style={{ display: "flex", alignItems: "center" }}>
                    <Button variant="contained" onClick={handleGenerateContract} style={{ backgroundColor: "#007bff", color: "#fff" }}>
                        Generate Contract
                    </Button>
                    {loading && <CircularProgress size={24} style={{ marginLeft: "15px", color: "#007bff" }} />}
                </div>
            </Card>

            {sections.length > 0 && (
                <>
                    <Card style={{ padding: "20px", marginTop: "20px", backgroundColor: "#fff", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>
                        <Typography variant="h5" gutterBottom style={{ textAlign: "center", fontWeight: "bold", color: "#333" }}>
                            Generated Contract
                        </Typography>
                        {sections.map((section, index) => (
                            <div key={index} style={{ position: "relative", padding: "10px", borderBottom: "1px solid #ddd" }}>
                                <IconButton
                                    style={{ position: "absolute", top: 5, right: 5 }}
                                    onClick={() => handleRemoveSection(index)}
                                    size="small"
                                >
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                                <Typography
                                    variant="body1"
                                    style={{ whiteSpace: "pre-line", fontFamily: "monospace", color: "#555" }}
                                    dangerouslySetInnerHTML={{ __html: highlightFillableParts(section) }}
                                />
                            </div>
                        ))}
                    </Card>

                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
                        <Button variant="contained" style={{ backgroundColor: "#28a745", color: "#fff" }} onClick={handleAutofillTemplate}>
                            {autofillLoading ? <CircularProgress size={24} style={{ color: "#fff" }} /> : "Autofill Template"}
                        </Button>
                        <Button variant="contained" style={{ backgroundColor: "#007bff", color: "#fff" }} onClick={handleDownloadPDF}>
                            Download PDF
                        </Button>
                        <Button variant="contained" style={{ backgroundColor: "#17a2b8", color: "#fff" }} onClick={handlePreviewPDF}>
                            Preview PDF
                        </Button>
                    </div>

                    <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} fullWidth maxWidth="lg">
                        <DialogContent>
                            <PDFViewer style={{ width: "100%", height: "80vh" }}>
                                <ContractPDF sections={sections} />
                            </PDFViewer>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={infoDialogOpen} onClose={() => setInfoDialogOpen(false)} fullWidth maxWidth="sm">
                        <DialogTitle>Using Autofill Data</DialogTitle>
                        <DialogContent>
                            Using information found from <a href="https://find-and-update.company-information.service.gov.uk/company/14026607" target="_blank">this link</a> to fill in information for the LLC "Pragmatism Labs Ltd".
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setInfoDialogOpen(false)} color="secondary">
                                Cancel
                            </Button>
                            <Button onClick={confirmAutofill} color="primary">
                                Confirm Autofill
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            )}
        </div>
    );
}
