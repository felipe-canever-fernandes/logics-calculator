import { inputField, outputDiv } from "./dom.js";
export function clearInput() {
    inputField.value = "";
}
export function setOutput(latex) {
    const mathDiv = document.createElement("math-div");
    mathDiv.innerHTML = latex;
    outputDiv.replaceChildren();
    outputDiv.appendChild(mathDiv);
}
