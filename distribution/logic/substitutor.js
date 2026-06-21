import { Token, Transformer, Tree } from "./lark.js";
export class Substitutor extends Transformer {
    constructor(substitutions) {
        super();
        this.substitutions = new Map();
        this.variable = ([token]) => {
            const symbol = token.value;
            const value = this.substitutions.get(symbol);
            if (value !== undefined) {
                return new Tree("value", [new Token("VALUE", String(value))]);
            }
            return new Tree("variable", [new Token("VARIABLE", symbol)]);
        };
        this.substitutions = substitutions;
    }
}
;
