import { FONTS, bold, button, columns, h, hr, img, link, p, placeholder, starter, styled } from "./nodes";

// Figma: "First email - Like Birdies" (High Fidelity), with the branding removed
const GOLD = "#B8893B";
const INK = "#111111";

const eyebrow = (text: string) => p(bold(styled({ size: 13 }, text.toUpperCase())), "center");

const product = (name: string) => [
	img(placeholder("fashion-grid"), name),
	p(styled({ size: 13 }, name), "center"),
];

export default starter({
	id: "big-sale",
	name: "Seasonal Sale",
	description:
		"Announce a sale with a big headline, a hero image, featured picks in three columns and a clear shop button.",
	category: "library",
	style: {
		background_color: "#F7F4F0",
		content_background: "#FFFFFF",
		font_family: FONTS.serif,
		link_color: INK,
	},
	header: {
		background_color: "#FFFFFF",
		text_color: INK,
		padding_y: 32,
		padding_x: 0,
		content: [
			p(bold(styled({ size: 16 }, "YOUR BRAND")), "center"),
			eyebrow("50% off sitewide"),
			h(1, styled({ size: 96, color: GOLD }, "sale"), "center"),
			img(placeholder("fashion-hero"), "Sale hero photo"),
		],
	},
	body: {
		background_color: "#FFFFFF",
		text_color: "#334155",
		padding_y: 40,
		padding_x: 24,
		content: [
			h(1, "Our biggest sale of the season", "center"),
			p(
				"For a limited time, take half off everything. Tell customers when the sale ends and what's included, then send them straight to the shop.",
				"center",
			),
			button("SHOP THE SALE", { background: INK, radius: 0, align: "center" }),
			hr(),
			eyebrow("Just landed"),
			h(2, "Fresh styles for the new season", "center"),
			img(placeholder("fashion-wide"), "New arrivals photo"),
			p(),
			eyebrow("Customer favourites"),
			columns([product("Product name"), product("Product name"), product("Product name")]),
			h(3, "Free returns, always", "center"),
			p(
				"Not quite right? Send it back within 30 days. Use this space to answer the question customers ask before they buy.",
				"center",
			),
			button("SHOP NOW", { background: INK, radius: 0, align: "center" }),
		],
	},
	footer: {
		background_color: "#F7F4F0",
		text_color: "#57534E",
		padding_y: 32,
		padding_x: 40,
		content: [
			p(bold(styled({ size: 15, color: INK }, "YOUR BRAND")), "center"),
			hr(),
			p(
				[
					link("https://", "Instagram"),
					"  ·  ",
					link("https://", "Facebook"),
					"  ·  ",
					link("https://", "TikTok"),
				],
				"center",
			),
			p(styled({ size: 12 }, "Your Company Ltd. · Street address, City, Postcode"), "center"),
		],
	},
});
