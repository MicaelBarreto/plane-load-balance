// Plane Capacity Variables
var frontCargo = { ton: 10, vol: 6800 };
var centralCargo = { ton: 16, vol: 8700 };
var rearCargo = { ton: 8, vol: 5300 };

// Loads
var c1 = { ton: 18, vol_ton: 480, profit: 310 };
var c2 = { ton: 15, vol_ton: 650, profit: 380 };
var c3 = { ton: 23, vol_ton: 580, profit: 350 };
var c4 = { ton: 12, vol_ton: 390, profit: 285 };

// Control Variables
var capacityProportions = { fc: 0, cc: 0, rc: 0 };
var volumetricProfitProportions = {}; // { c1: w, c2: x, c3: y, c4: z }
var volumetricProfitProportionsArray = []; // [ w, x, y, z ] descendent -> w > x > y > z
var loadPreference = [];
var results = {};
const env = 'resolve' // resolve || test
const totalTests = 0; // Number of test cases
var i = 0;

function setup() {
    // Setup cargo proportions -> vol
    var total = frontCargo.vol + centralCargo.vol + rearCargo.vol;
    capacityProportions.fc = frontCargo.vol / total; 
    capacityProportions.cc = centralCargo.vol / total;
    capacityProportions.rc = rearCargo.vol / total;
    
    // Setup volumentric profit -> profit/vol_ton
    volumetricProfitProportions.c1 = (c1.profit/c1.vol_ton);
    volumetricProfitProportions.c2 = (c2.profit/c2.vol_ton);
    volumetricProfitProportions.c3 = (c3.profit/c3.vol_ton);
    volumetricProfitProportions.c4 = (c4.profit/c4.vol_ton);
    volumetricProfitProportionsArray = Object.values(volumetricProfitProportions).sort((a,b) => b-a);
    loadPreference = volumetricProfitProportionsArray.map(result => Object.keys(volumetricProfitProportions).find(key => volumetricProfitProportions[key] === result));
}

function loadBalance() {
    loadPreference.map(load =>
        calculateCargoLoad(load)
    );
}

function calculateCargoLoad(load) {
    var chosenLoad;

    if(load === 'c1') chosenLoad = c1
    else if(load === 'c2') chosenLoad = c2
    else if(load === 'c3') chosenLoad = c3
    else chosenLoad = c4

    var frontVol = ((chosenLoad.vol_ton * chosenLoad.ton) * capacityProportions.fc).toFixed(3);
    var centralVol = ((chosenLoad.vol_ton * chosenLoad.ton) * capacityProportions.cc).toFixed(3);
    var rearVol = ((chosenLoad.vol_ton * chosenLoad.ton) * capacityProportions.rc).toFixed(3);

    if(
        (frontVol <= frontCargo.vol && 
        centralVol <= centralCargo.vol && 
        rearVol <= rearCargo.vol) &&
        (((frontVol / chosenLoad.vol_ton).toFixed(3)) <= frontCargo.ton &&
        ((centralVol / chosenLoad.vol_ton).toFixed(3)) <= centralCargo.ton &&
        ((rearVol / chosenLoad.vol_ton).toFixed(3)) <= rearCargo.ton)
    ) {
        frontCargo.vol -= frontVol;
        frontCargo.ton -= (frontVol / chosenLoad.vol_ton).toFixed(3);

        centralCargo.vol -= centralVol;
        centralCargo.ton -= (centralVol / chosenLoad.vol_ton).toFixed(3);

        rearCargo.vol -= rearVol;
        rearCargo.ton -= (rearVol / chosenLoad.vol_ton).toFixed(3);

        results[load] = {
            'frontCargo': { ton: (frontVol / chosenLoad.vol_ton).toFixed(3), vol: frontVol },
            'centralCargo': { ton: (centralVol / chosenLoad.vol_ton).toFixed(3), vol: centralVol },
            'rearCargo': { ton: (rearVol / chosenLoad.vol_ton).toFixed(3), vol: rearVol }
        };
    } else {
        var calc = calculatePossibility(frontCargo, centralCargo, rearCargo, chosenLoad);
        var bal = balance(calc.ton, calc.vol, chosenLoad);

        if(bal) {

        }
    }
}

function balance(ton, vol, chosenLoad) {
    if(
        ton.front.toFixed(3) <= 0 ||
        ton.central.toFixed(3) <= 0 ||
        ton.rear.toFixed(3) <= 0 ||
        vol.front.toFixed(3) <= 0 ||
        vol.central.toFixed(3) <= 0 ||
        vol.rear.toFixed(3) <= 0
    )
        return false;

    if(
        ton.front * chosenLoad.vol_ton <= frontCargo.vol &&
        ton.central * chosenLoad.vol_ton <= centralCargo.vol &&
        ton.rear * chosenLoad.vol_ton <= rearCargo.vol &&
        vol.front / chosenLoad.vol_ton <= frontCargo.ton &&
        vol.central / chosenLoad.vol_ton <= centralCargo.ton &&
        vol.rear / chosenLoad.vol_ton <= rearCargo.ton
    ) {

    } else {
        var calc = calculatePossibility(front, central, rear, chosenLoad);
        var bal = balance(calc.ton, calc.vol, chosenLoad);
        return bal;
    }
}

function calculatePossibility(front, central, rear, chosenLoad) {
    // calculate possible ton by volume
    var frontPossibleTon = front.vol / (chosenLoad.vol_ton * capacityProportions.fc);
    var centralPossibleTon = central.vol / (chosenLoad.vol_ton * capacityProportions.cc);
    var rearPossibleTon = rear.vol / (chosenLoad.vol_ton * capacityProportions.rc);
    // calculate possible volume by ton
    var frontPossibleVolume = front.ton * (chosenLoad.vol_ton * capacityProportions.fc);
    var centralPossibleVolume = central.ton * (chosenLoad.vol_ton * capacityProportions.cc);
    var rearPossibleVolume = rear.ton * (chosenLoad.vol_ton * capacityProportions.rc);

    return {
        ton: { front: frontPossibleTon, central: centralPossibleTon, rear: rearPossibleTon}, 
        vol: { front: frontPossibleVolume, central: centralPossibleVolume, rear: rearPossibleVolume}
    };
}

function printResults() {
    console.log(results);
    console.log('==============')
    console.log('frontCargo', frontCargo)
    console.log('centralCargo', centralCargo)
    console.log('rearCargo', rearCargo)
}

function test() {
    if(i < totalTests) {
        i++;
        setup();
        main();
    }
}

function main() {
    if (env === 'resolve') 
        setup();
    else
        test();

    loadBalance();
    printResults();
}

setup();
loadBalance();
printResults();