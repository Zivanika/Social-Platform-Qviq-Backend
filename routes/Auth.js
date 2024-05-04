const express = require("express");
const path = require("path");
const router = express.Router();
const User = require("../models/User");
const fetchuser = require("../Middlewares/Fetchuser");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

//! Route1: Creating a new user Using: POST "/api/auth/createuser".
router.post(
  "/createuser", 
  async (req, res) => {
    // u.save(); //?For saving in mongoDB database
    let success = false;
    try {
      //Check whether the user already exists
      //findOne is a mongoDB query function
      let u = await User.findOne({ email: req.body.email });
      if (u) {
        return res
          .status(400)
          .json({ error: "Sorry, a user with this email already exists" });
      }
      //?creating hashed password + salt
      let secPass = await bcrypt.hash(req.body.password, 10);

      //?creating a user from post request
      const user = await User.create({
        number: req.body.number,
        email: req.body.email,
        password: secPass,
        type:req.body.type,
        gender:req.body.gender,
        image:req.body.image
      });

      let ID = user._id;
            //! Token creation
            const payload = {
              user: {
                id: user.id,
              },
            };
            var privateKey = "valardohaeris";

      var authtoken = jwt.sign(payload, privateKey); //using userID to generate token cuz its unique and fast retrieval from database
      // res.json(user);
      success = true;
      res.json({ success, authtoken, ID });//Now if anyone gives me this token I can find the userID and with that I can find the database
    } catch (error) {
      if (error.code === 11000) {
        // Duplicate key error
        return res.status(400).json({ error: "Email already exists" });
      }
      console.error(error);
      res.status(500).json({ error: "Internal Server error" });
    }

  }
);
//! Route 2: Getting user details
router.get("/getuser", fetchuser, async (req, res) => {
  try {
      const data = await User.findById(req.user.id); //ab kyuki maine fetchuser use kiya hua hai toh mere req.user me hoga logged in user
      res.json({ data });
  }
  catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server error' });
  }
})

//! Route 3: Update user details

router.patch("/updateuser/:id", fetchuser, async (req, res) => {
  try {
      const { number, email, type } = req.body;
      //Creating a new user
      const newuser = {};
      if (email) { newuser.email = email, newuser.number = number,newuser.type = type  }

      const user = await User.findByIdAndUpdate(req.params.id, { $set: newuser }, { new: true });//By setting "new" to true in the third argument of the object in "findByIdAndUpdate()", we tell mongoose to return the updated state of the object instead of its default behaviour
      res.json({ user });

  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server error' });
  }
})

//! Route 4: Delete user details
router.delete("/deleteuser/:id", fetchuser, async (req, res) => {
  try {
      await User.findByIdAndDelete(req.params.id);
      res.json({"Success":"User has been deleted"})
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server error' });
  }
})
//! Route 5: Sign in user
router.post(
  "/login",
  async (req, res) => {
    let success = false;
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          error:
            "This username doesn't exist. Double-check or sign up if you're new.",
        });
      }
      // console.log(password,user.password)
      
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({
          error:
            "The password you entered is incorrect. Give it another shot or reset your password.",
        });
      }

      // Generate JWT token here 
      const payload = {
        user: {
          id: user.id,
        },
      };
      var privateKey = "valardohaeris";
      var authtoken = jwt.sign(payload, privateKey);
      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      if (error.code === 11000) {
        // Duplicate key error
        return res.status(400).json({ error: "Email already exists" });
      }
      console.error(error);
      res.status(500).json({ error: "Internal Server error" });
    }
  }
);
module.exports=router