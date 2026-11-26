import { FONTS, bold, button, columns, h, img, link, p, placeholder, starter, styled } from "./nodes";
import { socialIcons } from "./footers";

// Figma: "Group 1000006729" (the Adventure Diaries travel email, High Fidelity)
const YELLOW = "#F4D115";
const INK = "#111111";

const story = (n: string, title: string, text: string, label: string) => [
	img(placeholder("travel-hero"), title),
	p(styled({ size: 16, color: "#252525" }, n)),
	h(1, styled({ size: 48 }, title), "center"),
	p(styled({ size: 20 }, bold(text)), "center"),
	button(label, { background: YELLOW, color: "#000000", radius: 19, align: "center" }),
	p(),
];

export default starter({
	id: "travel-destinations",
	name: "Explore New Destinations",
	description:
		"A travel newsletter: a big hero, three numbered stories with buttons and a newsletter sign-up card.",
	category: "library",
	style: {
		background_color: "#EEF2F6",
		content_background: "#FFFFFF",
		font_family: FONTS.serif,
		link_color: INK,
	},
	header: {
		background_color: INK,
		text_color: "#FFFFFF",
		padding_y: 16,
		padding_x: 24,
		content: [
			columns(
				[
					[p(bold("LOGO"))],
					[
						p(
							styled({ size: 12 }, [
								...link("https://", "Home"),
								"    ",
								...link("https://", "Services"),
								"    ",
								...link("https://", "Blog"),
								"    ",
								...link("https://", "Contact"),
							]),
							"right",
						),
					],
				],
				{ valign: "middle" },
			),
			img(placeholder("travel-hero"), "Explore new destinations"),
			h(1, styled({ size: 56 }, "Explore New Destinations"), "center"),
			p(bold(styled({ size: 20 }, "Discover breathtaking spots around the world.")), "center"),
		],
	},
	body: {
		background_color: "#FFFFFF",
		text_color: INK,
		padding_y: 32,
		padding_x: 24,
		content: [
			...story(
				"01",
				"Crafting Memorable Journeys",
				"Dive into the intricacies of creating unforgettable trips. Explore detailed guides and tips.",
				"Discover More",
			),
			...story(
				"02",
				"Trekking Adventures Await",
				"Traverse through the most scenic hiking spots. Get ready to challenge your limits.",
				"Get Started",
			),
			...story(
				"03",
				"Ports of Wonder",
				"Set sail to the most beautiful harbors and coastal cities the world has to offer.",
				"Explore Now",
			),
			h(3, styled({ size: 18 }, "Stay Updated With Our Travel Diaries"), "center"),
			p(
				styled(
					{ size: 16, color: "#3F3F3F" },
					"Join our newsletter and never miss an update on the latest travel trends and destinations.",
				),
				"center",
			),
			columns(
				[
					[img(placeholder("travel-card"), "Special trendy collections")],
					[
						p(styled({ size: 23 }, "Special Trendy Collections")),
						p(link("https://", styled({ size: 17, color: "#494747" }, "[Read More]"))),
						button("Join Now", { background: YELLOW, color: "#000000", radius: 19 }),
					],
				],
				{ gap: 24, valign: "middle" },
			),
		],
	},
	footer: {
		background_color: "#3D3A3A",
		text_color: "#FFFFFF",
		padding_y: 32,
		padding_x: 48,
		content: [
			p(bold(styled({ size: 18 }, "Get In Touch")), "center"),
			p(
				styled(
					{ size: 14 },
					"Have questions or need assistance? Reach out, and our team will be happy to help.",
				),
				"center",
			),
			p(bold(styled({ size: 14 }, "Follow Us for Exclusive Deals!")), "center"),
			socialIcons("social-travel", 270),
			p(bold(styled({ size: 12 }, "1234 Wanderlust Lane, Traveltown, TP 56789")), "center"),
			p(styled({ size: 12 }, "© 2023 Adventure Diaries. All rights reserved."), "center"),
		],
	},
});
