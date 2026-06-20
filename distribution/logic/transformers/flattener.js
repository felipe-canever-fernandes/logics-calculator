import { Transformer, Tree } from "../lark.js";
const unaryExpressions = [
    "negation",
    "parentheses",
    "variable",
    "value",
];
export class Flattener extends Transformer {
    disjunction(children) {
        return Flattener.binaryOperator(children, "disjunction");
    }
    conjunction(children) {
        return Flattener.binaryOperator(children, "conjunction");
    }
    parentheses(children) {
        const subtree = children[1];
        if (unaryExpressions.includes(subtree.data)) {
            return subtree;
        }
        return new Tree("parentheses", children);
    }
    static binaryOperator(children, operation) {
        // += 2 to skip symbol.
        for (let i = 0; i < children.length; i += 2) {
            let subtree = children[i];
            if (subtree.data === "parentheses") {
                subtree = subtree.children[1];
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
}
;
