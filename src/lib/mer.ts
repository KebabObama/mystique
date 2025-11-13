import { type Draft, produce } from "immer";

export const mer =
	<S>(mutator: (draft: Draft<S>) => void) =>
	(prev: S): S =>
		produce(prev, (draft: Draft<S>) => {
			mutator(draft);
		});
