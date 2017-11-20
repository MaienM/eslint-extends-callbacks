const Config = require('eslint/lib/config');
const ConfigFile = require('eslint/lib/config/config-file');
const Linter = require('eslint/lib/linter');
const _ = require('lodash');

function extendsCallbacks(config) {
	// Expand the config, minus the rules
	const expanded = ConfigFile.applyExtends(
		_.omit(config, 'rules'),
		new Config({}, new Linter()),
		require.resolve('eslint-config-airbnb'),
		__dirname,
	);

	// Look for any rules that are callbacks and invoke them
	const expandedRules = _.mapValues(config.rules, (value, key) => {
		if (!_.isFunction(value)) {
			return value;
		}

		return value.apply(value, expanded.rules[key]);
	});

	// Merge with base config and return
	return _.assign({}, config, { rules: expandedRules });
}

module.exports = extendsCallbacks;

