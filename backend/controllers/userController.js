import User from "../models/userModel.js"
import bcrypt, { genSalt } from 'bcryptjs'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import db from "../dbConfig/db.js"
import { config } from "dotenv"

config()
db()

export const SignUp = async (req, res) => {

   try {

      const { name, email, password } = req.body

      if (!email || !name || !password)
         return res.json({
            success: false, message: 'Please enter all fields'
         })

      //check if user already exist.
      const userExist = await User.findOne({ email })
      if (userExist)
         return res.json({ success: false, message: 'user already existed' })

      //hashing the password.
      const salt = await genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      const newUser = await User.create({ username: name, email, password: hashedPassword })
      return res.json({
         success: true,
         data: newUser
      })
   }
   catch (err) {
      return res.json({
         success: false, message: err.message
      })
   }
}



export const Login = async (req, res) => {

   try {
      const {email,password}=req.body
      if (!email || !password)
         return res.json({
            success: false, message: 'Please enter all fields'
         })

      const user=await User.findOne({email})
      if(!user)
         return res.json({success:false,message:"user doesn't exist! Please sign up"})
      const hashedPassword = await bcrypt.compare(password,user.password)

      // const token = await jwt.sign({ id: user._id, email: user.email, name: user.username }, process.env.JWT_SECRET, { expiresIn: '2d' })


         return res.json({
            success: true,
            message: 'Login successful',
            data: {
               id: user._id,
               name: user.username,
               email: user.email,
               profilePicture: user.profilePicture,
               bio:user.bio
            }
         })
      }
   catch (err) {
      return res.json({
         success: false, message: err.message
      })
   }
}


//we have to search user except user himself
