
import { Link } from 'react-router'
import '../index.css'
const NotFound = () => {
   
  return (
    <div className='flex flex-col justify-center items-center w-screen h-screen gap-2 bg-zinc-900 text-white'>
      <h2 className='text-5xl font-semibold font-helviLight tracking-tight'>Page Not Found</h2>
      <Link className='text-lg hover:text-blue-500  rounded-md px-3 ' to='/'>Click to redirect at home page</Link>
      </div>
  )
}

export default NotFound