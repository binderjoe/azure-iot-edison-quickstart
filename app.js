// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

'use strict';
// Azure IoT packages
var Protocol = require('azure-iot-device-amqp').Amqp;
var Message = require('azure-iot-device').Message;
var Client = require('azure-iot-device').Client;
var ConnectionString = require('azure-iot-device').ConnectionString;
var Message = require('azure-iot-device').Message;

// The connection string for the IoTHub is stored in ./config/[environment].json
// use NODE_ENV to control the environment.
var config = require('config');
var deviceConfig = config.get('Device');
var hubConfig = config.get('IotHub');
var connectionString = 'HostName=' + hubConfig.HostName + ';DeviceId=' + deviceConfig.DeviceId + ';SharedAccessKey=' + deviceConfig.SharedAccessKey;

var Device = require('./device');

var myDevice;

// If the app is not running on a real Edison board, fall back to using a simulated device.
 try {
    var Edison = require('./edison');
    myDevice = new Edison(deviceConfig.DeviceId);

} catch(err) {
     var SimulatedEdison = require('./simulatedEdison');
     myDevice = new SimulatedEdison(deviceConfig.DeviceId);
}

var client = Client.fromConnectionString(connectionString, Protocol);

// Rate at which temperature data will be sent
var sendFrequency = 5000;

client.open(function (err, result) {
    if (err) {
        printErrorFor('open')(err);
      } else {
           // Send the device metadata 
           client.sendEvent(
              new Message(JSON.stringify(myDevice.getDeviceMetadata())), 
              printErrorFor('send metadata'));
          // Receive a message from the hub and call the device's blink command.
          client.on('message', function (msg) {
              console.log('Cloud message received: ' + msg.messageId + ' Body: ' + msg.data);
              myDevice.blinkLED();
              client.complete(msg, printErrorFor('completed'));
          });

           // Send temperature sensor data at regular intervals
           var sendInterval = setInterval(function () {
               // Send temperature data as the message payload
               var data = JSON.stringify({
                    temperature: myDevice.getTemperature()
                 });   
               console.log(data);
               client.sendEvent(new Message(data), printErrorFor('send event'));
          }, sendFrequency);
         
          client.on('error', function (err) {
              printErrorFor('client')(err);
              if (sendInterval) {
                  clearInterval(sendInterval);
                } 
                client.close();
            });
            client.on('disconnect', function () {
                clearInterval(sendInterval);
                client.removeAllListeners();
                //client.open(connectCallback);
            });
        }
    });

// Helper function to print results for an operation
function printErrorFor(op) {
  return function printError(err) {
    if (err) {
        console.log(op + ' error: ' + err.toString());
    } 

  };
}
