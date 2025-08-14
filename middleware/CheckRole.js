const User = require("../model/ConfigModals/UserModal");
const Role = require("../model/ConfigModals/RoleModal");

const authorizePermission = (requiredPermissionName) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.userId)
        .populate([
          {
            path: "Role",
            select: "-createdAt -updatedAt -__v",
            populate: {
              path: "RolePermissions",
              select: "permissionName",
            },
          },
          {
            path: "customPermissions",
            select: "permissionName",
          },
        ])
        .lean();

      if (!user || !user.Role) {
        return res.status(403).json({ message: "Role or user not found" });
      }

      // ✅ Check custom permissions
      const hasCustomPermission = user.customPermissions?.some(
        (perm) => perm.permissionName === requiredPermissionName
      );

      // ✅ Check role permissions
      const hasRolePermission = user.Role.RolePermissions?.some(
        (perm) => perm.permissionName === requiredPermissionName
      );

      if (hasCustomPermission || hasRolePermission) {
        return next();
      }

      return res.status(403).json({ message: "Permission denied" });
    } catch (err) {
      console.error("Authorization error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  };
};

module.exports = authorizePermission;
