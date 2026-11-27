import { FONTS, bold, button, h, img, p, placeholder, starter, styled } from "./nodes";
import { learnFooter } from "./footers";

// Figma: "Sixth email - Like Codecademy" (High Fidelity). Company name,
// logo and address are placeholders; everything else follows the design.
const PURPLE = "#3A10E5";
const NAVY = "#10162F";
const PEACH = "#FFF0E5";

const TERMS =
	"60% Off Pro offer valid from January 14, 2025 at 12:00:00 am Eastern Time (\"ET\") and ends at 11:59:59 pm ET on January 22, 2025. Discount is only applicable to new annual subscription plans (excluding Plus and Pro Student plans), and cannot be combined with any other offer or used for any Your Company for Business plans. Discount applies to the first year of a new subscription, after which the subscription will auto-renew for subsequent years at the regular price. Code valid one time only. Discount applies to certain products and not all products are available in all countries. Discount is not applicable to taxes. Your Company reserves the right to modify or cancel this promotion at any time without notice. Any subscription plan purchases are subject to Your Company's Terms of Service.";

export default starter({
	id: "biggest-sale",
	name: "Biggest Sale Ever",
	description:
		"A bright sale email: banner images, a huge discount headline with a code and one button, then the offer's terms.",
	category: "library",
	style: {
		background_color: "#FFFFFF",
		content_background: PEACH,
		font_family: FONTS.sans,
		link_color: PURPLE,
	},
	header: {
		background_color: PEACH,
		text_color: NAVY,
		padding_y: 0,
		padding_x: 0,
		content: [
			img(placeholder("learn-hero"), "Biggest sale ever"),
			img(placeholder("learn-hero"), "Save 60% on Pro"),
		],
	},
	body: {
		background_color: PEACH,
		text_color: NAVY,
		padding_y: 48,
		padding_x: 56,
		content: [
			button("Biggest sale ever", { background: PURPLE, radius: 4 }),
			h(1, styled({ size: 64 }, "60% off Pro")),
			p(
				"Set your goals for 2025 — then let us help you achieve them. Now through January 22, save 60% on Pro and unlock access to 600+ courses with in-demand topics like AI and cybersecurity, plus industry certification prep, and more.",
			),
			p(
				["Set a weekly learning target, track your progress, and join our community to stay motivated. Use code ", bold("UPSKILL2025"), " to save."],
			),
			button("Save 60%", { background: PURPLE, radius: 4 }),
			img(placeholder("learn-hero"), "Courses"),
		],
	},
	footer: {
		...learnFooter(),
		content: [p(styled({ size: 11, color: "#757575" }, TERMS)), ...learnFooter().content],
	},
});
