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

	l_strong_disjunction([x, y]: [number, number]) {
		return Math.min(1, x + y - 1);
	},

	conjunction([x, y]: [number, number]) {
		const negatedX = transformer.weak_negation([x]);
		const negatedY = transformer.weak_negation([y]);
		const disjoined = transformer.disjunction([negatedX, negatedY]);
		return transformer.weak_negation([disjoined]);
	},

	l_strong_conjunction([x, y]: [number, number]) {
		return Math.max(0, x + y - 1);
	},

	g_implication([x, y]: [number, number]) {
		return x <= y ? 1 : y;
	},

	l_implication([x, y]: [number, number]) {
		return Math.min(1, 1 - x + y);
	},

	j_implication([x, y]: [number, number]) {
		const distinguished = transformer.distinction([x]);
		const negated = transformer.weak_negation([distinguished]);
		return transformer.disjunction([negated, y]);
	},

	k_implication([x, y]: [number, number]) {
		const weaklyNegatedX = transformer.weak_negation([x]);
		return transformer.disjunction([weaklyNegatedX, y]);
	},

	g_bi_implication([x, y]: [number, number]) {
		const implicatedXY = transformer.g_implication([x, y]);
		const implicatedYX = transformer.g_implication([y, x]);
		return transformer.conjunction([implicatedXY, implicatedYX]);
	},

	l_bi_implication([x, y]: [number, number]) {
		const implicatedXY = transformer.l_implication([x, y]);
		const implicatedYX = transformer.l_implication([y, x]);
		return transformer.conjunction([implicatedXY, implicatedYX]);
	},

	j_bi_implication([x, y]: [number, number]) {
		const jImplicatedXY = transformer.j_implication([x, y]);
		const jImplicatedYX = transformer.j_implication([y, x]);
		return transformer.conjunction([jImplicatedXY, jImplicatedYX]);
	},

	k_bi_implication([x, y]: [number, number]) {
		const kImplicatedXY = transformer.k_implication([x, y]);
		const kImplicatedYX = transformer.k_implication([y, x]);
		return transformer.conjunction([kImplicatedXY, kImplicatedYX]);
	},
};
