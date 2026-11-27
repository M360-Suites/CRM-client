import { Editor, Node } from "@tiptap/react";
import { Fragment } from "@tiptap/pm/model";

// Side-by-side layout: a row of 2 or 3 equal columns, each holding ordinary
// blocks. In the sent email the columns stack on narrow screens (see
// lib/email_html.ts). Columns can't be nested.

export type ColumnsAlign = "top" | "middle";

export const COLUMN_CONTENT =
	"(paragraph | heading | bulletList | orderedList | blockquote | horizontalRule | emailImage | emailButton)+";

export const EmailColumn = Node.create({
	name: "emailColumn",
	content: COLUMN_CONTENT,
	defining: true,
	isolating: true,
	parseHTML() {
		return [{ tag: "div[data-email-column]" }];
	},
	renderHTML() {
		return ["div", { "data-email-column": "" }, 0];
	},
});

export const EmailColumns = Node.create({
	name: "emailColumns",
	group: "block",
	content: "emailColumn{2,3}",
	defining: true,
	addAttributes() {
		return {
			gap: {
				default: 16,
				parseHTML: (el) => {
					const n = Number(el.getAttribute("data-gap"));
					return el.hasAttribute("data-gap") && Number.isFinite(n) ? n : 16;
				},
				renderHTML: (a) => ({ "data-gap": a.gap }),
			},
			valign: {
				default: "top",
				parseHTML: (el) => (el.getAttribute("data-valign") === "middle" ? "middle" : "top"),
				renderHTML: (a) => ({ "data-valign": a.valign }),
			},
		};
	},
	parseHTML() {
		return [{ tag: "div[data-email-columns]" }];
	},
	renderHTML({ node, HTMLAttributes }) {
		return [
			"div",
			{
				...HTMLAttributes,
				"data-email-columns": node.childCount,
				// Only for the editor canvas; the email renderer reads data-*
				style: `display:grid;grid-template-columns:repeat(${node.childCount},minmax(0,1fr));gap:${node.attrs.gap}px;align-items:${node.attrs.valign === "middle" ? "center" : "start"}`,
			},
			0,
		];
	},
});

// Position and node of the columns row around the cursor, if any
export const findColumns = (editor: Editor) => {
	const { $from } = editor.state.selection;
	for (let d = $from.depth; d > 0; d--) {
		const node = $from.node(d);
		if (node.type.name === "emailColumns") return { pos: $from.before(d), node };
	}
	return null;
};

export const insertColumns = (editor: Editor, count: 2 | 3) =>
	editor
		.chain()
		.focus()
		.insertContent({
			type: "emailColumns",
			content: Array.from({ length: count }, () => ({
				type: "emailColumn",
				content: [{ type: "paragraph" }],
			})),
		})
		.run();

export const setColumnsAttrs = (
	editor: Editor,
	attrs: Partial<{ gap: number; valign: ColumnsAlign }>,
) => {
	const found = findColumns(editor);
	if (!found) return;
	editor.view.dispatch(
		editor.state.tr.setNodeMarkup(found.pos, undefined, { ...found.node.attrs, ...attrs }),
	);
	editor.commands.focus();
};

// Change a 2-column row to 3 (adds an empty column) or 3 to 2 (moves the
// last column's content into the one before it, so nothing is lost)
export const setColumnCount = (editor: Editor, count: 2 | 3) => {
	const found = findColumns(editor);
	if (!found || found.node.childCount === count) return;
	const { schema } = editor.state;
	const cols: Fragment[] = [];
	found.node.forEach((col) => cols.push(col.content));
	while (cols.length < count) cols.push(Fragment.from(schema.nodes.paragraph.create()));
	while (cols.length > count) {
		const last = cols.pop()!;
		cols[cols.length - 1] = cols[cols.length - 1].append(last);
	}
	const row = found.node.type.create(
		found.node.attrs,
		cols.map((c) => schema.nodes.emailColumn.create(null, c)),
	);
	editor.view.dispatch(
		editor.state.tr.replaceWith(found.pos, found.pos + found.node.nodeSize, row),
	);
	editor.commands.focus();
};

// Turn the row back into stacked content, keeping every block
export const removeColumns = (editor: Editor) => {
	const found = findColumns(editor);
	if (!found) return;
	let content = Fragment.empty;
	found.node.forEach((col) => {
		content = content.append(col.content);
	});
	editor.view.dispatch(
		editor.state.tr.replaceWith(found.pos, found.pos + found.node.nodeSize, content),
	);
	editor.commands.focus();
};
