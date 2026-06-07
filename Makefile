DISTRIBUTION_DIRECTORY_NAME=distribution
PARSER_FILE=parser.js

build:
	mkdir -p ${DISTRIBUTION_DIRECTORY_NAME}
	cp -r source/* ${DISTRIBUTION_DIRECTORY_NAME}/

generate-parser:
		lark-js grammar.lark -o ${PARSER_FILE} && \
		sed -i 's/module\.exports = {/const module_exports = {/g' ${PARSER_FILE} && \
		echo '\nexport { get_parser };' >> ${PARSER_FILE}
