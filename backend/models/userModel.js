import mongoose from 'mongoose'

const userSchema=new mongoose.Schema({
   username:{
      type:String,
      required:[5,'Minimun should be of 5 characters'],
      unique:true
   },
   email:{
      type:String,
      required:true,
      unique:true
   },
   password:{
      type:String,
      required:true
   },
   profilePicture:{
      type:String,
      default:''
   },
   bio:{
      type:String,
      default:''
   }
})

const User=mongoose.models('User') || mongoose.model('User',userSchema)

export default User