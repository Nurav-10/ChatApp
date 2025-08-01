import { useEffect, useState } from "react";
import { useTheme } from "../Context/ThemeProvider";
import Chat1 from "../assets/Chat1.svg";
import Chat2 from "../assets/Chat2.svg";
import { motion } from "motion/react";
import Features from "./Features";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router";

interface User {
  id: string;
  name: string;
  profilePicture: String;
  email: string;
}
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
      <div
        className={`${
          theme === "dark" ? " bg-zinc-900  text-white" : "text-zinc-900"
        } w-screen min-h-screen text-white font-helviRoman py-20 pr-4`}
      >
        <div className="mt-16 px-3">
          <h2
            className={`text-5xl md:text-6xl xl:text-7xl font-helviLight text-center font-semibold tracking-tight bg-gradient-to-bl ${
              theme === "dark"
                ? "from-cyan-200 to-pink-200"
                : "from-blue-400/90 to-emerald-200"
            } text-transparent bg-clip-text`}
          >
            Dive into real-time conversations
            <br />
            With friends, teams, and communities.
          </h2>
        </div>
        <motion.div className="flex relative justify-center">
          <motion.div className="mt-10  flex flex-row  z-0 justify-center ">
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
                  className="absolute p-0.5 rounded-xl opacity-100 sm:w-[60vw] md:w-[40vw] w-[85vw]"
                  src={Images[index].src}
                  alt="ChatImages"
                />
              );
            })}
          </motion.div>
        </motion.div>
      </div>
      <section id="features">
        <Features />
      </section>
    </>
  );
};

export default LandingPage;
