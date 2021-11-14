const { Legacy: { CascadingConfigArrayFactory } } = require('@eslint/eslintrc');

function extendsCallbacks(config) {
	// A clean version of the config that will be based purely on the defaults/extends.
	const baseConfig = Object.assign({}, config);
	baseConfig.rules = {};
	delete baseConfig.overrides;
	const result = Object.assign({}, baseConfig);

	// Expand this config to get the actual values of the rules.
	const ccaf = new CascadingConfigArrayFactory({
		useEslintrc: false,
		allowInlineConfig: false,
		baseConfig,
	});
	const expanded = ccaf.getConfigArrayForFile('/').extractConfig('/').toCompatibleObjectAsConfigFileContent();

	// Process overrides if they exist. We combine the extends from the override with that of the base config so that the
	// callback actually receives the value the rule would have at that point.
	if (config.overrides) {
		result.overrides = config.overrides.map((override) => {
			const overrideResult = {
				...override,
				...extendsCallbacks({
					extends: [baseConfig.extends, override.extends].flat().filter((v) => v),
					rules: override.rules,
				}),
				extends: override.extends,
			};
			if (overrideResult.extends === undefined) {
				delete overrideResult.extends;
			}
			return overrideResult;
		});
	}

	if (typeof config.rules === 'function') {
		result.rules = config.rules(expanded.rules);
	} else {
		result.rules = config.rules;
	}

	result.rules = Object
		.entries(result.rules)
		.map(function(entry) {
			const key = entry[0], value = entry[1];
			if (typeof value !== 'function') {
				return [key, value];
			}
			return [key, value.apply(value, expanded.rules[key])];
		})
		.reduce(function(obj, entry) { return Object.assign(obj, { [entry[0]]: entry[1] }); }, {});

	return result;
}

module.exports = extendsCallbacks;
