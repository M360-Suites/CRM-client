import { FONTS, bold, br, button, columns, h, img, link, p, placeholder, starter, styled } from "./nodes";

// Figma: "Weekly Updates" (High Fidelity)
const NAVY = "#0F3D5E";

const highlight = (title: string, date: string, text: string) => [
	img(placeholder("travel-card"), title, { radius: 6 }),
	h(3, title, "center"),
	p([bold(styled({ size: 13 }, date)), br, styled({ size: 14 }, text)], "center"),
];

const journey = (title: string, text: string) => [
	img(placeholder("travel-small"), title, { radius: 6 }),
	p(bold(title), "center"),
	p(styled({ size: 13 }, text), "center"),
];

export default starter({
	id: "weekly-updates",
	name: "Weekly Updates",
	description:
		"A weekly digest: a short intro, two highlights side by side and three featured stories underneath.",
	category: "starting",
	style: {
		background_color: "#EAF2F8",
		content_background: "#FFFFFF",
		font_family: FONTS.modern,
		link_color: NAVY,
	},
	header: {
		background_color: NAVY,
		text_color: "#FFFFFF",
		padding_y: 28,
		padding_x: 32,
		content: [
			h(1, "VOYAGE CHRONICLES", "center"),
			img(placeholder("travel-hero"), "Destination photo", { radius: 6 }),
		],
	},
	body: {
		background_color: "#FFFFFF",
		text_color: "#334155",
		padding_y: 36,
		padding_x: 32,
		content: [
			h(2, "Dive into the Journey with Voyage Chronicles", "center"),
			p(
				"Embark on a picturesque journey as we take you through untouched terrains, culinary delights and immersive experiences from around the globe. Our aim? To ignite the wanderlust in you and inspire your next adventure.",
				"center",
			),
			button("Read more", { background: NAVY, radius: 4, align: "center" }),
			h(2, "Weekly Highlights", "center"),
			columns(
				[
					highlight(
						"Mountains & Valleys",
						"15th August",
						"Traverse the rugged terrain of the Alps as we uncover hidden gems and majestic viewpoints.",
					),
					highlight(
						"Tropical Delights",
						"16th August",
						"Dive into turquoise waters, lounge by the beach and relish local seafood.",
					),
				],
				{ gap: 24 },
			),
			h(2, "Featured Journeys:", "center"),
			columns([
				journey("Hidden Trails", "Untouched forest trails, and the flora and fauna along the way."),
				journey("Desert Safaris", "Vast dunes, magical sunsets and traditional festivities."),
				journey("Island Getaways", "Island life, coral reefs and water sports."),
			]),
		],
	},
	footer: {
		background_color: "#F1F5F9",
		text_color: "#475569",
		padding_y: 28,
		padding_x: 40,
		content: [
			p(
				[
					bold("Connect and explore. "),
					"Stay up to date with our latest expeditions, travel tips and stories. Your next inspiration might be just a click away!",
				],
				"center",
			),
			p(
				[
					link("https://", "Instagram"),
					"  ·  ",
					link("https://", "YouTube"),
					"  ·  ",
					link("https://", "Facebook"),
				],
				"center",
			),
			p(
				styled(
					{ size: 12 },
					"You're receiving this because you showed interest in Voyage Chronicles.",
				),
				"center",
			),
		],
	},
});
