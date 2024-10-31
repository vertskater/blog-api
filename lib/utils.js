const crypto = require("crypto");
const jsonwebtoken = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

const pathToKey = path.join(__dirname, "..", "id_rsa_priv.pem");
const PRIV_KEY = fs.readFileSync(pathToKey, "utf8");

const genPassword = (password) => {
  const salt = crypto.randomBytes(32).toString("hex");
  const genHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "SHA512")
    .toString("hex");
  return {
    salt: salt,
    hash: genHash,
  };
};
function validPassword(password, hash, salt) {
  const hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return hash === hashVerify;
}
function hashApiKey(key) {
  return crypto.createHash("sha256").update(key).digest("hex");
}

const issueJwt = (user) => {
  const _id = user.id;
  const expiresIn = "1d";
  const payload = {
    sub: _id,
    iat: Date.now(),
  };

  const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, {
    expiresIn: expiresIn,
    algorithm: "RS256",
  });

  return {
    token: "Bearer " + signedToken,
    expires: expiresIn,
  };
};

const encryptApiKey = (apiKey) => {
  const algorithm = process.env.ALGORITHM || "aes-256-cbc";
  const encryptionKey = Buffer.from(
    "d4f23e20d4b22a1a5b9ed02d4f223456f2c0d4822c456d8f2a1e6b8eaf5d3b7f",
    "hex"
  ); //TODO: Change to environment Variable
  const vector = crypto.randomBytes(16);
  const cypher = crypto.createCipheriv(algorithm, encryptionKey, vector);
  let encrypted = cypher.update(apiKey, "utf8", "hex");
  encrypted += cypher.final("hex");
  return { iv: vector.toString("hex"), encryptedData: encrypted };
};

function decryptApiKey(encryptedData, iv) {
  const algorithm = process.env.ALGORITHM || "aes-256-cbc";
  const encryptionKey = Buffer.from(
    "d4f23e20d4b22a1a5b9ed02d4f223456f2c0d4822c456d8f2a1e6b8eaf5d3b7f",
    "hex"
  ); //TODO: Change to .env
  const decipher = crypto.createDecipheriv(
    algorithm,
    encryptionKey,
    Buffer.from(iv, "hex")
  );
  //TODO: catch error when encryption fails.
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
module.exports = {
  genPassword,
  validPassword,
  issueJwt,
  hashApiKey,
  encryptApiKey,
  decryptApiKey,
};
