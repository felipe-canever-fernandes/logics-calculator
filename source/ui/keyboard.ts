import { inputField } from "./dom.js";
import { operations } from "./operations.js";

export function setUpKeyboard() {
	mathVirtualKeyboard.layouts = [
		{
			label: "Main",

			rows: [
				[
					"0",
					{
						latex: "p",

						variants: [
							{
								latex: "q",
							},
						],
					},

					{
						label: "[separator]",
						width: 0.5,
					},

					{
						operation: "weak-negation",

						variants: [
							{
								operation: "post-negation",
							},
							{
								operation: "strong-negation",
							},
						],
					},

					{
						label: "[separator]",
						width: 0.5,
					},

					{
						operation: "weak-disjunction",

						variants: [
							{
								operation: "bochvar-disjunction",
							},
							{
								operation: "exclusive-disjunction",
							},
						],
					},
					{
						operation: "weak-conjunction",

						variants: [
							{
								operation: "bochvar-conjunction",
							},
						],
					},
					{
						operation: "l-implication",
						width: 1.5,

						variants: [
							{
								operation: "g-implication",
							},
							{
								operation: "j-implication",
							},
							{
								operation: "k-implication",
							},
							{
								operation: "bochvar-implication",
							},
							{
								operation: "r-implication",
							},
							{
								operation: "goguen-implication",
							},
						],
					},

					{
						label: "[separator]",
						width: 0.5,
					},

					{
						label: "[hide-keyboard]",
						width: 1,
					},
					{
						label: "[backspace]",
						width: 1,
					},
				],
				[
					{
						latex: "\\frac{1}{2}",
						width: 1,
						class: "small",
					},
					"\\left(#@\\right)",

					{
						label: "[separator]",
						width: 0.5,
					},

					{
						operation: "mosil-nabla",

						variants: [
							{
								operation: "baaz-delta",
							},
							{
								operation: "doubtful-operator",
							},
						],
					},

					{
						label: "[separator]",
						width: 0.5,
					},

					{
						operation: "quine-dagger",
					},
					{
						operation: "sheffer-stroke",
					},
					{
						operation: "l-equivalence",
						width: 1.5,

						variants: [
							{
								operation: "g-equivalence",
							},
							{
								operation: "j-equivalence",
							},
							{
								operation: "k-equivalence",
							},
							{
								operation: "bochvar-equivalence",
							},
							{
								operation: "r-equivalence",
							},
							{
								operation: "goguen-equivalence",
							},
						],
					},

					{
						label: "[separator]",
						width: 0.5,
					},

					{
						label: "[left]",
						width: 1,
					},
					{
						label: "[right]",
						width: 1,
					},
				],
				[
					"1",
					{
						label: "?",
						aside: "validity",
					},

					{
						label: "[separator]",
						width: 0.5,
					},

					{
						operation: "consistency",
					},

					{
						label: "[separator]",
						width: 0.5,
					},

					{
						operation: "strong-disjunction",
					},
					{
						operation: "strong-conjunction",
					},
					{
						label: "[separator]",
						width: 1.5,
					},

					{
						label: "[separator]",
						width: 0.5,
					},

					{
						label: "[shift]",
						width: 1,
					},
					{
						label: "[return]",
						width: 1,
					},
				],
			],
		},
		{
			label: "Alphabet",

			rows: [
				["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
				["a", "s", "d", "f", "g", "h", "j", "k", "l"],
				["z", "x", "c", "v", "b", "n", "m"],
			],
		},
	];

	generateOperationKeys();
	inputField.menuItems = [];
}

function generateOperationKeys() {
	for (const layout of mathVirtualKeyboard.layouts) {
		for (const row of layout.rows) {
			for (const key of row) {
				generateOperationKey(key);

				if (!key.variants) {
					continue;
				}

				for (const variant of key.variants) {
					generateOperationKey(variant);
				}
			}
		}
	}
}

function generateOperationKey(key: MathliveVirtualKeyboardKey) {
	if (typeof key === "string") {
		return;
	}

	if (!("operation" in key)) {
		return;
	}

	if (!key.operation) {
		return;
	}

	const operation = operations[key.operation];

	key.latex = operation.latex;
	key.aside = operation.name;
}
