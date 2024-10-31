const apiKeyRouter = require("express").Router();
const passport = require("passport");
const { isAdmin } = require("../middleware/authorisation");

const apiKeyController = require("../middleware/apiKey");
apiKeyRouter.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  apiKeyController.getKeys
);

apiKeyRouter.put(
  "/status",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  apiKeyController.changeStatus
);

module.exports = apiKeyRouter;
