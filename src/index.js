import { get5dayWeather } from "./forecastWeather.js";
import { getCurrentWeatherHTML } from "./currentWeather.js";
import { createApi } from "unsplash-js";

export const locationInput = document.querySelector('#location')
export const apiKey = 'd64d5c0808808df9dcde98fb9640bcfc';
const contactBtn = document.querySelector('footer > svg');
const currentWeatherDiv = document.querySelector('.current-weather');

function revealContact() {
    contactBtn.classList.toggle('rotated');
    document.querySelector('.footer-contact').classList.toggle('hidden');
}

async function populateCurrWeatherElems(e) {
    const currWeatherHTML =  await getCurrentWeatherHTML(); 
    document.querySelector('.current-weather').insertAdjacentHTML('afterbegin', currWeatherHTML);
}

contactBtn.addEventListener('click', revealContact);
locationInput.addEventListener('blur', populateCurrWeatherElems);
populateCurrWeatherElems();