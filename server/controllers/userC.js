import User from "../models/userM.js";
import asyncHandler from "express-async-handler";
import { generateToken } from "../config/generateToken.js";
import bcrypt from "bcryptjs";

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({message:"All feilds required"});
    // throw new Error("Please enter all the feilds");
  } else {
    const userExis = await User.findOne({ email });
    if (userExis) {
      res.status(400);
      throw new Error("User Already exist");
    }
    // const hashedPassword = bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password
    });
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        password: user.password,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Failed to create user");
    }
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter all the feilds");
  }
  const userExis = await User.findOne({ email });
  if (userExis) {
    res.status(400);
    throw new Error("User Already exist");
  }
  const user = await User.create({
    name,
    email,
    password,
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      password: user.password,
    });
  } else {
    res.status(400);
    throw new Error("Failed to create user");
  }
});

export default {
  registerUser,
  loginUser,
};
