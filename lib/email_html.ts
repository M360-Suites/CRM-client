import { EmailDesign } from "@/types/bulk_email";

// Turns the section editor's HTML into the HTML the API sends. Email clients
// ignore <style> blocks and most layout CSS, so everything is inlined and laid
// out with tables. The backend appends the unsubscribe link to every email.

// Relative asset paths (e.g. /assets/...) must be absolute in an inbox
export const absoluteUrl = (url: string) => {
	if (!url || /^(https?:|data:|mailto:|tel:)/i.test(url)) return url;
	if (typeof window === "undefined") return url;
	return new URL(url, window.location.origin).toString();
};

// Readable text on whatever background color was picked
export const isDarkColor = (color: string) => {
	const hex = color.replace("#", "");
	const full = hex.length === 3 ? hex.split("").map((c) => c + c).join("") : hex;
	const n = parseInt(full.padEnd(6, "0").slice(0, 6), 16);
	if (Number.isNaN(n)) return false;
	const r = (n >> 16) & 255;
	const g = (n >> 8) & 255;
	const b = n & 255;
	return 0.299 * r + 0.587 * g + 0.114 * b < 160;
};

const esc = (s: string) =>
	s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const num = (v: string | null | undefined, fallback: number) => {
	const n = Number(v);
	return v != null && v !== "" && Number.isFinite(n) ? n : fallback;
};

const BLOCK_STYLES: Record<string, string> = {
	p: "margin:0 0 12px;font-size:15px;line-height:24px;",
	h1: "margin:0 0 16px;font-size:30px;line-height:38px;font-weight:700;",
	h2: "margin:0 0 14px;font-size:24px;line-height:32px;font-weight:700;",
	h3: "margin:0 0 12px;font-size:19px;line-height:27px;font-weight:600;",
	ul: "margin:0 0 12px;padding-left:24px;",
	ol: "margin:0 0 12px;padding-left:24px;",
	li: "margin:0 0 4px;font-size:15px;line-height:24px;",
	blockquote: "margin:0 0 12px;padding-left:14px;border-left:3px solid #CBD5E1;",
	hr: "border:0;border-top:1px solid #E2E8F0;margin:16px 0;",
	code: "font-family:Menlo,Consolas,monospace;background:#F1F5F9;padding:1px 4px;border-radius:3px;",
};

// Block image → its own aligned row, optionally linked
const imageBlock = (img: HTMLElement, innerWidth: number) => {
	const src = img.getAttribute("src") ?? "";
	if (!src || src.startsWith("blob:")) return "";
	const width = img.getAttribute("width");
	const px = width ? Math.min(num(width, innerWidth), innerWidth) : null;
	const align = img.getAttribute("data-align") ?? "center";
	const radius = num(img.getAttribute("data-radius"), 0);
	const borderWidth = num(img.getAttribute("data-border-width"), 0);
	const borderColor = img.getAttribute("data-border-color") || "#E2E8F0";
	const href = img.getAttribute("data-href");
	const style = [
		"display:block",
		px ? `width:${px}px` : "width:100%",
		"max-width:100%",
		"height:auto",
		`border-radius:${radius}px`,
		borderWidth ? `border:${borderWidth}px solid ${borderColor}` : "border:0",
		align === "center" ? "margin:0 auto" : align === "right" ? "margin:0 0 0 auto" : "",
	]
		.filter(Boolean)
		.join(";");
	let tag = `<img src="${esc(absoluteUrl(src))}" alt="${esc(img.getAttribute("alt") ?? "")}" width="${px ?? innerWidth}" style="${style}" />`;
	if (href) tag = `<a href="${esc(href)}" target="_blank" style="text-decoration:none;">${tag}</a>`;
	return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 12px;"><tr><td align="${align}">${tag}</td></tr></table>`;
};

// Call-to-action button as a table cell, which renders in Outlook too
const buttonBlock = (btn: HTMLElement) => {
	const link = btn.querySelector("a");
	const href = link?.getAttribute("href") || "#";
	const label = link?.textContent?.trim() || "Click here";
	const bg = btn.getAttribute("data-background") || "#0091FE";
	const color = btn.getAttribute("data-color") || "#FFFFFF";
	const radius = num(btn.getAttribute("data-radius"), 4);
	const align = btn.getAttribute("data-align") || "left";
	const full = btn.getAttribute("data-full-width") === "true";
	return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 16px;"><tr><td align="${align}"><table role="presentation" cellpadding="0" cellspacing="0" border="0"${full ? ' width="100%"' : ""}><tr><td align="center" bgcolor="${bg}" style="border-radius:${radius}px;background:${bg};"><a href="${esc(href)}" target="_blank" style="display:inline-block;padding:12px 24px;font-size:15px;font-weight:600;line-height:20px;color:${color};text-decoration:none;border-radius:${radius}px;">${esc(label)}</a></td></tr></table></td></tr></table>`;
};

