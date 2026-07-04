import { Result, Validity } from "../logic/transformer.js";
import { inputField, outputList } from "./dom.js";
import { InvalidResult } from "./invalid-result.js";

export function clearInput() {
	inputField.value = "";
}

export function addOutput(input: string, result: Result) {
	const { symbol, latex } = convertToOutput(result);

	const listItem = document.createElement("li");

	const div = document.createElement("div");
	div.innerHTML =
		`<math-div class="output-input">${input}</math-div>`;
	div.innerHTML +=
		`<div class="result"><math-div class="result-symbol">${symbol}</math-div><div class="result-value">${latex}</div></div>`;

	listItem.appendChild(div);
	outputList.appendChild(listItem);
}

function convertToOutput(result: Result): Output {
	if (typeof result === "number") {
		const latex = convertNumberToLatex(result);

		return {
			symbol: "=",
			latex: `<math-div>${latex}</math-div>`,
		};
	}

	if (checkIsValidity(result)) {
		let elements = [...result];

		elements = elements.sort((a, b) => {
			if (a < b) {
				return -1;
			}

			if (a > b) {
				return 1;
			}

			return 0;
		});

		const latex = `\\left\\{${elements.map(convertNumberToLatex).join(", ")}\\right\\}`;

		return {
			symbol: "\\in",
			latex: `<math-div>${latex}</math-div>`,
		};
	}

	throw new InvalidResult();
}

interface Output {
	symbol: string;
	latex: string;
};

function convertNumberToLatex(value: number): string {
	if (value === 0.5) {
		return "\\frac{1}{2}";
	}

	return String(value);
}

function checkIsValidity(result: Result): result is Validity {
	const isSet = result instanceof Set;
	if (!isSet) {
		return false;
	}

	const isNumberSet = [...result].every((value) => typeof value === "number");
	if (!isNumberSet) {
		return false;
	}

	return true;
}
