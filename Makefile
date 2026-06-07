DISTRIBUTION_DIRECTORY_NAME=distribution
SOURCE_DIRECTORY_NAME=source
PARSER_FILE_PATH=${SOURCE_DIRECTORY_NAME}/parser.js

build:
	mkdir -p ${DISTRIBUTION_DIRECTORY_NAME}
	cp -r ${SOURCE_DIRECTORY_NAME}/* ${DISTRIBUTION_DIRECTORY_NAME}/

generate-parser:
		lark-js grammar.lark -o ${PARSER_FILE_PATH} && \
		sed -i 's/module\.exports = {/const module_exports = {/g' ${PARSER_FILE_PATH} && \
		echo '\nexport { get_parser };' >> ${PARSER_FILE_PATH}
