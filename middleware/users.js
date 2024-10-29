const crypto = require("crypto");
const dbApiKey = require("../db/apiKeys");
const dbUser = require("../db/users");
const utils = require("../lib/utils");
const { body, validationResult } = require("express-validator");

const validationSchema = [
  body("email").isEmail().withMessage("Must be a valid email address").trim(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .trim(),
];

const generateNewKey = async (req, res, next) => {
  const apiKey = crypto.randomBytes(32).toString("hex");
  const hashedKey = crypto.createHash("sha256").update(apiKey).digest("hex");
  const clientName = req.body.clientName || "default Api Key";
  try {
    const keys = await dbApiKey.countApiKeys(req.user.id);
    const keysCount = keys._count.ownerId;
    if (keysCount > 2) {
      return res.status(403).json({
        success: false,
        msg: "maximum number of allowed keys reached!",
      });
    }
    const data = {
      clientName: clientName,
      owner: req.user.id,
    };
    await dbApiKey.saveNewApiKey(hashedKey, data);
    res.status(200).json({
      key: apiKey,
      msg: "successfully generated - Attention: save the key somewhere secure. There is no way to replace this key when lost!!!",
    });
  } catch (err) {
    next(err);
  }
};

const registerUser = [
  validationSchema,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "user credentials not matching requirements",
        errorInfo: errors,
      });
    }
    const saltHash = utils.genPassword(req.body.password);
    const salt = saltHash.salt;
    const hash = saltHash.hash;
    try {
      const user = await dbUser.saveNewUser({
        email: req.body.email,
        password: `${hash}.${salt}`,
      });
      if (user) {
        const jwt = utils.issueJwt(user);
        return res
          .status(200)
          .json({ success: true, jwt: jwt.token, expiresIn: jwt.expires });
      }
      res.status(401).json({ success: false });
    } catch (err) {
      next(err);
    }
  },
];

const login = async (req, res, next) => {
  try {
    const user = await dbUser.getUserByEmail(req.body.email);
    if (!user) {
      return res.status(401).json({ success: false, msg: "user not found" });
    }
    const hashSalt = user.password.split(".");
    const verifyPassword = utils.validPassword(
      req.body.password,
      hashSalt[0],
      hashSalt[1]
    );
    if (verifyPassword) {
      const jwt = utils.issueJwt(user);
      return res.status(200).json({
        success: true,
        msg: "jwt token issued",
        token: jwt.token,
        expiresIn: jwt.expires,
      });
    }
    res.status(401).json({ success: false, msg: "wrong password" });
  } catch (err) {
    next(err);
  }
};

const pullApiKeys = async (req, res, next) => {
  try {
    const keys = await dbApiKey.getApiKeys(req.user.id);

    if (keys) {
      return res.status(200).json({ success: true, keys: keys });
    }
    res.status(401).json({ success: false, msg: "no keys found" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  generateNewKey,
  registerUser,
  login,
  pullApiKeys,
};
