import { get_parser, UnexpectedCharacters, UnexpectedToken } from "../logic/lark.js";
import { LogicTransformer } from "../logic/transformer.js";
import { inputField } from "../ui/dom.js";
import { addOutput, clearInput } from "../ui/rendering.js";
const parser = get_parser();
const logicTransformer = new LogicTransformer();
export function calculate() {
    const input = inputField.getValue();
    console.log(input);
    try {
        const tree = parser.parse(input);
        const result = logicTransformer.transform(tree);
        addOutput(input, result);
        clearInput();
    }
    catch (error) {
        if (error instanceof UnexpectedCharacters
            ||
                error instanceof UnexpectedToken) {
            const message = getUnexpectedMessage(error, input);
            alert(message);
        }
        else {
            throw error;
        }
    }
}
function getUnexpectedMessage(error, input) {
    const type = error instanceof UnexpectedCharacters ? "character" : "token";
    const errorIndex = error.column - 1;
    const inputBeforeError = input.slice(0, errorIndex);
    const inputFromError = input.slice(errorIndex);
    return `Unexpected ${type}: ${inputBeforeError}>>>${inputFromError}.`;
}
