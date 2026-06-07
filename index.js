import { get_parser } from "./parser.js";

const transformer = {
	weak_negation([x]) {
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

	conjunction([x, y]) {
		const negated_x = transformer.negation([x]); 
		const negated_y = transformer.negation([y]);
		const disjoined = transformer.disjunction([negated_x, negated_y]);
		return transformer.negation([disjoined]);
	},

	l_implication([x, y]) {
		return Math.min(1, 1 - x + y);
	},

	j_implication([x, y]) {
		const distinguished = transformer.distinction([x]);
		const negated = transformer.negation([distinguished]);
		return transformer.disjunction([negated, y]);
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
