const extendsCallbacks = require('./index');

test('extendsCallbacks works with callback rules', () => {
	const result = extendsCallbacks({
		extends: 'airbnb',
		rules: {
			'no-multiple-empty-lines': (severity, options) => [severity, { ...options, 'max': 5 }],
		},
	}, __filename, __dirname);
	expect(result.rules['no-multiple-empty-lines'][0]).toEqual('error');
	expect(result.rules['no-multiple-empty-lines'][1].max).toEqual(5);
	expect(result.rules['no-multiple-empty-lines'][1].maxEOF).toEqual(1);
});

test('extendsCallbacks works with static rules', () => {
	const result = extendsCallbacks({
		extends: 'airbnb',
		rules: {
			'no-multiple-empty-lines': ['warning', { max: 4 }],
		},
	}, __filename, __dirname);
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
	}, __filename, __dirname);
	expect(result.rules['no-multiple-empty-lines'][0]).toEqual('error');
	expect(result.rules['no-multiple-empty-lines'][1].max).toEqual(5);
	expect(result.rules['no-multiple-empty-lines'][1].maxEOF).toEqual(1);
});

test('extendsCallbacks does not return rules that are not overridden', () => {
	const result = extendsCallbacks({
		extends: 'airbnb',
		rules: {
			'no-multiple-empty-lines': (severity, options) => [severity, { ...options, 'max': 5 }],
		},
	}, __filename, __dirname);
	expect(result.rules['no-tabs']).toBeUndefined();
});

