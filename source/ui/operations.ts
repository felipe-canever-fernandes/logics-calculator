interface Operation {
	name: string;
	latex: string;
}

export const operations: Record<string, Operation> = {
	"weak-disjunction": {
		name: "weak disjunction",
		latex: "\\lor",
	},

	"bochvar-disjunction": {
		name: "Bochvar disjunction",
		latex: "\\underset{+}{\\lor}",
	},

	"quine-dagger": {
		name: "Quine dagger",
		latex: "\\downarrow",
	},

	"strong-disjunction": {
		name: "strong disjunction",
		latex: "\\oplus",
	},

	"exclusive-disjunction": {
		name: "exclusive disjunction",
		latex: "\\ominus",
	},

	"weak-conjunction": {
		name: "weak conjunction",
		latex: "\\land",
	},

	"bochvar-conjunction": {
		name: "Bochvar conjunction",
		latex: "\\underset{+}{\\land}",
	},

	"sheffer-stroke": {
		name: "Sheffer stroke",
		latex: "\\uparrow",
	},

	"strong-conjunction": {
		name: "strong conjunction",
		latex: "\\otimes",
	},

	"l-implication": {
		name: "Łukasiewicz implication",
		latex: "\\xrightarrow[L]{}",
	},

	"g-implication": {
		name: "Gödel implication",
		latex: "\\xrightarrow[G]{}",
	},

	"j-implication": {
		name: "Jaśkowski implication",
		latex: "\\xrightarrow[J]{}",
	},

	"k-implication": {
		name: "Kleene implication",
		latex: "\\xrightarrow[K]{}",
	},

	"bochvar-implication": {
		name: "Bochvar implication",
		latex: "\\xrightarrow[+]{}",
	},

	"r-implication": {
		name: "R-mingle 3 implication",
		latex: "\\xrightarrow[R]{}",
	},

	"goguen-implication": {
		name: "Goguen implication",
		latex: "\\xrightarrow[\\pi]{}",
	},

	"l-equivalence": {
		name: "Łukasiewicz equivalence",
		latex: "\\xleftrightarrow[L]{}",
	},

	"g-equivalence": {
		name: "Gödel equivalence",
		latex: "\\xleftrightarrow[G]{}",
	},

	"j-equivalence": {
		name: "Jaśkowski equivalence",
		latex: "\\xleftrightarrow[J]{}",
	},

	"k-equivalence": {
		name: "Kleene equivalence",
		latex: "\\xleftrightarrow[K]{}",
	},

	"bochvar-equivalence": {
		name: "Bochvar equivalence",
		latex: "\\xleftrightarrow[+]{}",
	},

	"r-equivalence": {
		name: "R-mingle 3 equivalence",
		latex: "\\xleftrightarrow[R]{}",
	},

	"goguen-equivalence": {
		name: "Goguen equivalence",
		latex: "\\xleftrightarrow[\\pi]{}",
	},

	"weak-negation": {
		name: "weak negation",
		latex: "\\overline{#@}",
	},

	"post-negation": {
		name: "post negation",
		latex: "!",
	},

	"strong-negation": {
		name: "strong negation",
		latex: "\\lnot",
	},

	"mosil-nabla": {
		name: "Mosil nabla",
		latex: "\\nabla",
	},

	"baaz-delta": {
		name: "Baaz delta",
		latex: "\\Delta",
	},

	"doubtful-operator": {
		name: "doubtful operator",
		latex: "I",
	},

	"consistency": {
		name: "consistency",
		latex: "\\circ",
	}
};
