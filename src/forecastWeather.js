import { getLocationCoords, setCustomCSSProperty, calculateWindDirection } from "./metUtil.js";
import { apiKey } from "./index.js";

const feelsLikeIconSVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32"><path fill="currentColor" d="M26 30h-4a2.006 2.006 0 0 1-2-2v-7a2.006 2.006 0 0 1-2-2v-6a2.946 2.946 0 0 1 3-3h6a2.946 2.946 0 0 1 3 3v6a2.006 2.006 0 0 1-2 2v7a2.006 2.006 0 0 1-2 2zm-5-18a.945.945 0 0 0-1 1v6h2v9h4v-9h2v-6a.945.945 0 0 0-1-1zm3-3a4 4 0 1 1 4-4a4.012 4.012 0 0 1-4 4zm0-6a2 2 0 1 0 2 2a2.006 2.006 0 0 0-2-2zM10 20.184V12H8v8.184a3 3 0 1 0 2 0z"/><path fill="currentColor" d="M9 30a6.993 6.993 0 0 1-5-11.89V7a5 5 0 0 1 10 0v11.11A6.993 6.993 0 0 1 9 30ZM9 4a3.003 3.003 0 0 0-3 3v11.983l-.332.299a5 5 0 1 0 6.664 0L12 18.983V7a3.003 3.003 0 0 0-3-3Z"/></svg>
`

export async function getForecastWeatherHTML() {
    try {    
        const forecastWeatherData = await fetchForecastWeatherData();
        const usedForecastData = getUsedForecastData(forecastWeatherData);
        return createForecastWeatherHTML(usedForecastData);
    } catch {
        console.log('error');
        const forecastErrDiv = document.createElement('div');
        forecastErrDiv.innerHTML = `
        <div class="forecast-weather weather-card flex-center-column">
            <h2>Please try again!</h2>
            <h4>The data didn't reach us or the location was not found!</h4>
        </div>`
        return forecastErrDiv;
    
    }
}

async function fetchForecastWeatherData() {
    const [lat, lon, elev] = await getLocationCoords();
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    
    const response = await fetch(url, {mode: 'cors', headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://gleaming-profiterole-922137.netlify.app/'
    }});
    const resData = await response.json();
    return resData;
}

function getUsedForecastData(forecastObj) {
    let forecastWeather = [];
    let forecastWeatherDaily = {};
    const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    forecastObj.list.forEach(threeHourForecast => {
        const usedThreeHourData = {
            forecastDateTime: threeHourForecast.dt_txt,
            forecastDay: weekDays[(new Date(threeHourForecast.dt_txt.substring(0, 10)).getUTCDay())],
            forecastTime: threeHourForecast.dt_txt.substring(10, 16),
            forecastDayPeriod: threeHourForecast.sys.pod,
            forecastIcon: threeHourForecast.weather[0].icon,
            forecastDesc: threeHourForecast.weather[0].main,
            forecastTempFelt: threeHourForecast.main.feels_like,
            forecastTemp: threeHourForecast.main.temp,
            forecastWindDir: threeHourForecast.wind.deg,
            forecastWindSpeed: threeHourForecast.wind.speed,
            forecastWindGust: threeHourForecast.wind.gust,
        }
        forecastWeather.push(usedThreeHourData);
    });

    forecastWeather.forEach(forecastObj => {
        if (!forecastWeatherDaily[forecastObj.forecastDay]) {
            forecastWeatherDaily[forecastObj.forecastDay] = []
        }
        forecastWeatherDaily[forecastObj.forecastDay].push(forecastObj);
    })
    return forecastWeatherDaily;
}

function createForecastWeatherHTML(usedForecastDataArr) {
    const days = Object.keys(usedForecastDataArr);
    setCustomCSSProperty('--forecast-grid-num', days.length);
    const forecastWeatherDiv = document.createElement('div');
    forecastWeatherDiv.classList.add('forecast-weather', 'weather-card', 'flex-center');
    
    for (let i = 0; i <= days.length - 1; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('forecast-day', `forecast-day-${i}`, `${days[i]}`, 'flex-center-column');
        dayDiv.innerHTML = `<h3>${days[i]}</h3>
                            <div class="daily-weather-forecast-wrapper flex-center"></div>`;
        
        usedForecastDataArr[days[i]].forEach(threeHourForecast => {
            const imgURL = `http://openweathermap.org/img/wn/${threeHourForecast.forecastIcon}@2x.png`;
            const windArrowDeg = calculateWindDirection(threeHourForecast.forecastWindDir);
            const dailyWeatherForecastTemplate = dayDiv.querySelector('.daily-weather-forecast-wrapper');
            const threeHourTemplate = `
                <div class="daily-weather-3-hour flex-center-column weather-card-data-group">
                    <div class="weather-icon flex-center-column">
                        <h5>${threeHourForecast.forecastTime}</h5>
                        <img src="${imgURL}" alt="${threeHourForecast.forecastDesc}">
                        <h6>${threeHourForecast.forecastDesc}</h6>
                    </div>
                    <div class="weather-temp flex-center-column">
                        <h6>${Number.parseFloat(threeHourForecast.forecastTemp).toFixed(1)} °C</h6>
                        <div style="height: 65px;" class="flex-center-column">
                            <h5 >Feels like:</h5>
                            <h5>${Number.parseFloat(threeHourForecast.forecastTempFelt).toFixed(1)} °C</h5>
                        </div>
                    </div>
                    <div class="weather-wind flex-center-column">
                        <svg style="transform: rotate(${windArrowDeg}deg);" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M13 18h-2v-8l-3.5 3.5l-1.42-1.42L12 6.16l5.92 5.92l-1.42 1.42L13 10v8M12 2a10 10 0 0 1 10 10a10 10 0 0 1-10 10A10 10 0 0 1 2 12A10 10 0 0 1 12 2m0 2a8 8 0 0 0-8 8a8 8 0 0 0 8 8a8 8 0 0 0 8-8a8 8 0 0 0-8-8Z"/></svg>
                        <h5>${Number.parseFloat(threeHourForecast.forecastWindSpeed).toFixed(1)} m/s</h5>
                        <h6>${Number.parseFloat(threeHourForecast.forecastWindGust).toFixed(1)} m/s</h6>
                    </div>
                </div>
                `
            dailyWeatherForecastTemplate.insertAdjacentHTML('beforeend', threeHourTemplate);
        })
        forecastWeatherDiv.insertAdjacentElement('beforeend', dayDiv);
    }
    return forecastWeatherDiv;
}