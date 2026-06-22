import { inputField } from "./dom.js";

export function setUpKeyboard() {
	mathVirtualKeyboard.layouts = [
		{
			label: "Main",

			rows: [
				[
					"0",
					{
						latex: "\\frac{1}{2}",
						width: 1,
						class: "small",
					},
					"1",
					{
						label: "[separator]",
						width: 0.5,
					},
					"p",
					"\\lnot",
					"\\sim",
					{
						label: "[separator]",
						width: 0.5,
					},
					"\\lor",
					"\\oplus",
					"\\land",
					"\\otimes",
					{
						label: "[separator]",
						width: 0.5,
					},
					{
						label: "[backspace]",
						width: 1,
					},
				],
				[
					"[(]",
					{
						label: "[separator]",
						width: 1,
					},
					"[)]",
					{
						label: "[separator]",
						width: 0.5,
					},
					"q",
					"\\nabla",
					"\\Delta",
					{
						label: "[separator]",
						width: 0.5,
					},
					"\\xrightarrow[G]{}",
					"\\xrightarrow[L]{}",
					"\\xrightarrow[J]{}",
					"\\xrightarrow[K]{}",
					{
						label: "[separator]",
						width: 0.5,
					},
					{
						label: "[hide-keyboard]",
						width: 1,
					},
				],
				[
					"[left]",
					{
						label: "[separator]",
						width: 1,
					},
					"[right]",
					{
						label: "[separator]",
						width: 0.5,
					},
					"?",
					"\\circ",
					{
						label: "[separator]",
						width: 1,
					},
					{
						label: "[separator]",
						width: 0.5,
					},
					"\\xleftrightarrow[G]{}",
					"\\xleftrightarrow[L]{}",
					"\\xleftrightarrow[J]{}",
					"\\xleftrightarrow[K]{}",
					{
						label: "[separator]",
						width: 0.5,
					},
					{
						label: "[return]",
						width: 1,
					},
				],
			],
		},
		{
			label: "Variables",

			rows: [
				["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
				["a", "s", "d", "f", "g", "h", "j", "k", "l"],
				["z", "x", "c", "v", "b", "n", "m"],
			],
		},
	];

	inputField.menuItems = [];
}
