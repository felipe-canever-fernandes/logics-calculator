interface HTMLMathFieldElement extends HTMLElement {
	value: string;
	getValue(): string;
}

interface MathliveVirtualKeyboard {
	layouts: MathliveVirtualKeyboardLayouts;
}

interface MathliveVirtualKeyboardLayouts {
	rows: MathliveVirtualKeyboardKey[][];
}

type MathliveVirtualKeyboardKey = string | {
	label: string;
	width: number;
}

declare const mathVirtualKeyboard: MathliveVirtualKeyboard;
