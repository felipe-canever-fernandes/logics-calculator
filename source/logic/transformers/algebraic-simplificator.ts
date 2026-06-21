import { Token, Transformer, Tree } from "../lark.js";
import { Printer } from "./printer.js";

type Expression = Tree | number;

const printer = new Printer();

export class AlgebraicSimplificator extends Transformer {
	disjunction([a, symbol, b]: [Expression, Token, Expression]): Expression {
		// Idempotence
		if (a instanceof Tree && b instanceof Tree) {
			const aShape = printer.transform(a);
			const bShape = printer.transform(b);

			if (aShape === bShape) {
				return a;
			}
		}

		const numberIndex = [a, b].findIndex((x) => typeof x === "number");

		if (numberIndex < 0) {
			return new Tree("disjunction", [a, symbol, b]);
		}

		const [number, tree] = numberIndex === 0
			? [a as number, b as Tree]
			: [b as number, a as Tree];

		// Identity
		if (number === 0) {
			return tree;
		}

		// Domination
		if (number === 1) {
			return 1;
		}

		return new Tree("disjunction", [a, symbol, b]);
	}

	negation([symbol, a]: [Token, Expression]): Expression {
		if (!(a instanceof Tree)) {
			return new Tree("negation", [symbol, a]);
		}

		if (a.data !== "negation") {
			return new Tree("negation", [symbol, a]);
		}

		// Double negation
		return a.children[1];
	}
};
