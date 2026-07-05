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

type MathliveVirtualKeyboardKey = MathliveVirtualKeyboardVariant & {
	width?: number;
	variants?: MathliveVirtualKeyboardVariant[];
}

type MathliveVirtualKeyboardVariant = string | {
	label?: string;
	latex?: string;
	class?: string;
	aside?: string;
}

declare const mathVirtualKeyboard: MathliveVirtualKeyboard;
