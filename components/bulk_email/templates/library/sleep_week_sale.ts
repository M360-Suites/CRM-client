import { FONTS, bold, br, button, columns, h, img, p, placeholder, starter, styled } from "./nodes";
import { wellnessFooter } from "./footers";

// Figma: "Second email - like Beam" (High Fidelity). Company name, logo and
// address are placeholders; everything else follows the design.
const LILAC = "#9E94C7";
const INK = "#2E2A2B";
const CREAM = "#F7F4EF";

const tip = (title: string, text: string, imageFirst: boolean) => {
	const picture = [img(placeholder("wellness-tile"), title)];
	const words = [h(3, styled({ size: 24 }, title)), p(text)];
	return columns(imageFirst ? [picture, words] : [words, picture], { gap: 24, valign: "middle" });
};

export default starter({
	id: "sleep-week-sale",
	name: "Sleep Week Sale",
	description:
		"A themed-week sale: a lilac hero with the discount, three alternating sleep tips with pictures, then a closing offer.",
	category: "library",
	style: {
		background_color: "#FFFFFF",
		content_background: CREAM,
		font_family: FONTS.serif,
		link_color: INK,
	},
	header: {
		background_color: LILAC,
		text_color: "#FFFFFF",
		padding_y: 24,
		padding_x: 24,
		content: [
			p(styled({ size: 14 }, "SLEEP AWARENESS WEEK: ENJOY UP TO 35% OFF NIGHTCAP"), "center"),
			p(bold(styled({ size: 28 }, "YOUR BRAND")), "center"),
			h(1, styled({ size: 64 }, ["SLEEP WEEK", br, "Enjoy 35% off"]), "center"),
			p(
				styled(
					{ size: 18 },
					"There’s no time like Sleep Week to create a better Nightcap routine. Shop your favorite, sleep-supporting blends now and enjoy up to 35%!",
				),
				"center",
			),
			button("SAVE 35%", { background: "#FFFFFF", color: INK, align: "center" }),
			img(placeholder("wellness-hero"), "Sleep Week"),
		],
	},
	body: {
		background_color: CREAM,
		text_color: INK,
		padding_y: 40,
		padding_x: 24,
		content: [
			h(1, styled({ size: 40 }, "Sleep Tips & Tricks"), "center"),
			tip(
				"Stay consistent",
				"Going to bed and waking up at the same time every day helps to regulate your body’s internal clock, which supports better sleep quality over time.",
				true,
			),
			tip(
				"Limit screen time",
				"Limiting screens and blue light at least an hour before bedtime helps your body prepare for a restful night of sleep.",
				false,
			),
			tip(
				"Create a sanctuary",
				"Make your bedroom a sleep-friendly space by keeping things cool, dark, and quiet to minimize distractions and ensure a peaceful night of rest.",
				true,
			),
			p(),
			h(1, styled({ size: 40 }, "Start Dreaming"), "center"),
			p(
				styled(
					{ size: 18 },
					"Nightcap is the evening sleep support that helps you fall asleep faster and stay asleep longer.",
				),
				"center",
			),
			img(placeholder("wellness-hero"), "Nightcap"),
			button("SAVE 35% ON NIGHTCAP", { background: INK, align: "center" }),
		],
	},
	footer: wellnessFooter(),
});
