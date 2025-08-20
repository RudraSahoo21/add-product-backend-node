const express = require("express");
const route = express.Router();
const locationController = require("../controller/LocationControllers/locationController");

// Api

// Adding new Places in DB
route.post("/addNewPlaces", locationController.addNewLocations);
// Adding new user place in DB
route.post("/addUserLocation", locationController.addUserLocation);

// Fetching user radius
route.post("/fetchNearByLocation", locationController.fetchNearByPlaces);

module.exports = route;
