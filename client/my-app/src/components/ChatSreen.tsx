import { Component, useEffect, useState } from "react";
import { Colors } from "../color-scheme/colors";
import { useTheme } from "../Context/ThemeProvider";
import NonPersistentChats from "./NonPersistentChats";
import { useNavigate } from "react-router";



  type Scheme =
    | "NeonMirage"
    | "CandyPop"
    | "BubbleHeatGum"
    | "ElectricSunset"
    | "PixelRush";

const ChatSreen = () => {
  const navigate=useNavigate()

     const Modes = [
    {
      Component:'non-persistent-chats',
      title: "Non Persistent Chats",
      mainHeading: `“Chats that disappear after the session ends.”`,
      content: `
      **Definition:** Messages are not saved to any database or local storage.
      Use Case: Temporary support rooms, anonymous chats, live Q&A.
      Benefit: Enhances privacy, no message history.
      Example Feature: Auto-deletes on refresh or after logout.`,
    },
    {
      title: "Private Talks",
      Component:'private-chats',
      mainHeading: `“Secure, 1-on-1 encrypted conversations between users.”`,
      content: `
         Definition: Direct messages between two users in a unique private room.
         Use Case: Personal or confidential communication.
         Benefit: Private room IDs, only accessible by participants.
        Security Layer: You can add message encryption and identity verification.
        `,
    },
    {
      title: "Group Chats",
      Component:'group-chats',
      mainHeading: "“Multiple users collaborating in real-time.”",
      content: `
        Features to Include:
       User list with online status
       Admin/moderator roles
       Mentioning @username support
       Threaded replies or reactions
        `,
    },
  ];
  const {theme}=useTheme()
  const [colorScheme, setColorScheme] = useState<Scheme>("NeonMirage");
 const [modes, setModes] = useState("");

   const options = [
    "NeonMirage",
    "CandyPop",
    "BubblegumHeat",
    "ElectricSunset",
    "PixelRush",
    "default",
  ];
  return (
    <>
    <div
    style={{
        backgroundColor: theme === "dark" ? Colors[colorScheme].bg : "beige",
      }}
      className={`${
        theme === "dark" ? " text-white" : " "
      } py-10 px-5 overflow-y-hidden font-helviLight`}
    >
    {!modes && (
          <div className="flex gap-4  justify-around  h-screen">
            {Modes.map((i: any, index) => {
              return (
                <div key={index} onClick={()=>navigate(`/${i.Component}`)}  style={{backgroundColor:Colors[colorScheme].primary}}  className=" px-2 gap-1 rounded-sm rounded-br-2xl sm:h-[25vh] md:h-[16vh] h-[35vh] items-center flex flex-col  py-3 cursor-pointer bg-gradient-to-bl border from-cyan-300/40 to-slate-300/60 hover:scale-103 transition-all ease-linear duration-200 mt-20">
                  <h2 className="text-center font-semibold text-xl">{i.title}</h2>
                  <h2 className="text-center  mt-1">{i.mainHeading}</h2>
                </div>
              );
            })}
          </div>

        )}
        </div>
  </>
  )
}

export default ChatSreen
