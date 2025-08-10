import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "../Context/ThemeProvider";
import { ArrowLeft, Heart, Send, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../Context/AuthContext";
import { io } from "socket.io-client";
import formatTime from "../helper/TimeFormat";

interface User {
  profilePicture: string;
  username: string;
  _id: string;
}

interface Message {
  senderId: string;
  receiverId: string;
  profilePicture?: string;
  createdAt?: string;
  message: string;
  _id?: string;
  updatedAt?: string;
  time: string;
}

const PrivateChats = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState<any>();
  const [peerUser, setPeerUser] = useState<any>();
  const [chats, setChats] = useState<Message[]>([]);
  const [extend, setExtend] = useState(true);
  const [userList, setUsersList] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [onlineUser, setOnlineUser] = useState<string[]>([]);
  const { getUser } = useAuth();
  const messageEndRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();

  const socket = useMemo(
    () =>
      io("http://localhost:5000", {
        transports: ["websocket"],
      }),
    []
  );

  useEffect(() => {
    const u = getUser();
    if (u !== null) {
      setUser(u);
      // as soon as user connects it emit register.
    }
  }, []);
  useEffect(() => {
    if (user?.id && socket) {
      fetchUserList();
      socket.emit("register", user.id);

      const handleOnline = (onlineList: any) => {
        const flattened = Object.values(onlineList).flat();
        setOnlineUser(flattened);
        console.log("Updated Online List:", flattened); // Log updated list
      };

      socket.on("online", handleOnline);

      return () => {
        socket.off("online", handleOnline); // Cleanup specific handler
      };
    }
  }, [user?.id, socket]);

  useEffect(() => {
    if (peerUser) {
      fetchUserChats();
    }
  }, [peerUser]);

  const sendMessageFromEnter = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    if (messageEndRef.current)
      messageEndRef.current.scrollTop = messageEndRef.current.scrollHeight;
  }, [chats]);

  const sendMessage = async () => {
    if (message === "") {
      toast.error("Message Cannot be Empty");
      return;
    }

    const newMessage = {
      senderId: user.id,
      receiverId: peerUser._id,
      message: message,
    };

    socket.emit("PersistentChats", {
      senderId: user.id,
      receiverId: peerUser._id,
      message: newMessage,
    });
    setChats((prev) => [
      ...prev,
      {
        ...newMessage,
        time: new Date().toUTCString(),
      },
    ]);
    setMessage("");
  };

  useEffect(() => {
    socket.on("receiverMessage", (msg) => {
      console.log(msg);
      setChats((prev) => [
        ...prev,
        {
          ...msg,
          time: new Date().toUTCString(),
        },
      ]);
    });

    return () => {
      socket.off("receiverMessage");
    };
  }, [socket]);

  const disconnection = () => {
    socket.disconnect();
  };
  const fetchUserChats = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/chats/getChats?senderId=${user?.id}&receiverId=${peerUser._id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      // console.log(user.id)
      const res = await response.json();
      if (res.success) {
        setChats(res.data);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  const fetchUserList = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/list/userList?userId=${user?.id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      // console.log(user.id)
      const res = await response.json();
      if (res.success) {
        setUsersList(res.data);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (id: String) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/chats/deleteMessage`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        }
      );
      const res = await response.json();
      console.log(res);
      toast.success("Message deleted successfully");
    } catch (error) {
      toast.error("Message Cannot be deleted");
      console.log(error);
    }
  };

  return (
    <div
      className={` ${
        theme === "dark" ? "bg-zinc-900 text-white" : "text-black"
      } w-screen h-screen`}
    >
      <div className="py-18 flex h-full">
        <div
          className={`user-list bg-black/5 h-[89.2vh]  overflow-auto scroll-hidden ${
            extend
              ? "xl:w-[15vw] sm:w-[35vw] md:w-[32vw] w-[50vw]"
              : "w-[17vw] md:w-[11vw] lg:w-[9vw] xl:w-[7vw]"
          } px-1 border-b rounded-tr-2xl flex items-center transition-all duration-300 flex-col py-2  border-t border-r gap-1 border-zinc-400}`}
        >
          <div className="flex items-center  justify-between gap-2 -z-0 px-2 ">
            <h2 className="text-xs font-helviRoman md:text-lg">Contacts</h2>
          </div>
          <div>
            <ArrowLeft
              size={15}
              className={`rounded-full  border ${
                extend ? "rotate-0" : "rotate-180"
              } transition-all duration-200`}
              onClick={() => setExtend((prev) => !prev)}
            />
          </div>
          {userList.map((i: User, ind) => {
            return (
              <div
                className={` h-fit  ${extend?'sm:w-45  w-40':'sm:w-20'} px-1 sm:px-3 border justify-center border-zinc-600  flex flex-row gap-2 cursor-pointer mt-2 rounded-4xl  ${
                  activeIndex === ind
                    ? "bg-gradient-to-bl from-blue-400/20 to-emerald-500/50 "
                    : ""
                }`}
                key={i._id}
                onClick={() => {
                  setPeerUser(i);
                  setActiveIndex(ind);
                }}
              >
                <div className="p-2  w-fit  gap-2 rounded-full flex text-sm relative ">
                  <img
                    src={i.profilePicture}
                    alt="profile"
                    className="object-cover w-10 rounded-full relative aspect-square border"
                  />
                  <div
                      className={`w-2 h-2 absolute left-2 top-2  sm:hidden ${
                        !extend && "hidden"
                      } rounded-full ${
                        onlineUser.includes(i._id)
                          ? "bg-emerald-400"
                          : "bg-red-400"
                      }`}
                    ></div>
                  <div className="flex justify-center gap-2">
                    <h2
                      className={`${
                        extend ? "" : "hidden"
                      } text-xs sm:text-md `}
                    >
                      {i.username}
                    </h2>
                    
                    {!extend && (
                      <div
                        className={`absolute top-0.5 right-0.5 w-2 h-2 ${
                          onlineUser.includes(i._id)
                            ? "bg-emerald-400"
                            : "bg-red-400"
                        } rounded-full`}
                      >
                        {extend && "online"}
                      </div>
                    )}
                    {extend && (
                      <h2
                        className={`py-0.5 h-fit w-fit top-1 hidden sm:flex sm:text-md text-xs font-semibold ${
                          onlineUser.includes(i._id)
                            ? "text-emerald-400 border px-2 rounded-xl bg-gradient-to-bl from-emerald-400/10 to-green-400/10 "
                            : "border-amber-400/70 bg-gradient-to-br from-amber-500/10 to-yellow-300/10 text-amber-500/80 border rounded-xl px-2"
                        }`}
                      >
                        {onlineUser.includes(i._id) ? "online" : "offline"}
                      </h2>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="px-3 w-full flex flex-col gap-2 relative">
          <h2 className="justify-center mx-auto font-helviRoman text-lg gap-1 flex items-center">
            Your Chats <Heart size={14} className="fill-red-400" />
          </h2>
          <div
            ref={messageEndRef}
            className="message   flex flex-col gap-12 py-10 h-full overflow-y-auto scroll-hidden px-1"
          >
            {chats.map((i: Message, ind) => {
              return (
                <div
                  key={ind}
                  className={`w-full flex ${
                    i.senderId === user.id ? "" : "flex-row-reverse"
                  }`}
                >
                  <div
                    key={ind}
                    className={`xl:max-w-[18vw] ${
                    i.senderId === user.id ?'bg-gradient-to-bl from-cyan-300/20 to-purple-400/20':' bg-gradient-to-tl from-pink-300/30 to-emerald-400/30 '}  border relative sm:px-4 p-2 w-[35vw] rounded-xl`}
                  >
                    <h2
                      className={`absolute  -top-5
                     ${
                       i?.senderId === user.id
                         ? "bg-emerald-400/80 left-0"
                         : "bg-blue-700/80 right-0"
                     }  rounded-md px-2 font-semibold text-white text-xs`}
                    >
                      {i?.senderId === user.id ? user.name : peerUser?.username}
                    </h2>
                    <h2 className="sm:text-md text-sm">{i.message}</h2>
                    <h2
                      className={`text-sm absolute -bottom-5 ${
                        i.senderId === user.id ? "right-1" : "left-1"
                      }`}
                    >
                      {formatTime(i.time)}
                    </h2>
                    <Trash
                      size={13}
                      onClick={() => deleteMessage(i._id)}
                      className={`hover:fill-red-400 absolute ${
                        i.senderId === user.id ? "right-17" : "left-17"
                      } hover:scale-115 -bottom-4`}
                    />
                  </div>
                </div>
              );
            })}
            <div className="px-3 w-[60vw] left-[50%] -translate-x-1/2 absolute -bottom-12 border py-2  rounded-md flex items-center justify-between gap-2">
              <input
                value={message}
                onKeyDown={sendMessageFromEnter}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter Message"
                className={`${
                  theme === "dark" ? "text-white" : "text-black"
                } w-full outline-none px-1 `}
              />
              <Send
                size={20}
                className="border hover:text-blue-500 rounded-sm px-1"
                onClick={sendMessage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivateChats;
