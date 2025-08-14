const PermissionDetails = require("../../model/ConfigModals/PermissionModal");
const RoleDetails = require("../../model/ConfigModals/RoleModal");
const UserDetails = require("../../model/ConfigModals/UserModal");
const jwt = require("jsonwebtoken");

// adding permission details on DB
const createNewPermission = async (req, res) => {
  const { permissionName } = req.body;
  try {
    if (!permissionName) {
      res.status(400).json({
        success: false,
        message: "Bad Request, Permission Name is not present",
      });
    }
    const savedPermission = await PermissionDetails.create({
      permissionName: permissionName,
    });
    res.status(201).json({
      success: true,
      message: "New Permission Added Successfully",
      data: savedPermission,
    });
  } catch (error) {
    console.error("Error while adding new permission", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// adding role details on DB
const createNewRole = async (req, res) => {
  const { RoleName, RolePermissions } = req.body;
  try {
    if (!RoleName) {
      res.status(400).json({
        success: false,
        message: "Bad Request, Role Name is not present",
      });
    }
    const saveRoleDetails = await RoleDetails.create({
      RoleName: RoleName,
      RolePermissions: RolePermissions,
    });
    res.status(201).json({
      success: true,
      message: "New Role Added Successfully",
      data: saveRoleDetails,
    });
  } catch (error) {
    console.error("Error while adding new role", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// adding UserDetails on DB (..........SIGN UP.............)
const createNewUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    if (!name || !email || !password || !role) {
      res.status(400).json({
        success: false,
        message: "Bad Request, complete user details are not present",
      });
    }
    const saveUserDetails = await UserDetails.create({
      UserName: name,
      UserEmail: email,
      password: password,
      Role: role,
    });
    res.status(201).json({
      success: true,
      message: "New Role Added Successfully",
      data: saveUserDetails,
    });
  } catch (error) {
    console.error("Error while adding new User", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// SIGN In User via email and password
const secretKey = "Rudra";
const login = async (req, res) => {
  try {
    const { UserEmail, password } = req.body;
    const user = await UserDetails.findOne({ UserEmail, password });
    const role = await RoleDetails.findById(user.Role);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ user_id: user._id }, secretKey, {
      expiresIn: "1h",
    });
    res.json({
      message: "Login successful",
      token,
      user: role.RoleName,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createNewPermission, createNewRole, createNewUser, login };
