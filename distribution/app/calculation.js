import { get_parser, UnexpectedCharacters } from "../logic/lark.js";
import { AlgebraicSimplificator } from "../logic/transformers/algebraic-simplificator.js";
import { ConstantFolder } from "../logic/transformers/constant-folder.js";
import { Flattener } from "../logic/transformers/flattener.js";
import { Printer } from "../logic/transformers/printer.js";
import { inputField } from "../ui/dom.js";
import { addOutput, clearInput } from "../ui/rendering.js";
const parser = get_parser();
const printer = new Printer();
const flattener = new Flattener();
const constantFolder = new ConstantFolder();
const algebraicSimplificator = new AlgebraicSimplificator();
export function calculate() {
    const input = inputField.getValue();
    console.log(input);
    try {
        clearInput();
        let tree = parser.parse(input);
        console.log(tree.pretty());
        for (const transformer of [
            flattener,
            constantFolder,
            algebraicSimplificator,
        ]) {
            tree = transformer.transform(tree);
        }
        const result = printer.transform(tree);
        addOutput(input, result);
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
