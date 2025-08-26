const placeLocation = require("../../model/Location/placeLocation");
const userLocation = require("../../model/Location/userLocation");

// add new places
const addNewLocations = async (req, res) => {
  const { placeName, locationDetails } = req.body; // request form client.
  try {
    // search in DB is that location coordinates present or not in my DB.
    const existingLocation = await placeLocation.findOne({
      "location.coordinates": locationDetails.coordinates,
    });
    // If location Already exist then send the response
    if (existingLocation) {
      return res.status(400).json({ message: "Location already exists" });
    }
    // if location coordinates are not present ,then adding this into DB
    const newLocation = await placeLocation.create({
      placeName,
      location: locationDetails,
    });
    res
      .status(201)
      .json({ message: "Location added successfully", data: newLocation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

// fetch all the location details for listing in dashboard
const fetchPlacesLocation = async (req, res) => {
  // empty request body
  try {
    const totalCount = await placeLocation.countDocuments(); // counts the no. of records present in the collection
    // fetch the data and store in the location variable
    const locations = await placeLocation
      .find({})
      .select("_id placeName location.coordinates");
    // If all are good then sending the data into server
    res.status(200).json({
      message: "location fetched sucessfully",
      success: true,
      totalLocations: totalCount,
      locationData: locations,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong while fetching locations",
      error: error.message || "Unknown error",
    });
  }
};

// update the places location from dashboard
const updatePlacesLocation = async (req, res) => {
  try {
    const { _id, placeName, location } = req.body; //request body.
    // first check _id field is received or not form client.
    if (!_id) {
      return res.status(400).json({ message: "Location _id is missing" });
    }
    // create an object to store the updated values of fields for upadateing the existing record
    const updateFields = {};
    // checking if place name is there or not in client req . if present then  add it into 'updateFields' object.
    if (placeName) {
      updateFields.placeName = placeName;
    }
    // checking if coorinates are there or not in client req . if present then  add it into 'updateFields' object.
    if (location?.coordinates) {
      //createing the location field as geoJSON object type .
      updateFields.location = {
        type: "Point",
        coordinates: location.coordinates,
      };
    }
    // find the existing record and match with 'updateFields' . if all fields are same then record willnot update.
    const existingRecord = await placeLocation.findOne(updateFields);
    if (existingRecord) {
      return res
        .status(404)
        .json({ message: "No changes in existing details..." });
    }
    // find the the existing record by _id received form request body & update the object which created above 'updateFields' in '$set' key
    const updatedRecord = await placeLocation
      .findByIdAndUpdate(
        _id,
        { $set: updateFields }, // '$set' is the operator use to update the record.
        { new: true, runValidators: true } // 'new : true' means when record will updated automatically data fetch and store into the 'updatedRecord' variable.
      )
      .select("_id location placeName");
    // console.log("updatedRecord", updatedRecord);
    // if by _id field not getting the existing record in DB sothat 'updatedRecord' variable value will be null and below condition will run
    if (!updatedRecord) {
      return res.status(404).json({ message: "Location record not found" });
    }
    res.status(200).json({
      message: "Location updated successfully",
      updateResult: updatedRecord,
    });
  } catch (error) {
    console.error("server error:", error);
    res.status(500).json({
      message: "Error in server",
      error: error.message || "Unknown error",
    });
  }
};

// Delete places Location record
const deletePlacesLocation = async (req, res) => {
  const { _id } = req.body; //recived '_id' from client as req body.
  try {
    // first check _id field is received or not form client.
    if (!_id) {
      return res.status(400).json({ message: "Location _id is missing" });
    }
    // find the record by '_id' and delete it.
    const deletedRecord = await placeLocation.findByIdAndDelete(_id);
    // if delete rocord is not populate then below code will run
    if (!deletedRecord) {
      return res.status(404).json({ message: "Location not found" });
    }
    res.status(200).json({
      message: "Location deleted successfully",
      deletedData: {
        _id: deletedRecord._id,
        placeName: deletedRecord.placeName,
      },
    });
  } catch (error) {
    console.error("server error:", error);
    res.status(500).json({
      message: "Error in server",
      error: error.message || "Unknown error",
    });
  }
};

// add new-user location
const addUserLocation = async (req, res) => {
  const { userId, locationDetails, placeName } = req.body; // userid , location-coordinates and  placename will come as request body
  try {
    const existingUser = await userLocation.findOne({ UserId: userId }); //find the user by user Id
    // if user is not exit then new user will create
    if (!existingUser) {
      const UserCurrentLocation = await userLocation.create({
        UserId: userId,
        location: locationDetails,
        placeName: placeName,
      });
      res.status(201).json({
        message: "user location added successfully",
        data: UserCurrentLocation,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// fetching place location in between the radius of location..
const fetchNearByPlaces = async (req, res) => {
  const defaultRadius = 2000; // defult Radius value
  const { long, lat, radius } = req.body; // longitute , latitude and radius received as req
  try {
    /*
     * $near operator find the nearest location and sort (nearesest >>>> largest).
     * $geometry operator holds the coordinate and type form where we will start.
     * $maxDistance operator mention what is the maximum length means radius
     */
    const places = await placeLocation
      .find({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [long, lat],
            },
            $maxDistance: radius || defaultRadius,
          },
        },
      })
      .select("placeName location _id");
    return res.status(200).json({
      message: "Nearby places fetched successfully",
      success: true,
      nearbyPlaces: places,
    });
  } catch (error) {
    console.error("Error fetching nearby places:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

module.exports = {
  addNewLocations,
  fetchPlacesLocation,
  updatePlacesLocation,
  deletePlacesLocation,
  addUserLocation,
  fetchNearByPlaces,
};
