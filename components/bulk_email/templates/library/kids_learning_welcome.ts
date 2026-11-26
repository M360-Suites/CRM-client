import { FONTS, bold, br, button, columns, h, img, link, p, placeholder, starter, styled } from "./nodes";
import { linkRow } from "./footers";

// Figma: "Newsletter Welcome" (the LearnVille one, High Fidelity)
const CORAL = "#F87D75";
const GREEN = "#46A62B";
const INK = "#262626";

const activity = (title: string, text: string, imageFirst: boolean) => {
	const picture = [img(placeholder("newsletter-card"), title, { radius: 8 })];
	const words = [h(3, styled({ size: 18, color: CORAL }, title)), p(styled({ size: 13 }, text))];
	return columns(imageFirst ? [picture, words] : [words, picture], { gap: 20, valign: "middle" });
};

export default starter({
	id: "kids-learning-welcome",
	name: "Welcome to LearnVille",
	description:
		"A playful welcome for a kids' learning product: a big greeting, four activities with pictures, a call to action and app download badges.",
	category: "library",
	style: {
		background_color: "#FFFFFF",
		content_background: "#FFFFFF",
		font_family: FONTS.modern,
		link_color: CORAL,
	},
	header: {
		background_color: "#FFF2DC",
		text_color: INK,
		padding_y: 24,
		padding_x: 40,
		content: [
			p(bold(styled({ size: 20, color: "#95CDE8" }, "LearnVille")), "center"),
			h(1, styled({ size: 52, color: CORAL }, "Welcome"), "center"),
			p(styled({ size: 22 }, "To"), "center"),
			h(1, styled({ size: 42, color: CORAL }, "LearnVille"), "center"),
			p(bold(styled({ color: GREEN }, "Embark on your child's educational adventure TODAY.")), "center"),
			img(placeholder("newsletter-hero"), "Welcome to LearnVille"),
		],
	},
	body: {
		background_color: "#FFFFFF",
		text_color: INK,
		padding_y: 32,
		padding_x: 40,
		content: [
			p(
				bold(styled({ size: 18 }, [
					"Meet Eddie Elephant in LearnVille Reading.",
					br,
					"Dive into your child's tailored educational pathway.",
				])),
				"center",
			),
			h(2, styled({ size: 20 }, "Unearth more learning treasures in LearnVille"), "center"),
			activity(
				"Journey Through Knowledge",
				"Books that inspire a thirst for knowledge. Children showcase their understanding with quizzes and tasks after every reading.",
				true,
			),
			activity("Mind Boosters", "Engaging and playful activities for hands-on learning at their pace.", false),
			activity(
				"Beginning Bibliophiles",
				"Tailored for our Reading Initiative, these beginner books enhance word recognition and boost reading confidence.",
				true,
			),
			activity(
				"Tale Time",
				"Narratives with unique characters and familiar ones like Luna the Astronomer and Ballet Dancer Betty. Watch our 'Alphabet Adventures' for an exciting introduction to letters, brought to life by children!",
				false,
			),
			p(),
			h(2, styled({ size: 20, color: "#1F811A" }, "Kick Off the Learning?"), "center"),
			button("Onwards!", { background: "#567C57", radius: 6, align: "center" }),
		],
	},
	footer: {
		background_color: "#FFF2DC",
		text_color: INK,
		padding_y: 28,
		padding_x: 40,
		content: [
			p(bold(styled({ size: 18, color: CORAL }, "SuperLearn App enhances your LearnVille experience.")), "center"),
			p(styled({ size: 14 }, "Grab it now!"), "center"),
			columns(
				[
					[img(placeholder("badge-google-play"), "Get it on Google Play", { width: 156, align: "right", href: "https://" })],
					[img(placeholder("badge-app-store"), "Download on the App Store", { width: 159, align: "left", href: "https://" })],
				],
				{ gap: 12, valign: "middle" },
			),
			p(styled({ size: 14 }, "Become a part of our family"), "center"),
			linkRow(["Facebook", "Instagram", "YouTube", "X"], 13),
			p(
				styled({ size: 10 }, [
					"Got suggestions for LearnVille? Share at ",
					...link("mailto:feedback@learnvilleapp.com", "feedback@learnvilleapp.com"),
					".",
					br,
					"Explore: www.learnvillewebsite.com",
					br,
					"© 2023 Learn With LearnVille",
					br,
					"LearnVille, 123 Learning Lane, Imaginary City, 45678",
				]),
				"center",
			),
			linkRow(["Terms of Service", "Privacy", "Opt-out"], 10),
		],
	},
});
