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
const env = 'resolve' // resolve || test
const totalTests = 0; // Number of test cases
var i = 0;

function setup() {
    Rever essa logica
    // Setup cargo proportions -> vol/ton
    // var total = (frontCargo.ton + centralCargo.ton + rearCargo.ton) / (frontCargo.vol + centralCargo.vol + rearCargo.vol);
    // capacityProportions.fc = ((frontCargo.ton / frontCargo.vol) * 100) / total; 
    // capacityProportions.cc = ((centralCargo.ton / centralCargo.vol) * 100) / total;
    // capacityProportions.rc = ((rearCargo.ton / rearCargo.vol) * 100) / total;
    // console.log(total);
    // console.log(capacityProportions.fc);
    // console.log(capacityProportions.cc);
    // console.log(capacityProportions.rc);
    // console.log("=================================")
    
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

    var frontTon = (chosenLoad.ton / capacityProportions.fc).toFixed(3);
    // console.log(chosenLoad.ton)
    // console.log(capacityProportions.fc)
    // console.log(capacityProportions.cc)
    // console.log(capacityProportions.rc)
    // console.log("----------------------------------")
    var centralTon = (chosenLoad.ton / capacityProportions.cc).toFixed(3);
    var rearTon = (chosenLoad.ton / capacityProportions.rc).toFixed(3);

    // console.log(frontTon)
    // console.log(centralTon)
    // console.log(rearTon)
    // console.log("========================================")
}

function printResults() {

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