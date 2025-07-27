import User from "../models/userModel"
import jwt from 'jsonwebtoken'
import configDotenv from 'dotenv'

configDotenv()

export const authMiddleware=async(req,res,next)=>{
   //verify the token.
  try{
   const token=req.headers.authorization.split(' ')[1]
   const decoded=jwt.verify(token,process.env.JWT_SECRET)
   req.user=decoded
   next()
  }
  catch(err)
  {
   return res.json({
      success:false,
      message:err.message
   })
  }

}