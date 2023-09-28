import User from "../models/userM.js";
import { generateToken } from "../config/generateToken.js";
import bcrypt from "bcrypt";

const registerUser =async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({message:"All feilds required"});
    // throw new Error("Please enter all the feilds");
  } else {
    try {
      const userExis = await User.findOne({ email });
      if (userExis) {
        res.status(400).json({message:"User already exist"})
      }else{
        const hashedPassword =await bcrypt.hash(password,10)
        const user = await User.create({
          name:name,
          email:email,
          password: hashedPassword,
        });
        if (user) {
          res.status(201).json({
            _id: user._id,
            name: user.name,
            password: user.password,
            email:email,
            token: generateToken(user._id),
          });
        } else {
          res.status(400).json({ message: "Failed to create user" });
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
};

const loginUser = async (req, res) => {
    const {email,password}= req.body
    if(!email || !password){
      res.status(400).json({message:"Required All feilda"})
    }else{
      try {
        const foundUser = await User.findOne({ email });
        if (!foundUser) {
          res.status(400).json({ message: "User not found" });
        } else {
          const userPassword = bcrypt.compare(foundUser.password, password);
          if (!userPassword) {
            res.status(400).json({ message: "Invalid Credentials" });
          } else {
            res.status(201).json({
              _id: foundUser._id,
              name: foundUser.name,
              email: email,
              token: generateToken(foundUser._id),
            });
          }
        }
      } catch (error) {
        console.log(error)
      }
    }
};

const allUsers = async(req,res)=>{
  const keyWords = req.query.search ? {
    $or:[
      {name:{$regex:req.query.search,$options:'i'}},
      {email:{$regex:req.query.search,$options:'i'}}
    ]
  }:{}
  const users = await User.find(keyWords).find({_id:{$ne:req.user._id}})
  res.send(users)
}
// 10 no video

export default {
  registerUser,
  loginUser,
  allUsers,
};
