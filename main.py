from lark import Lark, Transformer

grammar = ""
with open("grammar.lark") as file:
	grammar = file.read()

parser = Lark(grammar, start="program")

class GrammarTransformer(Transformer[float, float]):
	def __init__(self, visit_tokens: bool = True):
		super().__init__(visit_tokens)
	
	def group(self, items: list[float]) -> float:
		x = float(items[0])
		return x
	
	def negation(self, items: list[float]) -> float:
		x = float(items[0])
		return 1 - x

	def truth(self, items: list[float]) -> float:
		x = float(items[0])
		return float(x == 1)
	
	def unknownness(self, items: list[float]) -> float:
		x = float(items[0])
		y = self.negation([x])
		return self.bi_implication([x, y])
	
	def nonfalsehood(self, items: list[float]) -> float:
		x = float(items[0])
		x = self.negation([x])
		x = self.truth([x])
		return self.negation([x])
	
	def falsehood(self, items: list[float]) -> float:
		x = float(items[0])
		return float(x == 0)

	def implication(self, items: list[float]) -> float:
		x = float(items[0])
		y = float(items[1])
		
		if x <= y:
			return 1
		
		return 1 - x + y

	def bi_implication(self, items: list[float]) -> float:
		x = float(items[0])
		y = float(items[1])
		
		a = self.implication([x, y])
		b = self.implication([y, x])

		return self.weak_conjunction([a, b])

	def weak_conjunction(self, items: list[float]) -> float:
		x = float(items[0])
		y = float(items[1])
		
		return min(x, y)

	def strong_conjunction(self, items: list[float]) -> float:
		x = float(items[0])

		y = float(items[1])
		y = self.negation([y])

		z = self.implication([x, y])

		return self.negation([z])

	def weak_disjunction(self, items: list[float]) -> float:
		x = float(items[0])
		y = float(items[1])

		return max(x, y)

	def strong_disjunction(self, items: list[float]) -> float:
		x = float(items[0])
		x = self.negation([x])

		y = float(items[1])

		return self.implication([x, y])
	
	def print(self, items: list[float]):
		x = float(items[0])
		print(x)
		
	
program = ""
with open("program.txt") as file:
	program = file.read()

try:
	tree = parser.parse(program)
	transformer = GrammarTransformer()
	transformer.transform(tree)
except Exception as exception:
	print(exception)
