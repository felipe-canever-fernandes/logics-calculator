import { get_parser, Tree, UnexpectedCharacters } from "../logic/lark.js";
import { LogicTransformer, Result } from "../logic/transformer.js";
import { inputField } from "../ui/dom.js";
import { addOutput, clearInput } from "../ui/rendering.js";

const parser = get_parser();
const logicTransformer = new LogicTransformer();

export function calculate() {
	const input = inputField.getValue();
	console.log(input);

	try {
		const tree: Tree = parser.parse(input);

		const result: Result = logicTransformer.transform(tree);
		addOutput(input, result);

		clearInput();
	} catch (error: unknown) {
		if (error instanceof UnexpectedCharacters) {
			const message = getUnexpectedCharacterMessage(error, input);
			alert(message);
		} else {
			throw error;
		}
	}
}

function getUnexpectedCharacterMessage(
	error: UnexpectedCharacters,
	input: string,
): string {
	const errorIndex = error.column - 1;
	const inputFromError = input.slice(errorIndex);
	return `Unexpected character starting from "${inputFromError}".`;
}
