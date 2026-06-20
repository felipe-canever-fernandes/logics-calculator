import { Token, Transformer, Tree } from "../lark.js";

type Child = Tree | Token;

const unaryExpressions = [
	"negation",
	"parentheses",
	"variable",
	"value",
];

export class Flattener extends Transformer {
	disjunction(children: Child[]): Tree {
		return Flattener.binaryOperator(children, "disjunction");
	}

	conjunction(children: Child[]): Tree {
		return Flattener.binaryOperator(children, "conjunction");
	}

	parentheses(children: Child[]): Tree {
		const subtree = children[1] as Tree;
		if (unaryExpressions.includes(subtree.data)) {
			return subtree;
		}

		return new Tree("parentheses", children);
	}

	private static binaryOperator(
		children: Child[],
		operation: string,
	): Tree {
		// += 2 to skip symbol.
		for (let i = 0; i < children.length; i += 2) {
			let subtree = children[i] as Tree;

			if (subtree.data === "parentheses") {
				subtree = subtree.children[1] as Tree;
			}

			if (subtree.data !== operation) {
				continue;
			}

			children.splice(i, 1, ...subtree.children);

			const flattanedCount = subtree.children.length;
			i += flattanedCount - 1;
		}

		return new Tree(operation, children);
	}
};
