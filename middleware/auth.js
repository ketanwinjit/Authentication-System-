/**
 * ? MIDDLEWARE TO VERIFY USER IS LOGIN OR NOT
 */
const jwt = require("jsonwebtoken");

const isUserAuthenticated = (req, res, next) => {
  console.log("MiddleWare Req", req.header);
  const token =
    req.header("Authorization").replace("Bearer ", "") ||
    req.cookies.token ||
    req.body.token;

  if (!token) {
    return res.status(403).send("Token is missing");
  }
  try {
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    console.log("Decode", decode);
  } catch (error) {
    return res.status(401).send("Invalid token");
  }
  return next();
};

module.exports = isUserAuthenticated;
