"use client"

import { useState } from "react"
import { Worker, Viewer } from "@react-pdf-viewer/core"
import { highlightPlugin, Trigger } from "@react-pdf-viewer/highlight"
import "@react-pdf-viewer/core/lib/styles/index.css"
import "@react-pdf-viewer/highlight/lib/styles/index.css"

interface PDFViewerProps {
    file: string | Uint8Array
    onHighlight: (text: string) => void
}

export default function PDFViewer({ file, onHighlight }: PDFViewerProps) {
    const [highlightAreas, setHighlightAreas] = useState<string[]>([])

    const highlightPluginInstance = highlightPlugin({
        trigger: Trigger.TextSelection,
        onTextHighlighted: (props) => {
            const selectedText = props.selectedText
            setHighlightAreas((prev) => [...prev, selectedText])
            onHighlight(selectedText)
        },
    })

    return (
        <div className="h-screen">
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                <Viewer fileUrl={file} plugins={[highlightPluginInstance]} />
            </Worker>
        </div>
    )
}
