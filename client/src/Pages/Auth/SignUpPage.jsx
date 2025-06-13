import React ,{useState,useEffect}from 'react'
import {useSelector,useDispatch} from 'react-redux';
import {useNavigate,Link} from 'react-router-dom'
import {userSignUpThunk} from '../../store/user/userThunk'
import Navbar from '../../components/Navbar';
const SignUpPage = () => {
  const {isAuthenticated,loading} = useSelector(state => state.userReducer)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData,setFormData] = useState({
    username:"",
    email:"",
    password:"",
  })

  const handleChange = (e) =>{
    setFormData((prev) => ({...prev,[e.target.name]:e.target.value}))
  } 

  useEffect(() => {
      if (isAuthenticated && !loading) {
        navigate('/');
      }
    }, [isAuthenticated, loading]);

    
  const handleSignUp = async (e) =>{
    e.preventDefault();// do not refresh
    const response = await dispatch(userSignUpThunk(formData));
  } 
  return (
    <>
    <Navbar/>
    <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg m-auto mt-10">
        <h2 className="text-2xl font-bold text-center text-gray-800">Create an Account</h2>
        <form className="mt-4" onSubmit = {handleSignUp}>
            <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" name="username" className="w-full mt-1 p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="Your Name" required onChange = {handleChange}/>
            </div>
            <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" name="email"className="w-full mt-1 p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="you@example.com" required onChange = {handleChange}/>
            </div>
            <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input type="password" name="password" className="w-full mt-1 p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="••••••••" required onChange = {handleChange}/>
            </div>
            <button type="submit" className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">Sign Up</button>
        </form>
        <p className="mt-3 text-center text-sm text-gray-600">Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Log in</Link></p>
    </div>
  </>
  )
}

export default SignUpPage
