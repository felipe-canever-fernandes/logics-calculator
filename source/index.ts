import { helpDialog, helpDialogCloseButton, inputField } from "./ui/dom.js";
import { setUpKeyboard } from "./ui/keyboard.js";
import { calculate } from "./app/calculation.js";
import { showHelpModal } from "./ui/rendering.js";

window.addEventListener("DOMContentLoaded", () => {
	inputField.focus();
});

setUpKeyboard();

inputField.addEventListener("beforeinput", (event: InputEvent) => {
	if (event.inputType === "insertLineBreak") {
		calculate();
	};
});

inputField.addEventListener(
	"showHelpDialog",

	(event: MathliveKeyboardCommandEvent) => {
		const operationKey = event.detail;
		showHelpModal(operationKey);
	},
);

helpDialogCloseButton.addEventListener("click", () => {
	helpDialog.close();
});
