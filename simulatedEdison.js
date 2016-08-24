// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

'use strict';

var Device = require('./device');

/**
 * Generate a random number between the range of min and max
 * @param  {} min
 * @param  {} max
 */
function getRandom(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
}

/**
 * Generate a random temperate value within the given range. The generated value
 * will be +/- 5 degrees of the previous value
 * @param  {int} lastTempValue  Integer representing the last recorded temp value
 * @param  {} min               Minimum allowed temp value 
 * @param  {} max               Maximum allowed temp value
 */
function generateRandomTemp(lastTempValue, min, max) {
    // The new value will be no more than +/- 5 degrees from the current value.
    var tempDelta = Math.floor(Math.random() * 10) - 5;
    var newTemp = lastTempValue + tempDelta;

    // Make sure the new value is still within the min/max
    if(newTemp < min) {
        newTemp = min;
    } else if(newTemp > max) {
        mewTemp = max;
    } 
    return newTemp;
}

class SimulatedEdisonDevice extends Device {
    /**
     * Create a new simulated edison device
     * @param  {} deviceId      Id of the device
     * @param  {} minTemp       Minimum temp value to be simulated
     * @param  {} maxTemp       Maximum temp value to be simulated
     */ 
    constructor(deviceId, minTemp, maxTemp) {
        super(deviceId, true);
        if(!minTemp) {
            minTemp = 0;
        }
        if(!maxTemp) {
            maxTemp = 100;
        }
        this.minTemp = minTemp;
        this.maxTemp = maxTemp;
        this.lastTempValue = getRandom(this.minTemp, this.maxTemp);
    }

    /**
     * Get a new random temperature value.
     */
    getTemperature() {
        this.lastTempValue = generateRandomTemp(this.lastTempValue, this.minTemp, this.maxTemp);
        return this.lastTempValue;
    }

    blinkLED() {
        console.log("BLINK LED (Simulated)");
    }
}

module.exports = SimulatedEdisonDevice;