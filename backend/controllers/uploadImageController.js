import express from 'express'
import { configDotenv } from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import User from '../models/userModel.js'

configDotenv()

const uploadImage=(req, res) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      folder: 'ChatApp' // optional
    },
    process.env.CLOUDINARY_API_SECRET
  );
  res.json({
    timestamp,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    folder: 'ChatApp'
  });
}

const uploadImageDb=async(req,res)=>{
  try{
    const {profilePic,id}=req.body
    const updatedUser=await User.findByIdAndUpdate(id,{profilePicture:profilePic},{new:true}).select("_id email username profilePicture")


    if(updatedUser){
      return res.json({success:true,message:'Image Uploaded Successfully',data:updatedUser})
    }
  }
  catch(err)
  {
    return res.json({success:false,message:err.message})
  }
}

export  {uploadImage,uploadImageDb};
