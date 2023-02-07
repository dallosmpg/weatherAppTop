import { getLocationCoords } from "./metUtil.js";
import { apiKey } from "./index.js";

export async function getCurrentWeather() {
    const [lat, lon] = await getLocationCoords();
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    
    const response = await fetch(url, {mode: 'cors'});
    const resData = await response.json();
    console.log(resData);
}
