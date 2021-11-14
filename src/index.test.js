const extendsCallbacks = require('./index');

test('extendsCallbacks works with callback rules', () => {
	const result = extendsCallbacks({
		extends: 'airbnb',
		rules: {
			'no-multiple-empty-lines': (severity, options) => [severity, { ...options, 'max': 5 }],
		},
	});
	expect(result).toEqual({
		extends: 'airbnb',
		rules: {
			'no-multiple-empty-lines': ['error', {
				max: 5,
				maxBOF: 0,
				maxEOF: 0,
			}],
		},
	});
});

test('extendsCallbacks works with a callback for the entire ruleset', () => {
	const result = extendsCallbacks({
		extends: 'airbnb',
		rules: (rules) => ({
			'no-multiple-empty-lines': (
				r = rules['no-multiple-empty-lines'],
				[r[0], { ...r[1], 'max': 5 }]
			),
		}),
	});
	expect(result).toEqual({
		extends: 'airbnb',
		rules: {
			'no-multiple-empty-lines': ['error', {
				max: 5,
				maxBOF: 0,
				maxEOF: 0,
			}],
		},
	});
});

test('extendsCallbacks works with static rules', () => {
	const result = extendsCallbacks({
		extends: 'airbnb',
		rules: {
			'no-multiple-empty-lines': ['warning', { max: 4 }],
		},
	});
	expect(result).toEqual({
		extends: 'airbnb',
		rules: {
			'no-multiple-empty-lines': ['warning', { max: 4 }],
		},
	});
});

test('extendsCallbacks works with multiple extends', () => {
	const result = extendsCallbacks({
		extends: ['airbnb', 'airbnb'],
		rules: {
			'no-multiple-empty-lines': (severity, options) => [severity, { ...options, 'max': 5 }],
		},
	});
	expect(result).toEqual({
		extends: ['airbnb', 'airbnb'],
		rules: {
			'no-multiple-empty-lines': ['error', {
				max: 5,
				maxBOF: 0,
				maxEOF: 0,
			}],
		},
	});
});

test('extendsCallbacks works with callback rules in an override', () => {
	const result = extendsCallbacks({
		extends: 'airbnb',
		rules: {},
		overrides: [{
			files: ['**/*.js'],
			rules: {
				'no-multiple-empty-lines': (severity, options) => [severity, { ...options, 'max': 5 }],
			},
		}],
	});
	expect(result).toEqual({
		extends: 'airbnb',
		rules: {},
		overrides: [{
			files: ['**/*.js'],
			rules: {
				'no-multiple-empty-lines': ['error', {
					max: 5,
					maxBOF: 0,
					maxEOF: 0,
				}],
			},
		}],
	});
});

test('extendsCallbacks works with a callback for the entire ruleset in an override', () => {
	const result = extendsCallbacks({
		extends: 'airbnb',
		rules: {},
		overrides: [{
			files: ['**/*.js'],
			rules: (rules) => ({
				'no-multiple-empty-lines': (
					r = rules['no-multiple-empty-lines'],
					[r[0], { ...r[1], 'max': 5 }]
				),
			}),
		}],
	});
	expect(result).toEqual({
		extends: 'airbnb',
		rules: {},
		overrides: [{
			files: ['**/*.js'],
			rules: {
				'no-multiple-empty-lines': ['error', {
					max: 5,
					maxBOF: 0,
					maxEOF: 0,
				}],
			},
		}],
	});
});

test('extendsCallbacks rule passed to callback rule in an override includes non-override rule', () => {
	const mainRule = ['error', { max: 5, maxBOF: 0, maxEOF: 0 }];
	const overrideRule = jest.fn(() => ['error', {}]);

	extendsCallbacks({
		extends: 'airbnb',
		rules: {
			'no-multiple-empty-lines': mainRule,
		},
		overrides: [{
			files: ['**/*.js'],
			rules: {
				'no-multiple-empty-lines': overrideRule,
			},
		}],
	});

	expect(overrideRule.mock.calls.length).toBe(1);
	expect(overrideRule.mock.calls[0]).toEqual(mainRule);
});

test('extendsCallbacks rules passed to callback for the entire ruleset in an override includes non-override rules', () => {
	const mainRules = {
		'no-multiple-empty-lines': ['error', {
			max: 5,
			maxBOF: 0,
			maxEOF: 0,
		}],
	};
	const overrideRules = jest.fn(() => ({}));

	extendsCallbacks({
		extends: 'airbnb',
		rules: mainRules,
		overrides: [{
			files: ['**/*.js'],
			rules: overrideRules,
		}],
	});

	expect(overrideRules.mock.calls.length).toBe(1);
	expect(overrideRules.mock.calls[0][0]['no-multiple-empty-lines']).toEqual(mainRules['no-multiple-empty-lines']);
});
