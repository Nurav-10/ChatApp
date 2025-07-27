import mongoose, { isValidObjectId } from "mongoose"
import User from "../models/userModel.js"
import { Types } from "mongoose"
import Message from "../models/messageModel.js"

export const getUserSideBar = async (req, res) => {
   try {
      const userId = req.query.userId
      const userIdObj = new Types.ObjectId(userId)
      const usersList = await User.find(
         {
            _id: { $ne: userIdObj }
         }
      ).select("-password");//lean function convert into plain JS Object



      if (usersList)
         return res.json({
            success: true,
            message: 'User list fetched successful',
            data: usersList
         })
   }
   catch (err) {
      return res.json({
         success: false,
         message: err.message
      })
   }
}

//get message between private chat using senderId and Receiver Id.
export const getPrivateChats = async (req, res) => {
   try {
      const { senderId, receiverId } = req.query
      if (!isValidObjectId(senderId) || !isValidObjectId(receiverId))
         return res.json({
      success: false,
            message: 'type of id are not correct'
         })
         
         //find all message between them.
         const messages=await Message.find({
            $or:[
               {senderId,receiverId},
               {senderId:receiverId,receiverId:senderId}
            ]
         })
         return res.json({
            success:true,
            message:'Fetched message Successfully',
            data:messages
         })
      }
   catch(err)
   {
      return res.json({
         success:false,
         message:'Messages Cannot fetched successfully'
      })
   }
}

//function to create message.
export const createMessage=async(req,res)=>{
   try{
   const {senderId,receiverId,message}=req.body
   const newMessage=await Message.create({
      senderId,
      receiverId,
      message
   })
   return res.json({
      success:true,
      message:'New Message Created',
      data:newMessage
   })
   }
   catch(err)
   {
      return res.json({
         success:false,
         message:'Cannot send message'
      })
   }

}

export const deleteMessage=async(req,res)=>{
   try {
      const {id}=req.params.id
      const response=await Message.findByIdAndDelete({_id:id})

      if(response)
      return res.json({
         success:true,
         message:'Deleted successfully'
      })
   } catch{
      return res.json({
         success:false,
         message:'Message Cannot be deleted'
      })
   }
}






