import { FONTS, bold, button, columns, h, img, p, placeholder, starter, styled } from "./nodes";
import { learnFooter } from "./footers";

// Figma: "Third email - Like Codecademy" (High Fidelity). Company name, logo
// and address are placeholders; everything else follows the design.
const PURPLE = "#3A10E5";
const NAVY = "#10162F";
const PEACH = "#FFF0E5";

const path = (title: string, text: string) => [
	img(placeholder("learn-grid"), title),
	h(3, styled({ size: 22 }, title)),
	p(styled({ size: 15 }, text)),
];

export default starter({
	id: "certification-paths",
	name: "Prep for Success",
	description:
		"Promote certification prep: an intro with one button, four paths in a dark two-column grid and a closing call to action.",
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
		padding_y: 48,
		padding_x: 56,
		content: [
			p(bold(styled({ size: 20 }, "YOUR BRAND"))),
			img(placeholder("learn-hero"), "Prep for success"),
			h(1, styled({ size: 42 }, "Prep for success")),
			p(
				"The trick for navigating a competitive job market is to stand out with stellar skills and certifications. You can do just that with our growing list of certification prep paths.",
			),
			p(
				"Prepare and practice for the most in-demand industry certifications from AWS, Microsoft, CompTIA, ISC2, and more — all included with Pro and Plus plans.",
			),
			button("See all paths", { background: PURPLE, radius: 4 }),
		],
	},
	body: {
		background_color: NAVY,
		text_color: PEACH,
		padding_y: 40,
		padding_x: 56,
		content: [
			h(1, styled({ size: 42 }, "See what’s popular")),
			columns(
				[
					path(
						"AWS certifications",
						"Start or grow in your cloud career with guided paths that prep you for top AWS certifications including Cloud Practitioner, Solutions Architect, and more.",
					),
					path(
						"Microsoft certifications",
						"Build the skills needed to prepare for Microsoft certifications like Azure Fundamentals, Azure AI Fundamentals, Power BI Data Analyst Associate, and more.",
					),
				],
				{ gap: 32 },
			),
			columns(
				[
					path(
						"CompTIA certifications",
						"Prove your tech knowledge wherever you’re at in your career with certification prep for CompTIA A+, Security+, Network+, Linux+, ITF+, and more.",
					),
					path(
						"ISC2 certifications",
						"Show you have top tier cybersecurity skills with Certified Cloud Security Professional (CISSP) and Certified Information Systems Security Professional (CCSP) prep.",
					),
				],
				{ gap: 32 },
			),
		],
	},
	footer: {
		...learnFooter(),
		background_color: PURPLE,
		text_color: "#FFFFFF",
		content: [
			h(2, styled({ size: 32 }, "Not sure which path to take next? Explore all 20+"), "center"),
			button("See all paths", { background: PEACH, color: NAVY, radius: 4, align: "center" }),
			p(),
			...learnFooter().content,
		],
	},
});
