
import axios from 'axios';

import { IP_API_URL } from 'constants/constants';
import {
	getCoords,
	getWeather,
	checkResponse,
	filterData,
	updateDOM,
	catchError
} from 'helpers/helpers';

axios.get(IP_API_URL)
	.then(checkResponse)
	.then(getCoords)
	.then(getWeather)
	.then(checkResponse)
	.then(filterData)
	.then(updateDOM)
	.catch(catchError);
