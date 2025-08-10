import { Link, useLocation } from "react-router"
import { useTheme } from "../Context/ThemeProvider"
import { Sun,Moon, Menu } from "lucide-react"
import { useEffect, useState } from "react"
import {motion} from 'motion/react'
import { useAuth } from "../Context/AuthContext"
import { useNavigate } from "react-router"


const Navbar = () => {
   const navigate=useNavigate()
   const {getUser}=useAuth()
   const [user,setUser]=useState<any>()
   const {theme,toggleTheme}=useTheme()
   const bgColor=['#234578','#876789','#564733','#397256']
   const [menuopen,setMenuOpen]=useState(false)
   const location=useLocation()
   const navLink=[
      {
         title:'Home',
         href:'/'
      },
      {
         title:'Chat',
         href:'/chat'
      },
      {
         title:'Features',
         href:'/#features'
      },
      {
         title:'About',
         href:'#about'
      }
      
   ]
   useEffect(()=>{
      const u=getUser() 
      setUser(u)
   },[])

   const paths=['/sign-in','/sign-up','/features','/about']
   const {Logout}=useAuth()
  return (
   <div className={`p-2 pr-3 w-screen py-2 z-99 fixed rounded-2xl ${paths.includes(location.pathname) && 'hidden'}`}>

    <div className={`${theme==='dark' ? 'bg-zinc-900/80 text-white':'bg-white/40 text-zinc-800'} h-fit  font-helviRoman flex justify-between px-5 py-3 border border-zinc-600 shadow-[1px_1px_10px_rgba(150,120,100,0.5)] rounded-2xl  backdrop-blur-[1.5px]`}>
      <h2 className="text-lg font-semibold">Chatify</h2>

      <div className="md:flex gap-8 hidden items-center font-light">
         {
            navLink.map((i,ind:number)=>{
               return (
                  <Link key={ind} className={`${theme==='dark'?'bg-zinc-900':'bg-amber-50'} px-2 py-1 hover:text-blue-400 rounded-sm `} to={i.href}>{i.title}</Link>
               )
            })
         }
      </div>
      <div className="flex gap-2 items-center">
                  <div  onClick={()=>toggleTheme()} className="rounded-md p-1 border h-fit">{theme==='light'?<Moon size={15}/>:<Sun size={15}/>}</div>
         <div className="relative md:hidden" onClick={()=>setMenuOpen(pre=>!pre)}><Menu size={20}/></div>

         {/* Burger Menu */}
         {menuopen && <motion.div className="flex flex-col gap-3 absolute top-16 right-10 bg-green-200/50 border rounded-b-xl py-2 md:hidden">
            {
               navLink.map((i,index)=>{
                  return(
                     <Link key={index} className="px-5 hover:text-blue-500 text-center" to={i.href}>{i.title}</Link>
                  )
               })
            }
         </motion.div>}
         <button onClick={()=>{Logout() 
            navigate('/sign-in')}} className="bg-red-500 px-2 rounded-md transition-all text-white  hover:shadow-[1.5px_1.5px_3px_rgba(0,0,0,1)] duration-200">Logout</button>
         {user && <img src={user?.profilePicture || './my2.jpg'} alt="profile" onClick={()=>navigate('/profile')} className="w-8 object-cover aspect-square border transition-all rounded-full"/>}
    </div>
    </div>
    </div>
  )
}

export default Navbar