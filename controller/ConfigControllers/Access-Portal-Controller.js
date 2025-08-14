const PermissionDetails = require("../../model/ConfigModals/PermissionModal");
const RoleDetails = require("../../model/ConfigModals/RoleModal");
const UserDetails = require("../../model/ConfigModals/UserModal");

// view user details on Admin Access protal UI
const fetchAllUsers = async (req, res) => {
  try {
    const findUsers = await UserDetails.find()
      .select("_id UserName UserEmail Role customPermissions")
      .sort({ index: 1 });
    res.status(200).json({
      success: true,
      message: "All the users fetched successfully",
      users: findUsers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Unable to fetch the user details",
    });
  }
};

// Update User Access
const updateUserPermission = async (req, res) => {
  const { userId, roleId, customRoleId } = req.body;
  try {
    if (!userId) {
      res
        .status(400)
        .json({ success: false, message: "Bad request , UserId not given" });
    }
    if (!roleId) {
      res
        .status(400)
        .json({ success: false, message: "Bad request , RoleID not given" });
    }

    const userDetails = {
      Role: roleId,
      customPermissions: customRoleId,
    };

    const updatedUser = await UserDetails.findByIdAndUpdate(
      userId,
      userDetails
    );

    res.status(200).json({
      success: true,
      type: "success",
      message: "permission updated",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { fetchAllUsers, updateUserPermission };
