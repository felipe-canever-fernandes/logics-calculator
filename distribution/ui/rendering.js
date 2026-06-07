import { outputDiv } from "./dom.js";
export function setOutput(latex) {
    const mathDiv = document.createElement("math-div");
    mathDiv.innerHTML = latex;
    outputDiv.replaceChildren();
    outputDiv.appendChild(mathDiv);
}
