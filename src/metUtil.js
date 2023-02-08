import { apiKey, locationInput } from "./index.js";

export async function getLocationCoords() {
try {    
    const locationInputValue = locationInput.value || 'Budapest';

    const locationCoordsUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${locationInputValue}&limit=5&appid=${apiKey}`
    const response = await fetch(locationCoordsUrl, {mode: 'cors'});
    const resData = await response.json();
    return [resData[0].lat, resData[0].lon];
} catch {
    console.log(err);
}

}
