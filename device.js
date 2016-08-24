// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

'use strict';

// Used to get app version information
require('pkginfo')(module, 'version');


// Base class for all device types
class Device {
  constructor(deviceId, isSimulated) {
    this.id = deviceId;
    this.isSimulated = isSimulated;
    this.type = null;
  }
  getTemperature() {
    return -1;
  }

  blinkLED() {}

  getDeviceMetadata(){
    return {
                'ObjectType': 'DeviceInfo',
                'IsSimulatedDevice': this.isSimulated,
                'Version': this.version,
                'DeviceProperties': {
                    'DeviceID': this.id,
                    'HubEnabledState': 1,
                    'CreatedTime': new Date().toISOString(),
                    'DeviceState': 'normal',
                    'Manufacturer': 'Intel',
                    'ModelNumber': 'Edison',
                },
                'Commands': [{
                    'Name': 'Blink',
                    'Parameters': [{
                        'Name': 'NumberOfBlinks',
                        'Type': 'double'
                      }]
                }]
            };
  }
  toString() {
    return this.id + '(' + this.getTemperature() + ')';
  }



}


module.exports = Device;

