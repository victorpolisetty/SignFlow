"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import PDFViewer from "@/components/PdfViewer"

export default function Home() {
    const [pdfFile, setPdfFile] = useState<string | null>(null)
    const [highlightedText, setHighlightedText] = useState("")

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                const result = e.target?.result
                if (typeof result === "string") {
                    setPdfFile(result)
                }
            }
            reader.readAsDataURL(file)
        }
    }

    const handleHighlight = (text: string) => {
        setHighlightedText(text)
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">PDF Highlighter and Explainer</h1>
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
                </div>
            )}
        </div>
    )
}

