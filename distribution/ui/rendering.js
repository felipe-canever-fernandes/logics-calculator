import { inputField, outputList } from "./dom.js";
export function clearInput() {
    inputField.value = "";
}
export function addOutput(input, result) {
    const output = convertNumberToLatex(result);
    const listItem = document.createElement("li");
    const div = document.createElement("div");
    div.innerHTML =
        `<math-div class="output-input">${input}</math-div>`;
    div.innerHTML +=
        `<div><math-div class="output-symbol">=</math-div><math-div class="output-result">${output}</math-div></div>`;
    listItem.appendChild(div);
    outputList.appendChild(listItem);
}
function convertNumberToLatex(value) {
    if (value === 0.5) {
        return "\\frac{1}{2}";
    }
    return String(value);
}
