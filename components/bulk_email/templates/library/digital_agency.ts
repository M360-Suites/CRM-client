import { FONTS, br, button, columns, h, img, link, p, placeholder, starter, styled } from "./nodes";
import { socialIcons } from "./footers";

// Figma: "Group 1000006730" (the Digital Dynamo email, High Fidelity)
const NAVY = "#000066";
const DARK = "#0B0B3B";
const MUTED = "#64646A";

const article = (title: string, text: string, imageFirst: boolean) => {
	const picture = [img(placeholder("campaign-feature"), title)];
	const words = [
		h(3, styled({ size: 16, color: NAVY }, title), imageFirst ? "left" : "right"),
		p(styled({ size: 12, color: MUTED }, text), imageFirst ? "left" : "right"),
	];
	return columns(imageFirst ? [picture, words] : [words, picture], { gap: 24, valign: "middle" });
};

export default starter({
	id: "digital-agency",
	name: "Elevate Your Digital Presence",
	description:
		"A services newsletter: a dark hero with one button, four alternating articles, a customer-stories band and support details.",
	category: "library",
	style: {
		background_color: "#EEF2F6",
		content_background: "#FFFFFF",
		font_family: FONTS.modern,
		link_color: NAVY,
	},
	header: {
		background_color: DARK,
		text_color: "#FFFFFF",
		padding_y: 40,
		padding_x: 72,
		content: [
			p(styled({ size: 26 }, "Logo"), "center"),
			p(),
			h(2, styled({ size: 24 }, "Elevate Your Digital Presence"), "center"),
			p(
				styled(
					{ size: 12, color: "#D4D4D4" },
					"Unfold the endless possibilities of the digital realm. With our insights and tools, navigate the pathways to increase your brand's visibility and engagement online.",
				),
				"center",
			),
			button("Jumpstart Your Digital Journey", { background: "#FFFFFF", color: DARK, align: "center" }),
		],
	},
	body: {
		background_color: "#FFFFFF",
		text_color: "#313131",
		padding_y: 40,
		padding_x: 48,
		content: [
			h(2, styled({ size: 24, color: "#00006D" }, "Supercharge Your Online Engagement"), "center"),
			p(
				styled(
					{ size: 12, color: "#5C5C61" },
					"Benefit from our bespoke strategies tailored to maximize your online interactions and captivate your audience.",
				),
				"center",
			),
			p(),
			article(
				"Inclusivity Matters: Ensure Accessibility",
				"Crafting accessible content isn't just compliant; it opens doors to a broader audience base, enhancing inclusivity.",
				true,
			),
			article(
				"The Power of Palette: Choosing Apt Colors",
				"The right color combinations can evoke emotions and actions. Learn how to choose palettes that resonate with your brand's voice.",
				false,
			),
			article(
				"Narrate with Visuals: Embrace Imagery",
				"A picture speaks a thousand words. Use impactful visuals to weave your brand's narrative.",
				true,
			),
			article(
				"Teamwork Triumphs: Efficient Campaign Planning",
				"Plan, collaborate, and execute. Successful campaigns are a result of synchronized team efforts.",
				false,
			),
		],
	},
	footer: {
		background_color: DARK,
		text_color: "#D4D4D4",
		padding_y: 40,
		padding_x: 32,
		content: [
			p(
				styled({ size: 14 }, [
					"Join Thousands in Their Digital Success",
					br,
					br,
					"Over 27,000 satisfied customers have chosen Digital Dynamo to bolster their online brand presence. Discover their stories.",
				]),
				"center",
			),
			button("Explore Success Stories", { background: "#FFFFFF", color: DARK, align: "center" }),
			p(),
			p(
				styled({ size: 14 }, [
					"Got Questions? We're Here to Help! Reach out to us at ",
					...link("mailto:customer.support@digitaldynamo.com", "customer.support@digitaldynamo.com"),
					" or delve into our FAQs. Our team is available round the clock to assist you.",
				]),
				"center",
			),
			p(styled({ size: 14 }, "Connect with us"), "center"),
			socialIcons("social-digital", 207),
			p(
				styled({ size: 13 }, [
					"You are receiving this email because you've expressed interest in \"Digital Dynamo.\"",
					br,
					"For more info or to modify your subscription preferences, click here.",
					br,
					"Address: 123 Digital Drive, Dynamo City, DD 12345",
				]),
				"center",
			),
		],
	},
});
