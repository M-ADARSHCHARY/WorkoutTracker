import React , {useState, useEffect} from 'react';
import {LogIn , LoaderCircle} from 'lucide-react'
import {Link , useNavigate} from 'react-router-dom'
import { useSelector,useDispatch } from 'react-redux';
import { userLogInThunk } from '../../store/user/userThunk';
import Navbar from '../../components/Navbar'
const LoginPage = () => {
  const {loading,isAuthenticated} = useSelector(state => state.userReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [formData,setFormData] = useState({
    username:"",
    password:"",
  })

  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate('/');
    }
  }, [isAuthenticated, loading]);

  const handleInputChanges = (e)=>{
       setFormData((prevData) => ({...prevData,[e.target.name]:e.target.value}));
  }

  const handleLogIn = async (e)=>{
     e.preventDefault()
     await dispatch(userLogInThunk(formData));
  }
  

  return (
    <>
    <Navbar/>
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Login to Your Account</h2>

        <form className="space-y-5" onSubmit={handleLogIn}>
          <div>
            <label htmlFor="Username" className="block mb-1 font-medium text-gray-700">Username</label>
            <input  onChange = {handleInputChanges}
              type="text"
              name="username"
              placeholder="eg:alice_22"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 font-medium text-gray-700">Password</label>
            <input onChange = {handleInputChanges}
              type="password"
              name="password"
              placeholder="********"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="w-full flex justify-center">
              <button type="submit" className="bg-blue-600 h-fit w-fit py-2 px-4 rounded-md flex items-center gap-2">login {!loading ? (<LogIn size={20}/>) :(<LoaderCircle className="animate-spin w-5 h-5" />)}</button>
          </div>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{' '}
          <Link to = "/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
     </>
  );
};

export default LoginPage;
