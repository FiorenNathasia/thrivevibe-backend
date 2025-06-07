const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, "mysecretKey");
};

module.exports = generateAccessToken;
