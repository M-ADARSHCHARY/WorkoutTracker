import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const ProtectedRoute = ({children}) => {
    
    const {isAuthenticated , loading} = useSelector(state => state.userReducer)
    const navigate = useNavigate()
    useEffect(() =>{
        
        if(!isAuthenticated && !loading){
            console.log("isAuthenticated:",isAuthenticated)
            console.log("loading: ",loading)
            navigate('/login')
        }
    },[isAuthenticated,loading]);

  return children; 
}

export default ProtectedRoute
