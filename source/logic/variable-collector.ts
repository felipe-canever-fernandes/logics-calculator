import { Token, Transformer, Tree } from "./lark.js";

export class VariableCollector extends Transformer {
	variables = new Set<string>();

	variable = ([token]: [Token]): Tree => {
		const symbol = token.value;
		this.variables.add(symbol);

		return new Tree("variable", [token]);
	};
};
