module.exports = function (eleventyConfig) {
	eleventyConfig.addPassthroughCopy("styles.css");
	eleventyConfig.addPassthroughCopy("font");
	eleventyConfig.addPassthroughCopy("distribution");

	return {
		dir: {
			input: ".",
			output: "_site",
			includes: "_includes",
			data: "_data"
		},
		templateFormats: ["html", "njk"],
		htmlTemplateEngine: "njk"
	};
};
