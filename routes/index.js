var express = require('express');
var router = express.Router();
var carFactory = require('../services/car-service-factory');
var bodyParser = require('body-parser');


const INVALID_VEHICLE_ID = "Invalid Vehicle id";
const SERVICE_UNAVAILABLE = "Service temporarily unavailable... Try again later";
const INTERNAL_ERROR = "Oops! Something went wrong";

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'SmartCar' });
});

/**
 * GETs vehicle information
 */
router.get('/vehicles/:id', function(req, res) {
    var vehicleId = req.params.id;
    var vehicleService = carFactory('GM');

    if(!vehicleService.isValidVehicle(vehicleId)) { // return 422 when invalid vehicle id is provided
        return res.status(422).json({message : INVALID_VEHICLE_ID});
    }else {
        vehicleService.getVehicleInfo(vehicleId, function (err, data) {  // get vehicle information from vehicle Service
            if (err) {  // return 503 if we were unable to a response from vehicle service(GM service)
                return res.status(503).json({message: SERVICE_UNAVAILABLE});
            }

            vehicleService.convertVehicleInfoToSmartCarFormat(data, function (err, data) { // convert vehicle info to smart car API format
                if (err) {  // if for some reason conversion to smart car response failed - it's our fault. Log and return 500
                    console.log(err);
                    return res.status(500).json({message: INTERNAL_ERROR});
                }

                // everything is okay return 200 if smart car API response
                res.status(200);
                return res.send(data);
            });


        })
    }
});

/**
 * GETs vehicles door status
 */
router.get('/vehicles/:id/doors', function(req, res) {
    var vehicleId = req.params.id;
    var vehicleService = carFactory('GM');

    if(!vehicleService.isValidVehicle(vehicleId)) {
        return res.status(422).json({message : INVALID_VEHICLE_ID});
    }else {
        vehicleService.getSecurityStatus(vehicleId, function (err, data) {
            if (err) {
                return res.status(503).json({message: SERVICE_UNAVAILABLE});
            }

            vehicleService.covertSecurityStatusToSmartCarFormat(data, function (err, data) {
                if (err) {
                    return res.status(500).json({message: INTERNAL_ERROR});
                }

                res.status(200);
                return res.send(data);
            });
        });
    }
});

/**
 * GETs vehicles fuel status
 */
router.get('/vehicles/:id/fuel', function(req, res) {
    var vehicleId = req.params.id;
    var vehicleService = carFactory('GM');

    if(!vehicleService.isValidVehicle(vehicleId)) {
        return res.status(422).json({message : INVALID_VEHICLE_ID});
    }else {
        vehicleService.getEnergyInfo(vehicleId, function (err, data) {
            if (err) {
                return res.status(503).json({message: SERVICE_UNAVAILABLE});
            }

            vehicleService.convertEnergyInfoToFuelSmartCarFormat(data, function (err, data) {
                if (err) {
                    return res.status(500).json({message: INTERNAL_ERROR});
                }

                res.status(200);
                return res.send(data);
            });
        });
    }
});

/**
 * GETs vehicles battery status
 */
router.get('/vehicles/:id/battery', function(req, res) {
    var vehicleId = req.params.id;
    var vehicleService = carFactory('GM');

    if(!vehicleService.isValidVehicle(vehicleId)) {
        return res.status(422).json({message : INVALID_VEHICLE_ID});
    }else {
        vehicleService.getEnergyInfo(vehicleId, function (err, data) {
            if (err) {
                return res.status(503).json({message: SERVICE_UNAVAILABLE});
            }

            vehicleService.convertEnergyInfoToBatterySmartCarFormat(data, function (err, data) {
                if (err) {
                    return res.status(500).json({message: INTERNAL_ERROR});
                }

                res.status(200);
                return res.send(data);
            });
        });
    }
});


/**
 * Modify vehicles engine status
 */
router.post('/vehicles/:id/engine', function(req, res) {
    var vehicleId = req.params.id;
    var vehicleService = carFactory('GM');
    router.use( bodyParser.json() );
    if (!req.body.action) {
        return res.status(400).json({message : "action post param required"});
    }

    if (["START", "STOP"].indexOf(req.body.action) < 0) {
        return res.status(422).json({message : "action post param must be one of [START, STOP]"});
    }

    if(!vehicleService.isValidVehicle(vehicleId)) {
        return res.status(422).json({message : INVALID_VEHICLE_ID});
    }else {
        var action = req.body.action === "START" ? "START_VEHICLE" : "STOP_VEHICLE";

        vehicleService.modifyEngineState(vehicleId, action, function (err, data) {
            if (err) {
                return res.status(503).json({message: SERVICE_UNAVAILABLE});
            }

            vehicleService.convertEngineActionToSmartCarFormat(data, function (err, data) {
                if (err) {
                    return res.status(500).json({message: INTERNAL_ERROR});
                }

                res.status(200);
                return res.send(data);
            });
        });
    }
});

/**
 * All other routes redirected to NOT FOUND.
 */
router.get('*', function(req, res) {
    res.status(404);
    res.send();
});

module.exports = router;
