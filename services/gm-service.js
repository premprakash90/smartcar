/**
 * Responsible for handling all communication between Smart Car Server and GM APIs
 * @constructor
 */
function GMService() {
    
}

/**
 * Validates GM's vehicleId
 * @param vehicleId
 * @returns {boolean}
 */
GMService.prototype.isValidVehicle = function(vehicleId) {
    return ["1234", "1235"].indexOf(vehicleId) > - 1;
};

/**
 * Gets vehicle info from GM API - http://gmapi.azurewebsites.net/getVehicleInfoService
 * @param vehicleId
 * @param cb
 */
GMService.prototype.getVehicleInfo = function (vehicleId, cb) {
    var options = {
        url: 'http://gmapi.azurewebsites.net/getVehicleInfoService',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        json: {
            "id": vehicleId,
            "responseType": "JSON"
        }
    };

    var request = require('request');
    request(options, function (error, response, body) {
        if (error) {
            return cb(error)
        }

        if (response.statusCode !== 200) {
            err = new Error("Response Code for http://gmapi.azurewebsites.net/getVehicleInfoService :" + response.statusCode);
            return cb(err);
        }

        console.log(body);
        return cb(null, body);
    })
};

/**
 * Gets secuirty status from GM API - http://gmapi.azurewebsites.net/getSecurityStatusService
 * @param vehicleId
 * @param cb
 */
GMService.prototype.getSecurityStatus = function (vehicleId, cb) {
    var options = {
        url: 'http://gmapi.azurewebsites.net/getSecurityStatusService',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        json: {
            "id": "1234",
            "responseType": "JSON"
        }
    };

    var request = require('request');
    request(options, function (error, response, body) {
        if (error) {
            return cb(error)
        }

        if (response.statusCode !== 200) {
            err = new Error("Response Code for http://gmapi.azurewebsites.net/getSecurityStatusService :" + response.statusCode);
            return cb(err);
        }

        return cb(null, body);
    })
};

/**
 * Gets energy info from GM API - http://gmapi.azurewebsites.net/getEnergyService
 * @param vehicleId
 * @param cb
 */
GMService.prototype.getEnergyInfo = function (vehicleId, cb) {
    var options = {
        url: 'http://gmapi.azurewebsites.net/getEnergyService',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        json: {
            "id": "1234",
            "responseType": "JSON"
        }
    };

    var request = require('request');
    request(options, function (error, response, body) {
        if (error) {
            return cb(error)
        }

        if (response.statusCode !== 200) {
            err = new Error("Response Code for http://gmapi.azurewebsites.net/getEnergyService :" + response.statusCode);
            return cb(err);
        }

        console.log(body);
        return cb(null, body);
    })
};

/**
 * Update engine state by posting to GM API - http://gmapi.azurewebsites.net/actionEngineService
 * @param vehicleId
 * @param state
 * @param cb
 */
GMService.prototype.modifyEngineState = function (vehicleId, state, cb) {
    console.log(state);
    var options = {
        url: 'http://gmapi.azurewebsites.net/actionEngineService',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        json: {
            "id": "1234",
            "command": state,
            "responseType": "JSON"
        }
    };

    var request = require('request');
    request(options, function (error, response, body) {
        if (error) {
            return cb(error)
        }

        if (response.statusCode !== 200) {
            err = new Error("Response Code for http://gmapi.azurewebsites.net/actionEngineService :" + response.statusCode);
            return cb(err);
        }

        console.log(body);
        return cb(null, body);
    })
};

/**
 * Converts response of http://gmapi.azurewebsites.net/getEnergyService to SmartCar Fuel API format
 * @param response
 * @param cb
 * @returns {*}
 */
GMService.prototype.convertEnergyInfoToFuelSmartCarFormat = function (response, cb) {
    if (!response['data']) {
        console.log("Empty response - Unable to convert GM engine response to Smart Car Format");
        return cb(new Error("Empty response - Unable to convert GM engine response to Smart Car Format"))    ;
    }

    var out = {};
    if (response['data'] && response['data']['tankLevel'] && response['data']['tankLevel']['value']) {
        if (response['data']['tankLevel']['value'] !== "null") {
            out['percent'] = parseFloat(response['data']['tankLevel']['value']);
        }else { // if response is null set percent to 0
            out['percent'] = 0;

        }
    }

    return cb(null, out);
};


