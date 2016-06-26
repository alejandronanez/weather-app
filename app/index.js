
import {
	WEATHER_API_KEY,
	WEATHER_API_URL,
	IP_API_URL
} from 'constants/constants';

import axios from 'axios';

function getCoords({ data }) {
	const lat = parseFloat(data.loc.split(',')[0]);
	const lon = parseFloat(data.loc.split(',')[1]);

	return { lat, lon };
}

function getWeather({ lat, lon }) {
	const params = {
		APPID: WEATHER_API_KEY,
		lat,
		lon
	};

	return axios.get(WEATHER_API_URL, { params });
}

function checkResponse(response) {

	if (response.status !== 200) {
		throw new Error('Something went wrong :(');
	}

	return response;
}

function farenheitToCelsius(temperature) {
	return ((temperature - 32) * 5) / 9;
}

function celsiusToFarenheit(temperature) {
	return ((temperature * 9) / 5) + 32;
}

function kelvinToCelsius(temperature) {
	return temperature - 273.15;
}

function filterData({ data }) {
	const { temp: cityTemperature } = data.main;
	const cityIcon = data.weather[0];
	const {
		name: cityName,
		weather: cityWeather
	} = data;

	return {
		cityTemperature: kelvinToCelsius(cityTemperature),
		cityName,
		cityWeather: cityWeather[0].description,
		cityIcon: cityIcon.id
	};
}

function updateDOM({ cityTemperature, cityName, cityWeather, cityIcon }) {
	let temperature = cityTemperature.toFixed(1);
	const toCelsiusButton = document.querySelector('.js-to-celsius');
	const toFarenheitButton = document.querySelector('.js-to-farenheit');
	const temperatureElement = document.querySelector('.js-temperature');

	document.querySelector('.js-city').textContent = cityName;
	document.querySelector('.js-weather').textContent = cityWeather;
	document.querySelector('.js-icon').className = `js-icon wi wi-owm-${cityIcon}`;
	temperatureElement.textContent = `${temperature} Cº`;
	toCelsiusButton.setAttribute('class', 'active');
	toCelsiusButton.disabled = true;

	toCelsiusButton.addEventListener('click', () => {
		temperature = farenheitToCelsius(temperature).toFixed(1);
		temperatureElement.textContent = `${temperature} Cº`;

		toFarenheitButton.setAttribute('class', '');
		toCelsiusButton.setAttribute('class', 'active');

		toFarenheitButton.disabled = false;
		toCelsiusButton.disabled = true;
	});

	toFarenheitButton.addEventListener('click', () => {
		temperature = celsiusToFarenheit(temperature).toFixed(1);
		temperatureElement.textContent = `${temperature} Fº`;

		toFarenheitButton.setAttribute('class', 'active');
		toCelsiusButton.setAttribute('class', '');

		toFarenheitButton.disabled = true;
		toCelsiusButton.disabled = false;
	});
}

function catchError(error) {
	/* eslint-disable no-alert */
	alert(error);
	/* eslint-enable no-alert */
}

axios.get(IP_API_URL)
	.then(checkResponse)
	.then(getCoords)
	.then(getWeather)
	.then(checkResponse)
	.then(filterData)
	.then(updateDOM)
	.catch(catchError);
