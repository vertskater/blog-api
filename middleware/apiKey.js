const utils = require("../lib/utils");
const dbApiKey = require("../db/apiKeys");
const apiKeyStatus = require("../lib/apiKeyStatus");

const apiKeyRateLimit = async (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey) {
    return res.status(401).json({ success: false, msg: "Api-Key required" });
  }
  try {
    const keyRecords = await dbApiKey.fetchApiKeys(req.user.id);
    if (!keyRecords) {
      return res.status(403).json({ success: false, msg: "invalid Api-Key" });
    }
    const keyRecord = keyRecords.filter((record) => {
      const keyData = record.key.split(".");
      const decryptedKey = utils.decryptApiKey(keyData[0], keyData[1]);
      return apiKey === decryptedKey;
    });
    if (keyRecord.length === 0) {
      return res
        .status(403)
        .json({ success: false, msg: "Key does not match user credentials" });
    }
    const [key] = keyRecord;
    if (key.status === apiKeyStatus.REVOKED) {
      return res
        .status(401)
        .json({ success: false, msg: "your api key is REVOKED" });
    }
    if (key.usageCount >= key.maxRequests) {
      return res
        .status(429)
        .json({ success: false, msg: "Request limit exceeded " });
    }
    await dbApiKey.updateUsageCount(key);
    req.apiKey = key;
    next();
  } catch (err) {
    next(err);
  }
};

const getKeys = async (req, res, next) => {
  try {
    const apiKeys = await dbApiKey.fetchAllKeysGroupByOwner();
    apiKeys.forEach((keyItem) => {
      const keyData = keyItem.key.split(".");
      keyItem.key = utils.decryptApiKey(keyData[0], keyData[1]);
    });
    res
      .status(200)
      .json({ success: true, msg: "fetch api keys", apiKeys: apiKeys });
  } catch (err) {
    res.status(400).json({ success: false, msg: "could not fetch keys" });
  }
};

const changeStatus = async (req, res, next) => {
  const status = req.body.status;
  const apiId = req.body.apiId;
  const possibleStatus = Object.values(require("../lib/apiKeyStatus"));
  if (!possibleStatus.includes(status)) {
    return res
      .status(400)
      .json({ success: false, msg: "Status change not possible" });
  }
  try {
    await dbApiKey.updateStatus(status, apiId);
    res.status(200).json({ success: true, msg: `changed status to ${status}` });
  } catch (err) {
    res.status(400).json({ success: false, msg: "could not change status" });
  }
};

module.exports = {
  apiKeyRateLimit,
  getKeys,
  changeStatus,
};
