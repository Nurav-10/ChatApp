import { User } from 'lucide-react';
import React, { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../Context/AuthContext';
import { useTheme } from '../Context/ThemeProvider';

const ImageUpload = ({user}:{user:any}) => {
  const {theme}=useTheme()
  const {setUser}=useAuth()
  const [imageUrl, setImageUrl] = useState('');
  const [preview,setPreview]=useState('')
  const [file,setFile]=useState<File|null>(null)
  const [loading, setLoading] = useState(false);
  const inputRef=useRef<HTMLInputElement>(null)


  const handleFileChange=()=>{
    inputRef.current?.click()
  }

  const handlePreview=(e:React.ChangeEvent<HTMLInputElement>)=>{
     const selected = e.target.files?.[0];
    if (!selected)  return;

    const previewUrl=URL.createObjectURL(selected)
    setPreview(previewUrl)
    setFile(selected)
  }
  const handleUpload = async () => {
    if(!file) 
      {
        toast.error('No File Selected')
        return;
      }
    try {
      setLoading(true);
      const sigRes = await fetch('http://localhost:5000/api/uploadImage/generate-signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const { timestamp, signature, apiKey, cloudName, folder } = await sigRes.json();
  
      const formData = new FormData();
      formData.append('file',file);
      formData.append('api_key', apiKey);
      formData.append('timestamp', timestamp.toString());
      formData.append('signature', signature);
      formData.append('folder', folder);

      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData
      });

      const data = await uploadRes.json();
      setImageUrl(data.secure_url);

      //upload image to db.
      const response=await fetch(`http://localhost:5000/api/uploadImage/db`,{
        method:'PATCH',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({id:user.id,profilePic:data.secure_url})
      })
      const res=await response.json()
      if(res.success){
        toast.success(res.message)
        setUser(res.data)
      }
      else
        toast.error(res.message)

    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${theme==='dark' && 'text-white'} border-2 rounded-sm shadow-[4px_4px_1px_rgba(0,0,0,0.8)] flex flex-col items-center py-2`}>
      <div className='flex-col flex items-center px-3'>
      <img className='w-25 h-25 rounded-full object-cover' src={user?.profilePicture || preview || './my2.jpg'} alt='profile'/>
      <div className='p-1 sticky -right-9 z-99 -top-8 rounded-full my-2 border flex gap-1 items-center  hover:text-blue-400' ref={inputRef} onClick={handleFileChange}>
        <User size={18}/>
      </div>
      <input type="file" onChange={handlePreview} ref={inputRef} className='hidden'/>
      <h2 className='text-xl font-medium font-helviRoman text-center'>Name : {user?.name}</h2>
      <h2 className='text-xl font-medium font-helviRoman text-center'>Email : {user?.email}</h2>
      <button type='submit' disabled={loading} className='px-2 py-1 rounded-md hover:bg-blue-400 border' onClick={handleUpload}>{loading?'Uploading':'Upload'}</button>
      </div>
    </div>
  );
};

export default ImageUpload;
