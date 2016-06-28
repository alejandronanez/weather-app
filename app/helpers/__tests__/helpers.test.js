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
	catchError,
	updateDOM
} from 'helpers/helpers';

test.beforeEach(() => {
	sinon.spy(axios, 'get');
	sinon.spy(window, 'alert');
	document.body.innerHTML = '';
});

test.afterEach(() => {
	axios.get.restore();
	window.alert.restore();
	document.body.innerHTML = '';
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

test('updateDOM() - Updates the DOM accordingly', t => {

	document.body.innerHTML = `
		<div id="container">
			<h1 class="city js-city"></h1>
			<div class="weather-container">
				<p class="weather js-weather"></p>
				<span class="icon"><i class="js-icon"></i></span>
			</div>
			<div class="temperature js-temperature"><span class="unit js-unit"></span></div>
			<div class="switcher">
				<button type="button" class="js-to-farenheit">F</button>
				<button type="button" class="js-to-celsius">C</button>
			</div>
		</div>
	`;

	const data = {
		cityTemperature: 273.15, // 273.15K = 0C
		cityName: 'foo',
		cityWeather: 'bar',
		cityIcon: 'baz'
	};

	updateDOM(data);

	const weather = document.querySelector('.js-weather');
	const city = document.querySelector('.js-city');
	const icon = document.querySelector('.js-icon');
	const temperature = document.querySelector('.js-temperature');
	const farenheitButton = document.querySelector('.js-to-farenheit');
	const celsiusButton = document.querySelector('.js-to-celsius');

	t.is(weather.innerHTML, data.cityWeather);
	t.is(city.innerHTML, data.cityName);
	t.is(icon.classList[0], 'js-icon');
	t.is(icon.classList[1], 'wi');
	t.is(icon.classList[2], 'wi-owm-baz');
	t.is(temperature.innerHTML, '0.0 Cº');
	t.false(farenheitButton.disabled);
	t.true(celsiusButton.disabled);
});

test('updateDOM() - Transforms to farenheit disable transform to celsius button', t => {

	document.body.innerHTML = `
		<div id="container">
			<h1 class="city js-city"></h1>
			<div class="weather-container">
				<p class="weather js-weather"></p>
				<span class="icon"><i class="js-icon"></i></span>
			</div>
			<div class="temperature js-temperature"><span class="unit js-unit"></span></div>
			<div class="switcher">
				<button type="button" class="js-to-farenheit">F</button>
				<button type="button" class="js-to-celsius">C</button>
			</div>
		</div>
	`;

	const data = {
		cityTemperature: 273.15, // 273.15K = 0C
		cityName: 'foo',
		cityWeather: 'bar',
		cityIcon: 'baz'
	};

	updateDOM(data);

	const farenheitButton = document.querySelector('.js-to-farenheit');
	const celsiusButton = document.querySelector('.js-to-celsius');

	farenheitButton.click();

	t.false(celsiusButton.disabled);
	t.true(farenheitButton.disabled);
});

test('updateDOM() - Transforms to celsius disable transform to farenheit button', t => {

	document.body.innerHTML = `
		<div id="container">
			<h1 class="city js-city"></h1>
			<div class="weather-container">
				<p class="weather js-weather"></p>
				<span class="icon"><i class="js-icon"></i></span>
			</div>
			<div class="temperature js-temperature"><span class="unit js-unit"></span></div>
			<div class="switcher">
				<button type="button" class="js-to-farenheit">F</button>
				<button type="button" class="js-to-celsius">C</button>
			</div>
		</div>
	`;

	const data = {
		cityTemperature: 273.15, // 273.15K = 0C
		cityName: 'foo',
		cityWeather: 'bar',
		cityIcon: 'baz'
	};

	updateDOM(data);

	const farenheitButton = document.querySelector('.js-to-farenheit');
	const celsiusButton = document.querySelector('.js-to-celsius');

	celsiusButton.disabled = false; // It is disabled by default

	celsiusButton.click();

	t.true(celsiusButton.disabled);
	t.false(farenheitButton.disabled);
});
