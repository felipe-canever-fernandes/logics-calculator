import { inputField, inputButton, outputDiv } from "./ui/dom.js";
import { parser } from "./logic/parser.js"

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

function setOutput(latex: string) {
	const mathDiv = document.createElement("math-div");
	mathDiv.innerHTML = latex;

	outputDiv.replaceChildren();
	outputDiv.appendChild(mathDiv);
}
