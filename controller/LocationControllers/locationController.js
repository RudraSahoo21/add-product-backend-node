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

module.exports = { addNewLocations, addUserLocation, fetchNearByPlaces };
