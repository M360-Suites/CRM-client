import { FONTS, bold, button, columns, h, img, link, p, placeholder, starter, styled } from "./nodes";
import { fashionFooter } from "./footers";

// Figma: "Second email - Like Birdies" (High Fidelity). Company name, logo,
// technology name and address are placeholders; everything else follows the design.
const INK = "#0E0E0E";

const label = (text: string) => p(bold(text), "center");
const shopNow = () => button("SHOP NOW", { background: INK, radius: 0, align: "center" });
const tile = (alt: string) => [img(placeholder("fashion-grid"), alt), p(link("https://", bold("Shop now")), "center")];

export default starter({
	id: "style-spotlight",
	name: "Style Spotlight",
	description:
		"Spotlight one style: a big photo, what makes it special, a close-up with a customer review and four more styles to shop.",
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
		padding_x: 24,
		content: [
			p(bold(styled({ size: 22 }, "YOUR BRAND")), "center"),
			h(1, styled({ size: 56 }, "style spotlight"), "center"),
			label("THE BALLET FLAT"),
			img(placeholder("fashion-hero"), "The ballet flat"),
		],
	},
	body: {
		background_color: "#FFFFFF",
		text_color: INK,
		padding_y: 24,
		padding_x: 24,
		content: [
			p(
				styled(
					{ size: 18 },
					"Crafted with our Barefoot Comfort Technology, our best-selling ballet flats bend like you’re barefoot and feel light as air, with 7 layers of comfort and full arch support.",
				),
				"center",
			),
			shopNow(),
			p(),
			label("DETAILS, DETAILS, DETAILS"),
			img(placeholder("fashion-wide"), "Ballet flat details"),
			p(
				styled(
					{ size: 18 },
					"The inside is so padded it’s truly like wearing a slipper. I wore them on a trip through airports and walking on cement, and I had no complaints from my feet, which is a miracle!",
				),
				"center",
			),
			p(bold(styled({ size: 14 }, "CAROL L.")), "center"),
			shopNow(),
			p(),
			label("SHOP OUR SPRING STYLES"),
			columns([tile("Spring style one"), tile("Spring style two")], { gap: 24 }),
			columns([tile("Spring style three"), tile("Spring style four")], { gap: 24 }),
		],
	},
	footer: fashionFooter(),
});
