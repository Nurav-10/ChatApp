import mongoose from "mongoose";
import { configDotenv } from "dotenv";

configDotenv()

export default async function db(){
   try{
      await mongoose.connect(process.env.MONGO_URL).then(()=>console.log('Db Connected successfully'))
   }
   catch(err)
   {
      console.log('Error while connecting to db ',err.message)
   }
}

db()
