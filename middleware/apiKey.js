const utils = require("../lib/utils");
const dbApiKey = require("../db/apiKeys");

const apiKeyRateLimit = async (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey) {
    return res.status(401).json({ success: false, msg: "Api-Key required" });
  }
  const hashedKey = utils.hashApiKey(apiKey);
  try {
    const keyRecord = await dbApiKey.getApiKey(hashedKey);
    if (!keyRecord) {
      return res.status(403).json({ success: false, msg: "invalid Api-Key" });
    }
    if (keyRecord.ownerId !== req.user.id) {
      return res
        .status(403)
        .json({ success: false, msg: "Key does not match user credentials" });
    }
    if (keyRecord.usageCount >= keyRecord.maxRequests) {
      return res
        .status(429)
        .json({ success: false, msg: "Request limit exceeded " });
    }
    await dbApiKey.updateUsageCount(keyRecord);
    req.apiKey = keyRecord;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  apiKeyRateLimit,
};
