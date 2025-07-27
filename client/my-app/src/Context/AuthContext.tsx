'use client'
import { createContext, useContext } from "react"


// interface User{
//    _id:string,
//    name:string,
//    email:string,
//    profilePicture:string
// }
interface AuthContextProps{
   SignIn:(email:string,password:string)=>Promise<any>,
   SignUp:(email:string,name:string,password:string)=>Promise<any>,
   Logout:()=>void,
   getUser:()=>void
   setUser:(user:any)=>void
}


const AuthContext=createContext<AuthContextProps|undefined>(undefined)


export const AuthProvider=({children}:{children:React.ReactNode})=>{
   //all function here.
   const SignIn=async(email:string,password:string)=>{
      const response=await fetch('http://localhost:5000/api/auth/signin',{
         method:'POST',
         headers:{'Content-Type':'application/json'},
         body:JSON.stringify({email,password})
      })
      const res=await response.json()
      if(res.success)
      {
         localStorage.setItem('user',JSON.stringify(res.data))

         return {success:true,message:res.message,data:res.data}
      }
      else{
         return {success:false,message:res.message}
      }
   }

   const SignUp=async(email:string,name:string,password:string)=>{
      const response=await fetch('http://localhost:5000/api/auth/signup',{
         method:'POST',
         headers: {
    'Content-Type': 'application/json'
  },
         body:JSON.stringify({name,email,password})
      })
      const res=await response.json()

      if(res.success){
         return {success:true}
      }
      else
         return {success:false}
   }

   const Logout=()=>{
      localStorage.setItem('user','')
      
   }
   const getUser=()=>{
      const userDetail=localStorage.getItem('user')
      if(!userDetail) return false
      return JSON.parse(userDetail!)
   }

   const setUser=(user:any)=>{
      const id=user._id
      const name=user.username
      const profilePicture=user.profilePicture
      const email=user.email
      const bio=user.bio
      const userData={id,email,name,profilePicture,bio}
      //revalidate.
      console.log('Function called')
      localStorage.setItem('user',JSON.stringify(userData))
   }

   return (
      <AuthContext.Provider value={{SignIn,SignUp,Logout,getUser,setUser}}>
         {children}
      </AuthContext.Provider>
   ) 
}

export const useAuth=()=>{
   const context=useContext(AuthContext)
   if(!context) throw new Error('useAuth must be used within auth Context')

      return context
}
