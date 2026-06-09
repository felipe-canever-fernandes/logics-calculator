import { inputField, outputList } from "./dom.js";

export function clearInput() {
	inputField.value = "";
}

export function addOutput(input: string, result: string) {
	const latex = `${input}=${result}`;

	const listItem = document.createElement("li");
	listItem.innerHTML =
		`<math-div class="output-input">${input}</math-div>`;
	listItem.innerHTML +=
		`<math-div class="output-output">=${result}</math-div>`;

	outputList.appendChild(listItem);
}
