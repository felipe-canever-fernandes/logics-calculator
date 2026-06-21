import { Token, Transformer, Tree } from "./lark.js";
import { VariableCollector } from "./variable-collector.js";

type Expression = Tree | number;

export type Result = number | Validity | Tree;

export enum Validity {
	CONTRADICTION = "contradiction",
	CONTINGENCY = "contingency",
	TAUTOLOGY = "tautology",
}

export class LogicTransformer extends Transformer {
	substitutions = new Map<string, number>();

	query = ([expression]: [Expression]): Validity => {
		const values: number[] = [];

		if (typeof expression === "number") {
			values.push(expression);
		} else {
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

	weak_negation = ([x]: [Expression]): Expression => {
		if (typeof x !== "number") {
			return new Tree("weak_negation", [x]);
		}

		return 1 - x;
	};

	strong_negation = ([x]: [Expression]): Expression => {
		if (typeof x !== "number") {
			return new Tree("strong_negation", [x]);
		}

		const distinguished = this.distinction([x]);
		return this.weak_negation([distinguished]);
	};

	distinction = ([x]: [Expression]): Expression => {
		if (typeof x !== "number") {
			return new Tree("distinction", [x]);
		}

		return x == 0 ? 0 : 1;
	};

	crisp_truthness = ([x]: [Expression]): Expression => {
		if (typeof x !== "number") {
			return new Tree("crisp_truthness", [x]);
		}

		const negated = this.weak_negation([x]);
		const distinguished = this.distinction([negated]);
		return this.weak_negation([distinguished]);
	};

	consistency = ([x]: [Expression]): Expression => {
		if (typeof x !== "number") {
			return new Tree("consistency", [x]);
		}

		const negated = this.weak_negation([x]);
		const conjoined = this.conjunction([x, negated]);
		return this.strong_negation([conjoined]);
	};

	contradiction = ([x]: [Expression]): Expression => {
		if (typeof x !== "number") {
			return new Tree("contradiction", [x]);
		}

		const negated = this.strong_negation([x]);
		return this.conjunction([x, negated]);
	};

	value = ([token]: [Token]): number => {
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

	disjunction = ([x, y]: [Expression, Expression]): Expression => {
		if (typeof x !== "number" || typeof y !== "number") {
			return new Tree("disjunction", [x, y]);
		}

		return Math.max(x, y);
	};

	l_strong_disjunction = ([x, y]: [Expression, Expression]): Expression => {
		if (typeof x !== "number" || typeof y !== "number") {
			return new Tree("l_strong_disjunction", [x, y]);
		}

		return Math.min(1, x + y - 1);
	};

	conjunction = ([x, y]: [Expression, Expression]): Expression => {
		if (typeof x !== "number" || typeof y !== "number") {
			return new Tree("conjunction", [x, y]);
		}

		const negatedX = this.weak_negation([x]);
		const negatedY = this.weak_negation([y]);
		const disjoined = this.disjunction([negatedX, negatedY]);
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

		const distinguishedX = this.distinction([x]);
		const negated = this.weak_negation([distinguishedX]);
		return this.disjunction([negated, y]);
	};

	k_implication = ([x, y]: [Expression, Expression]): Expression => {
		if (typeof x !== "number" || typeof y !== "number") {
			return new Tree("k_implication", [x, y]);
		}

		const negatedX = this.weak_negation([x]);
		return this.disjunction([negatedX, y]);
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
};

function count<T>(array: T[], value: T): number {
	return array.reduce((count, currentValue) => {
		if (currentValue === value) {
			return count + 1;
		}

		return count;
	}, 0);
}