const inlineSection = (
	section: HTMLElement,
	design: EmailDesign,
	textColor: string,
	innerWidth: number,
) => {
	const swap = (el: HTMLElement, html: string) => {
		const holder = el.ownerDocument.createElement("div");
		holder.innerHTML = html;
		el.replaceWith(...Array.from(holder.childNodes));
	};
	section
		.querySelectorAll<HTMLElement>("div[data-email-button]")
		.forEach((btn) => swap(btn, buttonBlock(btn)));
	section
		.querySelectorAll<HTMLElement>("img")
		.forEach((img) => swap(img, imageBlock(img, innerWidth)));

	section.querySelectorAll<HTMLElement>("*").forEach((el) => {
		const tag = el.tagName.toLowerCase();
		// Image and button tables are already inlined
		if (el.closest("table")) return;
		const own = el.getAttribute("style") ?? "";
		if (tag === "a") {
			el.setAttribute("style", `color:${design.link_color};text-decoration:underline;${own}`);
			el.setAttribute("target", "_blank");
		} else if (tag === "mark") {
			el.setAttribute("style", `padding:0 2px;${own}`);
		} else if (BLOCK_STYLES[tag]) {
			const color = ["p", "h1", "h2", "h3", "li"].includes(tag) ? `color:${textColor};` : "";
			el.setAttribute("style", BLOCK_STYLES[tag] + color + own);
			// Keep empty paragraphs as visible spacing
			if (tag === "p" && !el.textContent?.trim()) el.innerHTML = "&nbsp;";
		}
		el.removeAttribute("class");
	});

	// The last block shouldn't add space under the section
	const last = section.lastElementChild as HTMLElement | null;
	if (last?.style) last.style.marginBottom = "0";
	return section.innerHTML;
};

export const buildEmailHtml = (design: EmailDesign, editorHtml: string) => {
	const doc = new DOMParser().parseFromString(`<div>${editorHtml}</div>`, "text/html");
	const sections = Array.from(doc.querySelectorAll<HTMLElement>("[data-email-section]"));

	const rows = sections
		.map((section) => {
			const hasContent =
				!!section.textContent?.trim() || !!section.querySelector("img[src]");
			if (!hasContent) return "";
			const bg = section.getAttribute("data-bg") || "transparent";
			const color = section.getAttribute("data-color") || "#334155";
			const py = num(section.getAttribute("data-py"), 24);
			const px = num(section.getAttribute("data-px"), 32);
			const inner = inlineSection(section, design, color, design.content_width - px * 2);
			return `<tr><td style="background:${bg};color:${color};padding:${py}px ${px}px;">${inner}</td></tr>`;
		})
		.join("\n");

	return `<!doctype html>
<html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><meta name="x-apple-disable-message-reformatting" /></head>
<body style="margin:0;padding:0;background:${design.background_color};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${design.background_color};">
<tr><td align="center" style="padding:32px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:${design.content_width}px;background:${design.content_background};border-radius:${design.content_radius}px;overflow:hidden;font-family:${design.font_family};">
${rows}
</table>
</td></tr>
</table>
</body></html>`;
};

// Drafts saved before broadcasts had a `design` field carried the editor state
// in an HTML comment. Kept only so those drafts still reopen correctly.
const DESIGN_MARKER = "crm360-design:";

export const extractDesign = (html?: string | null): unknown => {
	const match = html?.match(new RegExp(`<!--${DESIGN_MARKER}([A-Za-z0-9+/=]+)-->`));
	if (!match) return null;
	try {
		return JSON.parse(decodeURIComponent(escape(atob(match[1]))));
	} catch {
		return null;
	}
};

// HTML saved without a design (made outside this editor): keep its body
export const bodyFromHtml = (html: string) => {
	if (typeof DOMParser === "undefined") return html;
	const doc = new DOMParser().parseFromString(html, "text/html");
	return doc.body.innerHTML.trim();
};
