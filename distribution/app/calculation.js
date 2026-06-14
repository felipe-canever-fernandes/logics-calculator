import { UnexpectedCharacters } from "../logic/lark.js";
import { parser } from "../logic/parser.js";
import { inputField } from "../ui/dom.js";
import { addOutput, clearInput } from "../ui/rendering.js";
export function calculate() {
    const input = inputField.getValue();
    console.log(input);
    try {
        const result = parser.parse(input);
        console.log(result);
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
}
function getUnexpectedCharacterMessage(error, input) {
    const errorIndex = error.column - 1;
    const inputFromError = input.slice(errorIndex);
    return `Unexpected character starting from "${inputFromError}".`;
}
