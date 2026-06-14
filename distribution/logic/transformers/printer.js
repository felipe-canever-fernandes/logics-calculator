import { Transformer } from "../lark.js";
export class Printer extends Transformer {
    start([result]) {
        return result;
    }
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
}
;
