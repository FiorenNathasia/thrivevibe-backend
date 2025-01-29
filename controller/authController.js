const db = require("../db/db");
const bcrypt = require("bcrypt");
const generateAccessToken = require("../utils/token");

const signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    //Check  if  user already exist
    const user = await db("users").where("email", email).first();
    if (user) {
      res.status(400).send({ message: "User already exists" });
    }

    //Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //Create new user
    const newUser = await db("users")
      .insert({
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        email: req.body.email,
        password: hashedPassword,
      })
      .returning("*");
    console.log(newUser);

    // Generate access token (assuming this is a helper function)
    const accessToken = generateAccessToken(newUser[0]);

    // Send success response
    return res.status(200).send({
      data: {
        firstName: newUser[0].first_name,
        lastName: newUser[0].last_name,
        email: newUser[0].email,
        accessToken,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await db("users").where("email", email).first();
  console.log(user);

  if (!user) {
    return res.status(400).send({ message: "email could not be found" });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return res.status(400).send({ message: "Invalid password" });
  }
  const accessToken = generateAccessToken(user);
  res.status(200).send({
    message: "You have succesfully logged in!",
    data: {
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      accessToken,
    },
  });
};

module.exports = {
  login,
  signup,
};
