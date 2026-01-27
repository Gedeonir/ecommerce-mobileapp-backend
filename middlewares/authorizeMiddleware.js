const authorizeMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const { role } = req.user;
      if (!allowedRoles.includes(role)) {
        return res
          .status(403)
          .json({
            message: "You do not have permission to perform this action",
          });
      }
      next();
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error" });
    }
  };
};

const checkOwnership = (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    if (id !== userId) {
      return res
        .status(403)
        .json({ message: "You do not have permission to perform this action" });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

const authorizeSelfOrAdmin = (req, res, next) => {
  const currentUser = req.user;
  const targetUserId = req.params.id;

  const isOwner = currentUser.id === targetUserId;
  const isAdmin = currentUser.role === "admin";

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ message: "Forbidden" });
  }

  next();
}

module.exports = {
  authorizeMiddleware,
  authorizeSelfOrAdmin,
  checkOwnership
};