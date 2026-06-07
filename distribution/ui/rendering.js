import { inputField, outputList } from "./dom.js";
export function clearInput() {
    inputField.value = "";
}
export function addOutput(latex) {
    const mathDiv = document.createElement("math-div");
    mathDiv.innerHTML = latex;
    const listItem = document.createElement("li");
    listItem.appendChild(mathDiv);
    outputList.appendChild(listItem);
}
