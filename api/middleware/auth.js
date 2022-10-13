const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
  // bearer token
  var token = req?.cookies?.accessToken;
  if (!token) {
    const bearerHearder = req.headers["authorization"];
    if (!bearerHearder) {
      res.render("components/login/index", {
        layout: "./layouts/login-layout",
      });
      return;
      // return res
      //   .status(403)
      //   .send({ message: "A token is required for authentication" });
    }
    token = bearerHearder.split(" ")[1];
    if (!token) {
      res.render("components/login/index", {
        layout: "./layouts/login-layout",
      });
      return;
      // return res
      //   .status(403)
      //   .send({ message: "A token is required for authentication" });
    }
  }

  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    res.render("components/login/index", { layout: "./layouts/login-layout" });
    return;
    // return res.status(401).send({ message: "Invalid Token" });
  }
  return next();
};

module.exports = verifyToken;
