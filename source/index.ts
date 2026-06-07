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
	const result = parser.parse(input);
	addOutput(result);
	clearInput();
}

function getInput() {
	return inputField.getValue();
}
