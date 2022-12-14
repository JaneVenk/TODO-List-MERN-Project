const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const User = require("../collectionsMongoDB/user");

function generateToken(userId, email) {
  return jwt.sign({ userId: userId, email: email }, process.env.JWT_KEY, {
    expiresIn: "1h",
  });
}

router.post("/signup", async function (req, res, next) {
  const { name, email, password } = req.body;

  try {
    const existingUsers = await User.find({ email: email });

    if (existingUsers.length !== 0) {
      res.json({ errorMessage: "User already signed up. Try to login." });
      return next(new Error(`User with email ${email} already signed up.`));
    }

    var salt = bcrypt.genSaltSync(10);
    var hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      lists: [],
    });

    await newUser.save();

    const token = generateToken(newUser._id, newUser.email);

    res.json({
      userId: newUser._id,
      token: token,
    });
  } catch (error) {
    return next(error);
  }
});

router.post("/login", async function (req, res, next) {
  const { email, password } = req.body;

  try {
    const existingUsers = await User.find({ email: email });

    if (existingUsers.length === 0) {
      res.json({ errorMessage: "No user found. Sign up." });
      return next(
        new Error(`Failed login attempt. No user with email ${email} found.`)
      );
    }

    if (existingUsers.length > 1) {
      return next(
        new Error(`Found ${existingUsers.length} users with ${email} email`)
      );
    }

    const user = existingUsers[0];
    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (isPasswordValid) {
      const token = generateToken(user._id, user.email);

      res.json({
        userId: user._id,
        token: token,
      });
    } else {
      res.json({
        errorMessage: "Error, check your credentials and try again.",
      });
      return next(
        new Error(`Incorrect credentials for user with ${email} email`)
      );
    }
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
