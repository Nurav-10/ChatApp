import { useAuth } from "../Context/AuthContext";
import { useState, useEffect } from "react";
import "../index.css";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, MessageCircle, Sparkles, Zap } from "lucide-react";
import toast from "react-hot-toast";

const SignUp = () => {
  const navigate = useNavigate();
  const { SignUp, user, isAuthenticated } = useAuth();
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
  const res=await SignUp(email,name,password)
  if(res.success)
  {
    toast.success('User Registered successfully')
    navigate('/sign-in')
    
  }
  else{
    toast.error('User cannot be registered')
  }
}

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br bg-black to-cyan-300/40 font-helviLight">
      {/* Animated background elements */}

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row gap-20 items-center min-h-screen justify-around p-4">
        <div className="w-fit  gap-8 items-center">
          {/* Left side - Hero content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
                <div className="relative">
                  <MessageCircle className="w-12 h-12 text-white" />
                  <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
                </div>
                <h1 className="text-4xl font-bold text-white">Chatify</h1>
              </div>

              <h2 className="text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-orange-400/90 to-indigo-500/80 animate-gradient">
                Welcome Back!
              </h2>

              <p className="text-xl tracking-tight text-gray-300 max-w-md mx-auto lg:mx-0">
                Join millions of users in the most exciting chat experience.
                Connect, share, and explore like never before.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
              <div className="text-center p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
                <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-sm text-white font-medium">Lightning Fast</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
                <MessageCircle className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-sm text-white font-medium">Real-time Chat</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
                <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-sm text-white font-medium">AI Powered</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Sign in form */}
        <div className="w-100">
          <div className="w-full max-w-md bg-gradient-to-tr from-cyan-300/10 to-black/10 rounded-2xl backdrop-blur-md border-white/20 shadow-2xl px-5 py-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white">Sign Up</h2>
              <div className="text-zinc-400 mb-2 text-sm">
                Enter your credentials to access your account
              </div>
            </div>

            <div className="">
              <div className="space-y-4 px-3">
                <div className="flex flex-col gap-1 ">
                  <label className="text-white font-medium">Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border px-3 py-1 rounded-md text-white"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1 ">
                  <label className="text-white font-medium">Email</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border px-3 py-1 rounded-md text-white"
                    required
                  />
                </div>

                <div className="space-y-2 ">
                  <label htmlFor="password" className="text-white font-medium">
                    Password
                  </label>
                  <div className="flex flex-col relative gap-2">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border px-3 py-1 rounded-md  text-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center space-x-2 text-gray-300">
                    <input
                      type="checkbox"
                      className="rounded border-white/30 bg-white/20"
                    />
                    <span>Remember me</span>
                  </label>
                  <Link
                    to="#"
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  //   disabled={isPending}
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-103 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  SignUp
                </button>
              </div>

              <div className=" mt-5">
                <div className=" inset-0 flex items-center">
                  <div className="w-full border-t border-white/30"></div>
                </div>
                <div className="mt-3 flex justify-center text-sm">
                  <span className="px-2 bg-transparent text-gray-300">
                    Or continue with
                  </span>
                </div>
              </div>

              <p className="text-center text-sm text-gray-300">
                {"Don't have an account? "}
                <Link
                  to="/sign-in"
                  className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
