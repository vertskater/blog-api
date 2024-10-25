const crypto = require('crypto');
const dbApiKey = require('../db/apiKeys');
const dbUser = require('../db/users');
const utils = require('../lib/utils');

const generateNewKey = async (req, res, next) => {
  const apiKey = crypto.randomBytes(32).toString('hex');
  const hashedKey = crypto.createHash('sha256').update(apiKey).digest('hex');
  const clientName = req.body.clientName || 'default Api Key'
  try {
    const data = {
      clientName: clientName,
      owner: req.user.id //TODO: not quite sure
    }
    const apiKey = await dbApiKey.saveNewApiKey(hashedKey, data)
    //TODO: missing error handling
    res.status(200).json({key: apiKey, msg: 'successfully generated'})
  }catch(err) {
    next(err);
  }
}

const registerUser = async (req, res, next) => {
  const saltHash = utils.genPassword(req.body.password);
  const salt= saltHash.salt;
  const hash = saltHash.hash;
  try {
    const user = await dbUser.saveNewUser({
      email: req.body.email,
      password: `${hash}.${salt}`
    })
    if(user) {
      const jwt = utils.issueJwt(user);
      return res.status(200).json({success: true, jwt: jwt.token, expiresIn: jwt.expires})
    }
    res.status(401).json({success: false});
  }catch(err) {
    next(err)
  }
}

const login = async (req, res, next) => {
  try {
    const user = await dbUser.getUserByEmail(req.body.email);
    if(!user) {
      return res.status(401).json({success: false, msg: 'user not found'})
    }
    const hashSalt = user.password.split('.');
    const verifyPassword = utils.validPassword(req.body.password, hashSalt[0], hashSalt[1]);
    if(verifyPassword) {
      const jwt = utils.issueJwt(user);
      return res.status(200).json({success: true, msg: 'jwt token issued', token: jwt.token, expiresIn: jwt.expires})
    }
    res.status(401).json({success: false, msg: 'wrong password'})
  }catch (err){
    next(err)
  }
}

const pullApiKeys = async (req, res, next) => {
  try {
    const keys = await dbApiKey.getApiKeys(req.user.id);
    if(keys) {
      return res.status(200).json({success: true, keys: keys})
    }
    res.status(401).json({success: false, msg: 'no keys found'})
  }catch(err){
    next(err)
  }
}

module.exports = {
  generateNewKey,
  registerUser,
  login,
  pullApiKeys
}