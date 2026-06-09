import { UnexpectedCharacters } from "./logic/lark.js";
import { inputField, inputButton } from "./ui/dom.js";
import { parser } from "./logic/parser.js";
import { addOutput, clearInput } from "./ui/rendering.js";
mathVirtualKeyboard.layouts = {
    rows: [
        [
            "0",
            "1",
            {
                label: "[separator]",
                width: 0.5,
            },
            "\\neg",
            "\\sim",
            {
                label: "[separator]",
                width: 0.5,
            },
            "\\lor",
            "\\land",
            {
                label: "[separator]",
                width: 0.5,
            },
            {
                label: "[backspace]",
                width: 1,
            },
        ],
        [
            "[(]",
            "[)]",
            {
                label: "[separator]",
                width: 0.5,
            },
            "\\nabla",
            "\\Delta",
            {
                label: "[separator]",
                width: 0.5,
            },
            "\\rightarrow",
            "\\roundimplies",
            {
                label: "[separator]",
                width: 0.5,
            },
            {
                label: "[separator]",
                width: 1,
            },
        ],
        [
            "[left]",
            "[right]",
            {
                label: "[separator]",
                width: 0.5,
            },
            "o",
            "\\sigma",
            {
                label: "[separator]",
                width: 0.5,
            },
            "\\leftrightarrow",
            {
                label: "[separator]",
                width: 1,
            },
            {
                label: "[separator]",
                width: 0.5,
            },
            {
                label: "[return]",
                width: 1,
            },
        ],
    ],
};
inputField.menuItems = [];
inputField.addEventListener('beforeinput', (event) => {
    if (event.inputType === 'insertLineBreak') {
        calculate();
    }
    ;
});
inputButton.addEventListener("click", () => {
    calculate();
});
function calculate() {
    const input = getInput();
    console.log(input);
    try {
        const result = parser.parse(input);
        addOutput(input, result);
        clearInput();
    }
    catch (error) {
        if (error instanceof UnexpectedCharacters) {
            const message = getUnexpectedCharacterMessage(error, input);
            alert(message);
        }
        else {
            throw error;
        }
    }
    finally {
    }
}
function getInput() {
    return inputField.getValue();
}
function getUnexpectedCharacterMessage(error, input) {
    const errorIndex = error.column - 1;
    const inputFromError = input.slice(errorIndex);
    return `Unexpected character starting from "${inputFromError}".`;
}
