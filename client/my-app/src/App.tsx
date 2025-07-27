import {Route,Routes, BrowserRouter, useLocation } from "react-router"
import ChatScreen from '../src/components/ChatSreen'
import LandingPage from "./components/LandingPage"
import Navbar from "./components/Navbar.tsx"
import { Toaster } from "react-hot-toast"
import Login from "./screen/Login.tsx"
import SignUp from "./screen/SignUp.tsx"
import NotFound from "./screen/NotFound.tsx"
import Profile from "./components/Profile.tsx"
import NonPersistentChats from "./components/NonPersistentChats.tsx"
import PrivateChats from "./components/PrivateChats.tsx"
import GroupChat from "./components/GroupChat.tsx"
const App = () => {
  return (
    <>
    <BrowserRouter>
    <Navbar/>
    <Routes>
      <Route path="/" element={<LandingPage isCaraousel={false} time={2000}/>}/>
      <Route path="/chat" element={<ChatScreen/>}/>

      <Route path="/sign-in" element={<Login/>}/>
        <Route path="/sign-up" element={<SignUp/>}/>
        <Route path="*" element={<NotFound/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/non-persistent-chats" element={<NonPersistentChats/>}/>
        <Route path="/private-chats" element={<PrivateChats/>}/>
        <Route path="/group-chats" element={<GroupChat/>}/>

    </Routes>
    </BrowserRouter>
    <Toaster/>
    </>
  )
}

export default App