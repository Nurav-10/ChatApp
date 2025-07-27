import { useAuth } from '../Context/AuthContext'
import { useState,useEffect } from 'react'
import '../index.css'
import { Link } from 'react-router'
import { Eye, EyeOff, MessageCircle, Sparkles, Zap } from 'lucide-react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router'


const Login = () => {
   const {Logout,SignIn,SignUp}=useAuth()
     const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate=useNavigate()

  const handleSubmit = async () => {
    const response=await SignIn(email,password)
    if(response.success)
    {
      toast.success(response.message)
      navigate('/')
    }
    else{
      toast.error(response.message)
    }
  }

  return (
    <div className="h-screen w-screen flex flex-row items-center justify-center bg-gradient-to-br bg-black to-cyan-300/40 font-helviLight">
      {/* Animated background elements */}
   

          {/* Right side - Sign in form */}
          <div className="flex justify-center ">
            <div className="w-full max-w-md bg-gradient-to-tr from-cyan-300/10 to-black/10 rounded-2xl backdrop-blur-md border-white/20 shadow-2xl px-5 py-8">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-white">Sign In</h2>
                <div className="text-gray-300">
                  Enter your credentials to access your account
                </div>
              </div>

              <div className="">
                <div className="space-y-4">
                  <div className="flex flex-col gap-1 ">
                    <label htmlFor="email" className="text-white font-medium">
                      Email
                    </label>
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

                  <div className="space-y-2">
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
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center space-x-2 text-gray-300">
                      <input type="checkbox" className="rounded border-white/30 bg-white/20" />
                      <span>Remember me</span>
                    </label>
                    <Link to="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                      Forgot password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                  SignIn
                  </button>
                </div>

                <div className=" mt-5">
                  <div className=" inset-0 flex items-center">
                    <div className="w-full border-t border-white/30"></div>
                  </div>
                  <div className="mt-3 flex justify-center text-sm">
                    <span className="px-2 bg-transparent text-gray-300">Or continue with</span>
                  </div>
                </div>


                <p className="text-center text-sm text-gray-300">
                  {"Don't have an account? "}
                  <Link to="/sign-up" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
 
  )
}

export default Login