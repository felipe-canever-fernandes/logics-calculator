import { get_parser } from "./parser.js";

const transformer = {
	negation([x]) {
		return 1 - x
	},

	value([token]) {
		return Number(token.value);
	}
};

const parser = get_parser({transformer});

const inputField = document.querySelector("#input-field");
const inputButton = document.querySelector("#input-button");
const outputDiv = document.querySelector("#output");

inputButton.addEventListener("click", () => {
	const input = getInput();
	const result = parser.parse(input);
	setOutput(result);
})

function getInput() {
	return inputField.getValue();
}

function setOutput(latex) {
	const mathDiv = document.createElement("math-div");
	mathDiv.innerHTML = latex;

	outputDiv.replaceChildren();
	outputDiv.appendChild(mathDiv);
}
