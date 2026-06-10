import { UnexpectedCharacters } from "../logic/lark";
import { parser } from "../logic/parser";
import { inputField } from "../ui/dom";
import { addOutput, clearInput } from "../ui/rendering";
export function calculate() {
    const input = inputField.getValue();
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
}
function getUnexpectedCharacterMessage(error, input) {
    const errorIndex = error.column - 1;
    const inputFromError = input.slice(errorIndex);
    return `Unexpected character starting from "${inputFromError}".`;
}
