let CLIEngine = require('eslint/lib/cli-engine'); // ESLint 4.x and 5.x.
if (CLIEngine.CLIEngine) { // ESLint 6.x
	CLIEngine = CLIEngine.CLIEngine;
}

function extendsCallbacks(config) {
	// A clean version of the config that will be based purely on the defaults/extends.
	const baseConfig = Object.assign({}, config, {
		rules: {},
		overrides: [],
	});
	const result = Object.assign({}, baseConfig);

	// Expand this config to get the actual values of the rules.
	const cli = new CLIEngine({
		useEslintrc: false,
		allowInlineConfig: false,
		baseConfig,
	});
	const expanded = cli.getConfigForFile('-');

	// Process overrides if they exist. We combine the extends from the override with that of the base config so that the
	// callback actually receives the value the rule would have at that point.
	if (config.overrides) {
		result.overrides = config.overrides.map((override) => ({
			...override,
			...extendsCallbacks({
				extends: [baseConfig.extends, override.extends].flat().filter((v) => v),
				rules: override.rules,
			}),
		}));
	}

	if (typeof config.rules === 'function') {
		result.rules = config.rules(expanded.rules);
	}
	else {
		result.rules = Object
			.entries(config.rules)
			.map(function(entry) {
				const key = entry[0], value = entry[1];
				if (typeof value !== 'function') {
					return [key, value];
				}
				return [key, value.apply(value, expanded.rules[key])];
			})
			.reduce(function(obj, entry) { return Object.assign(obj, { [entry[0]]: entry[1] }); }, {});
	}

	return result;
}

module.exports = extendsCallbacks;

