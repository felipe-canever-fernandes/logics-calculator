import { Token, Transformer, Tree } from "./lark.js";
import { Substitutor } from "./substitutor.js";
import { VariableCollector } from "./variable-collector.js";

type Expression = Tree | number;

export type Result = number | Validity | Tree;
export type Validity = Set<number>;

export class LogicTransformer extends Transformer {
	query = ([expression]: [Expression]): Validity => {
		let results: Validity = new Set<number>();

		if (typeof expression === "number") {
			results.add(expression);
		} else {
			const variables = this.collectVariables(expression);
			results = this.getResults(expression, variables);
		}

		return results;
	};

	weak_negation = ([x]: [Expression]): Expression => {
		if (typeof x !== "number") {
			return new Tree("weak_negation", [x]);
		}

		return 1 - x;
	};

	post_negation = ([x]: [Expression]): Expression => {
		if (typeof x !== "number") {
			return new Tree("post_negation", [x]);
		}

		if (x === 0) {
			return 1;
		}

		return x - 0.5;
	};

	strong_negation = ([x]: [Expression]): Expression => {
		if (typeof x !== "number") {
			return new Tree("strong_negation", [x]);
		}

		const distinguished = this.mosil_nabla_operator([x]);
		return this.weak_negation([distinguished]);
	};

	mosil_nabla_operator = ([x]: [Expression]): Expression => {
		if (typeof x !== "number") {
			return new Tree("mosil_nabla_operator", [x]);
		}

		return x == 0 ? 0 : 1;
	};

	baaz_delta_operator = ([x]: [Expression]): Expression => {
		if (typeof x !== "number") {
			return new Tree("baaz_delta_operator", [x]);
		}

		const negated = this.weak_negation([x]);
		const distinguished = this.mosil_nabla_operator([negated]);
		return this.weak_negation([distinguished]);
	};

	doubtful_operator = ([x]: [Expression]): Expression => {
		if (typeof x !== "number") {
			return new Tree("doubtful_operator", [x]);
		}

		if (x == 1 - x) {
			return 1;
		}

		return 0;
	};

	consistency = ([x]: [Expression]): Expression => {
		if (typeof x !== "number") {
			return new Tree("consistency", [x]);
		}

		const negated = this.weak_negation([x]);
		const conjoined = this.conjunction([x, negated]);
		return this.strong_negation([conjoined]);
	};

