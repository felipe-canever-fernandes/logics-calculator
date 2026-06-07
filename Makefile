PARSER_FILE=parser.js

generate-parser:
		lark-js grammar.lark -o ${PARSER_FILE} && \
		sed -i 's/module\.exports = {/const module_exports = {/g' ${PARSER_FILE} && \
		echo '\nexport { get_parser };' >> ${PARSER_FILE}
