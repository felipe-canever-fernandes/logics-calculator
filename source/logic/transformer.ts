import { Token } from "./lark.js";

export const transformer = {
	weak_negation([x]: [number]): number {
		return 1 - x
	},

	strong_negation([x]: [number]): number {
		const distinguished = transformer.distinction([x]);
		return transformer.weak_negation([distinguished]);
	},

	distinction([x]: [number]): number {
		return x == 0 ? 0 : 1;
	},

	crisp_truthness([x]: [number]): number {
		const negated = transformer.weak_negation([x]);
		const distinguished = transformer.distinction([negated]);
		return transformer.weak_negation([distinguished]);
	},

	consistency([x]: [number]): number {
		const negated = transformer.weak_negation([x]);
		const conjoined = transformer.conjunction([x, negated]);
		return transformer.strong_negation([conjoined]);
	},

	contradiction([x]: [number]): number {
		const negated = transformer.strong_negation([x]);
		return transformer.conjunction([x, negated]);
	},

	value([token]: [Token]): number {
		console.log(token);
		const value = token.value;

		switch (value) {
			case "0":
			case "1":
				return Number(value);

			case "\\frac12":
			case "\\frac{1}{2}":
				return 0.5;
		}

		throw new Error(`Invalid value ${value}`);
	},

	disjunction([x, y]: [number, number]): number {
		return Math.max(x, y);
	},

	l_strong_disjunction([x, y]: [number, number]): number {
		return Math.min(1, x + y - 1);
	},

	conjunction([x, y]: [number, number]): number {
		const negatedX = transformer.weak_negation([x]);
		const negatedY = transformer.weak_negation([y]);
		const disjoined = transformer.disjunction([negatedX, negatedY]);
		return transformer.weak_negation([disjoined]);
	},

	l_strong_conjunction([x, y]: [number, number]): number {
		return Math.max(0, x + y - 1);
	},

	g_implication([x, y]: [number, number]): number {
		return x <= y ? 1 : y;
	},

	l_implication([x, y]: [number, number]): number {
		return Math.min(1, 1 - x + y);
	},

	j_implication([x, y]: [number, number]): number {
		const distinguishedX = transformer.distinction([x]);
		const negated = transformer.weak_negation([distinguishedX]);
		return transformer.disjunction([negated, y]);
	},

	k_implication([x, y]: [number, number]): number {
		const negatedX = transformer.weak_negation([x]);
		return transformer.disjunction([negatedX, y]);
	},

	g_bi_implication([x, y]: [number, number]): number {
		const implicatedXY = transformer.g_implication([x, y]);
		const implicatedYX = transformer.g_implication([y, x]);
		return transformer.conjunction([implicatedXY, implicatedYX]);
	},

	l_bi_implication([x, y]: [number, number]): number {
		const implicatedXY = transformer.l_implication([x, y]);
		const implicatedYX = transformer.l_implication([y, x]);
		return transformer.conjunction([implicatedXY, implicatedYX]);
	},

	j_bi_implication([x, y]: [number, number]): number {
		const jImplicatedXY = transformer.j_implication([x, y]);
		const jImplicatedYX = transformer.j_implication([y, x]);
		return transformer.conjunction([jImplicatedXY, jImplicatedYX]);
	},

	k_bi_implication([x, y]: [number, number]): number {
		const kImplicatedXY = transformer.k_implication([x, y]);
		const kImplicatedYX = transformer.k_implication([y, x]);
		return transformer.conjunction([kImplicatedXY, kImplicatedYX]);
	},
};
