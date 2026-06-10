interface HTMLMathFieldElement extends HTMLElement {
	value: string;
	menuItems: [];

	getValue(): string;
}

interface MathliveVirtualKeyboard {
	layouts: MathliveVirtualKeyboardLayouts;
}

interface MathliveVirtualKeyboardLayouts {
	rows: MathliveVirtualKeyboardKey[][];
}

type MathliveVirtualKeyboardKey = string | {
	label?: string;
	latex?: string;
	width: number;
	class?: string;
}

declare const mathVirtualKeyboard: MathliveVirtualKeyboard;
