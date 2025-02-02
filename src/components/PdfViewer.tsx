"use client";

import { highlightPlugin, RenderHighlightTargetProps, Trigger } from "@react-pdf-viewer/highlight";
import { Worker, Viewer } from "@react-pdf-viewer/core";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/highlight/lib/styles/index.css";

interface PDFViewerProps {
    file: string | Uint8Array;
    onHighlight: (text: string) => void;
}

export default function PDFViewer({ file, onHighlight }: PDFViewerProps) {
    // Create the highlight plugin
    const highlightPluginInstance = highlightPlugin({
        trigger: Trigger.TextSelection,
        // Called automatically right after text is selected
        renderHighlightTarget: (props: RenderHighlightTargetProps) => {
            console.log("🔹 Highlight detected:", props.selectedText);
            onHighlight(props.selectedText);
            // Return `null` to avoid showing the "Add Note" button
            return <div />;
        },
    });

    return (
        <div className="h-screen bg-white">
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                <Viewer fileUrl={file} plugins={[highlightPluginInstance]} />
            </Worker>
        </div>
    );
}
