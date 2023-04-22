import {
  getLocationCoords,
  setCustomCSSProperty,
  calculateWindDirection,
} from './metUtil.js';
import { apiKey } from './index.js';

export async function getForecastWeatherHTML() {
  try {
    const forecastWeatherData = await fetchForecastWeatherData();
    const usedForecastData = getUsedForecastData(forecastWeatherData);
    return createForecastWeatherHTML(usedForecastData);
  } catch {
    const forecastErrDiv = document.createElement('div');
    forecastErrDiv.innerHTML = `
        <div class="forecast-weather weather-card flex-center-column">
            <h2>Please try again!</h2>
            <h4>The data didn't reach us or the location was not found!</h4>
        </div>`;
    return forecastErrDiv;
  }
}

async function fetchForecastWeatherData() {
  const [lat, lon] = await getLocationCoords();
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  const response = await fetch(url, { mode: 'cors' });
  const resData = await response.json();
  return resData;
}

function getUsedForecastData(forecastObj) {
  const forecastWeather = [];
  const forecastWeatherDaily = {};
  const weekDays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  forecastObj.list.forEach((threeHourForecast) => {
    const usedThreeHourData = {
      forecastDateTime: threeHourForecast.dt_txt,
      forecastDay:
        weekDays[
          new Date(threeHourForecast.dt_txt.substring(0, 10)).getUTCDay()
        ],
      forecastTime: threeHourForecast.dt_txt.substring(10, 16),
      forecastDayPeriod: threeHourForecast.sys.pod,
      forecastIcon: threeHourForecast.weather[0].icon,
      forecastDesc: threeHourForecast.weather[0].main,
      forecastTempFelt: threeHourForecast.main.feels_like,
      forecastTemp: threeHourForecast.main.temp,
      forecastWindDir: threeHourForecast.wind.deg,
      forecastWindSpeed: threeHourForecast.wind.speed,
      forecastWindGust: threeHourForecast.wind.gust,
    };
    forecastWeather.push(usedThreeHourData);
  });

  forecastWeather.forEach((forecastUsedObj) => {
    if (!forecastWeatherDaily[forecastUsedObj.forecastDay]) {
      forecastWeatherDaily[forecastUsedObj.forecastDay] = [];
    }
    forecastWeatherDaily[forecastUsedObj.forecastDay].push(forecastUsedObj);
  });
  return forecastWeatherDaily;
}

function createForecastWeatherHTML(usedForecastDataArr) {
  const days = Object.keys(usedForecastDataArr);
  setCustomCSSProperty('--forecast-grid-num', days.length);
  const forecastWeatherDiv = document.createElement('div');
  forecastWeatherDiv.classList.add(
    'forecast-weather',
    'weather-card',
    'flex-center'
  );

  for (let i = 0; i <= days.length - 1; i += 1) {
    const dayDiv = document.createElement('div');
    dayDiv.classList.add(
      'forecast-day',
      `forecast-day-${i}`,
      `${days[i]}`,
      'flex-center-column'
    );
    dayDiv.innerHTML = `<h3>${days[i]}</h3>
                            <div class="daily-weather-forecast-wrapper flex-center"></div>`;

    usedForecastDataArr[days[i]].forEach((threeHourForecast) => {
      const imgURL = `http://openweathermap.org/img/wn/${threeHourForecast.forecastIcon}@2x.png`;
      const windArrowDeg = calculateWindDirection(
        threeHourForecast.forecastWindDir
      );
      const dailyWeatherForecastTemplate = dayDiv.querySelector(
        '.daily-weather-forecast-wrapper'
      );
      const threeHourTemplate = `
                <div class="daily-weather-3-hour flex-center-column weather-card-data-group">
                    <div class="weather-icon flex-center-column">
                        <h5>${threeHourForecast.forecastTime}</h5>
                        <img src="${imgURL}" alt="${
        threeHourForecast.forecastDesc
      }">
                        <h6>${threeHourForecast.forecastDesc}</h6>
                    </div>
                    <div class="weather-temp flex-center-column">
                        <h6>${Number.parseFloat(
                          threeHourForecast.forecastTemp
                        ).toFixed(1)} °C</h6>
                        <div style="height: 65px;" class="flex-center-column">
                            <h5 >Feels like:</h5>
                            <h5>${Number.parseFloat(
                              threeHourForecast.forecastTempFelt
                            ).toFixed(1)} °C</h5>
                        </div>
                    </div>
                    <div class="weather-wind flex-center-column">
                        <svg style="transform: rotate(${windArrowDeg}deg);" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M13 18h-2v-8l-3.5 3.5l-1.42-1.42L12 6.16l5.92 5.92l-1.42 1.42L13 10v8M12 2a10 10 0 0 1 10 10a10 10 0 0 1-10 10A10 10 0 0 1 2 12A10 10 0 0 1 12 2m0 2a8 8 0 0 0-8 8a8 8 0 0 0 8 8a8 8 0 0 0 8-8a8 8 0 0 0-8-8Z"/></svg>
                        <h5>${Number.parseFloat(
                          threeHourForecast.forecastWindSpeed
                        ).toFixed(1)} m/s</h5>
                        <h6>${Number.parseFloat(
                          threeHourForecast.forecastWindGust
                        ).toFixed(1)} m/s</h6>
                    </div>
                </div>
                `;
      dailyWeatherForecastTemplate.insertAdjacentHTML(
        'beforeend',
        threeHourTemplate
      );
    });
    forecastWeatherDiv.insertAdjacentElement('beforeend', dayDiv);
  }
  return forecastWeatherDiv;
}
