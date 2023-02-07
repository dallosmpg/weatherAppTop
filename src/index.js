import { get5dayWeather } from "./forecastWeather.js";
import { getCurrentWeather } from "./currentWeather.js";

export const locationInput = document.querySelector('#location')
export const apiKey = 'd64d5c0808808df9dcde98fb9640bcfc';

locationInput.addEventListener('blur', getCurrentWeather);
getCurrentWeather();
get5dayWeather();