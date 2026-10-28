"use client";

import { useCallback, useState } from "react";

// Undo/redo over a single value. Every `set` records a new entry.
export function useHistory<T>(initial: T) {
	const [history, setHistory] = useState({
		past: [] as T[],
		present: initial,
		future: [] as T[],
	});

	const set = useCallback(
		(update: T | ((current: T) => T)) =>
			setHistory(({ past, present }) => {
				const next =
					typeof update === "function"
						? (update as (current: T) => T)(present)
						: update;
				return { past: [...past, present].slice(-50), present: next, future: [] };
			}),
		[],
	);

	const undo = useCallback(
		() =>
			setHistory(({ past, present, future }) =>
				past.length
					? {
							past: past.slice(0, -1),
							present: past[past.length - 1],
							future: [present, ...future],
						}
					: { past, present, future },
			),
		[],
	);

	const redo = useCallback(
		() =>
			setHistory(({ past, present, future }) =>
				future.length
					? {
							past: [...past, present],
							present: future[0],
							future: future.slice(1),
						}
					: { past, present, future },
			),
		[],
	);

	return {
		state: history.present,
		set,
		undo,
		redo,
		canUndo: history.past.length > 0,
		canRedo: history.future.length > 0,
	};
}
