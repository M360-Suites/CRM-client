"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { EmailDesign } from "@/types/bulk_email";
import { renderDesignHtml } from "../email_editor/render";

const noop = () => () => {};

// A scaled-down, non-interactive render of a full email HTML document, sized
// so `width` pixels of the email fill the box.
export function HtmlThumbnail({
	html,
	width,
	background,
}: {
	html: string;
	width: number;
	background?: string;
}) {
	const boxRef = useRef<HTMLDivElement>(null);
	const [scale, setScale] = useState(0);

	useEffect(() => {
		const box = boxRef.current;
		if (!box) return;
		const observer = new ResizeObserver(([entry]) =>
			setScale(entry.contentRect.width / width),
		);
		observer.observe(box);
		return () => observer.disconnect();
	}, [width]);

	return (
		<div
			ref={boxRef}
			className="relative h-full w-full overflow-hidden"
			style={{ background }}
			aria-hidden
		>
			{html && scale > 0 && (
				<iframe
					title=""
					srcDoc={html}
					sandbox=""
					tabIndex={-1}
					scrolling="no"
					className="pointer-events-none absolute left-0 top-0 origin-top-left border-0"
					style={{
						width,
						height: `${100 / scale}%`,
						transform: `scale(${scale})`,
					}}
				/>
			)}
		</div>
	);
}

// The same render for an email design, used on the template cards. Rendering
// needs the DOM, so it only happens in the browser.
export default function DesignThumbnail({ design }: { design: EmailDesign }) {
	const mounted = useSyncExternalStore(noop, () => true, () => false);
	const html = useMemo(() => (mounted ? renderDesignHtml(design) : ""), [mounted, design]);
	// The rendered email is wider than its content: the content plus the outer padding
	return (
		<HtmlThumbnail
			html={html}
			width={design.content_width + 24}
			background={design.background_color}
		/>
	);
}
