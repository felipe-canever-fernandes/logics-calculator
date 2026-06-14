import { Token, Transformer } from "../lark.js";

type Element = Token | string | number;

export class Printer extends Transformer {
	start([result]: [string]): string {
		return result;
	}

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
			.map((e) => {
				switch (typeof e) {
					case "number":
						return String(e);
					
					case "string":
						return e;
					
					default:
						return e.value;
				}
			})
			.join(" ");
	}
};
