import { Token, Transformer, Tree } from "./lark.js";

export class Substitutor extends Transformer {
	substitutions = new Map<string, number>();

	constructor(substitutions: Map<string, number>) {
		super();
		this.substitutions = substitutions;
	}

	variable = ([token]: [Token]): Tree => {
		const symbol = token.value;

		const value = this.substitutions.get(symbol);
		if (value !== undefined) {
			return new Tree("value", [new Token("VALUE", String(value))]);
		}

		return new Tree("variable", [new Token("VARIABLE", symbol)]);
	};
};
