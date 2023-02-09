import { getForecastWeatherHTML } from "./forecastWeather.js";
import { getCurrentWeatherHTML } from "./currentWeather.js";

export const locationInput = document.querySelector('#location')
export const apiKey = 'd64d5c0808808df9dcde98fb9640bcfc';
const contactBtn = document.querySelector('footer > svg');
const currentWeatherDiv = document.querySelector('.current-weather');
const mainWeatherDisplay = document.querySelector('main');

function revealContact() {
    contactBtn.classList.toggle('rotated');
    document.querySelector('.footer-contact').classList.toggle('hidden');
}

async function populateCurrWeatherElems(event) {
    if (event) event.preventDefault();
    const currWeatherHTML =  await getCurrentWeatherHTML(); 
    currentWeatherDiv.innerHTML = "";
    currentWeatherDiv.insertAdjacentHTML('afterbegin', currWeatherHTML);
}

async function populateForecastWeatherElems(event) {
    if (event) event.preventDefault();
    if (mainWeatherDisplay.lastElementChild.classList.contains('forecast-weather')) mainWeatherDisplay.removeChild(mainWeatherDisplay.lastElementChild);
    const forecastWeatherElem =  await getForecastWeatherHTML();
    
    mainWeatherDisplay.insertAdjacentElement('beforeend', forecastWeatherElem);
}


contactBtn.addEventListener('click', revealContact);
locationInput.addEventListener('blur', populateCurrWeatherElems);
locationInput.addEventListener('blur', populateForecastWeatherElems);

populateCurrWeatherElems();
populateForecastWeatherElems()