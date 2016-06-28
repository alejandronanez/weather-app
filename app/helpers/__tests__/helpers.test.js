import test from 'ava';
import sinon from 'sinon';
import axios from 'axios';

import { isFloat } from 'helpers/test-helpers';
import {
	WEATHER_API_KEY,
	WEATHER_API_URL,
} from 'constants/constants';

import {
	getCoords,
	checkResponse,
	farenheitToCelsius,
	celsiusToFarenheit,
	kelvinToCelsius,
	getWeather,
	filterData,
	catchError
	// updateDOM
} from 'helpers/helpers';

test.beforeEach(() => {
	sinon.spy(axios, 'get');
	sinon.spy(window, 'alert');
});

test.afterEach(() => {
	axios.get.restore();
	window.alert.restore();
});

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

test('getWeather() - call axios.get once', t => {
	getWeather({ lat: 1, lon: 1 });

	t.true(axios.get.calledOnce);
});

test('getWeather() - call axios.get with the right parameters', t => {
	getWeather({ lat: 1, lon: 1 });

	t.is(axios.get.getCall(0).args[0], WEATHER_API_URL);
	t.is(axios.get.getCall(0).args[1].params.lat, 1);
	t.is(axios.get.getCall(0).args[1].params.lon, 1);
	t.is(axios.get.getCall(0).args[1].params.APPID, WEATHER_API_KEY);
});

test('filterData() - should return the correct data', t => {
	const params = {
		data: {
			main: {
				temp: 1
			},
			weather: [{
				id: 'icon',
				description: 'description'
			}],
			name: 'foo'
		}
	};

	const result = filterData(params);

	t.true(result.hasOwnProperty('cityTemperature'));
	t.true(result.hasOwnProperty('cityName'));
	t.true(result.hasOwnProperty('cityWeather'));
	t.true(result.hasOwnProperty('cityIcon'));

	t.is(result.cityTemperature, 1);
	t.is(result.cityName, 'foo');
	t.is(result.cityWeather, 'description');
	t.is(result.cityIcon, 'icon');
});

test('catchError() - should call window.alert only once', t => {
	catchError('foo');

	t.true(window.alert.calledOnce);
});

test('catchError() - should call window.alert with the right parameters', t => {
	catchError('foo');

	t.is(window.alert.getCall(0).args[0], 'foo');
});

test.todo('updateDOM');
