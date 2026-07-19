import { operations } from "../ui/operations";

declare global {
	interface HTMLMathFieldElement extends HTMLElement {
		value: string;
		menuItems: [];

		getValue(): string;
	}

	interface HTMLMathSpanElement extends HTMLSpanElement {
		render(): void;
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
		shift?: MathliveVirtualKeyboardKey;
	}

	type MathliveVirtualKeyboardVariant = string | {
		operation?: keyof typeof operations;
		label?: string;
		latex?: string;
		class?: string;
		aside?: string;
		tooltip?: string;
		command?: string;
	}


	const mathVirtualKeyboard: MathliveVirtualKeyboard;

	interface MathliveKeyboardCommandEvent extends Event {
		detail: string;
	}
}
