import test from 'ava';

import { isFloat } from 'helpers/test-helpers';

import {
	getCoords,
	checkResponse,
	farenheitToCelsius,
	celsiusToFarenheit,
	kelvinToCelsius
	// getWeather
	// filterData,
	// updateDOM,
	// catchError
} from 'helpers/helpers';

test('getCoords() - returns an object with lat and long keys', t => {
	const req = {
		data: {
			loc: '1.1,2.2'
		}
	};
	const result = getCoords(req);

	t.is(result.hasOwnProperty('lat'), true);
	t.is(result.hasOwnProperty('lon'), true);
});

test('getCoords() - floats', t => {
	const req = {
		data: {
			loc: '1.1,2.2'
		}
	};
	const result = getCoords(req);

	t.is(isFloat(result.lat), true);
	t.is(isFloat(result.lon), true);
});

test('checkResponse() - throw error if status !== 200', t => {
	const req = {
		status: 201
	};

	t.throws(() => {
		checkResponse(req);
	});
});

test('checkResponse() - not throws error if status === 200', t => {
	const req = {
		status: 200
	};

	t.notThrows(() => {
		checkResponse(req);
	});
});

test('checkResponse() - should return request', t => {
	const req = {
		status: 200,
		foo: 'foo'
	};

	t.deepEqual(checkResponse(req), req);
});

test('farenheitToCelsius() - get the right temperature', t => {
	t.is(farenheitToCelsius(32), 0);
});

test('celsiusToFarenheit() - get the right temperature', t => {
	t.is(celsiusToFarenheit(0), 32);
});

test('kelvinToCelsius() - get the right temperature', t => {
	t.is(kelvinToCelsius(273.15), 0);
});

test.todo('getWeather');
test.todo('checkResponse');
test.todo('filterData');
test.todo('updateDOM');
test.todo('catchError');
