import { Transformer, Tree } from "./lark.js";
export class VariableCollector extends Transformer {
    constructor() {
        super(...arguments);
        this.variables = new Set();
        this.variable = ([token]) => {
            const symbol = token.value;
            this.variables.add(symbol);
            return new Tree("variable", [token]);
        };
    }
}
;
