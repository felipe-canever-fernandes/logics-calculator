import { UnexpectedCharacters } from "./logic/lark.js";
import { inputField, inputButton } from "./ui/dom.js";
import { parser } from "./logic/parser.js"
import { addOutput, clearInput } from "./ui/rendering.js";

inputField.addEventListener("keydown", (event: KeyboardEvent) => {
	if (event.key === "Enter") {
		calculate();
	}
})

inputButton.addEventListener("click", () => {
	calculate();
})

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
	} finally {

	}
}

function getInput() {
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
