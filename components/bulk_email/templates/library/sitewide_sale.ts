import { FONTS, bold, button, columns, h, img, link, p, placeholder, starter, styled } from "./nodes";
import { fashionFooter } from "./footers";

// Figma: "Eighth email - Like Birdies" (High Fidelity). Company name, logo
// and address are placeholders; everything else follows the design.
const INK = "#0E0E0E";

const cat = (name: string) => p(link("https://", bold(styled({ size: 20 }, name))), "center");
const row = (a: string, b: string) => columns([[cat(a)], [cat(b)]]);

export default starter({
	id: "sitewide-sale",
	name: "50% Off Sitewide",
	description:
		"A tall hero for a sitewide offer, one shop button and a tidy list of eight categories to jump into.",
	category: "library",
	style: {
		background_color: "#FFFFFF",
		content_background: "#FFFFFF",
		font_family: FONTS.modern,
		link_color: INK,
	},
	header: {
		background_color: "#FFFFFF",
		text_color: INK,
		padding_y: 48,
		padding_x: 0,
		content: [
			p(bold(styled({ size: 22 }, "YOUR BRAND")), "center"),
			h(2, styled({ size: 24 }, "50% OFF SITEWIDE"), "center"),
			img(placeholder("fashion-hero"), "Sale"),
		],
	},
	body: {
		background_color: "#FFFFFF",
		text_color: INK,
		padding_y: 32,
		padding_x: 24,
		content: [
			p(
				styled(
					{ size: 18 },
					"Save on all things chic, including new and best-selling styles! Each crafted with the softest cloud-like comfort.",
				),
				"center",
			),
			button("SHOP THE SALE", { background: INK, radius: 0, align: "center" }),
			p(),
			row("LOAFERS", "BALLET FLATS"),
			row("MARY JANES", "HEELS"),
			row("SNEAKERS", "BOOTS"),
			row("MULES", "SANDALS"),
		],
	},
	footer: fashionFooter(),
});
