import { parser } from "./logic/parser.js"

const inputField = document
	.querySelector("#input-field") as HTMLMathFieldElement;

const inputButton = document
	.querySelector("#input-button") as HTMLButtonElement;

const outputDiv = document
	.querySelector("#output") as HTMLDivElement;

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
