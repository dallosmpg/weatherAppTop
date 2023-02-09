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

export async function setBackgroundImg(weatherDesc) {
    const response = await fetch(`https://api.unsplash.com/search/photos?&query=${weatherDesc}&color=orange&orientation=landscape&client_id=inUZHZYqQ-h7kGW3jhjv0-eVwJIrOsL9YATL4AdZ4i0`, {mode: 'cors'});
    const imgData = await response.json();
    
    const randomImgFromQuery = Math.floor(Math.random() * imgData.results.length);
    document.documentElement.style.setProperty('--bg-img', `url(${imgData.results[randomImgFromQuery].urls.full})`);
}