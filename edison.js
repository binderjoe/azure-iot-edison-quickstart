// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

'use strict';

// Node packages used to interact with the Intel Edison.  These packages are not available
// on OSX and Windows
var Device = require('./device');

var Grove = require('jsupm_grove');
var mraa = require('mraa');

class EdisonDevice extends Device {
    
    /**
     * Create a new device with the given device id.
     * @param  {} deviceId
     */
    constructor(deviceId) {
        super(deviceId, false);
        this.tempSensor = new Grove.GroveTemp(0);
        this.onboardLED = new mraa.Gpio(13); 
        this.onboardLED.dir(mraa.DIR_OUT); 
    }

    /**
     * Read temperature sensor value from A0 in celsius.
     */
    getTemperature() {
        return this.tempSensor.value();
    }
    
    /**
     * Blink the onboard LED for 1.5 seconds
     */
    blinkLED() {
        var blinkDuration = 1500;
        var led = this.onboardLED;
        led.write(1);
        setTimeout(function() {
            led.write(0);
        }, blinkDuration );
    };

    /**
     * Override default device metadata with board specific information, when available.
     */
    getDeviceMetadata() {
        var edisonMetadata = super.getDeviceMetadata();
        edisonMetadata.DeviceProperties.Platform = mraa.getPlatformName();
        return edisonMetadata
    }
}
    
module.exports = EdisonDevice;