const express = require("express");
const route = express.Router();
const locationController = require("../controller/LocationControllers/locationController");

// Api

// Adding new Places in DB
route.post("/addNewPlaces", locationController.addNewLocations);
// fetch all the location details for listing in dashboard
route.post("/fetchAllLocations", locationController.fetchPlacesLocation);
// update existing the location details
route.patch("/updatePlacesLocation", locationController.updatePlacesLocation);
// Remove the saved location record
route.delete("/deletePlaceLocation", locationController.deletePlacesLocation);

// Adding new user place in DB
route.post("/addUserLocation", locationController.addUserLocation);

// Fetching user radius
route.post("/fetchNearByLocation", locationController.fetchNearByPlaces);

module.exports = route;
