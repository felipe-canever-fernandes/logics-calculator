import { Token, Transformer, Tree } from "../lark.js";

type Child = Operand | Token;
type Operand = Tree | number;

export class ConstantFolder extends Transformer {
	disjunction(children: Child[]): Operand {
		return ConstantFolder.binaryOperator(children, "disjunction", Math.max);
	}

	conjunction(children: Child[]): Operand {
		return ConstantFolder.binaryOperator(children, "conjunction", Math.min);
	}

	implication([a, symbol, b]: [Operand, Token, Operand]): Operand {
		if (typeof a === "number" && typeof b === "number") {
			return Math.min(1, 1 - a + b);
		}

		return new Tree("implication", [a, symbol, b]);
	}

	negation([symbol, a]: [Token, Operand]): Operand {
		if (typeof a === "number") {
			return 1 - a;
		}

		return new Tree("negation", [symbol, a]);
	}

	parentheses([left, a, right]: [Token, Operand, Token]): Operand {
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

	private static binaryOperator(
		children: Child[],
		operation: string,
		operate: (...values: number[]) => number,
	): Operand {
		const numbers = children.filter(e => typeof e === "number");
		if (numbers.length === 0) {
			return new Tree(operation, children);
		}

		const trees = children.filter(e => e instanceof Tree);
		const result = operate(...numbers);

		if (trees.length === 0) {
			return result;
		}

		const symbol = children.find(e => e instanceof Token)!;

		let simplified: Child[] = [];
		simplified = [...trees, result]
			.reduce(
				(list, e, i) => i === 0 ? [e] : [...list, symbol, e],
				simplified,
			);

		return new Tree(operation, simplified);
	}
};
