/**
 * * Created express app and export that using module.export.
 * * After exporting we can listen on port in index.js file.
 */
require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("./model/user");
const isUserAuthenticated = require("./middleware/auth");

/**
 * ? MIDDLEWARES
 */
app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h6>Authentication System</h6>");
});

//! REGISTRATION API
app.post("/register", async (req, res) => {
  try {
    // 1.Get all information
    const { firstname, lastname, email, password } = req.body;

    // 2.Check all fileds are present
    if (!(email && password && firstname && lastname)) {
      res.status(400).send("All feeds are mandatory...");
    }

    // 3.Check if user already exist
    const existingUser = await User.findOne({ email }); // This will return PROMISE

    if (existingUser) {
      res.status(401).send("User Already Registered.");
    }

    // 4.Handle password to be encrypt
    const encryptPassword = await bcrypt.hash(password, 10);

    // 5.Create user

    const user = await User.create({
      firstname,
      lastname,
      email: email.toLowerCase(),
      password: encryptPassword,
    });

    // Creating Token -> After creating user we get unique user._id from DB
    const token = jwt.sign(
      { user_id: user._id, email }, // Payload
      process.env.SECRET_KEY, // Secret key to generate token
      {
        expiresIn: "2h", // Token expiration time
      }
    );

    /**
     * ? Update or not in DB
     * ? We are not storing token in DB if you want to store
     * ? then you can by creating the token first and then create user.
     */
    user.token = token;
    // Not to display password to user in response.
    user.password = undefined;
    // In res send a token or entire user or just success / fail to redirect the frontend user.
    res.status(201).json(user);
  } catch (error) {
    console.log(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      res.status(400).json("All fields are required");
    }

    const user = await User.findOne({ email });
    /**
     * Below conditions to handle
     * !IF user not find.
     * !IF Password Not Matches.
     */

    // if(!user){
    //   res.status(400).send("You are not registered in our app")
    // }

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.SECRET_KEY,
        {
          expiresIn: "2h",
        }
      );

      user.token = token;
      user.password = undefined;
      res.status(200).json(user);
    }

    res.status(400).send("Email or Password is incorrect");
  } catch (error) {
    console.log(error);
  }
});

app.get("/dashboard", isUserAuthenticated, (req, res) => {
  res.status(200).send("My secret information");
});
module.exports = app;
