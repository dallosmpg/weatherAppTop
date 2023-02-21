import { apiKey, locationInput } from "./index.js";

export async function getLocationCoords() {
try {    
    const locationInputValue = locationInput.value || 'Budapest';

    const locationCoordsUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${locationInputValue}&limit=5&appid=${apiKey}`
    const response = await fetch(locationCoordsUrl, {mode: 'cors'});
    const resData = await response.json();
    const [lat, lon] = [resData[0].lat, resData[0].lon]
    const elevation = await getLocationElevation(lat, lon);
    console.log(elevation);
    return [lat, lon, elevation];
} catch(err) {
    console.log(err);
}
}

export async function setBackgroundImg(weatherDesc) {
    const response = await fetch(`https://api.unsplash.com/search/photos?&query=${weatherDesc}&orientation=landscape&client_id=inUZHZYqQ-h7kGW3jhjv0-eVwJIrOsL9YATL4AdZ4i0`, {mode: 'cors'});
    const imgData = await response.json();
    
    const randomImgFromQuery = Math.floor(Math.random() * imgData.results.length);
    setCustomCSSProperty('--bg-img', `url(${imgData.results[randomImgFromQuery].urls.full})`)
}

export function setCustomCSSProperty(propertyName, newPropValue) {
    document.documentElement.style.setProperty(propertyName, newPropValue);
}

export function calculateWindDirection(deg) {
    return Math.abs(360 - (180 - deg));
}

export async function getLocationElevation(lat, lon) {
    try {    
        const req = await fetch(`https://cors-anywhere.herokuapp.com/https://api.opentopodata.org/v1/eudem25m?locations=${lat},${lon}`, {mode: 'cors'});
        const reqRes = await req.json();
        console.log(req, reqRes);
        return reqRes.results[0].elevation;
    } catch {
        return 0;
    }
}