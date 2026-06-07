import { Token } from "./lark.js";

export const transformer = {
	weak_negation([x]: [number]) {
		return 1 - x
	},

	strong_negation([x]: [number]) {
		const distinguished = transformer.distinction([x]);
		return transformer.weak_negation([distinguished]);
	},

	distinction([x]: [number]) {
		return x == 0 ? 0 : 1;
	},

	crisp_truthness([x]: [number]) {
		const negated = transformer.weak_negation([x]);
		const distinguished = transformer.distinction([negated]);
		return transformer.weak_negation([distinguished]);
	},

	consistency([x]: [number]) {
		const negated = transformer.weak_negation([x]);
		const conjoined = transformer.conjunction([x, negated]);
		return transformer.strong_negation([conjoined]);
	},

	contradiction([x]: [number]) {
		const negated = transformer.strong_negation([x]);
		return transformer.conjunction([x, negated]);
	},

	value([token]: [Token]) {
		return Number(token.value);
	},

	disjunction([x, y]: [number, number]) {
		return Math.max(x, y);
	},

	conjunction([x, y]: [number, number]) {
		const negated_x = transformer.weak_negation([x]);
		const negated_y = transformer.weak_negation([y]);
		const disjoined = transformer.disjunction([negated_x, negated_y]);
		return transformer.weak_negation([disjoined]);
	},

	l_implication([x, y]: [number, number]) {
		return Math.min(1, 1 - x + y);
	},

	j_implication([x, y]: [number, number]) {
		const distinguished = transformer.distinction([x]);
		const negated = transformer.weak_negation([distinguished]);
		return transformer.disjunction([negated, y]);
	},

	l_bi_implication([x, y]: [number, number]) {
		const implicated_x_y = transformer.l_implication([x, y]);
		const implicated_y_x = transformer.l_implication([y, x]);
		return transformer.conjunction([implicated_x_y, implicated_y_x]);
	},
};
