import { inputField } from "./dom.js";

export function setUpKeyboard() {
	const separator = {
		label: "[separator]",
		width: 0.5,
	};

	mathVirtualKeyboard.layouts = {
		rows: [
			[
				"0",
				{
					latex: "\\frac{1}{2}",
					width: 1,
					class: "small",
				},
				"1",
				separator,
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
				"\\sim",
				"[(]",
				"[)]",
				separator,
				"[left]",
				"[right]",
			],
			[
				"\\rightarrow",
				"\\lor",
				"\\land",
				separator,
				{
					label: "[return]",
					width: 2,
				},
			],
		],
	};

	inputField.menuItems = [];
}
