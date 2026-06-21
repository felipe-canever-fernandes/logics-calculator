import { get_parser, Tree, UnexpectedCharacters, UnexpectedToken } from "../logic/lark.js";
import { LogicTransformer, Result } from "../logic/transformer.js";
import { inputField } from "../ui/dom.js";
import { InvalidResult } from "../ui/invalid-result.js";
import { addOutput, clearInput } from "../ui/rendering.js";

const parser = get_parser();
const logicTransformer = new LogicTransformer();

export function calculate() {
	const input = inputField.getValue();

	if (input.trim() === "") {
		return;
	}

	console.log(input);

	try {
		const tree: Tree = parser.parse(input);

		const result: Result = logicTransformer.transform(tree);
		addOutput(input, result);

		clearInput();
	} catch (error: unknown) {
		if (
			error instanceof UnexpectedCharacters
			||
			error instanceof UnexpectedToken
		) {
			const message = getUnexpectedMessage(error, input);
			alert(message);
		} else if (error instanceof InvalidResult) {
			alert(`Algebraic expressions are not supported yet. Did you forget to add "?" at the end to calculate the validity of your expression?`);
		} else {
			throw error;
		}
	}
}

function getUnexpectedMessage(
	error: UnexpectedCharacters | UnexpectedToken,
	input: string,
): string {
	const type = error instanceof UnexpectedCharacters ? "character" : "token";

	const errorIndex = error.column - 1;
	const inputBeforeError = input.slice(0, errorIndex);
	const inputFromError = input.slice(errorIndex);

	return `Unexpected ${type}: ${inputBeforeError}>>>${inputFromError}.`;
}
