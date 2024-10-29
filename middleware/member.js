const listPosts = (req, res, next) => {
  res.status(200).json({ msg: `you have a valid api key: ${req.apiKey.key}` });
};

module.exports = {
  listPosts,
};
