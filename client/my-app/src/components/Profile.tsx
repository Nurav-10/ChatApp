import  { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router";
import ImageUpload from "./ImageUpload";
import { ArrowLeft, Home, MessageCircleMore } from "lucide-react";
import { useTheme } from "../Context/ThemeProvider";

const paths=[
  {
    name:'Home',
    path:'/',
    logo:<Home size={20}/>,
    hoverColor:'bg-blue-400'
  },
  {
    name:'Chats',
    path:'/chat',
    logo:<MessageCircleMore size={20}/>,
    hoverColor:'bg-yellow-300'
  },

]
const Profile = () => {
  const {theme}=useTheme()
  const { getUser } = useAuth();
  const [user, setUser] = useState(null);
  const [extend,setExtend]=useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    const u = getUser();
    if (!u!) navigate("/sign-in");
    setUser(u!);
  }, []);

  if (!user) <h2 className="text-2xl p-2 text-zinc-600">Loading..</h2>;
  return (
    <div className={`${theme==='dark'?'bg-zinc-900 text-white':''} flex flex-col gap-2 w-screen px-20 h-screen py-15`}>
      <div className={`h-[94.2vh] transition-all duration-200 ${extend?'w-32':'w-18'} fixed flex justify-between py-15 flex-col  left-0 top-20 bg-yellow-50/90 text-black border rounded-tr-2xl`}>
      <div className="absolute top-2 left-[50%] hover:bg-amber-100 -translate-x-1/2 border rounded-full" onClick={()=>setExtend(prev=>!prev)}><ArrowLeft className={`${extend?'rotate-0':'rotate-180'} transition-all`}/></div>
        <div className="flex flex-col gap-4 px-2">
          {
            paths.map((i,ind)=>{
              return(
                <div key={ind} className={`flex rounded-md items-center gap-1 border px-2 py-1 hover:${i.hoverColor} cursor-pointer justify-center`} onClick={()=>navigate(i.path)}>
                  <div>{i.logo}</div>
                  <h2 className={`text-xl font-helviRoman ${extend?'':'hidden'}`}>{i.name}</h2>
                  </div>
              )
            })
          }
        </div>
        <h2 className="text-2xl -rotate-90 font-medium font-helviRoman mb-10">Navigation</h2>
      </div>
      <h2 className="font-helviLight text-2xl  bg-emerald-300 mt-0.5 w-fit rounded-md px-3 font-medium">Profile Page</h2>
      <div className="flex flex-row">
        <div className="w-[100vw] aspect-auto sm:w-[50vw] md:w-[40vw] lg:w-[25vw]">
          <ImageUpload user={user} />
        </div>
        <div className="w-0 sm:w-[55vw] md:w-[65vw] lg:w-[80vw]">

        </div>
      </div>
      <div className="mt-3 border-t w-screen border-l rounded-tl-md top-[52%] h-full fixed px-3 py-2 overflow-y-auto">
        <h2 className="text-xl font-medium underline underline-offset-2">Recent Chats</h2>
      </div>
    </div>
  );
};

export default Profile;
