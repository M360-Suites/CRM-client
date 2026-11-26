import { FONTS, bold, button, h, img, link, p, placeholder, starter, styled } from "./nodes";

// Figma: "Campaign Updates" (High Fidelity)
const BLUE = "#0B4DA2";

const feature = (title: string, text: string) => [
	img(placeholder("campaign-feature"), title, { radius: 8 }),
	h(3, title, "center"),
	p(text, "center"),
	button("Learn more", { background: BLUE, radius: 6, align: "center" }),
	p(),
];

export default starter({
	id: "campaign-updates",
	name: "Campaign Updates",
	description:
		"Promote a service or campaign: a bold intro, three features each with a button and a row of partner names.",
	category: "starting",
	style: {
		background_color: "#EEF4FB",
		content_background: "#FFFFFF",
		font_family: FONTS.modern,
		content_radius: 8,
		link_color: BLUE,
	},
	header: {
		background_color: BLUE,
		text_color: "#FFFFFF",
		padding_y: 36,
		padding_x: 40,
		content: [
			p(bold(styled({ size: 18 }, "Your logo")), "center"),
			p(),
			h(1, "Boost Your Online Presence!"),
			p("Elevate your brand's digital footprint and connect with a broader audience."),
			button("Get started today", { background: "#FFFFFF", color: BLUE, radius: 6 }),
		],
	},
	body: {
		background_color: "#FFFFFF",
		text_color: "#334155",
		padding_y: 40,
		padding_x: 40,
		content: [
			h(1, "Transform Your Strategies Into Success!", "center"),
			p("Let us help make your marketing campaigns more impactful.", "center"),
			img(placeholder("campaign-hero"), "Campaign photo", { radius: 8 }),
			p(),
			...feature(
				"Offline Integration",
				"Experience fluid operations even without an internet connection.",
			),
			...feature(
				"Comprehensive Data Insights",
				"Harness the power of data to understand your audience better.",
			),
			...feature(
				"Optimal Performance Solutions",
				"Make sure your digital platforms run at peak efficiency.",
			),
			h(3, "Collaborators We're Proud Of", "center"),
			p(
				styled({ size: 20, color: "#94A3B8" }, bold("FutureTech  ·  NexusWave  ·  PrimeNode  ·  SyncPulse")),
				"center",
			),
		],
	},
	footer: {
		background_color: "#F8FAFC",
		text_color: "#64748B",
		padding_y: 28,
		padding_x: 40,
		content: [
			p(bold("Simple and beautiful"), "center"),
			p(
				[
					link("https://", "Facebook"),
					"  ·  ",
					link("https://", "X"),
					"  ·  ",
					link("https://", "Instagram"),
					"  ·  ",
					link("https://", "LinkedIn"),
				],
				"center",
			),
			p(
				styled({ size: 12 }, "400 N Bridge Rd, Paris City · Phone: +999 1234 5678"),
				"center",
			),
		],
	},
});
