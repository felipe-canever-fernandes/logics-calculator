interface HTMLMathFieldElement extends HTMLElement {
	value: string;
	menuItems: [];

	getValue(): string;
}

interface MathliveVirtualKeyboard {
	layouts: MathliveVirtualKeyboardLayout[];
}

interface MathliveVirtualKeyboardLayout {
	label: string;
	rows: MathliveVirtualKeyboardKey[][];
}

type MathliveVirtualKeyboardKey = string | {
	label?: string;
	latex?: string;
	width: number;
	class?: string;
}

declare const mathVirtualKeyboard: MathliveVirtualKeyboard;
