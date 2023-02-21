import * as velitherm from "velitherm";

export function calculateCloudbase(hum, press, temp, elev) {
    let cloudbase;
    const seaLevelPress = calculateSeaLevelPressure(temp, press, elev);
    const specHum = velitherm.specificHumidity(hum, press, temp);
    
    for (let i = elev; ; i++) {
        const pressureAtAlt = velitherm.pressureFromAltitude(i, seaLevelPress, temp);
        const tempAtAlt = temp - i * velitherm.gamma;
        let relHumAtAlt = velitherm.relativeHumidity(specHum, pressureAtAlt, tempAtAlt);
        
        if(relHumAtAlt >= 100) {
            cloudbase = i;
            break;
        }
    }
    const lclCB = velitherm.LCL(temp, velitherm.dewPoint(velitherm.relativeHumidity(specHum, press, temp), temp));
    modifyThermalDom(createThermalWeatherHTML(cloudbase, lclCB.toFixed(0)));
} 

function createThermalWeatherHTML(cB, lclCB) {
    return `
        <h2>The cloudbase is currently at:</h2>
        <h2>${Number.parseFloat(cB).toFixed(0)} meters</h2>
        <h3>The LCL cloudbase is <span>${Number.parseFloat(lclCB).toFixed(0)} meters.</span></h3>
    `
}

function modifyThermalDom(thermalHTML) {
    const thermalDiv = document.querySelector('.thermal-weather')
    thermalDiv.innerHTML = '';
    thermalDiv.insertAdjacentHTML('afterbegin', thermalHTML);
}

function calculateSeaLevelPressure(temp, press, elev) {
    return press * (Math.pow(1 - ((0.0065 * elev) / (temp + 0.0065 * elev + 273.15)), -5.257));
}