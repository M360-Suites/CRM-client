import { Extension } from "@tiptap/react";
import { Plugin } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

// Marks the section holding the cursor so the canvas can outline and label it
export const ActiveSection = Extension.create({
	name: "activeSection",
	addProseMirrorPlugins() {
		return [
			new Plugin({
				props: {
					decorations(state) {
						const { $from } = state.selection;
						if ($from.depth < 1) return null;
						const start = $from.before(1);
						const node = state.doc.nodeAt(start);
						if (!node) return null;
						return DecorationSet.create(state.doc, [
							Decoration.node(start, start + node.nodeSize, { class: "is-active-section" }),
						]);
					},
				},
			}),
		];
	},
});
