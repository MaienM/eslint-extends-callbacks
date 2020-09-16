const extendsCallbacks = require('./index');

test('extendsCallbacks works with callback rules', () => {
	const result = extendsCallbacks({
		extends: 'airbnb',
		rules: {
			'no-multiple-empty-lines': (severity, options) => [severity, { ...options, 'max': 5 }],
		},
	});
	expect(result.rules['no-multiple-empty-lines'][0]).toEqual('error');
	expect(result.rules['no-multiple-empty-lines'][1].max).toEqual(5);
	expect(result.rules['no-multiple-empty-lines'][1].maxEOF).toEqual(0);
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
	expect(result.rules['no-multiple-empty-lines'][0]).toEqual('error');
	expect(result.rules['no-multiple-empty-lines'][1].max).toEqual(5);
	expect(result.rules['no-multiple-empty-lines'][1].maxEOF).toEqual(0);
});

test('extendsCallbacks works with static rules', () => {
	const result = extendsCallbacks({
		extends: 'airbnb',
		rules: {
			'no-multiple-empty-lines': ['warning', { max: 4 }],
		},
	});
	expect(result.rules['no-multiple-empty-lines'][0]).toEqual('warning');
	expect(result.rules['no-multiple-empty-lines'][1].max).toEqual(4);
	expect(result.rules['no-multiple-empty-lines'][1].maxEOF).toBeUndefined();
});

test('extendsCallbacks works with multiple extends', () => {
	const result = extendsCallbacks({
		extends: ['airbnb', 'airbnb'],
		rules: {
			'no-multiple-empty-lines': (severity, options) => [severity, { ...options, 'max': 5 }],
		},
	});
	expect(result.rules['no-multiple-empty-lines'][0]).toEqual('error');
	expect(result.rules['no-multiple-empty-lines'][1].max).toEqual(5);
	expect(result.rules['no-multiple-empty-lines'][1].maxEOF).toEqual(0);
});

test('extendsCallbacks does not return rules that are not overridden', () => {
	const result = extendsCallbacks({
		extends: 'airbnb',
		rules: {
			'no-multiple-empty-lines': (severity, options) => [severity, { ...options, 'max': 5 }],
		},
	});
	expect(result.rules['no-tabs']).toBeUndefined();
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
	expect(result.overrides[0].rules['no-multiple-empty-lines'][0]).toEqual('error');
	expect(result.overrides[0].rules['no-multiple-empty-lines'][1].max).toEqual(5);
	expect(result.overrides[0].rules['no-multiple-empty-lines'][1].maxEOF).toEqual(0);
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
	expect(result.overrides[0].rules['no-multiple-empty-lines'][0]).toEqual('error');
	expect(result.overrides[0].rules['no-multiple-empty-lines'][1].max).toEqual(5);
	expect(result.overrides[0].rules['no-multiple-empty-lines'][1].maxEOF).toEqual(0);
});
