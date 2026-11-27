import { FONTS, bold, button, columns, h, img, link, p, placeholder, starter, styled } from "./nodes";

// Figma: "First email - Like Codecademy" (High Fidelity), with the branding removed
const PURPLE = "#3A10E5";
const INK = "#10162F";

const course = (title: string, text: string) => [
	img(placeholder("learn-grid"), title, { radius: 4 }),
	h(3, title),
	p(styled({ size: 14 }, text)),
	p(bold(link("https://", "Start learning →"))),
];

export default starter({
	id: "course-welcome",
	name: "Learn Something New",
	description:
		"Welcome new learners with a bright hero, then recommend four courses or resources in a two-column grid.",
	category: "classic",
	style: {
		background_color: "#F5F3FF",
		content_background: "#FFFFFF",
		font_family: FONTS.modern,
		link_color: PURPLE,
	},
	header: {
		background_color: PURPLE,
		text_color: "#FFFFFF",
		padding_y: 40,
		padding_x: 48,
		content: [
			p(bold(styled({ size: 18 }, "Your Brand"))),
			p(),
			h(1, styled({ size: 36 }, "Learn new skills to achieve your goal")),
			p(
				"Working toward a new goal doesn't have to be intimidating. Our interactive lessons make learning something new easy and fun, so you can get started today.",
			),
			img(placeholder("learn-hero"), "Course illustration"),
		],
	},
	body: {
		background_color: "#FFF5EE",
		text_color: INK,
		padding_y: 40,
		padding_x: 48,
		content: [
			h(2, "Try one of our top-rated courses"),
			p("Hi {{contact.first_name}}, here are a few places to start, picked for beginners."),
			p(),
			columns(
				[
					course("Course one", "A short line about what learners will be able to do afterwards."),
					course("Course two", "A short line about what learners will be able to do afterwards."),
				],
				{ gap: 32 },
			),
			columns(
				[
					course("Course three", "A short line about what learners will be able to do afterwards."),
					course("Course four", "A short line about what learners will be able to do afterwards."),
				],
				{ gap: 32 },
			),
			button("Explore all courses", { background: PURPLE, radius: 4 }),
		],
	},
	footer: {
		background_color: "#FFFFFF",
		text_color: "#64748B",
		padding_y: 32,
		padding_x: 48,
		content: [
			p(
				[
					link("https://", "Help center"),
					"  ·  ",
					link("https://", "Catalog"),
					"  ·  ",
					link("https://", "Pricing"),
					"  ·  ",
					link("https://", "Blog"),
				],
				"center",
			),
			p(styled({ size: 12 }, "Your Company Ltd. · Street address, City, Postcode"), "center"),
		],
	},
});
