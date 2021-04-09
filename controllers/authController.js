const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { email, username, password } = req.body; // info from client

  // Check if all fields are present
  if (!email || !username || !password) {
    return res.status(400).send("Please provide all fields");
  }

  // Check if username /email is ready in database
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).send("Email already exist");
  }

  // hash of password
  const hashedPassword = await bcrypt.hash(password, 12);

  // create user
  const user = await User.create({ email, username, password: hashedPassword });

  // Generate token
  const token = jwt.sign({ id: user._id }, "123456789", { expiresIn: "1h" });

  // return response
  res.status(200).json({ token });
};

const verifyToken = (req, res, next) => {
  let token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "Not Authorized." });
  }

  token = token.split(" ")[1];

  try {
    let user = jwt.verify(token, "123456789");
    req.user = user.id;
    console.log(user);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token." });
  }

  next();
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // Check if user is in the database
  let user = await User.findOne({ email });
  if (!user) {
    return res.status(400).send("Invalid Credentials");
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).send("Invalid Credentials");
  }

  // Generate token
  const token = jwt.sign({ id: user._id }, "012345678", { expiresIn: "1h" });

  // return response
  res.status(200).json({ token });
};

module.exports = {
  register,
  login,
  verifyToken,
};
