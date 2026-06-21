import { Result, Validity } from "../logic/transformer.js";
import { inputField, outputList } from "./dom.js";
import { InvalidResult } from "./invalid-result.js";

export function clearInput() {
	inputField.value = "";
}

export function addOutput(input: string, result: Result) {
	const output = convertToOutput(result);

	const listItem = document.createElement("li");

	const div = document.createElement("div");
	div.innerHTML =
		`<math-div class="output-input">${input}</math-div>`;
	div.innerHTML +=
		`<div><math-div class="output-symbol">=</math-div><div class="output-result">${output}</div></div>`;

	listItem.appendChild(div);
	outputList.appendChild(listItem);
}

function convertToOutput(result: Result): string {
	if (typeof result === "number") {
		const latex = result === 0.5
			? "\\frac{1}{2}"
			: String(result);

		return `<math-div>${latex}</math-div>`;
	}

	if (typeof result === "string") {
		if (Object.values(Validity).includes(result)) {
			return result;
		}

		throw new Error("unknown validity");
	}

	throw new InvalidResult();
}
