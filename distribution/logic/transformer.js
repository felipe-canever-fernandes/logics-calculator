import { Transformer, Tree } from "./lark.js";
import { Substitutor } from "./substitutor.js";
import { VariableCollector } from "./variable-collector.js";
export class LogicTransformer extends Transformer {
    constructor() {
        super(...arguments);
        this.query = ([expression]) => {
            let results = new Set();
            if (typeof expression === "number") {
                results.add(expression);
            }
            else {
                const variables = this.collectVariables(expression);
                results = this.getResults(expression, variables);
            }
            return results;
        };
        this.weak_negation = ([x]) => {
            if (typeof x !== "number") {
                return new Tree("weak_negation", [x]);
            }
            return 1 - x;
        };
        this.post_negation = ([x]) => {
            if (typeof x !== "number") {
                return new Tree("post_negation", [x]);
            }
            if (x === 0) {
                return 1;
            }
            return x - 0.5;
        };
        this.strong_negation = ([x]) => {
            if (typeof x !== "number") {
                return new Tree("strong_negation", [x]);
            }
            const distinguished = this.mosil_nabla([x]);
            return this.weak_negation([distinguished]);
        };
        this.mosil_nabla = ([x]) => {
            if (typeof x !== "number") {
                return new Tree("mosil_nabla", [x]);
            }
            return x == 0 ? 0 : 1;
        };
        this.baaz_delta_operator = ([x]) => {
            if (typeof x !== "number") {
                return new Tree("baaz_delta_operator", [x]);
            }
            const negated = this.weak_negation([x]);
            const distinguished = this.mosil_nabla([negated]);
            return this.weak_negation([distinguished]);
        };
        this.doubtful_operator = ([x]) => {
            if (typeof x !== "number") {
                return new Tree("doubtful_operator", [x]);
            }
            if (x == 1 - x) {
                return 1;
            }
            return 0;
        };
        this.consistency = ([x]) => {
            if (typeof x !== "number") {
                return new Tree("consistency", [x]);
            }
            const negated = this.weak_negation([x]);
            const conjoined = this.conjunction([x, negated]);
            return this.strong_negation([conjoined]);
        };
        this.value = ([token]) => {
            const value = token.value;
            switch (value) {
                case "0":
                case "1":
                case "0.5":
                    return Number(value);
                case "\\frac12":
                case "\\frac{1}{2}":
                    return 0.5;
            }
            throw new Error(`Invalid value ${value}`);
        };
        this.weak_disjunction = ([x, y]) => {
            if (typeof x !== "number" || typeof y !== "number") {
                return new Tree("weak_disjunction", [x, y]);
            }
            return Math.max(x, y);
        };
        this.bochvar_disjunction = ([x, y]) => {
            if (typeof x !== "number" || typeof y !== "number") {
                return new Tree("bochvar_disjunction", [x, y]);
            }
            if (x == 0.5 || y == 0.5) {
                return 0.5;
            }
            return Math.min(x, y);
        };
        this.quine_dagger = ([x, y]) => {
            if (typeof x !== "number" || typeof y !== "number") {
                return new Tree("quine_dagger", [x, y]);
            }
            return 1 - Math.max(x, y);
        };
        this.l_strong_disjunction = ([x, y]) => {
            if (typeof x !== "number" || typeof y !== "number") {
                return new Tree("l_strong_disjunction", [x, y]);
            }
            return Math.min(1, x + y);
        };
        this.conjunction = ([x, y]) => {
            if (typeof x !== "number" || typeof y !== "number") {
                return new Tree("conjunction", [x, y]);
            }
            const negatedX = this.weak_negation([x]);
            const negatedY = this.weak_negation([y]);
            const disjoined = this.weak_disjunction([negatedX, negatedY]);
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
            const distinguishedX = this.mosil_nabla([x]);
            const negated = this.weak_negation([distinguishedX]);
            return this.weak_disjunction([negated, y]);
        };
        this.k_implication = ([x, y]) => {
            if (typeof x !== "number" || typeof y !== "number") {
                return new Tree("k_implication", [x, y]);
            }
            const negatedX = this.weak_negation([x]);
            return this.weak_disjunction([negatedX, y]);
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
        this.collectVariables = (expression) => {
            const collector = new VariableCollector();
            collector.transform(expression);
            const variables = [...collector.variables];
            return variables;
        };
        this.getResults = (expression, variables) => {
            const values = [0, 0.5, 1];
            const counters = this.createCounters(variables, values);
            const firstCounter = counters[0];
            const lastCounter = counters[variables.length - 1];
            const results = new Set();
            while (!firstCounter.getHasFinishedLap()) {
                const variableValues = counters.map((counter) => counter.get());
                const substitutions = new Map([...variableValues]);
                const substitutor = new Substitutor(substitutions);
                const tree = substitutor.transform(expression);
                const result = this.transform(tree);
                if (typeof result !== "number") {
                    throw new Error("could not calculate result for validity");
                }
                results.add(result);
                lastCounter.increment();
            }
            return results;
        };
        this.createCounters = (variables, values) => {
            const counters = [];
            for (let i = 0; i < variables.length; ++i) {
                const callback = i === 0
                    ? () => { }
                    : () => { counters[i - 1].increment(); };
                const variable = variables[i];
                const counter = new Counter(variable, values, callback);
                counters.push(counter);
            }
            return counters;
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
class Counter {
    constructor(variable, values, callback) {
        this.variable = "";
        this.values = [];
        this.count = 0;
        this.i = 0;
        this.hasFinishedLap = false;
        this.callback = () => { };
        this.variable = variable;
        this.values = values;
        this.count = values.length;
        this.callback = callback;
    }
    get() {
        const value = this.values[this.i];
        return [
            this.variable,
            value,
        ];
    }
    increment() {
        ++this.i;
        if (this.i === this.count) {
            this.i = 0;
            this.hasFinishedLap = true;
            this.callback();
        }
    }
    getHasFinishedLap() {
        return this.hasFinishedLap;
    }
}
