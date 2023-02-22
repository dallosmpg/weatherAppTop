import {
  getLocationCoords,
  setBackgroundImg,
  calculateWindDirection,
} from './metUtil.js';
import { apiKey } from './index.js';
import { calculateCloudbase } from './thermalWeather.js';

let elevation;

export async function getCurrentWeatherHTML() {
  try {
    const weatherData = await fetchCurrWeatherData();
    const weatherDataObj = getUsedWeatherData(weatherData);
    setBackgroundImg(weatherDataObj.currWeatherPropertyDesc);
    calculateCloudbase(
      weatherDataObj.currWeatherHum,
      weatherDataObj.currWeatherPress,
      weatherDataObj.currWeatherTemp,
      elevation
    );
    return createCurrentWeatherHTML(weatherDataObj);
  } catch {
    return `
        <div class="flex-center-column" style="grid-column: span 4;">
            <h2>Please try again!</h2>
            <h4>The data didn't reach us or the location was not found!</h4>
        </div>
    `;
  }
}

async function fetchCurrWeatherData() {
  const [lat, lon, elev] = await getLocationCoords();
  elevation = elev;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  const response = await fetch(url);
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
    currWeatherPress: weatherDataObj.main.pressure,
    currWeatherHum: weatherDataObj.main.humidity,
    currWeatherVis: weatherDataObj.visibility,
    currWeatherWindSpeed: weatherDataObj.wind.speed,
    currWeatherWindDir: weatherDataObj.wind.deg,
    currWeatherClouds: weatherDataObj.clouds.all,
  };
  return currWeather;
}

function createCurrentWeatherHTML(filteredWeatherDataObj) {
  const imgURL = `http://openweathermap.org/img/wn/${filteredWeatherDataObj.currWeatherIcon}@2x.png`;
  const windArrowDeg = calculateWindDirection(
    filteredWeatherDataObj.currWeatherWindDir
  );
  const template = `
            <div class="curr-weather-location flex-center-column">
                <h2>Current weather at: <span>${
                  filteredWeatherDataObj.currWeatherLocation
                }</span></h2>
                <h4><span>${filteredWeatherDataObj.currWeatherCoord}</span></h4>
            </div>
            <div class="curr-weather-temp-wind weather-card-data-group flex-center-column">
                <div class="curr-weather-icon flex-center-column weather-card-data-group">
                    <img src="${imgURL}" alt="Weather description icon: ${
    filteredWeatherDataObj.currWeatherPropertyDesc
  }">
                    <h4>${filteredWeatherDataObj.currWeatherPropertyDesc}</h4>
                </div>
                <div class="curr-weather-temperature flex-center-column ">
                    <h3>Temperature: ${Number.parseFloat(
                      filteredWeatherDataObj.currWeatherTemp
                    ).toFixed(1)} °C</h3>
                    <h2>Feels like: ${Number.parseFloat(
                      filteredWeatherDataObj.currWeatherTempFL
                    ).toFixed(1)} °C</h2>
                </div>
            </div>
            <div class="curr-weather-wind flex-center-column weather-card-data-group">
                <svg style="transform: rotate(${windArrowDeg}deg);" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M13 18h-2v-8l-3.5 3.5l-1.42-1.42L12 6.16l5.92 5.92l-1.42 1.42L13 10v8M12 2a10 10 0 0 1 10 10a10 10 0 0 1-10 10A10 10 0 0 1 2 12A10 10 0 0 1 12 2m0 2a8 8 0 0 0-8 8a8 8 0 0 0 8 8a8 8 0 0 0 8-8a8 8 0 0 0-8-8Z"/></svg>
                <h4>${filteredWeatherDataObj.currWeatherWindDir}°</h4>
                <h4>Speed: ${Number.parseFloat(
                  filteredWeatherDataObj.currWeatherWindSpeed
                ).toFixed(1)} m/s</h4>
            </div>
            <div class="curr-weather-misc flex-center-column weather-card-data-group">
                <h5>Cloud cover: ${
                  filteredWeatherDataObj.currWeatherClouds
                }%</h5>
                <h5>Air pressure: ${
                  filteredWeatherDataObj.currWeatherPress
                } hPa</h5>
                <h5>Rel. humidity: ${
                  filteredWeatherDataObj.currWeatherHum
                }%</h5>
                <h5>Visibility: ${filteredWeatherDataObj.currWeatherVis} m</h5>
            </div>

    `;
  return template;
}
