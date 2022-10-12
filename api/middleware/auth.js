const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
  // bearer token

  const bearerHearder = req.headers["authorization"];
  if (!bearerHearder) {
    return res
      .status(403)
      .send({ message: "A token is required for authentication" });
  }
  const token = bearerHearder.split(" ")[1];
  if (!token) {
    return res
      .status(403)
      .send({ message: "A token is required for authentication" });
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send({ message: "Invalid Token" });
  }
  return next();
};

module.exports = verifyToken;
