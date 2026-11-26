import { SectionInput, bold, img, link, p, placeholder, styled } from "./nodes";

// Footers shared by the starter templates that come from the same Figma
// family, matching the designs. Only the company identity (name, logo,
// address) is a placeholder; the rest is the design's own copy.

// A centred row of links: "Shop all · About us · My account"
export const linkRow = (labels: string[], size?: number) =>
	p(
		labels.flatMap((label, i) => {
			const a = link("https://", size ? styled({ size }, label) : label);
			return i ? ["     ", ...a] : a;
		}),
		"center",
	);

// A row of social icons, exported from the design as one picture
export const socialIcons = (name: string, width: number) =>
	img(placeholder(name), "Follow us", { width, href: "https://" });

// "like Beam" emails
export const wellnessFooter = (): SectionInput => ({
	background_color: "#F7F4EF",
	text_color: "#2E2A2B",
	padding_y: 40,
	padding_x: 64,
	content: [
		p(
			"We’re on a mission to revolutionize your health through better sleep and all-day wellness.",
			"center",
		),
		linkRow(["Shop all", "About us", "My account"]),
		socialIcons("social-wellness", 552),
		p(
			styled(
				{ size: 14 },
				"*These statements have not been evaluated by the Food and Drug Administration. These products are not intended to diagnose, treat, or cure any disease",
			),
			"center",
		),
		linkRow(["Sale terms & conditions", "Privacy policy", "Unsubscribe"], 14),
		p(
			styled({ size: 14, color: "#6F6C67" }, "Your Company, LLC. Street address, City, State ZIP"),
			"center",
		),
	],
});

// "like Bellroy" emails
export const goodsFooter = (): SectionInput => ({
	background_color: "#FFFFFF",
	text_color: "#333436",
	padding_y: 40,
	padding_x: 24,
	content: [
		socialIcons("social-goods", 552),
		p(
			styled(
				{ size: 14 },
				"Your Company Pty Ltd | Street address, City, Postcode, Country. Your Company Pty Ltd. All rights reserved.",
			),
			"center",
		),
		linkRow(["Unsubscribe", "Privacy policy", "Customer support"], 13),
	],
});

// "like Birdies" emails
export const fashionFooter = (background = "#FFFFFF"): SectionInput => ({
	background_color: background,
	text_color: "#0E0E0E",
	padding_y: 40,
	padding_x: 24,
	content: [
		p(bold("THE STYLISH FLAT THAT’S SECRETLY A SLIPPER."), "center"),
		p(bold(styled({ size: 24 }, "YOUR BRAND")), "center"),
		socialIcons("social-fashion", 552),
		p(
			styled(
				{ size: 14 },
				"See our Promotions page for details and exclusions.   © 2025 Your Company.  Street address, City, State ZIP.",
			),
			"center",
		),
		linkRow(["Unsubscribe"], 14),
	],
});

// "like Codecademy" emails
export const learnFooter = (): SectionInput => ({
	background_color: "#FFFFFF",
	text_color: "#2E2A2B",
	padding_y: 32,
	padding_x: 56,
	content: [
		linkRow(["View web version", "Email preferences", "Unsubscribe", "Privacy policy"], 13),
		p(
			styled({ size: 13 }, "Copyright Your Company. All rights reserved.  Street address, Suite, City, State ZIP"),
			"center",
		),
	],
});
