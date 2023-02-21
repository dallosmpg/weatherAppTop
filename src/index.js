import { getForecastWeatherHTML } from "./forecastWeather.js";
import { getCurrentWeatherHTML } from "./currentWeather.js";

export const locationInput = document.querySelector('#location');
let locationInputValue = locationInput.value;
export const apiKey = 'd64d5c0808808df9dcde98fb9640bcfc';
const contactBtn = document.querySelector('footer > svg');
const currentWeatherDiv = document.querySelector('.current-weather');
const mainWeatherDisplay = document.querySelector('main');
const searchButton = document.querySelector('.location-search-btn');

function revealContact() {
    contactBtn.classList.toggle('rotated');
    document.querySelector('.footer-contact').classList.toggle('hidden');
}

async function populateCurrWeatherElems() {
    currentWeatherDiv.innerHTML = "";
    currentWeatherDiv.innerHTML = '<div style="grid-column: span 4;" class="spinner">';
    const currWeatherHTML =  await getCurrentWeatherHTML(); 
    currentWeatherDiv.innerHTML = "";
    currentWeatherDiv.insertAdjacentHTML('afterbegin', currWeatherHTML);
}

async function populateForecastWeatherElems() {
    if (document.querySelector('.forecast-weather')) mainWeatherDisplay.removeChild(mainWeatherDisplay.lastElementChild);
    const forecastWeatherElem =  await getForecastWeatherHTML();
    console.log(forecastWeatherElem);
    
    mainWeatherDisplay.insertAdjacentElement('beforeend', forecastWeatherElem);
}


contactBtn.addEventListener('click', revealContact);
locationInput.addEventListener('blur', () => {
    if (locationInputValue === locationInput.value) return;
    locationInputValue = locationInput.value;
    populateCurrWeatherElems();
    populateForecastWeatherElems();
});
document.addEventListener('keypress', (event) => {
    if (locationInputValue === locationInput.value) return;
    locationInputValue = locationInput.value;
    if (event.target === locationInput && event.key === 'Enter') {
        populateCurrWeatherElems();
        populateForecastWeatherElems();
    }
});
searchButton.addEventListener('click', () => {
    if (locationInputValue === locationInput.value) return;
    locationInputValue = locationInput.value;
        populateCurrWeatherElems();
        populateForecastWeatherElems();
})
populateCurrWeatherElems();
populateForecastWeatherElems();
