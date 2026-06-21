import { Transformer, Tree } from "./lark.js";
export var Validity;
(function (Validity) {
    Validity["CONTRADICTION"] = "contradiction";
    Validity["CONTINGENCY"] = "contingency";
    Validity["TAUTOLOGY"] = "tautology";
})(Validity || (Validity = {}));
export class LogicTransformer extends Transformer {
    constructor() {
        super(...arguments);
        this.substitutions = new Map();
        this.query = ([expression]) => {
            const values = [];
            if (typeof expression === "number") {
                values.push(expression);
            }
            else {
                throw new Error("algebraic validation not supported");
            }
            const totalCount = values.length;
            const zeroCount = count(values, 0);
            if (zeroCount === totalCount) {
                return Validity.CONTRADICTION;
            }
            const oneCount = count(values, 1);
            if (oneCount === totalCount) {
                return Validity.TAUTOLOGY;
            }
            return Validity.CONTINGENCY;
        };
        this.weak_negation = ([x]) => {
            if (typeof x !== "number") {
                return new Tree("weak_negation", [x]);
            }
            return 1 - x;
        };
        this.strong_negation = ([x]) => {
            if (typeof x !== "number") {
                return new Tree("strong_negation", [x]);
            }
            const distinguished = this.distinction([x]);
            return this.weak_negation([distinguished]);
        };
        this.distinction = ([x]) => {
            if (typeof x !== "number") {
                return new Tree("distinction", [x]);
            }
            return x == 0 ? 0 : 1;
        };
        this.crisp_truthness = ([x]) => {
            if (typeof x !== "number") {
                return new Tree("crisp_truthness", [x]);
            }
            const negated = this.weak_negation([x]);
            const distinguished = this.distinction([negated]);
            return this.weak_negation([distinguished]);
        };
        this.consistency = ([x]) => {
            if (typeof x !== "number") {
                return new Tree("consistency", [x]);
            }
            const negated = this.weak_negation([x]);
            const conjoined = this.conjunction([x, negated]);
            return this.strong_negation([conjoined]);
        };
        this.contradiction = ([x]) => {
            if (typeof x !== "number") {
                return new Tree("contradiction", [x]);
            }
            const negated = this.strong_negation([x]);
            return this.conjunction([x, negated]);
        };
        this.value = ([token]) => {
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
        };
        this.disjunction = ([x, y]) => {
            if (typeof x !== "number" || typeof y !== "number") {
                return new Tree("disjunction", [x, y]);
            }
            return Math.max(x, y);
        };
        this.l_strong_disjunction = ([x, y]) => {
            if (typeof x !== "number" || typeof y !== "number") {
                return new Tree("l_strong_disjunction", [x, y]);
            }
            return Math.min(1, x + y - 1);
        };
        this.conjunction = ([x, y]) => {
            if (typeof x !== "number" || typeof y !== "number") {
                return new Tree("conjunction", [x, y]);
            }
            const negatedX = this.weak_negation([x]);
            const negatedY = this.weak_negation([y]);
            const disjoined = this.disjunction([negatedX, negatedY]);
            return this.weak_negation([disjoined]);
        };
        this.l_strong_conjunction = ([x, y]) => {
            if (typeof x !== "number" || typeof y !== "number") {
                return new Tree("l_strong_conjunction", [x, y]);
            }
            return Math.max(0, x + y - 1);
        };
        this.g_implication = ([x, y]) => {
            if (typeof x !== "number" || typeof y !== "number") {
                return new Tree("g_implication", [x, y]);
            }
            return x <= y ? 1 : y;
        };
        this.l_implication = ([x, y]) => {
            if (typeof x !== "number" || typeof y !== "number") {
                return new Tree("l_implication", [x, y]);
            }
            return Math.min(1, 1 - x + y);
        };
        this.j_implication = ([x, y]) => {
            if (typeof x !== "number" || typeof y !== "number") {
                return new Tree("j_implication", [x, y]);
            }
            const distinguishedX = this.distinction([x]);
            const negated = this.weak_negation([distinguishedX]);
            return this.disjunction([negated, y]);
        };
        this.k_implication = ([x, y]) => {
            if (typeof x !== "number" || typeof y !== "number") {
                return new Tree("k_implication", [x, y]);
            }
            const negatedX = this.weak_negation([x]);
            return this.disjunction([negatedX, y]);
        };
        this.g_bi_implication = ([x, y]) => {
            if (typeof x !== "number" || typeof y !== "number") {
                return new Tree("g_bi_implication", [x, y]);
            }
            const implicatedXY = this.g_implication([x, y]);
            const implicatedYX = this.g_implication([y, x]);
            return this.conjunction([implicatedXY, implicatedYX]);
        };
        this.l_bi_implication = ([x, y]) => {
            if (typeof x !== "number" || typeof y !== "number") {
                return new Tree("l_bi_implication", [x, y]);
            }
            const implicatedXY = this.l_implication([x, y]);
            const implicatedYX = this.l_implication([y, x]);
            return this.conjunction([implicatedXY, implicatedYX]);
        };
        this.j_bi_implication = ([x, y]) => {
            if (typeof x !== "number" || typeof y !== "number") {
                return new Tree("j_bi_implication", [x, y]);
            }
            const jImplicatedXY = this.j_implication([x, y]);
            const jImplicatedYX = this.j_implication([y, x]);
            return this.conjunction([jImplicatedXY, jImplicatedYX]);
        };
        this.k_bi_implication = ([x, y]) => {
            if (typeof x !== "number" || typeof y !== "number") {
                return new Tree("k_bi_implication", [x, y]);
            }
            const kImplicatedXY = this.k_implication([x, y]);
            const kImplicatedYX = this.k_implication([y, x]);
            return this.conjunction([kImplicatedXY, kImplicatedYX]);
        };
    }
}
;
function count(array, value) {
    return array.reduce((count, currentValue) => {
        if (currentValue === value) {
            return count + 1;
        }
        return count;
    }, 0);
}
