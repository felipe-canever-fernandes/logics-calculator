import { Token, Transformer, Tree } from "../lark.js";

type Operand = Token | number;
type Result = Tree | number;

export class ConstantFolder extends Transformer {
	disjunction([a, symbol, b]: [Operand, Token, Operand]): Result {
		console.log(a, symbol, b);
		if (typeof a === "number" && typeof b === "number") {
			return Math.max(a, b);
		}

		return new Tree("disjunction", [a, symbol, b]);
	}

	conjunction([a, symbol, b]: [Operand, Token, Operand]): Result {
		console.log(a, symbol, b);
		if (typeof a === "number" && typeof b === "number") {
			return Math.min(a, b);
		}

		return new Tree("conjunction", [a, symbol, b]);
	}

	implication([a, symbol, b]: [Operand, Token, Operand]): Result {
		console.log(a, symbol, b);
		if (typeof a === "number" && typeof b === "number") {
			return Math.min(1, 1 - a + b);
		}

		return new Tree("implication", [a, symbol, b]);
	}

	negation([symbol, a]: [Token, Operand]): Result {
		if (typeof a === "number") {
			return 1 - a;
		}

		return new Tree("negation", [symbol, a]);
	}

	parentheses([left, a, right]: [Token, Operand, Token]): Result {
		if (typeof a === "number") {
			return a;
		}

		return new Tree("parentheses", [left, a, right]);
	}

	value([token]: [Token]): number {
		const value = token.value;
		const number = Number(value);
		return number;
	}
};
