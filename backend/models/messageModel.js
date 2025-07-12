import mongoose from 'mongoose'

const messageSchema=new mongoose.Schema({
   senderId:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
   receiverId:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
   message:{type:String,required:[2,'min of 2 characters']},
   time:{type:Date,default:Date.now},
   seen:{type:Boolean,default:false}
},{timestamps:true})

export default Message=mongoose.models('Message') || mongoose.model('Message',messageSchema)
