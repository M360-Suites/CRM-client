import { FONTS, bold, button, h, img, p, placeholder, starter, styled } from "./nodes";
import { learnFooter } from "./footers";

// Figma: "Fifth email - Like Codecademy" (High Fidelity). Company name,
// logo and address are placeholders; everything else follows the design.
const NAVY = "#10162F";
const PEACH = "#FFF0E5";

export default starter({
	id: "limited-offer",
	name: "Free AI Course Offer",
	description:
		"A short dark email for one time-limited offer: a badge, a big headline, one button, a picture and the full terms.",
	category: "library",
	style: {
		background_color: "#FFFFFF",
		content_background: NAVY,
		font_family: FONTS.sans,
		link_color: PEACH,
	},
	header: {
		background_color: NAVY,
		text_color: PEACH,
		padding_y: 48,
		padding_x: 56,
		content: [
			p(bold(styled({ size: 20 }, "YOUR BRAND"))),
			button("Limited time offer", { background: PEACH, color: NAVY, radius: 4 }),
			h(1, styled({ size: 56 }, "Take a free AI course and save 60% on PRO")),
			p(
				"Don't miss out — for a limited time only, enroll in any of our top free AI courses like Intro to Midjourney, Learn How to Use AI for Coding, or Principles of Data Literacy, and we'll email you a discount code to save 60% on a year of Pro.",
			),
			button("Explore AI courses and save", { background: PEACH, color: NAVY, radius: 4 }),
			img(placeholder("learn-hero"), "Free AI courses"),
		],
	},
	body: {
		background_color: "#FFFFFF",
		text_color: "#757575",
		padding_y: 40,
		padding_x: 56,
		content: [
			p(
				styled(
					{ size: 11 },
					"60% Off Pro offer valid from January 14, 2025 at 12:00:00 am Eastern Time (\"ET\") and ends at 11:59:59 pm ET on January 22, 2025. Discount is only applicable to new annual subscription plans (excluding Plus and Pro Student plans), and cannot be combined with any other offer or used for any Your Company for Business plans. Discount applies to the first year of a new subscription, after which the subscription will auto-renew for subsequent years at the regular price. Code valid one time only. Discount applies to certain products and not all products are available in all countries. Discount is not applicable to taxes. Your Company reserves the right to modify or cancel this promotion at any time without notice. Any subscription plan purchases are subject to Your Company's Terms of Service.",
				),
			),
			p(
				styled(
					{ size: 11 },
					"Eligible courses: Intro to Generative AI; Learn How to Use AI for Coding; Learn How to Use ChatGPT; Principles of Data Literacy; Deep Dive Into Generative AI with Azure OpenAI; Generative AI on AWS: Generating Code with Amazon CodeWhisperer; Using OpenAI APIs: Exploring APIs with the OpenAI Playground; Intro to AI Transformers; Intro to Midjourney; Learning Django Using Generative AI Help",
				),
			),
		],
	},
	footer: learnFooter(),
});
