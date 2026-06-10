import { inputField, outputList } from "./dom.js";
export function clearInput() {
    inputField.value = "";
}
export function addOutput(input, result) {
    const output = convertNumberToLatex(result);
    const listItem = document.createElement("li");
    listItem.innerHTML =
        `<math-div class="output-input">${input}</math-div>`;
    listItem.innerHTML +=
        `<math-div class="output-output">=${output}</math-div>`;
    outputList.appendChild(listItem);
}
function convertNumberToLatex(value) {
    if (value === 0.5) {
        return "\\frac{1}{2}";
    }
    return String(value);
}
