import { FONTS, bold, button, columns, h, hr, img, link, p, placeholder, starter, styled } from "./nodes";

// Figma: "First email - like Beam" (High Fidelity), with the branding removed
const ACCENT = "#8C7655";
const DARK = "#2B2726";

const ingredient = (title: string, text: string) => [
	img(placeholder("wellness-tile"), title, { radius: 4 }),
	p(bold(styled({ size: 14 }, title))),
	p(styled({ size: 13, color: "#D6D3D1" }, text)),
];

export default starter({
	id: "wellness-launch",
	name: "Product Launch",
	description:
		"A warm hero with a single call to action, then a grid of four features on a dark band. Made for launching a product.",
	category: "library",
	style: {
		background_color: "#F5F1EC",
		content_background: "#FFFFFF",
		font_family: FONTS.serif,
		link_color: DARK,
	},
	header: {
		background_color: ACCENT,
		text_color: "#FFFFFF",
		padding_y: 32,
		padding_x: 40,
		content: [
			h(1, "Your Brand", "center"),
			hr(),
			p(styled({ size: 12 }, "NEW ARRIVAL"), "center"),
			h(1, styled({ size: 36 }, "Your Everyday Ritual, Elevated"), "center"),
			p(
				"Zero fuss, all the benefits. Tell your customers what makes this product the everyday essential that fits straight into their routine.",
				"center",
			),
			button("SHOP NOW", { background: "#FFFFFF", color: DARK, radius: 2, align: "center" }),
			img(placeholder("wellness-hero"), "Product photo"),
		],
	},
	body: {
		background_color: DARK,
		text_color: "#FFFFFF",
		padding_y: 40,
		padding_x: 40,
		content: [
			h(2, "Your daily essential, and then some", "center"),
			p(
				styled({ size: 14 }, "Our formulas are thoughtful so that your routine can stay simple."),
				"center",
			),
			p(),
			columns([
				ingredient("Feature one", "Describe the first benefit in a sentence or two, and why it matters."),
				ingredient("Feature two", "Describe the second benefit and the everyday difference it makes."),
			]),
			columns([
				ingredient("Feature three", "A third reason to choose this product, kept short and specific."),
				ingredient("Feature four", "Close with the benefit customers ask you about most often."),
			]),
			button("SHOP NOW", { background: "#FFFFFF", color: DARK, radius: 2, align: "center" }),
		],
	},
	footer: {
		background_color: "#F5F1EC",
		text_color: "#3B3632",
		padding_y: 32,
		padding_x: 40,
		content: [
			p(
				"We're on a mission to make everyday wellness simple. Thanks for being part of it.",
				"center",
			),
			p(
				[
					link("https://", "Shop all"),
					"  ·  ",
					link("https://", "About us"),
					"  ·  ",
					link("https://", "My account"),
				],
				"center",
			),
			hr(),
			p(
				styled(
					{ size: 12, color: "#78716C" },
					"*Add any disclaimer your products need here, for example how claims were tested.",
				),
				"center",
			),
			p(
				styled({ size: 12, color: "#78716C" }, [
					"Your Company Ltd. · Street address, City, Postcode",
				]),
				"center",
			),
		],
	},
});
