import {Route,Routes, BrowserRouter } from "react-router"
import ChatScreen from '../src/components/ChatSreen'
import LandingPage from "./components/LandingPage"
import Navbar from "./components/Navbar.tsx"
const App = () => {
  return (
    <BrowserRouter>
    <Navbar/>
    <Routes>
      <Route path="/" element={<LandingPage isCaraousel={false} time={1000}/>}/>
      <Route path="/chat" element={<ChatScreen/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App