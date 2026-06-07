import { get_parser } from "./parser.js";

const transformer = {
	negation([x]) {
		return 1 - x
	},

	distinction([x]) {
		return x == 0 ? 0 : 1;
	},

	value([token]) {
		return Number(token.value);
	},

	disjunction([x, y]) {
		return Math.max(x, y);
	},

	l_implication([x, y]) {
		return Math.min(1, 1 - x + y);
	},
};

const parser = get_parser({transformer});

const inputField = document.querySelector("#input-field");
const inputButton = document.querySelector("#input-button");
const outputDiv = document.querySelector("#output");

inputButton.addEventListener("click", () => {
	const input = getInput();
	console.log(input);
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
