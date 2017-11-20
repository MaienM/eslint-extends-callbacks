# eslint-extends-callbacks

The default way to customize the base config is to override any rules
completely. However, for things like modifying the severity, this causes
needless duplication. To prevent this, this module allows you to override the
rules using callbacks.

Whenever a rule is a method, it will be called with the rule from the base
config's array as separate arguments. Its return value is then used as the new
rule.

## Example

[javascript]
```
const extendsCallbacks = require('./eslint-extends-callbacks');

module.exports = extendsCallbacks({
	extends: [
		'airbnb',
	],
	rules: {
		// Don't allow multiple empty lines
		'no-multiple-empty-lines': (severity, options) => [severity, { ...options, 'max': 1 }],
	},
}, __filename, __dirname);
```

