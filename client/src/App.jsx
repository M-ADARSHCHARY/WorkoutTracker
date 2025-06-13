import { useState , useEffect } from 'react'
import reactLogo from './assets/react.svg'
import {Toaster} from 'react-hot-toast'
import { useSelector,useDispatch } from 'react-redux'
import {checkAuthThunk} from './store/user/userThunk'
import {getDataThunk} from './store/workout/workoutThunk'
function App() {
   const {isAuthenticated,loading} = useSelector(state => state.userReducer);
  const dispatch = useDispatch()
  
  
  useEffect(()=>{
      dispatch(checkAuthThunk())   
  },[])

  useEffect(()=>{
      if(isAuthenticated && !loading){
        dispatch(getDataThunk());
      }
  },[isAuthenticated,loading])
  
  return (
    <>
    
      <Toaster position="top-center" reverseOrder={false} />
    </>
  )
}

export default App
