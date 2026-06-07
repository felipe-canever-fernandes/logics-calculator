SOURCE_DIRECTORY=source
DISTRIBUTION_DIRECTORY=distribution

PARSER_FILE=parser.js

build:
	mkdir -p ${DISTRIBUTION_DIRECTORY}
	cp -r ${SOURCE_DIRECTORY}/* ${DISTRIBUTION_DIRECTORY}/

generate-parser:
		lark-js grammar.lark -o ${PARSER_FILE} && \
		sed -i 's/module\.exports = {/const module_exports = {/g' ${PARSER_FILE} && \
		echo '\nexport { get_parser };' >> ${PARSER_FILE}
