const inputField = document.querySelector("#input-field");

const inputButton = document.querySelector("#input-button");
inputButton.addEventListener("click", () => {
	const latex = inputField.getValue();
	setOutput(latex);
})

const outputDiv = document.querySelector("#output");

function setOutput(latex) {
	const mathDiv = document.createElement("math-div");
	mathDiv.innerHTML = latex;

	outputDiv.replaceChildren();
	outputDiv.appendChild(mathDiv);
}