/**
 * Converts response of http://gmapi.azurewebsites.net/actionEngineService to SmartCar Engine API format
 * @param response
 * @param cb
 * @returns {*}
 */
GMService.prototype.convertEngineActionToSmartCarFormat = function (response, cb) {
    if (!response['actionResult']) {
        console.log("Empty response - Unable to convert GM energy info to Smart Car Format");
        return cb(new Error("Empty response - Unable to convert GM energy info to Smart Car Format"))    ;
    }

    var out = {};
    if (response['actionResult'] && response['actionResult']['status']) {
        out['status'] = response['actionResult']['status'] === "EXECUTED" ? "success" : "error";
    }

    return cb(null, out);
};

/**
 * Converts response of http://gmapi.azurewebsites.net/actionEngineService to SmartCar Battery API format
 * @param response
 * @param cb
 * @returns {*}
 */
GMService.prototype.convertEnergyInfoToBatterySmartCarFormat = function (response, cb) {
    if (!response['data']) {
        console.log("Empty response - Unable to convert GM energy info to Smart Car Format");
        return cb(new Error("Empty response - Unable to convert GM energy info to Smart Car Format"))    ;
    }

    var out = {};
    if (response['data'] && response['data']['batteryLevel'] && response['data']['batteryLevel']['value']) {
        if (response['data']['batteryLevel']['value'] !== "null") {
            out['percent'] = parseFloat(response['data']['batteryLevel']['value']);
        }else { // if response is null set percent to 0
            out['percent'] = 0;

        }
    }

    return cb(null, out);
};

/**
 * Converts response of http://gmapi.azurewebsites.net/getSecurityStatusService to SmartCar Door API format
 * @param response
 * @param cb
 * @returns {*}
 */
GMService.prototype.covertSecurityStatusToSmartCarFormat = function (response, cb) {
    var out = [];

    if (!response['data']) {
        console.log("Empty response - Unable to convert GM Security Status to Smart Car Format");
        cb(new Error("Empty response - Unable to convert GM Security Status to Smart Car Format"))    ;
    }

    console.log(response['data']['doors']['values'].length);

    if (response['data']['doors'] && response['data']['doors']['values'] && response['data']['doors']['values'].length === 4) {
        if (response['data']['doors']['values'][0]['location'] && response['data']['doors']['values'][0]['location']['value'] &&
            response['data']['doors']['values'][0]['locked'] && response['data']['doors']['values'][0]['locked']['value']) {
            var d1 = {};
            d1['location'] = response['data']['doors']['values'][0]['location']['value'];
            d1['locked'] = response['data']['doors']['values'][0]['locked']['value'] === "True";
            out.push(d1)
        }

        if (response['data']['doors']['values'][1]['location'] && response['data']['doors']['values'][1]['location']['value'] &&
            response['data']['doors']['values'][1]['locked'] && response['data']['doors']['values'][1]['locked']['value']) {
            var d2 = {};
            d2['location'] = response['data']['doors']['values'][1]['location']['value'];
            d2['locked'] = response['data']['doors']['values'][1]['locked']['value'] === "True";
            out.push(d2)
        }
    }

    return cb(null, out);
};

/**
 * Converts response of http://gmapi.azurewebsites.net/getVehicleInfoService to SmartCar Vehicle API format
 *
 * @param response
 * @param cb
 * @returns {*}
 */
GMService.prototype.convertVehicleInfoToSmartCarFormat = function (response, cb) {
    var out = {};

    if (!response || !response['data']) {
        console.log("Empty response - Unable to convert GM vehicle info to Smart Car Format");
        return cb(new Error("Empty response - Unable to convert GM vehicle info to Smart Car Format"))    ;
    }

    if (response['data']['vin']) {
        out['vin'] = response['data']['vin']['value'];
    }

    if (response['data']['color']) {
        out['color'] = response['data']['color']['value'];
    }

    if (response['data']['driveTrain']) {
        out['driveTrain'] = response['data']['driveTrain']['value'];
    }

    if (response['data']['fourDoorSedan'] && response['data']['fourDoorSedan']['value'] && response['data']['fourDoorSedan']['value'] === "True") {
        out['doorCount'] = 4;
    }else if (response['data']['twoDoorCoupe'] && response['data']['twoDoorCoupe']['value'] && response['data']['twoDoorCoupe']['value'] === "True") {
        out['doorCount'] = 2;
    }

    return cb(null, out);

};

module.exports = GMService;