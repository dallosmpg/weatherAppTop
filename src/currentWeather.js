import { getLocationCoords, setBackgroundImg, calculateWindDirection } from "./metUtil.js";
import { apiKey } from "./index.js";
import { calculateCloudbase } from "./thermalWeather.js";

let elevation;

export async function getCurrentWeatherHTML() {
    const weatherData = await fetchCurrWeatherData();
    const weatherDataObj = getUsedWeatherData(weatherData);
    setBackgroundImg(weatherDataObj.currWeatherPropertyDesc);
    calculateCloudbase(weatherDataObj.currWeatherHum, weatherDataObj.currWeatherPress, weatherDataObj.currWeatherTemp, elevation);
    return createCurrentWeatherHTML(weatherDataObj);
}

async function fetchCurrWeatherData() {
    const [lat, lon, elev] = await getLocationCoords();
    elevation = elev;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    
    const response = await fetch(url, {mode: 'cors'});
    const weatherData = await response.json();
    return weatherData;
}

function getUsedWeatherData(weatherDataObj) {
    const currWeather = {
        currWeatherLocation: weatherDataObj.name,
        currWeatherCoord: `${weatherDataObj.coord.lat}, ${weatherDataObj.coord.lon}`,
        currWeatherProperty: weatherDataObj.weather[0].main,
        currWeatherPropertyDesc: weatherDataObj.weather[0].description,
        currWeatherID: weatherDataObj.weather[0].id,
        currWeatherIcon: weatherDataObj.weather[0].icon,
        currWeatherTemp: weatherDataObj.main.temp,
        currWeatherTempFL: weatherDataObj.main.feels_like,
        currWeatherTempMin: weatherDataObj.main.temp_min,
        currWeatherTempMax: weatherDataObj.main.temp_max,
        currWeatherTempMax: weatherDataObj.main.temp_max,
        currWeatherPress: weatherDataObj.main.pressure,
        currWeatherHum: weatherDataObj.main.humidity,
        currWeatherVis: weatherDataObj.visibility,
        currWeatherWindSpeed: weatherDataObj.wind.speed,
        currWeatherWindDir: weatherDataObj.wind.deg,
        currWeatherClouds: weatherDataObj.clouds.all,
    }
    return currWeather;
}


function createCurrentWeatherHTML(filteredWeatherDataObj) {
    const imgURL = `http://openweathermap.org/img/wn/${filteredWeatherDataObj.currWeatherIcon}@2x.png`;
    const windArrowDeg = calculateWindDirection(filteredWeatherDataObj.currWeatherWindDir);
    const template = `
            <div class="curr-weather-location flex-center-column">
                <h2>Current weather at: <span>${filteredWeatherDataObj.currWeatherLocation}</span></h2>
                <h4><span>${filteredWeatherDataObj.currWeatherCoord}</span></h4>
            </div>
            <div class="curr-weather-temperature flex-center-column weather-card-data-group">
                <h5>Temperature: ${filteredWeatherDataObj.currWeatherTemp}</h5>
                <h4>Temperature felt: ${filteredWeatherDataObj.currWeatherTempFL}</h4>
                <div class="temp-min-max flex-center">
                    <h6>Tmin: ${filteredWeatherDataObj.currWeatherTempMin}</h6>
                    <h6>Tmax: ${filteredWeatherDataObj.currWeatherTempMin}</h6>
                </div>
            </div>
            <div class="curr-weather-icon flex-center-column weather-card-data-group">
                <img src="${imgURL}" alt="Weather description icon: ${filteredWeatherDataObj.currWeatherPropertyDesc}">
                <h5>${filteredWeatherDataObj.currWeatherPropertyDesc}</h5>
            </div>
            <div class="curr-weather-wind flex-center-column weather-card-data-group">
                <svg style="transform: rotate(${windArrowDeg}deg);" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M13 18h-2v-8l-3.5 3.5l-1.42-1.42L12 6.16l5.92 5.92l-1.42 1.42L13 10v8M12 2a10 10 0 0 1 10 10a10 10 0 0 1-10 10A10 10 0 0 1 2 12A10 10 0 0 1 12 2m0 2a8 8 0 0 0-8 8a8 8 0 0 0 8 8a8 8 0 0 0 8-8a8 8 0 0 0-8-8Z"/></svg>
                <h6>Wind dir: ${filteredWeatherDataObj.currWeatherWindDir}</h6>
                <h5>Wind speed: ${filteredWeatherDataObj.currWeatherWindSpeed}</h5>
            </div>
            <div class="curr-weather-misc flex-center-column weather-card-data-group">
                <h5>${filteredWeatherDataObj.currWeatherClouds}</h5>
                <h5>${filteredWeatherDataObj.currWeatherPress}</h5>
                <h5>${filteredWeatherDataObj.currWeatherHum}</h5>
                <h5>${filteredWeatherDataObj.currWeatherVis}</h5>
            </div>

    `
    return template;
}