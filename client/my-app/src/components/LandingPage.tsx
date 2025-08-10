import { useEffect, useState } from "react";
import { useTheme } from "../Context/ThemeProvider";
import Chat1 from "../assets/Chat1.svg";
import Chat2 from "../assets/Chat2.svg";
import { motion } from "motion/react";
import Features from "./Features";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router";
import DemoSection from "./demo-section";
import About from "./about";


interface User {
  id: string;
  name: string;
  profilePicture: String;
  email: string;
}

const sliderImages=[
  {
    id:1,
    href:'./chatuser1.png'
  },
  {
    id:2,
    href:'./chatuser2.png'
  },
  {
    id:3,
    href:'./chatuser3.png'
  },
  {
    id:4,
    href:'./chatuser4.png'
  },
  {
    id:5,
    href:'./chatuser5.png'
  },
  {
    id:6,
    href:'./chatuser6.png'
  }
]
const LandingPage = ({
  isCaraousel,
  time,
}: {
  isCaraousel: boolean;
  time: number;
}) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [index, setIndex] = useState(0);
  const { getUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const colors = ["#FFFBDE", "#FFB4B4", "#E14434", "#91C8E4"];
  
  useEffect(() => {
    const u = getUser();
    if(!u!) navigate('/sign-in')
      else{
      setUser(u!)
      console.log(u)
      }
    if (isCaraousel) {
      const timer = setInterval(() => {
        setIndex((prev) => (prev < Images.length - 1 ? prev + 1 : 0));
      }, time);

      return () => clearInterval(timer);
    }
  }, []);
  const Images = [
    {
      id: 0,
      src: Chat1,
    },
    {
      id: 1,
      src: Chat2,
    },
  ];
  return (
    <>
    <div className={`${
          theme === "dark" ? " bg-zinc-950  text-white" : "bg-amber-50 text-zinc-900"
        } flex overflow-y-hidden h-[85vh] md:h-full  text-white font-helviRoman pb-5 `}>
      <div
        className={`${
          theme === "dark" ? " bg-gradient-to-bl from-pink-500/90 to-red-700  text-white" : "bg-gradient-to-bl from-zinc-900/100 to-cyan-400/90 text-zinc-900"
        } w-[70vw]  lg:w-[80vw]  mt-20  rounded-2xl 
         text-white font-helviRoman py-10 ml-5 md:ml-15`}
      >
        
        <div className="px-3">
          <h2
            className={`text-4xl md:text-6xl xl:text-7xl font-helviLight  font-semibold tracking-tight bg-gradient-to-bl ${
              theme === "dark"
                ? "from-cyan-200 to-pink-200"
                : "from-blue-400/90 to-pink-200"
            } text-transparent bg-clip-text ml-2 sm:ml-6`}
          >
            Dive into real-time conversations
            <br />
            With friends, teams, and communities.
          </h2>
        </div>
        <motion.div className="flex relative bg-slate-600">
          <motion.div className="mt-10 absolute left-0 w-full bg-pink-700 flex flex-row  z-0 ml-4 sm:ml-9 ">
            {Images.map((_, ind) => {
              return (
                <motion.img
                  animate={{
                    backgroundColor: colors,
                  }}
                  // transition={
                  //   {
                  //     duration: 10,
                  //     repeat: Infinity,
                  //     repeatType: "loop",
                  //   }
                  // }
                  key={ind}
                  className="absolute p-0.5 rounded-xl opacity-100 shadow-xl shadow-emerald-500/25 sm:w-[55vw] md:w-[42vw] w-[52vw]"
                  src={Images[index].src}
                  alt="ChatImages"
                />
              );
            })}
          </motion.div>
        </motion.div>
      </div>
      <motion.div
      animate={{
        y:['-200%','100%'],
        transition:{
          duration:15,
          ease:'linear',
          repeat:Infinity,
          repeatType:'loop'
        }
      }}
      className={`w-[30vw] lg:w-[20vw] h-screen flex flex-col justify-between py-1 md:gap-30 gap-15 items-center mt-20   ${theme==='dark'?'bg-zinc-950':'bg-amber-50'}`}>

        {sliderImages.map((i)=>{
          return(
            <div key={i.id} className="border rounded-md">
              <img src={i.href} alt='slider-image' className="w-20 h-20 sm:w-30 sm:h-30 lg:w-40 lg:h-40 object-cover rounded-md"/>
            </div>
          )
        })}
      </motion.div>
      </div>
      <section className="" id="features">
        <Features />
      </section>
      <section className="">
        <DemoSection/>
      </section>
      <section className="">
        <About/>
      </section>
    </>
  );
};

export default LandingPage;
