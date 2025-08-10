"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "../Context/ThemeProvider";
import toast from "react-hot-toast";
import { motion } from "motion/react";
import { Crown, Send, Trash } from "lucide-react";
import { io } from "socket.io-client";
import formatTime from "../helper/TimeFormat";
import { useNavigate } from "react-router";

interface Message {
  name: string;
  message: string;
  roomId: string;
  time: string;
  admin?: string;
}

interface UserList {
  name: string;
  admin: boolean;
  socketId:string
}

const GroupChat = () => {
  const { theme } = useTheme();
  const navigate=useNavigate()
  const [collapse, setCollapse] = useState(true);
  const [roomCreate, setRoomCreate] = useState(false);
  const [name, setName] = useState("");
  const [admin, setAdmin] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [message, setMessage] = useState("");
  const [Messages, setMessages] = useState<Message[]>([]);
  const [userList, setUserList] = useState<UserList[]>([]);
  const ChatContainerRef = useRef<HTMLDivElement>(null);
  const [joined, setJoined] = useState(true);
  const socket = useMemo(
    () => io("http://localhost:5000", { transports: ["websocket"] }),
    []
  );

  const createRoom = () => {
    setCollapse(false);
    setRoomCreate(true);
  };

  const joinRoom = () => {
    setCollapse(false);
  };
  const sendMessageEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  useEffect(() => {
    if (ChatContainerRef.current) {
      ChatContainerRef.current.scrollTop =
        ChatContainerRef.current.scrollHeight;
    }
  }, [Messages]);

  const sendMessage = () => {
    if (!message) {
      toast.error("bhai msg to dal le");
      return;
    }

    const newMessage = {
      message: message,
      time: new Date().toUTCString(),
      roomId: roomId,
      admin: roomCreate,
    };

    socket.emit("new-message", {
      name: name,
      message: newMessage,
    });
    setMessage("");
  };

  const setInfo = () => {
    if (!name || !roomId) {
      toast.error("Bhai phele info to bhar le");
      return;
    }

    if (roomCreate) setAdmin(true);
    setCollapse(true);
    console.log(name, roomId);
    setJoined(false);

    //Admin Join
    roomCreate && socket.emit("join-admin", { name, roomId });

    // Normal User join
    !roomCreate && socket.emit("join-private", { name, roomId });
  };

  const kickOutUser=(socketId:string,name:string)=>{
    socket.emit('kick-user',({socketId,roomId,admin,name}))
  }

  useEffect(() => {
    socket.on("welcome", ({ msg }) => {
      toast.success(msg);
    });

    socket.on("end", ({ msg }) => {
      toast.success(msg);
    });
    socket.on("online", ({ privateUserList }) => {
      // console.log(privateUserList);
      setUserList(privateUserList);
    });

    socket.on("removed",({msg})=>{
      toast.error(msg)
      navigate('/')
      return
    })
    return () => {
      socket.off("end");
      socket.off("online");
      socket.off('removed');
      socket.off("welcome");
    };
  }, [userList]);

  console.log(admin);
  useEffect(() => {
    socket.on("receiveMessage", ({ name, message }) => {
      console.log(name, message);
      setMessages((prev) => [
        ...prev,
        {
          name: name,
          roomId: message.roomId,
          message: message.message,
          time: message.time,
          admin: message.admin,
        },
      ]);
    });

    socket.on("error", ({ msg }) => {
      setCollapse(false);
      setRoomCreate(false);
      toast.error(msg);
      return;
    });

    socket.on("error-message", ({ msg }) => {
      setCollapse(false);
      toast.error(msg);
    });
    return () => {
      socket.off("online");
      socket.off("receiveMessage");
      socket.off("error-message");
      socket.off("error");
      socket.disconnect();
    };
  }, []);

  console.log(userList);
  return (
    <div
      className={`h-screen w-full ${
        theme === "dark" ? "bg-zinc-950 text-white" : "bg-white text-zinc-900"
      } text-white  py-20 px-5`}
    >
      <div
        className={`absolute z-99 ${
          collapse
            ? "-translate-x-500 rotate-90 transition-all duration-500"
            : ""
        } top-[20%] left-[50%] -translate-x-1/2 border rounded-md p-5 flex flex-col gap-3`}
      >
        {/* Information Form for Joining room. */}
        <h2 className="text-center font-helviLight text-xl  font-semibold text-shadow-md text-shadow-pink-400/10">
          {roomCreate ? "Create Room" : "Join Room"}
        </h2>
        <div className="flex flex-col gap-1">
          <label>Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Dominator69"
            className="border-blue-300 text-zinc-500 border rounded-md px-2 py-1"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label>Room Id</label>
          <input
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Aaja meri gadi me beth ja"
            className={`border-blue-300 border rounded-md px-2 py-1 text-zinc-500`}
          />
        </div>
        <button
          type="submit"
          onClick={setInfo}
          className={`${
            theme === "dark" ? "bg-white text-black" : "bg-black text-white"
          } font-semibold rounded-md py-1 mt-2 hover:shadow-md hover:shadow-blue-400/80`}
        >
          Submit
        </button>
      </div>

      {/* Choices create room or join room */}

      <div className="choices z-9 absolute flex gap-5 top-[30%] left-[50%] text-black -translate-x-1/2">
        <div
          onClick={() => joinRoom()}
          className={`join-room ${
            !collapse || !joined ? "-translate-x-300" : "translate-0"
          }  flex flex-col items-center w-38 cursor-pointer h-20 bg-pink-300 hover:shadow-[2px_2px_1px_rgba(0,0,0,0.8)] transition-all duration-200 hover:border ease-in  rounded-tl-xl rounded-tr-xl rounded-br-xl px-2 py-1 mt-20`}
        >
          <h2 className="font-helviRoman font-semibold text-sm hover:underline underline-offset-2">
            Join Room
          </h2>
          <p className="text-sm  font-helviLight text-center mt-1">
            Join Room with roomId and username
          </p>
        </div>
        <div
          onClick={() => createRoom()}
          className={`create-room ${
            !collapse || !joined ? "-translate-x-300" : "translate-0"
          } flex items-center flex-col cursor-pointer px-2 py-1 create-room w-35 h-20 bg-blue-300 rounded-tl-xl rounded-bl-xl rounded-br-xl hover:shadow-[2px_2px_1px_rgba(0,0,0,0.8)] transition-all duration-200 hover:border`}
        >
          <h2 className="font-helviRoman font-semibold text-sm hover:underline underline-offset-2">
            Create Room
          </h2>
          <p className="text-sm  font-helviLight text-center mt-1">
            The unique ID or code of the room.
          </p>
        </div>
      </div>

      <div className="w-full h-[80vh] border rounded-md overflow-hidden relative">
        <img
          src="./chatbg.jpeg"
          alt="bg-chat"
          className="absolute object-cover w-full h-full opacity-8"
        />
        <h2 className="pl-3 text-xl text-emerald-400 md:text-center font-semibold mt-1 flex flex-col ">
          Chatter Box
          <span className="text-pink-400 underline decoration-dotted underline-offset-2 text-sm">
            RoomNo {roomId}
          </span>
        </h2>
        <div
          ref={ChatContainerRef}
          className="px-2 pt-10 pb-20 overflow-y-auto scroll-hidden  absolute w-full  flex flex-col gap-15 h-full "
        >
          {Messages &&
            Messages?.map((i, ind) => {
              return (
                <div
                  key={ind}
                  className={`flex ${
                    i.name === name ? "flex-row" : "flex-row-reverse"
                  } `}
                >
                  <div
                    className={`relative border shadow-[2px_2px_1px_rgba(0,0,0,0.5)] ${
                      i.name === name ? "bg-green-300/10" : "bg-blue-400/10"
                    } rounded-md text-md  md:max-w-[40vw] max-w-[45vw] sm:w-[30vw] w-[45vw] px-2 py-1 backdrop-blur-[2px]`}
                  >
                    <h2
                      className={`absolute flex items-center gap-0.5 text-white -top-6 ${
                        i.name === name
                          ? "left-1 bg-pink-500/80"
                          : "right-0 bg-amber-400/80"
                      } text-sm font-semibold px-3 rounded-md`}
                    >
                      {i.name}{" "}
                      {i.admin && (
                        <span>
                          <Crown size={16} fill="red" />
                        </span>
                      )}
                    </h2>
                    <h2 className="break-words whitespace-pre-wrap">
                      {i.message}
                    </h2>

                    <h2
                      className={`absolute -bottom-5 ${
                        i.name === name ? "right-1" : "left-1"
                      } text-sm`}
                    >
                      {formatTime(i.time)}
                    </h2>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      <div className="absolute flex items-center bottom-3 left-[50%] -translate-x-1/2 border ">
        <input
          disabled={joined}
          onKeyDown={sendMessageEnter}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border border-zinc-400 px-2 py-1"
          placeholder="Enter message here"
        />
        <div className="px-1">
          <Send
            onClick={sendMessage}
            className="hover:text-blue-400 transition-all duration-200"
            size={22}
          />
        </div>
      </div>
      <motion.div
        initial={{ maxHeight: "5vh" }}
        whileHover={{ maxHeight: "40vh" }}
        className="flex  absolute cursor-pointer bg-blue-400/50 top-20 right-5 text-lg font-semibold items-center border w-fit px-2  rounded-bl-md rounded-tr-md  flex-col overflow-hidden pb-1"
      >
        <p className="flex items-center gap-1 mt-0.5 text-md md:text-md">
          Online User<h2 className="w-2 h-2 bg-green-400 rounded-full"></h2>
        </p>
        <div className="flex flex-col ">
          {userList &&
            userList?.map((i, ind) => {
              return (
                <div className="flex gap-1 flex-row  items-center" key={ind}>
                  <h2 className="flex items-center gap-0.5">
                    {i.name}{" "}
                    {i.admin && (
                      <span className="mt-0.5">
                        <Crown className="fill-red-400" size={16} />
                      </span>
                    )}
                    {admin && !i.admin && (
                      <span className="mt-0.5">
                        <Trash size={16} onClick={()=>kickOutUser(i.socketId,i.name)}/>
                      </span>
                    )}
                  </h2>
                </div>
              );
            })}
        </div>
      </motion.div>
    </div>
  );
};

export default GroupChat;
