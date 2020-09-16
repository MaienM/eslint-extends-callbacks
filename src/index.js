let CLIEngine = require('eslint/lib/cli-engine'); // ESLint 4.x and 5.x.
if (CLIEngine.CLIEngine) { // ESLint 6.x
	CLIEngine = CLIEngine.CLIEngine;
}

function extendsCallbacks(config, filename, dirname) {
	// Expand the config, minus the rules
	const cli = new CLIEngine({
		useEslintrc: false,
		allowInlineConfig: false,
		baseConfig: Object.assign({}, config, { rules: {} }),
	});
	const expanded = cli.getConfigForFile('index.js');

	// If the entire rules property is a callback we can short-circuit here.
	if (typeof config.rules === 'function') {
		return Object.assign({}, config, { rules: config.rules(expanded.rules) });
	}

	// Look for any rules that are callbacks and invoke them
	const expandedRules = Object
		.entries(config.rules)
		.map(function(entry) {
			const key = entry[0], value = entry[1];
			if (typeof value !== 'function') {
				return [key, value];
			}
			return [key, value.apply(value, expanded.rules[key])];
		})
		.reduce(function(obj, entry) { return Object.assign(obj, { [entry[0]]: entry[1] }); }, {});

	// Merge with base config and return
	return Object.assign({}, config, { rules: expandedRules });
}

module.exports = extendsCallbacks;

