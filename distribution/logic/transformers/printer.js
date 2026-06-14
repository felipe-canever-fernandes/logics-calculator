export const printer = {
    disjunction(elements) {
        return printer.getRepresentation(elements);
    },
    conjunction(elements) {
        return printer.getRepresentation(elements);
    },
    implication(elements) {
        return printer.getRepresentation(elements);
    },
    negation(elements) {
        return printer.getRepresentation(elements);
    },
    parentheses(elements) {
        return printer.getRepresentation(elements);
    },
    variable(elements) {
        return printer.getRepresentation(elements);
    },
    value(elements) {
        return printer.getRepresentation(elements);
    },
    getRepresentation(elements) {
        return elements
            .map(e => typeof e === "string" ? e : e.value)
            .join(" ");
    }
};
