PARSER_FILE_PATH=source/logic/lark.js

build:
	npm run build

generate-parser:
		lark-js grammar.lark -o ${PARSER_FILE_PATH} && \
		sed -i 's/module\.exports = {/const module_exports = {/g' ${PARSER_FILE_PATH} && \
		echo '\nexport { get_parser, Token, Transformer, Tree, UnexpectedCharacters, UnexpectedToken };' >> ${PARSER_FILE_PATH}
