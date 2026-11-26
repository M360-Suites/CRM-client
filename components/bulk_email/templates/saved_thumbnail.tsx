"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useEmailTemplate } from "@/hooks/bulk_email/templates";
import { loadDesign } from "../email_editor/design";
import DesignThumbnail, { HtmlThumbnail } from "./design_thumbnail";

// Preview of a saved template on the Email Templates page. The list endpoint
// leaves out html and design, so each card loads its own template, but only
// once it scrolls near the screen. It shares the editor's cache, so opening
// the template afterwards doesn't fetch it again.
export default function SavedThumbnail({ id }: { id: string }) {
	const boxRef = useRef<HTMLDivElement>(null);
	const [inView, setInView] = useState(false);

	useEffect(() => {
		const box = boxRef.current;
		if (!box || inView) return;
		const observer = new IntersectionObserver(
			([entry]) => entry.isIntersecting && setInView(true),
			{ rootMargin: "200px" },
		);
		observer.observe(box);
		return () => observer.disconnect();
	}, [inView]);

	const { data, isLoading } = useEmailTemplate(inView ? id : undefined);
	// Designs made in the editor render from the design (with the editor's own
	// upgrades applied); anything else falls back to the saved HTML
	const design = useMemo(() => {
		if (!data) return null;
		const loaded = loadDesign(data);
		return typeof loaded.initial === "string" ? null : loaded.design;
	}, [data]);

	return (
		<div ref={boxRef} className="h-full w-full bg-[#F8FAFC]">
			{design ? (
				<DesignThumbnail design={design} />
			) : data?.html ? (
				<HtmlThumbnail html={data.html} width={624} background="#FFFFFF" />
			) : (
				(!inView || isLoading) && <div className="h-full w-full animate-pulse bg-[#F1F5F9]" />
			)}
		</div>
	);
}
