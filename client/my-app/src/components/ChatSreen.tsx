import { useTheme } from "../Context/ThemeProvider";
import { dummyChat } from "./dummyChat";
import { Colors } from "../color-scheme/colors";
import {  useEffect, useState } from "react";
import { Star } from "lucide-react";
import { io } from "socket.io-client";

interface Messages{
  id:number,
  user:string,
  message:string,
  time:string
}
const socket=io('http://localhost:5000')
const ChatSreen = () => {
  type Scheme =
    | "NeonMirage"
    | "CandyPop"
    | "BubbleHeatGum"
    | "ElectricSunset"
    | "PixelRush";

    const [Message,setMessages]=useState<Messages[]>([])
    
  const { theme } = useTheme();
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [colorScheme, setColorScheme] = useState<Scheme>("NeonMirage");
  const [message,setMessage]=useState('')
  const [userId,setUser]=useState('')
  const [modal,setModal]=useState(true)
  const [roomId,setRoomId]=useState('')
  const [characterName,setCharacterName]=useState('')
  const [peerId,setPeerId]=useState('')
  const options = [
    "NeonMirage",
    "CandyPop",
    "BubblegumHeat",
    "ElectricSunset",
    "PixelRush",
    "default"
  ];

  const generateRoomId=(id1:any,id2:any)=>[id1,id2].sort().join('-')

  const handleDetails=()=>{

    if(!userId ||!peerId)
      return console.log('Please fill all details')

    socket.emit('PrivateRoom',{
      userId,
      peerId
    })

    setModal(false)
  }
  
  
  useEffect(()=>{

    socket.on('newPrivateMessage',({senderId,data})=>{
      console.log(`${senderId}:${data.message} time ${data.time}`)
      setMessages((prev)=>[
        ...prev,
        {id:Date.now()
          ,user:senderId,
          message:data.message,
          time:data.time}])
      setMessage('')
    })
    
  },[])
  const sendMessage=()=>{
    socket.emit('PrivateMessage',({
      senderId:userId,
      receiverId:peerId,
      data:{
        message:message,
        time:new Date().toLocaleTimeString()
      }
    }))
    
    
  }


  return (
    <div
    style={{backgroundColor:theme==='dark'?Colors[colorScheme].bg:'beige'}}
      className={`${
        theme === "dark" ? " text-white" : " "
      } py-18 px-5 w-screen h-screen overflow-y-hidden font-helviLight`}
    >

      {
        modal && <div className={`z-99 absolute ${theme==='dark'?'bg-zinc-950/90':'bg-amber-100/90'} left-[50%] -translate-x-1/2 px-8 py-8 rounded-md gap-4 flex flex-col`}>
          <div className="flex flex-col gap-1">
          <label>Name</label>
          <input placeholder="Enter you name" onChange={(e)=>setUser(e.target.value)} value={userId} className="px-3 w-fit rounded-md py-1 border"/>
          </div>

          

           <div className="flex flex-col gap-1">
          <label>Peer Id</label>
          <input placeholder="Enter Peer Id" onChange={(e)=>setPeerId(e.target.value)} value={peerId} className="px-3 w-fit rounded-md py-1 border"/>
          </div>

          <button type='submit' className="bg-blue-500 rounded-sm py-1 hover:bg-blue-600" onClick={handleDetails}>Submit</button>
          </div>
    
      }
      <div className="flex justify-center relative items-center cursor-pointer" onClick={()=>setOptionsOpen(prev=>!prev)}>
        <h2 className="text-xl text-center font-semibold hover:text-blue-300">
          Chats ColorScheme
        </h2>
        <Star fill="pink" size={15} />
        {optionsOpen && (
          <div className="flex flex-col absolute top-8">
            {options.map((i:string, ind:number) => {
              return <button key={ind} className="hover:text-blue-200" onClick={()=>setColorScheme(i)}>{i}</button>;
            })}
          </div>
        )}
      </div>
      <div className="flex flex-col  py-5 overflow-y-scroll overflow-hidden snap-y h-full">
        {Message.map((i, ind) => {
          return (
            <div
              key={ind}
              className={`w-full  mt-15 flex px-2 ${
                i.user === userId ? "flex-row " : "flex-row-reverse "
              }`}
            >
              <div className="border px-3 py-2 rounded-xl xl:max-w-[15vw] md:w-[25vw] relative min-w-[25vw]">
                <div>
                  <h2
                  style={{backgroundColor:i.user===userId?Colors[colorScheme].primary:Colors[colorScheme].secondary}}
                    className={`absolute text-white px-2 rounded-md -top-6 text-sm ${
                      i.user !==userId
                        ? "right-0"
                        : "left-0"
                    }`}
                  >
                    {i.user}
                  </h2>
                  <h2>{i.message}</h2>
                  <h2 className="text-sm absolute -bottom-5">{i.time}</h2>
                </div>
              </div>
            </div>
          );
        })}

        <div className="flex ml-3  mt-10 flex-col gap-2">
        <input placeholder="Enter Message" value={message} onChange={(e)=>setMessage(e.target.value)} className=" w-fit  px-2 border rounded-md font-helviLight"/>
        <button type="submit" onClick={sendMessage} className="w-fit bg-blue-500 text-white rounded-md px-2">Submit Message</button>
      </div>
        
      </div>
    </div>
  );
};

export default ChatSreen;
