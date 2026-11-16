"use client";

import { useEffect } from "react";

const CLASS = "bulk-email-scrollbars";

// The page itself (html) is what scrolls, and popovers/dialogs render outside
// the page content, so the minimal scrollbar style is switched on at <html>
// while a bulk email page is open and removed when leaving it.
export default function ScrollbarScope() {
	useEffect(() => {
		const root = document.documentElement;
		root.classList.add(CLASS);
		return () => root.classList.remove(CLASS);
	}, []);
	return null;
}
