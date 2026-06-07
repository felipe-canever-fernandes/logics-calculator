const inputField = document.querySelector("#input-field");
const inputButton = document.querySelector("#input-button");
const outputDiv = document.querySelector("#output");

inputButton.addEventListener("click", () => {
	const latex = inputField.getValue();
	setOutput(latex);
})

function setOutput(latex) {
	const mathDiv = document.createElement("math-div");
	mathDiv.innerHTML = latex;

	outputDiv.replaceChildren();
	outputDiv.appendChild(mathDiv);
}