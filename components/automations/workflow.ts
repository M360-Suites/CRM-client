import { WorkflowStep } from "@/types/automation";

// Immutable helpers for the workflow step tree. A split step owns two nested
// step lists (paths a and b), so every helper recurses into them.

// Where a new step goes: the list identified by `parentId`/`path`
// (top level when parentId is null) at position `index`.
export interface InsertPoint {
	parentId: string | null;
	path: "a" | "b" | null;
	index: number;
}

const mapLists = (
	steps: WorkflowStep[],
	fn: (list: WorkflowStep[], parentId: string | null, path: "a" | "b" | null) => WorkflowStep[],
	parentId: string | null = null,
	path: "a" | "b" | null = null,
): WorkflowStep[] =>
	fn(steps, parentId, path).map((s) =>
		s.type === "split"
			? {
					...s,
					paths: {
						a: mapLists(s.paths.a, fn, s.id, "a"),
						b: mapLists(s.paths.b, fn, s.id, "b"),
					},
				}
			: s,
	);

export const insertStep = (
	steps: WorkflowStep[],
	at: InsertPoint,
	step: WorkflowStep,
) =>
	mapLists(steps, (list, parentId, path) =>
		parentId === at.parentId && path === at.path
			? [...list.slice(0, at.index), step, ...list.slice(at.index)]
			: list,
	);

export const updateStep = (
	steps: WorkflowStep[],
	id: string,
	update: (step: WorkflowStep) => WorkflowStep,
) => mapLists(steps, (list) => list.map((s) => (s.id === id ? update(s) : s)));

export const removeStep = (steps: WorkflowStep[], id: string) =>
	mapLists(steps, (list) => list.filter((s) => s.id !== id));

export const findStep = (
	steps: WorkflowStep[],
	id: string,
): WorkflowStep | undefined => {
	for (const s of steps) {
		if (s.id === id) return s;
		if (s.type === "split") {
			const found = findStep(s.paths.a, id) ?? findStep(s.paths.b, id);
			if (found) return found;
		}
	}
};
