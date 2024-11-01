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
const validationSchemaUpdate = [
  body("id").notEmpty().withMessage("please provide a valid user id"),
  body("email").isEmail().withMessage("Must be a valid email address").trim(),
];

const generateNewKey = async (req, res, next) => {
  const apiKey = crypto.randomBytes(32).toString("hex");
  const { iv, encryptedData } = utils.encryptApiKey(apiKey);
  // const hashedKey = crypto.createHash("sha256").update(apiKey).digest("hex");
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
    await dbApiKey.saveNewApiKey(`${encryptedData}.${iv}`, data);
    res.status(200).json({
      key: apiKey,
      msg: "successfully generated - Attention: save the key somewhere secure. There is no way to replace this key when lost!!!",
    });
  } catch (err) {
    next(err);
  }
};
const getApiKeys = async (req, res, next) => {
  const userId = parseInt(req.user.id);
  try {
    const keyRecords = await dbApiKey.fetchApiKeys(userId);
    keyRecords.forEach((apiKey) => {
      const keyData = apiKey.key.split(".");
      apiKey.key = utils.decryptApiKey(keyData[0], keyData[1]);
    });
    res
      .status(200)
      .json({ success: true, msg: "api keys fetched", keys: keyRecords });
  } catch (err) {
    res.status(401).json({
      success: false,
      msg: "cant find any Api-Keys, please generate a new one",
    });
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
        msg: "jwt token issued, you are logged in",
        token: jwt.token,
        expiresIn: jwt.expires,
      });
    }
    res.status(401).json({ success: false, msg: "wrong password" });
  } catch (err) {
    next(err);
  }
};

const updateUserEmail = [
  validationSchemaUpdate,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "no valid e-mail-address or user Id",
        errorInfo: errors,
      });
    }
    try {
      const userId = parseInt(req.body.id);
      const email = req.body.email;
      await dbUser.changeEmail(email, userId);
      res
        .status(200)
        .json({ success: true, msg: "e-mail successfully changed" });
    } catch (err) {
      res
        .status(400)
        .json({ success: false, msg: "could not change e-mail-address" });
    }
  },
];

module.exports = {
  generateNewKey,
  registerUser,
  login,
  updateUserEmail,
  getApiKeys,
};
