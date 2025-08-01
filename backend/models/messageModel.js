import mongoose from 'mongoose'

const messageSchema=new mongoose.Schema({
   senderId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
   receiverId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
   message:{type:String,required:[1,'min of 2 characters']},
   time:{type:Date,default:Date.now},
   seen:{type:Boolean,default:false}
},{timestamps:true})

const Message=mongoose.model('Message',messageSchema)
export default Message