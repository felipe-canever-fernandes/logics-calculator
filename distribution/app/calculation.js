import { get_parser, UnexpectedCharacters } from "../logic/lark.js";
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
