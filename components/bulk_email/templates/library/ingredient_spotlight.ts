import { FONTS, bold, br, button, columns, h, img, link, p, placeholder, starter, styled } from "./nodes";
import { wellnessFooter } from "./footers";

// Figma: "Fourth email - like Beam" (High Fidelity). Company name, logo,
// product names and address are placeholders; everything else follows the design.
const PINK = "#FDE1EB";
const INK = "#2E2A2B";

const benefit = (text: string) => p(styled({ size: 18 }, ["✔︎  ", text]));

const product = (name: string, text: string) => [
	img(placeholder("wellness-tile"), name),
	p(bold(name)),
	p(text),
	p(link("https://", bold(styled({ size: 13 }, "SHOP NOW")))),
];

export default starter({
	id: "ingredient-spotlight",
	name: "Ingredient Spotlight",
	description:
		"Explain one ingredient: a soft pink hero, its key benefits as a checklist and the products that contain it.",
	category: "library",
	style: {
		background_color: "#FFFFFF",
		content_background: "#F8F0ED",
		font_family: FONTS.serif,
		link_color: INK,
	},
	header: {
		background_color: PINK,
		text_color: INK,
		padding_y: 24,
		padding_x: 24,
		content: [
			p(styled({ size: 14 }, "$25 OFF OUR BEST-SELLERS"), "center"),
			p(bold(styled({ size: 28 }, "YOUR BRAND")), "center"),
			h(
				1,
				styled({ size: 64, color: "#FFFFFF" }, ["INGREDIENT SPOTLIGHT", br, "Secret key"]),
				"center",
			),
			p(
				styled(
					{ size: 18 },
					"Ashwagandha, a revered adaptogen used for centuries, is shown to help reduce stress and support overall well-being. That’s why it’s a core ingredient in Daily Greens and Radiance.",
				),
				"center",
			),
			button("LEARN MORE", { background: INK, align: "center" }),
			img(placeholder("wellness-hero"), "Ashwagandha"),
		],
	},
	body: {
		background_color: "#F8F0ED",
		text_color: INK,
		padding_y: 32,
		padding_x: 24,
		content: [
			p(styled({ size: 14 }, "KEY BENEFITS"), "center"),
			h(2, styled({ size: 32 }, "Ashwagandha"), "center"),
			img(placeholder("wellness-tile"), "Ashwagandha", { width: 552 }),
			benefit("Helps the body cope with stress and anxiety*"),
			benefit("Supports enhanced mental clarity and focus*"),
			benefit("Helps improve energy and endurance during exercise*"),
			benefit("Supports a strengthened immune system*"),
			benefit("Has been shown to support regulation of hormones*"),
			p(),
			h(1, styled({ size: 40 }, "Ashwagandha is a Key Ingredient of:"), "center"),
			columns(
				[
					product("Daily Greens", "Super-powered greens for foundational nutrition."),
					product("Radiance", "For balanced hormones, stronger hair, plus lasting energy."),
				],
				{ gap: 32 },
			),
		],
	},
	footer: wellnessFooter(),
});
