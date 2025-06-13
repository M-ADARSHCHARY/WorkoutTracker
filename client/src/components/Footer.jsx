import { Menu, X } from "lucide-react";
import {Link} from 'react-router-dom'


const  Footer = ()=> {
  return (
    <footer className="bg-black border-t-[#fff] border-t-2 text-white px-2 py-6 h-[20vh] space-y-2 grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
       
          {/* Left - Brand or Logo */}
          <div className="text-lg font-semibold w-full flex items-center justify-center">WorkoutTracker © 2025</div>

          {/* Center - Links */}
          {/* <div className="flex space-x-6 text-sm w-full items-center justify-center">
            
          </div> */}

          {/* Right - Social or Info */}
          <div className="text-sm text-gray-400 flex items-center justify-center">
            Not Done Yet ..! 💪 
          </div>
    </footer>
  );
}


export default Footer;