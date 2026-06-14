import { Token } from "../lark.js";

type Element = Token | string;

export const printer = {
	disjunction(elements: Element[]): string {
		return printer.getRepresentation(elements);
	},

	conjunction(elements: Element[]): string {
		return printer.getRepresentation(elements);
	},

	implication(elements: Element[]): string {
		return printer.getRepresentation(elements);
	},

	negation(elements: Element[]): string {
		return printer.getRepresentation(elements);
	},

	parentheses(elements: Element[]): string {
		return printer.getRepresentation(elements);
	},

	variable(elements: Element[]): string {
		return printer.getRepresentation(elements);
	},

	value(elements: Element[]): string {
		return printer.getRepresentation(elements);
	},

	getRepresentation(elements: Element[]): string {
		return elements
			.map(e => typeof e === "string" ? e : e.value)
			.join(" ");
	}
};
