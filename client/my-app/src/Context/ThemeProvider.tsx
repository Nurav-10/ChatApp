import { createContext, useContext, useState } from "react"
import React from "react";
type Theme='light'|'dark';

interface ThemeContextProps{
  theme:Theme,
  toggleTheme:()=>void
}

const ThemeContext=createContext<ThemeContextProps|undefined>(undefined)

export const ThemeProvider=({children}:{children:React.ReactNode})=>{

  const [theme,setTheme]=useState<Theme>('dark')

  const toggleTheme=()=>{
    setTheme((prev)=>prev==='light'?'dark':'light')
  }

  return(
    <ThemeContext.Provider value={{theme,toggleTheme}}>
      <div data-theme={theme}>{children}</div>
    </ThemeContext.Provider>
  )
}

export const useTheme=()=>{
  const context=useContext(ThemeContext);
  if(!context) throw new Error('useTheme must be used within a ThemeProvider')
    return context
};