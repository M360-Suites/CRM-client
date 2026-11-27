import { FONTS, bold, br, button, columns, h, img, link, p, placeholder, starter, styled } from "./nodes";
import { linkRow, socialIcons } from "./footers";

// Figma: "Group 1000006728" (the Festive Moments email, High Fidelity)
const RED = "#E3473C";
const INK = "#000000";

const post = (title: string, text: string) => [
	img(placeholder("school-thumb"), title, { radius: 13 }),
	p(bold(styled({ size: 16 }, title))),
	p(styled({ size: 11 }, text)),
];

export default starter({
	id: "holiday-edition",
	name: "Embrace the Festive Spirit",
	description:
		"A festive newsletter: a seasonal hero, a five-post blog grid, a red feature band, a two-up news section and contact details.",
	category: "library",
	style: {
		background_color: "#FDF6F0",
		content_background: "#FFFFFF",
		content_width: 668,
		font_family: FONTS.serif,
		link_color: INK,
	},
	header: {
		background_color: "#FFFFFF",
		text_color: "#202020",
		padding_y: 28,
		padding_x: 28,
		content: [
			h(2, styled({ size: 25 }, "Embrace the festive spirit!"), "center"),
			button("Link to online version of the email.", { background: RED, radius: 5, align: "center" }),
			linkRow(["Specials", "Holiday edition", "Get in touch"], 15),
			img(placeholder("school-banner"), "Festive origins and traditions"),
			h(2, styled({ size: 27 }, "Festive Origins and Traditions"), "center"),
			p(
				styled(
					{ size: 14 },
					"Discover the roots of our cherished festive customs and the significance behind them. From ornaments to festive foods, uncover the stories that have been passed down through generations.",
				),
				"center",
			),
			p(),
			h(2, styled({ size: 27 }, "Blogs"), "center"),
			columns(
				[
					post(
						"Festive Treats",
						"Explore the rich variety of holiday treats, from gingerbread cookies to fruitcake, and learn about their origins.",
					),
					post(
						"Warm Beverages",
						"Dive into the warm and cozy world of festive drinks. Whether it's hot cocoa or mulled wine, there's a story behind every sip.",
					),
					post(
						"Sparkling Adornments",
						"Unveil the history of festive jewelry and how these shimmering pieces became a part of our celebrations.",
					),
				],
				{ gap: 24 },
			),
			columns(
				[
					post(
						"Winter Celebrations",
						"Delve into the diverse ways people around the world come together to celebrate this joyful season.",
					),
					post(
						"Thoughtful Gifting",
						"Explore the tradition of gifting and how it evolved over time, becoming an integral part of our festive rituals.",
					),
				],
				{ gap: 24 },
			),
		],
	},
	body: {
		background_color: RED,
		text_color: "#FFFFFF",
		padding_y: 32,
		padding_x: 96,
		content: [
			h(2, styled({ size: 27 }, "Blogs"), "center"),
			p(
				styled(
					{ size: 12 },
					"Delve deeper into the origins of holiday traditions. From ancient customs to modern-day practices, discover how they've shaped our festive celebrations today.",
				),
				"center",
			),
		],
	},
	footer: {
		background_color: "#FFFFFF",
		text_color: INK,
		padding_y: 32,
		padding_x: 96,
		content: [
			h(2, styled({ size: 27 }, "News Section"), "center"),
			columns(
				[
					post(
						"Festive decor",
						"Get inspired by the latest trends in holiday decor and transform your home into a winter wonderland.",
					),
					post(
						"Joyful moments",
						"Celebrate the small moments that bring immense joy. From carol singing to tree decorating, relive the magic.",
					),
				],
				{ gap: 28 },
			),
			p(),
			h(2, styled({ size: 27, color: RED }, ["Festive Moments", br, "Connect with us:"]), "center"),
			socialIcons("social-festive", 239),
			p(styled({ size: 10 }, "Address: 1234 Pine Street, Holiday Town, HT 12345, Country"), "center"),
			p(
				styled({ size: 10 }, [
					"Copyright: © 2023 Festive Moments. All Rights Reserved.",
					br,
					...link("https://", "[Terms & Conditions]"),
					" ",
					...link("https://", "[Unsubscribe]"),
				]),
				"center",
			),
			button("Reach out", { background: RED, radius: 5, align: "center" }),
		],
	},
});
