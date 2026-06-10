import { UnexpectedCharacters } from "./logic/lark.js";
import { inputField } from "./ui/dom.js";
import { parser } from "./logic/parser.js"
import { addOutput, clearInput } from "./ui/rendering.js";
import { setUpKeyboard } from "./ui/keyboard.js";

setUpKeyboard();

inputField.addEventListener('beforeinput', (event) => {
	if (event.inputType === 'insertLineBreak') {
		calculate();
	};
});

function calculate() {
	const input = getInput();
	console.log(input);

	try {
		const result = parser.parse(input);
		addOutput(input, result);
		clearInput();
	} catch (error: unknown) {
		if (error instanceof UnexpectedCharacters) {
			const message = getUnexpectedCharacterMessage(error, input);
			alert(message);
		} else {
			throw error;
		}
	}
}

function getInput(): string {
	return inputField.getValue();
}

function getUnexpectedCharacterMessage(
	error: UnexpectedCharacters,
	input: string,
): string {
	const errorIndex = error.column - 1;
	const inputFromError = input.slice(errorIndex);
	return `Unexpected character starting from "${inputFromError}".`;
}
