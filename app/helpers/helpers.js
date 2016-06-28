
import {
	WEATHER_API_KEY,
	WEATHER_API_URL,
} from 'constants/constants';

import axios from 'axios';

export function getCoords({ data: { loc } }) {
	const lat = parseFloat(loc.split(',')[0]);
	const lon = parseFloat(loc.split(',')[1]);

	return { lat, lon };
}

export function getWeather({ lat, lon }) {
	const params = {
		APPID: WEATHER_API_KEY,
		lat,
		lon
	};

	return axios.get(WEATHER_API_URL, { params });
}

export function checkResponse(response) {

	if (response.status !== 200) {
		throw new Error('Something went wrong :(');
	}

	return response;
}

export function farenheitToCelsius(temperature) {
	return ((temperature - 32) * 5) / 9;
}

export function celsiusToFarenheit(temperature) {
	return ((temperature * 9) / 5) + 32;
}

export function kelvinToCelsius(temperature) {
	return temperature - 273.15;
}

export function filterData({ data }) {
	const { temp: cityTemperature } = data.main;
	const cityIcon = data.weather[0];
	const {
		name: cityName,
		weather: cityWeather
	} = data;

	return {
		cityTemperature,
		cityName,
		cityWeather: cityWeather[0].description,
		cityIcon: cityIcon.id
	};
}

export function updateDOM({ cityTemperature, cityName, cityWeather, cityIcon }) {
	let temperature = kelvinToCelsius(cityTemperature).toFixed(1);
	const toCelsiusButton = document.querySelector('.js-to-celsius');
	const toFarenheitButton = document.querySelector('.js-to-farenheit');
	const temperatureElement = document.querySelector('.js-temperature');

	document.querySelector('.js-city').textContent = cityName;
	document.querySelector('.js-weather').textContent = cityWeather;
	document.querySelector('.js-icon').className = `js-icon wi wi-owm-${cityIcon}`;
	temperatureElement.textContent = `${temperature} Cº`;
	toCelsiusButton.setAttribute('class', 'active js-to-celsius');
	toCelsiusButton.disabled = true;

	toCelsiusButton.addEventListener('click', () => {
		temperature = farenheitToCelsius(temperature).toFixed(1);
		temperatureElement.textContent = `${temperature} Cº`;

		toFarenheitButton.setAttribute('class', 'js-to-farenheit');
		toCelsiusButton.setAttribute('class', 'active js-to-celsius');

		toFarenheitButton.disabled = false;
		toCelsiusButton.disabled = true;
	});

	toFarenheitButton.addEventListener('click', () => {
		temperature = celsiusToFarenheit(temperature).toFixed(1);
		temperatureElement.textContent = `${temperature} Fº`;

		toFarenheitButton.setAttribute('class', 'active js-to-farenheit');
		toCelsiusButton.setAttribute('class', 'js-to-celsius');

		toFarenheitButton.disabled = true;
		toCelsiusButton.disabled = false;
	});
}

export function catchError(error) {
	/* eslint-disable no-alert */
	window.alert(error);
	/* eslint-enable no-alert */
}
