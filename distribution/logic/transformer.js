import { Tree } from "./lark.js";
export const transformer = {
    weak_negation([x]) {
        if (typeof x !== "number") {
            return new Tree("weak_negation", [x]);
        }
        return 1 - x;
    },
    strong_negation([x]) {
        if (typeof x !== "number") {
            return new Tree("strong_negation", [x]);
        }
        const distinguished = transformer.distinction([x]);
        return transformer.weak_negation([distinguished]);
    },
    distinction([x]) {
        if (typeof x !== "number") {
            return new Tree("distinction", [x]);
        }
        return x == 0 ? 0 : 1;
    },
    crisp_truthness([x]) {
        if (typeof x !== "number") {
            return new Tree("crisp_truthness", [x]);
        }
        const negated = transformer.weak_negation([x]);
        const distinguished = transformer.distinction([negated]);
        return transformer.weak_negation([distinguished]);
    },
    consistency([x]) {
        if (typeof x !== "number") {
            return new Tree("consistency", [x]);
        }
        const negated = transformer.weak_negation([x]);
        const conjoined = transformer.conjunction([x, negated]);
        return transformer.strong_negation([conjoined]);
    },
    contradiction([x]) {
        if (typeof x !== "number") {
            return new Tree("contradiction", [x]);
        }
        const negated = transformer.strong_negation([x]);
        return transformer.conjunction([x, negated]);
    },
    value([token]) {
        const value = token.value;
        switch (value) {
            case "0":
            case "1":
                return Number(value);
            case "\\frac12":
            case "\\frac{1}{2}":
                return 0.5;
        }
        throw new Error(`Invalid value ${value}`);
    },
    disjunction([x, y]) {
        if (typeof x !== "number" || typeof y !== "number") {
            return new Tree("disjunction", [x, y]);
        }
        return Math.max(x, y);
    },
    l_strong_disjunction([x, y]) {
        if (typeof x !== "number" || typeof y !== "number") {
            return new Tree("l_strong_disjunction", [x, y]);
        }
        return Math.min(1, x + y - 1);
    },
    conjunction([x, y]) {
        if (typeof x !== "number" || typeof y !== "number") {
            return new Tree("conjunction", [x, y]);
        }
        const negatedX = transformer.weak_negation([x]);
        const negatedY = transformer.weak_negation([y]);
        const disjoined = transformer.disjunction([negatedX, negatedY]);
        return transformer.weak_negation([disjoined]);
    },
    l_strong_conjunction([x, y]) {
        if (typeof x !== "number" || typeof y !== "number") {
            return new Tree("l_strong_conjunction", [x, y]);
        }
        return Math.max(0, x + y - 1);
    },
    g_implication([x, y]) {
        if (typeof x !== "number" || typeof y !== "number") {
            return new Tree("g_implication", [x, y]);
        }
        return x <= y ? 1 : y;
    },
    l_implication([x, y]) {
        if (typeof x !== "number" || typeof y !== "number") {
            return new Tree("l_implication", [x, y]);
        }
        return Math.min(1, 1 - x + y);
    },
    j_implication([x, y]) {
        if (typeof x !== "number" || typeof y !== "number") {
            return new Tree("j_implication", [x, y]);
        }
        const distinguishedX = transformer.distinction([x]);
        const negated = transformer.weak_negation([distinguishedX]);
        return transformer.disjunction([negated, y]);
    },
    k_implication([x, y]) {
        if (typeof x !== "number" || typeof y !== "number") {
            return new Tree("k_implication", [x, y]);
        }
        const negatedX = transformer.weak_negation([x]);
        return transformer.disjunction([negatedX, y]);
    },
    g_bi_implication([x, y]) {
        if (typeof x !== "number" || typeof y !== "number") {
            return new Tree("g_bi_implication", [x, y]);
        }
        const implicatedXY = transformer.g_implication([x, y]);
        const implicatedYX = transformer.g_implication([y, x]);
        return transformer.conjunction([implicatedXY, implicatedYX]);
    },
    l_bi_implication([x, y]) {
        if (typeof x !== "number" || typeof y !== "number") {
            return new Tree("l_bi_implication", [x, y]);
        }
        const implicatedXY = transformer.l_implication([x, y]);
        const implicatedYX = transformer.l_implication([y, x]);
        return transformer.conjunction([implicatedXY, implicatedYX]);
    },
    j_bi_implication([x, y]) {
        if (typeof x !== "number" || typeof y !== "number") {
            return new Tree("j_bi_implication", [x, y]);
        }
        const jImplicatedXY = transformer.j_implication([x, y]);
        const jImplicatedYX = transformer.j_implication([y, x]);
        return transformer.conjunction([jImplicatedXY, jImplicatedYX]);
    },
    k_bi_implication([x, y]) {
        if (typeof x !== "number" || typeof y !== "number") {
            return new Tree("k_bi_implication", [x, y]);
        }
        const kImplicatedXY = transformer.k_implication([x, y]);
        const kImplicatedYX = transformer.k_implication([y, x]);
        return transformer.conjunction([kImplicatedXY, kImplicatedYX]);
    },
};
