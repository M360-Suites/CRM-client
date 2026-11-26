import { FONTS, bold, button, columns, h, img, p, placeholder, starter, styled } from "./nodes";
import { fashionFooter } from "./footers";

// Figma: "Fifth email - Like Birdies" (High Fidelity). Company name, logo,
// style name and address are placeholders; everything else follows the design.
const SAGE = "#758A5F";
const INK = "#0E0E0E";

const variant = (name: string, imageFirst: boolean) => {
	const picture = [img(placeholder("fashion-grid"), name)];
	const words = [
		p(styled({ size: 12 }, "THE SIGNATURE"), "center"),
		p(bold(name), "center"),
		button("SHOP NOW", { background: "#FFFFFF", color: SAGE, radius: 0, align: "center" }),
	];
	return columns(imageFirst ? [picture, words] : [words, picture], { gap: 0, valign: "middle" });
};

export default starter({
	id: "product-variants",
	name: "Softest Loafers",
	description:
		"Show one style in four finishes, alternating photo and name, each with its own shop button.",
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
			h(1, styled({ size: 72, color: SAGE }, "softest loafers"), "center"),
			img(placeholder("fashion-hero"), "Loafers"),
			p(
				styled(
					{ size: 18 },
					"Our best-selling Signature loafers are designed with pillowy softness you have to feel to believe. Find your perfect pair now.",
				),
				"center",
			),
		],
	},
	body: {
		background_color: SAGE,
		text_color: "#FFFFFF",
		padding_y: 0,
		padding_x: 0,
		content: [
			variant("BLACK VELVET", false),
			variant("LATTE SUEDE", true),
			variant("LEOPARD PRINT CALF HAIR", false),
			variant("NAVY SUEDE", true),
		],
	},
	footer: fashionFooter(),
});