	value = ([token]: [Token]): number => {
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

	weak_disjunction = ([x, y]: [Expression, Expression]): Expression => {
		if (typeof x !== "number" || typeof y !== "number") {
			return new Tree("weak_disjunction", [x, y]);
		}

		return Math.max(x, y);
	};

	l_strong_disjunction = ([x, y]: [Expression, Expression]): Expression => {
		if (typeof x !== "number" || typeof y !== "number") {
			return new Tree("l_strong_disjunction", [x, y]);
		}

		return Math.min(1, x + y);
	};

	conjunction = ([x, y]: [Expression, Expression]): Expression => {
		if (typeof x !== "number" || typeof y !== "number") {
			return new Tree("conjunction", [x, y]);
		}

		const negatedX = this.weak_negation([x]);
		const negatedY = this.weak_negation([y]);
		const disjoined = this.weak_disjunction([negatedX, negatedY]);
		return this.weak_negation([disjoined]);
	};

	l_strong_conjunction = ([x, y]: [Expression, Expression]): Expression => {
		if (typeof x !== "number" || typeof y !== "number") {
			return new Tree("l_strong_conjunction", [x, y]);
		}

		return Math.max(0, x + y - 1);
	};

	g_implication = ([x, y]: [Expression, Expression]): Expression => {
		if (typeof x !== "number" || typeof y !== "number") {
			return new Tree("g_implication", [x, y]);
		}

		return x <= y ? 1 : y;
	};

	l_implication = ([x, y]: [Expression, Expression]): Expression => {
		if (typeof x !== "number" || typeof y !== "number") {
			return new Tree("l_implication", [x, y]);
		}

		return Math.min(1, 1 - x + y);
	};

	j_implication = ([x, y]: [Expression, Expression]): Expression => {
		if (typeof x !== "number" || typeof y !== "number") {
			return new Tree("j_implication", [x, y]);
		}

		const distinguishedX = this.mosil_nabla_operator([x]);
		const negated = this.weak_negation([distinguishedX]);
		return this.weak_disjunction([negated, y]);
	};

	k_implication = ([x, y]: [Expression, Expression]): Expression => {
		if (typeof x !== "number" || typeof y !== "number") {
			return new Tree("k_implication", [x, y]);
		}

		const negatedX = this.weak_negation([x]);
		return this.weak_disjunction([negatedX, y]);
	};

	g_bi_implication = ([x, y]: [Expression, Expression]): Expression => {
		if (typeof x !== "number" || typeof y !== "number") {
			return new Tree("g_bi_implication", [x, y]);
		}

		const implicatedXY = this.g_implication([x, y]);
		const implicatedYX = this.g_implication([y, x]);
		return this.conjunction([implicatedXY, implicatedYX]);
	};

	l_bi_implication = ([x, y]: [Expression, Expression]): Expression => {
		if (typeof x !== "number" || typeof y !== "number") {
			return new Tree("l_bi_implication", [x, y]);
		}

		const implicatedXY = this.l_implication([x, y]);
		const implicatedYX = this.l_implication([y, x]);
		return this.conjunction([implicatedXY, implicatedYX]);
	};

	j_bi_implication = ([x, y]: [Expression, Expression]): Expression => {
		if (typeof x !== "number" || typeof y !== "number") {
			return new Tree("j_bi_implication", [x, y]);
		}

		const jImplicatedXY = this.j_implication([x, y]);
		const jImplicatedYX = this.j_implication([y, x]);
		return this.conjunction([jImplicatedXY, jImplicatedYX]);
	};

	k_bi_implication = ([x, y]: [Expression, Expression]): Expression => {
		if (typeof x !== "number" || typeof y !== "number") {
			return new Tree("k_bi_implication", [x, y]);
		}

		const kImplicatedXY = this.k_implication([x, y]);
		const kImplicatedYX = this.k_implication([y, x]);
		return this.conjunction([kImplicatedXY, kImplicatedYX]);
	};

	collectVariables = (expression: Expression): string[] => {
		const collector = new VariableCollector();
		collector.transform(expression);
		const variables = [...collector.variables];
		return variables;
	};

	getResults = (expression: Expression, variables: string[]): Validity => {
		const values = [0, 0.5, 1];

		const counters = this.createCounters(variables, values);
		const firstCounter = counters[0];
		const lastCounter = counters[variables.length - 1];

		const results: Validity = new Set();
		while (!firstCounter.getHasFinishedLap()) {
			const variableValues = counters.map((counter) => counter.get());
			const substitutions = new Map<string, number>([...variableValues]);
			const substitutor = new Substitutor(substitutions);
			const tree: Tree = substitutor.transform(expression);

			const result: Expression = this.transform(tree);
			if (typeof result !== "number") {
				throw new Error("could not calculate result for validity");
			}

			results.add(result);

			lastCounter.increment();
		}

		return results;
	};

	createCounters = (variables: string[], values: number[]): Counter[] => {
		const counters: Counter[] = [];

		for (let i = 0; i < variables.length; ++i) {
			const callback: () => void = i === 0
				? () => { }
				: () => { counters[i - 1].increment(); }

			const variable = variables[i];
			const counter = new Counter(variable, values, callback);
			counters.push(counter);
		}

		return counters;
	};
};

function count<T>(array: T[], value: T): number {
	return array.reduce((count, currentValue) => {
		if (currentValue === value) {
			return count + 1;
		}

		return count;
	}, 0);
}

class Counter {
	private variable: string = "";

	private values: number[] = [];
	private count: number = 0;

	private i: number = 0;
	private hasFinishedLap: boolean = false;

	private callback: () => void = () => { };

	public constructor(
		variable: string,
		values: number[],
		callback: () => void,
	) {
		this.variable = variable;

		this.values = values;
		this.count = values.length;

		this.callback = callback;
	}

	public get(): [string, number] {
		const value = this.values[this.i];

		return [
			this.variable,
			value,
		];
	}

	public increment() {
		++this.i;

		if (this.i === this.count) {
			this.i = 0;
			this.hasFinishedLap = true;

			this.callback();
		}
	}

	public getHasFinishedLap(): boolean {
		return this.hasFinishedLap;
	}
}
