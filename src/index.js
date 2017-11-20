const Config = require('eslint/lib/config');
const ConfigFile = require('eslint/lib/config/config-file');
const Linter = require('eslint/lib/linter');

function extendsCallbacks(config, filename, dirname) {
	// Expand the config, minus the rules
	const expanded = ConfigFile.applyExtends(
		Object.assign({}, config, { rules: [] }),
		new Config({}, new Linter()),
		filename,
		dirname,
	);

	// Look for any rules that are callbacks and invoke them
	const expandedRules = Object
		.entries(config.rules)
		.map(function(entry) {
			const key = entry[0], value = entry[1];
			if (typeof value !== 'function') {
				return [key, value];
			}
			return [key, value.apply(value, expanded.rules[0][key])];
		})
		.reduce(function(obj, entry) { return Object.assign(obj, { [entry[0]]: entry[1] }); }, {});

	// Merge with base config and return
	return Object.assign({}, config, { rules: expandedRules });
}

module.exports = extendsCallbacks;

