export const transformer = {
    negation([x]) {
        return 1 - x;
    },
    value([token]) {
        console.log(token);
        const value = token.value;
        switch (value) {
            case "0":
            case "1":
                return Number(value);
            case "\\frac12":
            case "\\frac{1}{2}":
                return 0.5;
        }
        throw new Error(`Invalid value ${value}`);
    },
    disjunction([x, y]) {
        return Math.max(x, y);
    },
    conjunction([x, y]) {
        const negatedX = transformer.negation([x]);
        const negatedY = transformer.negation([y]);
        const disjoined = transformer.disjunction([negatedX, negatedY]);
        return transformer.negation([disjoined]);
    },
    implication([x, y]) {
        return Math.min(1, 1 - x + y);
    },
};
