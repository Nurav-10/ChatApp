import { Link } from "react-router"
import { useTheme } from "../Context/ThemeProvider"
import { Sun,Moon, Menu } from "lucide-react"
import { useState } from "react"
import {motion} from 'motion/react'

const Navbar = () => {
   const {theme,toggleTheme}=useTheme()
   const [menuopen,setMenuOpen]=useState(false)
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
  return (
   <div className="p-2 pr-3 w-screen py-2 z-99 fixed rounded-2xl">
    <div className={`${theme==='dark' ? 'bg-zinc-900/80 text-white':'text-zinc-800'} h-fit  font-helviRoman flex justify-between px-5 py-3 border border-zinc-600 shadow-[1px_1px_10px_rgba(150,120,100,0.5)] rounded-2xl  backdrop-blur-[1.5px]`}>
      <h2 className="text-lg font-semibold">Chatify</h2>

      <div className="md:flex gap-8 hidden items-center">
         {
            navLink.map((i,ind:number)=>{
               return (
                  <Link key={ind} className='hover:text-blue-400 px-3' to={i.href}>{i.title}</Link>
               )
            })
         }
      </div>
      <div className="flex gap-2 items-center">
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
         <div  onClick={()=>toggleTheme()} className="rounded-md p-1 border h-fit">{theme==='light'?<Moon size={15}/>:<Sun size={15}/>}</div>
    </div>
    </div>
    </div>
  )
}

export default Navbar