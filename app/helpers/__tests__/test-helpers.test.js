import test from 'ava';

import { isFloat } from 'helpers/test-helpers';

test('isFloat() - returns true if it is float', t => {
	t.true(isFloat(1.1));
	t.true(isFloat(-1.1));
});

test('isFloat() - returns false if it is not float', t => {
	t.false(isFloat(1));
	t.false(isFloat(0));
	t.false(isFloat('a'));
	t.false(isFloat(false));
	t.false(isFloat(true));
	t.false(isFloat({}));
	t.false(isFloat(() => {}));
});
