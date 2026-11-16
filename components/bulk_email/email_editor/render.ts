import { generateHTML } from "@tiptap/react";
import { buildEmailHtml } from "@/lib/email_html";
import { EmailDesign } from "@/types/bulk_email";
import { emailExtensions } from "./extensions";

// The HTML sent to recipients, built from a saved design (no editor needed)
export const renderDesignHtml = (design: EmailDesign) =>
	buildEmailHtml(
		design,
		generateHTML(design.doc as Parameters<typeof generateHTML>[0], emailExtensions()),
	);

// Thin scrollbars matching the bulk email pages (globals.css). An iframe is its
// own document, so the page's scrollbar styles don't reach it. Preview only:
// the HTML that gets sent never includes this.
const PREVIEW_SCROLLBARS = `<style>
html{scrollbar-width:thin;scrollbar-color:rgb(15 23 42 / 0.2) transparent}
@supports selector(::-webkit-scrollbar){html{scrollbar-width:auto;scrollbar-color:auto}}
::-webkit-scrollbar{width:6px;height:6px}
::-webkit-scrollbar-track,::-webkit-scrollbar-corner{background:transparent}
::-webkit-scrollbar-thumb{background-color:rgb(15 23 42 / 0.16);border-radius:9999px}
::-webkit-scrollbar-thumb:hover{background-color:rgb(15 23 42 / 0.32)}
</style>`;

export const renderPreviewHtml = (design: EmailDesign) =>
	renderDesignHtml(design).replace("</head>", `${PREVIEW_SCROLLBARS}</head>`);
