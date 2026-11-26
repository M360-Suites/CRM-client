import { bold, button, columns, h, hr, img, link, p, placeholder, starter, styled } from "./nodes";

// Figma: "Newsletter Welcome" (High Fidelity)
const GREEN = "#2F6B4F";

const blog = (title: string, text: string) => [
	img(placeholder("newsletter-card"), title, { radius: 8 }),
	h(3, title),
	p(styled({ size: 14 }, text)),
];

export default starter({
	id: "newsletter-welcome",
	name: "Newsletter Welcome",
	description:
		"Greet new subscribers personally, set expectations for what they'll receive and point them to your best posts.",
	category: "starting",
	style: {
		background_color: "#EEF5F1",
		content_background: "#FFFFFF",
		link_color: GREEN,
	},
	header: {
		background_color: "#FFFFFF",
		text_color: "#0F172A",
		padding_y: 32,
		padding_x: 40,
		content: [
			p(bold(styled({ size: 20 }, "Step into the world of efficient communication!")), "center"),
			h(1, styled({ color: GREEN }, "WHISPERING PINES"), "center"),
			img(placeholder("newsletter-hero"), "Welcome illustration", { width: 220 }),
		],
	},
	body: {
		background_color: "#FFFFFF",
		text_color: "#334155",
		padding_y: 8,
		padding_x: 40,
		content: [
			p(
				"Welcome to the future of emails! By subscribing, you get access to dynamic and responsive emails tailored for the best reading experience.",
				"center",
			),
			hr(),
			p(bold("Greetings, {{contact.first_name}}!")),
			p(
				"We're thrilled to have you join the Whispering Pines subscribers. I'm Anna, and I'll be guiding you through our newsletters and updates. Stay informed with the latest trends and best practices in the world of email communication.",
			),
			p(
				"Choose your preferred reading schedule, whether daily, weekly or monthly. We value your thoughts and feedback, so reply to this email any time with questions or suggestions.",
			),
			p(),
			h(2, "Featured Blogs:", "center"),
			columns(
				[
					blog(
						"The Future of Dynamic Emails",
						"Delve into the mechanics of creating responsive emails and the benefits they bring to your campaigns.",
					),
					blog(
						"Crafting the Ideal Confirmation Email",
						"Learn the intricacies of building a confirmation email that ensures clarity and prompts action.",
					),
				],
				{ gap: 28 },
			),
			button("Read the blog", { background: GREEN, radius: 6, align: "center" }),
		],
	},
	footer: {
		background_color: "#F1F5F2",
		text_color: "#64748B",
		padding_y: 28,
		padding_x: 48,
		content: [
			p(
				"If you have questions or need help, don't hesitate to contact us through our chat support or reply to this email.",
				"center",
			),
			p(
				[
					link("https://", "Facebook"),
					"  ·  ",
					link("https://", "Instagram"),
					"  ·  ",
					link("https://", "LinkedIn"),
				],
				"center",
			),
			p(
				styled(
					{ size: 12 },
					"You're receiving this email because you signed up for updates from Whispering Pines.",
				),
				"center",
			),
		],
	},
});
