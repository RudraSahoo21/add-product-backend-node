const placeLocation = require("../../model/Location/placeLocation");
const userLocation = require("../../model/Location/userLocation");

// add new places
const addNewLocations = async (req, res) => {
  const { placeName, locationDetails } = req.body;
  try {
    const existingLocation = await placeLocation.findOne({
      "location.coordinates": locationDetails.coordinates,
    });
    if (existingLocation) {
      return res.status(400).json({ message: "Location already exists" });
    }
    const newLocation = await placeLocation.create({
      placeName,
      location: locationDetails,
    });
    res
      .status(201)
      .json({ message: "Location added successfully", data: newLocation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// fetch all the location details for listing in dashboard
const fetchPlacesLocation = async (req, res) => {
  try {
    const totalCount = await placeLocation.countDocuments();
    const locations = await placeLocation
      .find({})
      .select("_id placeName location.coordinates");

    res.status(200).json({
      message: "location fetched sucessfully",
      totalLocation: totalCount,
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
    const { _id, placeName, location } = req.body;
    if (!_id) {
      return res.status(400).json({ message: "Location _id is missing" });
    }
    const updateFields = {};
    if (placeName) {
      updateFields.placeName = placeName;
    }
    if (location?.coordinates) {
      updateFields.location = {
        type: "Point",
        coordinates: location.coordinates,
      };
    }
    // console.log(updateFields);
    // Use findByIdAndUpdate with replacement (no $set)
    const updatedRecord = await placeLocation
      .findByIdAndUpdate(
        _id,
        { $set: updateFields },
        { new: true, runValidators: true }
      )
      .select("_id location placeName");
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
  const { _id } = req.body;
  try {
    if (!_id) {
      return res.status(400).json({ message: "Location _id is missing" });
    }
    const deletedRecord = await placeLocation.findByIdAndDelete(_id);
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
  // console.log(req.body);
  const { userId, locationDetails, placeName } = req.body;
  // console.log(userId, locationDetails);
  try {
    const existingUser = await userLocation.findOne({ UserId: userId });
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

// fetching place location in between the radius of user location..
const fetchNearByPlaces = async (req, res) => {
  const defaultRadius = 2000; // defult Radius value
  const { user_id, radius } = req.body;
  try {
    const user = await userLocation
      .findOne({ UserId: user_id })
      .select("location UserId placeName ");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const places = await placeLocation
      .find({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: user.location.coordinates,
            },
            $maxDistance: radius || defaultRadius,
          },
        },
      })
      .select("placeName location -_id");

    return res.status(200).json({
      message: "Nearby places fetched successfully",
      userLocation: user.placeName,
      userCoordinates: user.location,
      nearbyPlaces: places,
    });
  } catch (error) {
    console.error("Error fetching nearby places:", error);
    return res.status(500).json({ message: "Internal server error" });
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
