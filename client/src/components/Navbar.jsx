import { useState } from "react";
import { Menu, X ,LogOut} from "lucide-react";
import {Link} from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import {userLogOutThunk} from '../store/user/userThunk'
import { Home, Settings } from 'lucide-react';

const Navbar = () =>{
  const [isOpen, setIsOpen] = useState(false);
  const {isAuthenticated} = useSelector(state => state.userReducer)
  const dispatch = useDispatch()
  const handleLogOut = (e) =>{
      e.preventDefault();
      dispatch(userLogOutThunk());
  }
  return (
    <nav className="bg-black border-b-[#fff] border-b-2 text-white px-4 py-4 shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo or brand */}
        <div className="text-2xl font-bold">WorkoutTracker</div>

        {/* Desktop menu */}
        {isAuthenticated && <div className="hidden md:flex gap-6">
          <Link to="/" className="hover:text-gray-300 transition flex items-center gap-1"> <Home size={22} className="cursor-pointer hover:text-blue-400" />Home</Link>
          <button  className="hover:text-gray-300 transition flex items-center gap-1"><Settings size={22} className="cursor-pointer hover:text-blue-400" />settings</button>
           <button onClick = {handleLogOut}className="bg-blue-500 hover:bg-blue-600 w-fit h-fit p-1 flex items-center gap-2 rounded-md">Logout <LogOut className="w-5 h-5" /></button>
        </div>}

        {/* Mobile menu button */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {(isOpen && isAuthenticated) && (
        <div className="md:hidden mt-2 space-y-4 px-4 flex flex-col items-center">
          <Link to="/" className="flex hover:text-gray-300  items-center gap-1"><Home size={22} className="cursor-pointer hover:text-blue-400" />Home</Link>
          <button  className="flex hover:text-gray-300 items-center"><Settings size={22} className="cursor-pointer hover:text-blue-400" />settings</button>
          <button onClick = {handleLogOut} className="bg-blue-500 w-fit h-fit p-1 rounded-md flex items-center "><LogOut className="w-5 h-5 mr-2" />Logout</button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
