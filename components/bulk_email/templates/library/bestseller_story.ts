import { FONTS, bold, button, columns, h, img, p, placeholder, starter, styled } from "./nodes";
import { goodsFooter, linkRow } from "./footers";

// Figma: "Third email - Like Bellroy" (High Fidelity). Company name, logo,
// product name and address are placeholders; everything else follows the design.
const ORANGE = "#F34D01";
const GREY = "#474747";
const DARK = "#333436";

const detail = (title: string, text: string, imageFirst: boolean) => {
	const picture = [img(placeholder("goods-side"), title)];
	const words = [p(bold(styled({ size: 18 }, title)), "center"), p(styled({ size: 18 }, text), "center")];
	return columns(imageFirst ? [picture, words] : [words, picture], { gap: 24, valign: "middle" });
};

export default starter({
	id: "bestseller-story",
	name: "The Original Best-seller",
	description:
		"Tell the story of a best-seller: a hero, a five-star review, three alternating details and a closing photo.",
	category: "library",
	style: {
		background_color: "#FFFFFF",
		content_background: "#F6F7F9",
		font_family: FONTS.modern,
		link_color: DARK,
	},
	header: {
		background_color: GREY,
		text_color: "#FFFFFF",
		padding_y: 24,
		padding_x: 24,
		content: [
			linkRow(["WALLETS", "BAGS", "ACCESSORIES", "NEW RELEASES"], 11),
			p(bold(styled({ size: 24 }, "YOUR BRAND")), "center"),
			img(placeholder("goods-hero"), "Slim wallet"),
			h(1, styled({ size: 48 }, "The O.G. slim wallet"), "center"),
			p(
				styled(
					{ size: 18 },
					"The Slim Wallet was our first design. And through iterations, variations and updates it’s remained a bestseller. What gives this wallet so much staying power? Let’s see...",
				),
				"center",
			),
			img(placeholder("goods-wide"), "Slim wallet detail"),
			button("SHOP THE SLIM WALLET", { background: ORANGE, radius: 8, align: "center" }),
		],
	},
	body: {
		background_color: "#F6F7F9",
		text_color: DARK,
		padding_y: 40,
		padding_x: 24,
		content: [
			p(bold(styled({ size: 32, color: ORANGE }, "★★★★★")), "center"),
			p(
				styled(
					{ size: 18 },
					"I’ve been using one of these for two years, and in my opinion it’s the perfect wallet.",
				),
				"center",
			),
			p(bold(styled({ size: 12 }, "-DANIEL")), "center"),
			p(),
			detail("HELLO PULL TAB!", "Easily access your stacked cards with a simple tug.", true),
			detail("MORE THAN CARDS", "There’s room for folded bills, for when cash is king.", false),
			detail("SIMPLY SLIM", "Made with nothing but leather and thread, for minimal bulk.", true),
			p(),
			h(1, styled({ size: 48 }, "Better with age"), "center"),
			img(placeholder("goods-wide"), "Leather wallet"),
			p(
				styled(
					{ size: 18 },
					"The premium eco-tanned leather stands the test of time, and only gets better-looking as it does.",
				),
				"center",
			),
			button("SHOP THE SLIM WALLET", { background: ORANGE, radius: 8, align: "center" }),
		],
	},
	footer: goodsFooter(),
});
