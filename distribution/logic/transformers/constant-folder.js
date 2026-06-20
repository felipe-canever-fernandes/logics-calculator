import { Token, Transformer, Tree } from "../lark.js";
export class ConstantFolder extends Transformer {
    disjunction(children) {
        return ConstantFolder.binaryOperator(children, "disjunction", Math.max);
    }
    conjunction(children) {
        return ConstantFolder.binaryOperator(children, "conjunction", Math.min);
    }
    implication([a, symbol, b]) {
        if (typeof a === "number" && typeof b === "number") {
            return Math.min(1, 1 - a + b);
        }
        return new Tree("implication", [a, symbol, b]);
    }
    negation([symbol, a]) {
        if (typeof a === "number") {
            return 1 - a;
        }
        return new Tree("negation", [symbol, a]);
    }
    parentheses([left, a, right]) {
        if (typeof a === "number") {
            return a;
        }
        return new Tree("parentheses", [left, a, right]);
    }
    value([token]) {
        const value = token.value;
        const number = Number(value);
        return number;
    }
    static binaryOperator(children, operation, operate) {
        const numbers = children.filter(e => typeof e === "number");
        if (numbers.length === 0) {
            return new Tree(operation, children);
        }
        const trees = children.filter(e => e instanceof Tree);
        const result = operate(...numbers);
        if (trees.length === 0) {
            return result;
        }
        const symbol = children.find(e => e instanceof Token);
        let simplified = [];
        simplified = [...trees, result]
            .reduce((list, e, i) => i === 0 ? [e] : [...list, symbol, e], simplified);
        return new Tree(operation, simplified);
    }
}
;
