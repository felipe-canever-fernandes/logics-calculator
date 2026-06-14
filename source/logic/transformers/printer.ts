import { Token, Transformer } from "../lark.js";

type Element = Token | string;

export class Printer extends Transformer {
	disjunction(elements: Element[]): string {
		return Printer.getRepresentation(elements);
	}

	conjunction(elements: Element[]): string {
		return Printer.getRepresentation(elements);
	}

	implication(elements: Element[]): string {
		return Printer.getRepresentation(elements);
	}

	negation(elements: Element[]): string {
		return Printer.getRepresentation(elements);
	}

	parentheses(elements: Element[]): string {
		return Printer.getRepresentation(elements);
	}

	variable(elements: Element[]): string {
		return Printer.getRepresentation(elements);
	}

	value(elements: Element[]): string {
		return Printer.getRepresentation(elements);
	}

	static getRepresentation(elements: Element[]): string {
		return elements
			.map(e => typeof e === "string" ? e : e.value)
			.join(" ");
	}
};
