import { inputField } from "./dom.js";

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
						latex: "\\overline{#@}",
						aside: "weak negation",

						variants: [
							{
								latex: "!",
								aside: "post negation",
							},
							{
								latex: "\\lnot",
								aside: "strong negation",
							},
						],
					},

					{
						label: "[separator]",
						width: 0.5,
					},

					{
						latex: "\\lor",
						aside: "weak disjunction",

						variants: [
							{
								latex: "\\underset{+}{\\lor}",
								aside: "Bochvar disjunction",
							},
						],
					},
					{
						latex: "\\land",
						aside: "weak conjunction",

						variants: [
							{
								latex: "\\underset{+}{\\land}",
								aside: "Bochvar conjunction",
							},
						],
					},
					{
						latex: "\\xrightarrow[L]{}",
						aside: "Łukasiewicz implication",
						width: 2,

						variants: [
							{
								latex: "\\xrightarrow[G]{}",
								aside: "Gödel implication",
							},
							{
								latex: "\\xrightarrow[J]{}",
								aside: "Jaśkowski implication",
							},
							{
								latex: "\\xrightarrow[K]{}",
								aside: "Kleene implication",
							},
							{
								latex: "\\xrightarrow[+]{}",
								aside: "Bochvar implication",
							},
							{
								latex: "\\xrightarrow[R]{}",
								aside: "R-mingle 3 implication",
							},
							{
								latex: "\\xrightarrow[\\pi]{}",
								aside: "Goguen implication",
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
						latex: "\\nabla",
						aside: "Mosil nabla operator",

						variants: [
							{
								latex: "\\Delta",
								aside: "Baaz delta operator",
							},
							{
								latex: "I",
								aside: "doubtful operator",
							},
						],
					},

					{
						label: "[separator]",
						width: 0.5,
					},

					{
						latex: "\\downarrow",
						aside: "Quine dagger",
					},
					{
						latex: "\\uparrow",
						aside: "Sheffer stroke",
					},
					{
						latex: "\\xleftrightarrow[L]{}",
						aside: "Łukasiewicz equivalence",
						width: 2,

						variants: [
							{
								latex: "\\xleftrightarrow[G]{}",
								aside: "Gödel equivalence",
							},
							{
								latex: "\\xleftrightarrow[J]{}",
								aside: "Jaśkowski equivalence",
							},
							{
								latex: "\\xleftrightarrow[K]{}",
								aside: "Kleene equivalence",
							},
							{
								latex: "\\xleftrightarrow[+]{}",
								aside: "Bochvar equivalence",
							},
							{
								latex: "\\xleftrightarrow[R]{}",
								aside: "R-mingle 3 equivalence",
							},
							{
								latex: "\\xleftrightarrow[\\pi]{}",
								aside: "Goguen equivalence",
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
						latex: "\\circ",
						aside: "consistency",
					},

					{
						label: "[separator]",
						width: 0.5,
					},

					{
						latex: "\\oplus",
						aside: "strong disjunction",
					},
					{
						latex: "\\otimes",
						aside: "strong conjunction",
					},
					{
						latex: "\\ominus",
						aside: "exclusive disjunction",
					},
					{
						latex: "\\odot",
						aside: "product",
						width: 1,
					},

					{
						label: "[separator]",
						width: 0.5,
					},

					{
						label: "[return]",
						width: 2,
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

	inputField.menuItems = [];
}
