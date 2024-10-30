const dbUsers = require("../db/users");

const fetchUsers = async (req, res, next) => {
  try {
    const users = await dbUsers.getAllUsers();
    res.status(200).json({ success: true, msg: "users fetched", users: users });
  } catch (err) {
    res.status(400).json({ success: false, msg: "could not fetch users" });
  }
};

const fetchUserById = async (req, res, next) => {
  const userId = parseInt(req.params.id);
  try {
    const user = await dbUsers.getUserById(userId);
    if (user) {
      return res
        .status(200)
        .json({ success: true, msg: "user fetched", user: user });
    }
    res.status(400).json({
      success: false,
      msg: `there is no user with this id: ${userId}`,
    });
  } catch (err) {
    res.status(400).json({ success: false, msg: "could not fetch user" });
  }
};

const changeRole = async (req, res, next) => {
  const possibleRoles = require("../lib/userRoles");
  const roles = Object.values(possibleRoles);
  const newRole = req.params.roleName;
  const userId = parseInt(req.params.id);
  try {
    const user = await dbUsers.getUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }
    if (roles.includes(newRole)) {
      await dbUsers.changeRole(newRole, userId);
      return res
        .status(200)
        .json({ success: true, msg: `user role changed to ${newRole}` });
    }
    res
      .status(400)
      .json({ success: false, msg: `Could not change to role ${newRole}.` });
  } catch (err) {
    res.status(400).json({ success: false, msg: "could not change role" });
  }
};

const deleteUser = async (req, res, next) => {
  const userId = parseInt(req.params.id);
  const user = await dbUsers.getUserById(userId);
  try {
    if (user) {
      await dbUsers.deleteUser(userId);
      return res.status(200).json({
        success: true,
        msg: `User ${user.email} successfully deleted`,
      });
    }
    res.status(400).json({ success: false, msg: "no user found with this id" });
  } catch (err) {
    res.status(400).json({ success: false, msg: "could not delete user" });
  }
};

module.exports = {
  fetchUsers,
  fetchUserById,
  changeRole,
  deleteUser,
};
