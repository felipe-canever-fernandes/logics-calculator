import { Transformer } from "../lark.js";
export class Printer extends Transformer {
    disjunction(elements) {
        return Printer.getRepresentation(elements);
    }
    conjunction(elements) {
        return Printer.getRepresentation(elements);
    }
    implication(elements) {
        return Printer.getRepresentation(elements);
    }
    negation(elements) {
        return Printer.getRepresentation(elements);
    }
    parentheses(elements) {
        return Printer.getRepresentation(elements);
    }
    variable(elements) {
        return Printer.getRepresentation(elements);
    }
    value(elements) {
        return Printer.getRepresentation(elements);
    }
    static getRepresentation(elements) {
        return elements
            .map(e => typeof e === "string" ? e : e.value)
            .join(" ");
    }
}
;
