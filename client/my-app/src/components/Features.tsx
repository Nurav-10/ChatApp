import { useTheme } from "../Context/ThemeProvider";
import { BookHeart,Users,Key,Cherry } from "lucide-react";
const Features = () => {
  const { theme } = useTheme();
  const feature=[
   {
      icons:<BookHeart/>,
      title:'Private Chats',
      content1:'Engage in secure, one-on-one conversations with other users through private chat rooms.',
      content2:'Messages are visible only to participants, keeping your discussions confidential.',
      color:'text-pink-400',
      bg:'bg-gradient-to-tr from-cyan-300/10 to-purple-800/10',
      color2:'pink'
   },
      {
      icons:<Users/>,
      title:'Room Chats',
      content1:'Create or join topic-based public rooms to collaborate in groups.',
      content2:'Easily switch between rooms for organized, real-time discussions.',
      color:'text-blue-400',
      bg:'bg-gradient-to-tl from-cyan-300/10 to-pink-blue-500/10',
      color2:'lightblue'


   },
      {
      icons:<Key/>,
      title:'Security',
      content1:'All messages are transmitted securely using WebSocket protocols.',
      content2:'Optional end-to-end encryption, role-based access, and anti-spam measures ensure a safe environment.',
      color:'text-orange-600',
      bg:'bg-gradient-to-tr from-red-900/10 to-black/20',
      color2:'orange'

   },
      {
      icons:<Cherry/>,
      title:'Seamless UI',
      content1:'Sleek, responsive interface with real-time message flow, theme toggling, and user presence indicators.',
      content2:'Optimized for desktop and mobile, providing a seamless chatting experience.',
      color:'text-red-500',
      bg:'bg-gradient-to-tr from-red-300/30 to-blue-200/10',
      color2:'red'

   }
  ]
  return (
    <div
      className={`${
        theme === "dark" ? " bg-zinc-900  text-white" : "text-zinc-950"
      } w-screen min-h-screen text-white font-helviLight tracking-wide py-6 px-10`}
    >
      <h2 className="text-4xl text-center font-helviRoman">Features</h2>
      <div className="grid grid-cols-1 xl:grid-cols-4  place-items-center gap-8 justify-center mt-10 md:grid-cols-2">
         {
            feature.map((i,index)=>{
               return(
                  <div style={{borderColor:i.color2}} className={`flex flex-col items-center px-5 py-3 border-[1px] rounded-md w-[60vw] h-[40vh] md:w-[40vw] md:h-[30vh] xl:w-[20vw] xl:h-[35vh] gap-2 hover:scale-103 transition-all ${i.bg} ease-linear duration-200`} key={index}>
                     <div className={i.color}>{i.icons}</div>
                     <h2 className="font-helviRoman">{i.title}</h2>
                     <li className="text-sm text-center list-none mb-2">{i.content1}</li>
                     <li className="text-sm text-center  list-none">{i.content2}</li>
                  </div>
               )
            })
         }
         </div>
      </div>
  );
};

export default Features;
// book-heart users Key cherry