const jwt = require("jsonwebtoken");

function verify(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(403).send({ message: "There is no token!" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const userId = jwt.verify(token, "mysecretKey").id;

    res.locals.userId = userId;
    next();
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: "Token is invalid!" });
  }
}

module.exports = verify;
