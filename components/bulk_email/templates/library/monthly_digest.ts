import { FONTS, bold, columns, h, hr, img, link, p, placeholder, starter, styled } from "./nodes";
import { learnFooter } from "./footers";

// Figma: "Fourth email - Like Codecademy" (High Fidelity). Company name,
// logo and address are placeholders; everything else follows the design.
const PURPLE = "#3A10E5";
const NAVY = "#10162F";
const PEACH = "#FFF0E5";
const YELLOW = "#FFD300";

const tag = (text: string) => p(bold(styled({ size: 12 }, text)));
const cta = (text: string) => p(link("https://", bold(styled({ color: YELLOW }, text))));

const course = (title: string, text: string) => [
	img(placeholder("learn-grid"), title),
	h(3, styled({ size: 22 }, title)),
	p(text),
	cta("Start course"),
];

const event = (date: string, text: string) => [h(3, styled({ size: 22 }, date)), p(text), cta("Register now")];

export default starter({
	id: "monthly-digest",
	name: "Your Career Decoded",
	description:
		"A dark monthly newsletter: the month's theme, a featured challenge, new courses, upcoming events and a survey.",
	category: "library",
	style: {
		background_color: "#FFFFFF",
		content_background: NAVY,
		font_family: FONTS.sans,
		link_color: YELLOW,
	},
	header: {
		background_color: PURPLE,
		text_color: PEACH,
		padding_y: 24,
		padding_x: 24,
		content: [
			columns(
				[[p(bold(styled({ size: 20 }, "YOUR BRAND")))], [p(bold("February 2025"), "right")]],
				{ valign: "middle" },
			),
		],
	},
	body: {
		background_color: NAVY,
		text_color: PEACH,
		padding_y: 24,
		padding_x: 24,
		content: [
			h(1, styled({ size: 42 }, "Your career decoded")),
			p(
				"While there are no shortcuts to success, there are smarter strategies you can lean on. This month is all about forming your own game plan to reach your career goals — with a little help, of course. From tips to stay accountable to intentions you set earlier this year to events that share big ideas from our own community to an all-new challenge that will help you crack the code to your career growth, see how you can make the most of your learning experience.",
			),
			p("Happy learning,"),
			p("The Your Brand Team"),
			hr(),
			tag("Starts february 17"),
			img(placeholder("learn-hero"), "Operation codebreaker"),
			h(3, styled({ size: 22 }, "Join operation codebreaker")),
			p(
				"Your mission, should you choose to accept it — complete 11 missions in 11 days and crack the code to your career growth. Sign up to get notified when the challenge starts.",
			),
			hr(),
			tag("New courses"),
			columns(
				[
					course(
						"Learn Python Developer Tools with VS Code",
						"Learn how to set up, debug, and unit test your programs using VS Code, a free IDE (integrated development environment).",
					),
					course(
						"Learn Intermediate C++",
						"Dive into memory management, object-oriented programming in C++, and more in this follow-up to our Learn C++ course.",
					),
				],
				{ gap: 32 },
			),
			hr(),
			tag("Upcoming events"),
			...event(
				"February 25",
				"Build an important foundation for creating the structure and content for web pages with HTML.",
			),
			...event(
				"February 27",
				"Learn how to control the flow of a program and use JS to power dynamic behaviors on websites.",
			),
			hr(),
			columns(
				[
					[
						h(3, styled({ size: 22 }, "Share your story")),
						p("Did you switch or advance your career? Please, tell us about your experience."),
						cta("Take our survey"),
					],
					[img(placeholder("learn-grid"), "Share your story")],
				],
				{ gap: 32, valign: "middle" },
			),
		],
	},
	footer: learnFooter(),
});
