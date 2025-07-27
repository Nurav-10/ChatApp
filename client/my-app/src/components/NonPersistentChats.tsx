import React, { useState, useEffect, useRef, type FormEvent, useMemo } from "react";
import { useTheme } from "../Context/ThemeProvider";
import toast, { Toaster } from "react-hot-toast";
import { Colors } from "../color-scheme/colors";
import { FormInput, Star } from "lucide-react";
import Navbar from "./Navbar";
import { io, Socket } from "socket.io-client";
const NonPersistentChats = () => {
  interface Messages {
    id: number;
    user: string;
    message: string;
    time: string;
  }

  type Scheme =
    | "NeonMirage"
    | "CandyPop"
    | "BubbleHeatGum"
    | "ElectricSunset"
    | "PixelRush";

  const [Message, setMessages] = useState<Messages[]>([]);
  const { theme } = useTheme();
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [colorScheme, setColorScheme] = useState<Scheme>("NeonMirage");
  const [message, setMessage] = useState("");
  const [userId, setUser] = useState("");
  const [modal, setModal] = useState(true);
  const [roomId, setRoomId] = useState("");
  const [peerId, setPeerId] = useState("");

  const socket=useMemo(()=>io('http://localhost:5000'),[])

  const options = [
    "NeonMirage",
    "CandyPop",
    "BubblegumHeat",
    "ElectricSunset",
    "PixelRush",
    "default",
  ];
  //Non Persistent Chat
  
  const sendMessage = () => {
      if (message.trim() !== "") {
        socket.emit("newMessage", {
          senderId: userId,
          receiverId: peerId,
          message,
        });
      }
      setMessage("");
    };
    
    const handleSubmission = () => {
      if(!userId || !peerId){
      }
      socket.emit("join-room", { senderId: userId });
      setModal(false);
    };
    
    useEffect(() => {
 
     socket.on("connect", () => {
      console.log(`Connected to the server ${socket.id}`);
    });

    socket.on("handleMessage", ({ senderId, message }) => {
      console.log(`Client ${senderId}: ${message}`)
      setMessages((prev) => [
        ...prev,
        {
          id:122,
          time: new Date().toLocaleTimeString(),
          user: senderId,
          message: message,
        },
      ]);
      console.log(Message)
    });
    socket.on('general',(msg)=>toast.error(msg))
    socket.on('error-message',(msg)=>toast.error(msg))
    socket.on('disconnect',()=>{
      console.log(`${userId} leave the chat`)
    })
    return () => {
      socket.off('connect')
      socket.off('handleMessage')
      socket.off('general')
      socket.off('disconnect')
      socket.disconnect()
    };
  }, []);
  
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div
        style={{
          backgroundColor: theme === "dark" ? Colors[colorScheme].bg : "beige",
        }}
        className={`${
          theme === "dark" ? " text-white" : " "
        } py-18 px-5 w-screen h-screen overflow-y-hidden font-helviLight`}
      >
        <div
          className={`z-99 absolute ${
            theme === "dark" ? "bg-zinc-950/90" : "bg-amber-100/90"
          }  ${
            modal ? "" : "hidden"
          } left-[50%] -translate-x-1/2 px-8 py-8 rounded-md gap-4 flex flex-col`}
        >
          <div className="flex flex-col gap-1">
            <label>Name</label>
            <input
              placeholder="Enter you name"
              onChange={(e) => setUser(e.target.value)}
              value={userId}
              className="px-3 w-fit rounded-md py-1 border"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label>Peer Id</label>
            <input
              placeholder="Enter peer Id"
              onChange={(e) => setPeerId(e.target.value)}
              value={peerId}
              className="px-3 w-fit rounded-md py-1 border"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 rounded-sm py-1 hover:bg-blue-600"
            onClick={() => handleSubmission()}
          >
            Submit
          </button>
        </div>

        <div
          className="flex justify-center relative items-center cursor-pointer"
          onClick={() => setOptionsOpen((prev) => !prev)}
        >
          <h2 className="text-xl text-center font-semibold hover:text-blue-300">
            Chats ColorScheme
          </h2>
          <Star fill="pink" size={15} />
          {optionsOpen && (
            <div className="flex flex-col absolute top-8 backdrop-blur-[3px] border rounded-b-2xl px-4 py-2">
              {options.map((i: string, ind: number) => {
                return (
                  <button
                    key={ind}
                    className="hover:text-blue-500 "
                    onClick={() => setColorScheme(i)}
                  >
                    {i}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <div className="flex flex-col  py-5 overflow-auto scroll-hidden  h-full">
          {Message.map((i, ind) => {
            return (
              <div
                key={ind}
                className={`w-full  mt-15 flex px-2 ${
                  i.user === userId ? "flex-row " : "flex-row-reverse "
                }`}
              >
                <div className="border  px-4 py-2 rounded-xl md:max-w-[20vw]  w-[45vw]   relative ">
                  <div>
                    <h2
                      style={{
                        backgroundColor:
                          i.user === userId
                            ? Colors[colorScheme].primary
                            : Colors[colorScheme].secondary,
                      }}
                      className={`absolute text-white px-2 rounded-md -top-6 text-sm ${
                        i.user !== userId ? "right-0" : "left-0"
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
          <div className="flex ml-3  mt-10  flex-col gap-2">
            <input
              placeholder="Enter Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={`w-fit py-1  px-2 border rounded-md font-helviLight text-zinc-500`}
            />
            <button
              type="submit" onClick={sendMessage}
              className="w-fit bg-blue-500 text-white rounded-md py-1 hover:bg-blue-600 px-2"
            >
              Submit Message
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default NonPersistentChats;
