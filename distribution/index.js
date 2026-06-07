import { parser } from "./logic/parser.js";
const inputField = document
    .querySelector("#input-field");
const inputButton = document
    .querySelector("#input-button");
const outputDiv = document
    .querySelector("#output");
inputField.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        calculate();
    }
});
inputButton.addEventListener("click", () => {
    calculate();
});
function calculate() {
    const input = getInput();
    console.log(input);
    const result = parser.parse(input);
    setOutput(result);
}
function getInput() {
    return inputField.getValue();
}
function setOutput(latex) {
    const mathDiv = document.createElement("math-div");
    mathDiv.innerHTML = latex;
    outputDiv.replaceChildren();
    outputDiv.appendChild(mathDiv);
}
