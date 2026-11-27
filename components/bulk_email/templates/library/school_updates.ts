import { FONTS, bold, br, button, columns, h, hr, img, link, p, placeholder, starter, styled } from "./nodes";

// Figma: "School Updates" (High Fidelity)
const CORAL = "#F25C54";

const story = (title: string, text: string, cta: string) =>
	columns(
		[
			[img(placeholder("school-thumb"), title, { radius: 4 })],
			[
				p([bold(title), br, styled({ size: 14 }, text)]),
				button(cta.toUpperCase(), { background: CORAL, radius: 4 }),
			],
		],
		{ gap: 20, valign: "middle" },
	);

export default starter({
	id: "school-updates",
	name: "School Updates",
	description:
		"A newsletter for schools and communities: an event announcement up top, then three short stories with buttons.",
	category: "classic",
	style: {
		background_color: "#F3F4F6",
		content_background: "#FFFFFF",
		font_family: FONTS.modern,
		link_color: CORAL,
	},
	header: {
		background_color: "#111111",
		text_color: "#FFFFFF",
		padding_y: 20,
		padding_x: 20,
		content: [
			p(bold(styled({ size: 18 }, "Madison School District"))),
			img(placeholder("school-banner"), "Event photo"),
		],
	},
	body: {
		background_color: "#F5F5F5",
		text_color: "#334155",
		padding_y: 40,
		padding_x: 40,
		content: [
			h(1, ["Baked Delights ", styled({ color: CORAL }, "Gala")], "center"),
			p(
				"Join us for a delicious extravaganza! Our students have worked hard to prepare an array of baked goods to tantalize your taste buds.",
				"center",
			),
			p(
				"To support the Junior class's journey to Brazil, come relish our bake sale next Monday after classes!",
				"center",
			),
			p(styled({ size: 14, color: "#0F172A" }, "Central School Auditorium, 2:30 p.m. - 3:30 p.m."), "center"),
			button("CAN'T MAKE IT TO THE GALA? SUPPORT ONLINE!", { background: CORAL, align: "center" }),
			hr(),
			h(1, "School Updates", "center"),
			story(
				"Emily's Adventure in Spain",
				"High school student Emily embarked on a six-month adventure in Spain, delving deep into its culture, language, and history. Dive into her story to uncover her experiences and learnings.",
				"Discover more",
			),
			story(
				"Principal Laura Mitchell's Farewell",
				"After leading Madison School District for over twelve years, Principal Laura Mitchell is taking a well-deserved retirement. Join us in celebrating her outstanding contributions.",
				"Learn more",
			),
			story(
				"Mastering Remote Learning",
				"Navigating online schooling can be challenging. Our latest webinar covers essential tools, techniques, and strategies to ensure your child's success. A must-watch for all parents!",
				"Learn more",
			),
		],
	},
	footer: {
		background_color: "#F3F3F3",
		text_color: "#475569",
		padding_y: 28,
		padding_x: 40,
		content: [
			p(
				[
					link("https://", "Facebook"),
					"  ·  ",
					link("https://", "X"),
					"  ·  ",
					link("https://", "Instagram"),
					"  ·  ",
					link("https://", "LinkedIn"),
				],
				"center",
			),
			p(styled({ size: 12 }, "Madison School District · Street address, City, Postcode"), "center"),
		],
	},
});
