import { inputField, inputButton } from "./ui/dom.js";
import { parser } from "./logic/parser.js"
import { setOutput } from "./ui/rendering.js";

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
	setOutput(result);
}

function getInput() {
	return inputField.getValue();
}
