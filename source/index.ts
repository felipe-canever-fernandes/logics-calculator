import { inputField } from "./ui/dom.js";
import { setUpKeyboard } from "./ui/keyboard.js";
import { calculate } from "./app/calculation.js";

setUpKeyboard();

inputField.addEventListener('beforeinput', (event) => {
	if (event.inputType === 'insertLineBreak') {
		calculate();
	};
});
