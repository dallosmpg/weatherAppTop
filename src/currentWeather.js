import { getLocationCoords } from "./metUtil.js";
import { apiKey } from "./index.js";

export async function getCurrentWeatherHTML() {
    const weatherData = await fetchCurrWeatherData();
    const weatherDataObj = getUsedWeatherData(weatherData);
    return createCurrentWeatherHTML(weatherDataObj);
}

async function fetchCurrWeatherData() {
    const [lat, lon] = await getLocationCoords();
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    
    const response = await fetch(url, {mode: 'cors'});
    const weatherData = await response.json();
    return weatherData;
}

function getUsedWeatherData(weatherDataObj) {
    const weatherData = weatherDataObj;
    const currWeather = {
        currWeatherLocation: weatherData.name,
        currWeatherCoord: `${weatherData.coord.lon}, ${weatherData.coord.lat}`,
        currWeatherProperty: weatherData.weather[0].main,
        currWeatherPropertyDesc: weatherData.weather[0].description,
        currWeatherID: weatherData.weather[0].id,
        currWeatherIcon: weatherData.weather[0].icon,
        currWeatherTemp: weatherData.main.temp,
        currWeatherTempFL: weatherData.main.feels_like,
        currWeatherTempMin: weatherData.main.temp_min,
        currWeatherTempMax: weatherData.main.temp_max,
        currWeatherTempMax: weatherData.main.temp_max,
        currWeatherPress: weatherData.main.pressure,
        currWeatherHum: weatherData.main.humidity,
        currWeatherVis: weatherData.visibility,
        currWeatherWindSpeed: weatherData.wind.speed,
        currWeatherWindDir: weatherData.wind.deg,
        currWeatherClouds: weatherData.clouds.all,
    }
    return currWeather;
}


function createCurrentWeatherHTML(filteredWeatherDataObj) {
    const imgURL = `http://openweathermap.org/img/wn/${filteredWeatherDataObj.currWeatherIcon}@2x.png`
    const template = `
            <div class="curr-weather-location flex-center-column">
                <h2>Current weather at:</h2>
                <h3>${filteredWeatherDataObj.currWeatherLocation}</h3>
                <h4>${filteredWeatherDataObj.currWeatherCoord}</h4>
            </div>
            <div class="curr-weather-temperature flex-center-column">
                <h5>Temperature: ${filteredWeatherDataObj.currWeatherTemp}</h5>
                <h4>Temperature felt: ${filteredWeatherDataObj.currWeatherTempFL}</h4>
                <h6>Tmin: ${filteredWeatherDataObj.currWeatherTempMin}</h6>
                <h6>Tmax: ${filteredWeatherDataObj.currWeatherTempMin}</h6>
            </div>
            <div class="curr-weather-icon flex-center-column">
                <img src="${imgURL}" alt="Weather description icon: ${filteredWeatherDataObj.currWeatherPropertyDesc}">
                <h5>${filteredWeatherDataObj.currWeatherPropertyDesc}</h5>
            </div>
            <div class="curr-weather-wind flex-center-column">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M13 18h-2v-8l-3.5 3.5l-1.42-1.42L12 6.16l5.92 5.92l-1.42 1.42L13 10v8M12 2a10 10 0 0 1 10 10a10 10 0 0 1-10 10A10 10 0 0 1 2 12A10 10 0 0 1 12 2m0 2a8 8 0 0 0-8 8a8 8 0 0 0 8 8a8 8 0 0 0 8-8a8 8 0 0 0-8-8Z"/></svg>
                <h5>Wind speed: ${filteredWeatherDataObj.currWeatherWindSpeed}</h5>
            </div>
            <div class="curr-weather-misc flex-center-column">
                <h5>${filteredWeatherDataObj.currWeatherClouds}</h5>
                <h5>${filteredWeatherDataObj.currWeatherPress}</h5>
                <h5>${filteredWeatherDataObj.currWeatherHum}</h5>
                <h5>${filteredWeatherDataObj.currWeatherVis}</h5>
            </div>

    `
    return template;
}