import { Token } from "./lark.js";

export const transformer = {
	negation([x]: [number]): number {
		return 1 - x
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

	conjunction([x, y]: [number, number]): number {
		const negatedX = transformer.negation([x]);
		const negatedY = transformer.negation([y]);
		const disjoined = transformer.disjunction([negatedX, negatedY]);
		return transformer.negation([disjoined]);
	},

	implication([x, y]: [number, number]): number {
		return Math.min(1, 1 - x + y);
	},
};
