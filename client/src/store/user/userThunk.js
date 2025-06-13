import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from 'react-hot-toast'


export const checkAuthThunk = createAsyncThunk('auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/auth/check-auth'); // backend endpoint
      // console.log("CheckAuth:",response?.data?.userProfile) 
      return response?.data?.userProfile; // assuming backend returns user info in `user`
    } catch (error) {
      toast.error(error.response?.data?.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to Authenticate');
    }
  }
);


export const userLogInThunk = createAsyncThunk('auth/login',async ({username,password},{rejectWithValue})=>{
    try{
        const response = await axiosInstance.post('/auth/login',{
            username,
            password
        });
        toast.success(response.data?.message);
        console.log("thunk response.data:",response.data)
        return response.data?.userProfile; // goes to fullfilled state in extraReducers
    }catch(error){
        const errMsg = error.response?.data.message;
        toast.error(errMsg);
        return rejectWithValue(errMsg) // goes to rejected State in extraReducers
    }
})


export const userSignUpThunk =  createAsyncThunk('auth/signup',async ({username,email,password},{rejectWithValue}) => {
     try{
        const response = await axiosInstance.post('/auth/signup',{username,email,password});
        toast.success(response?.data?.message);
        console.log("Successfully registered.");

        return response?.data?.userProfile;
     }catch(error){
        const errMsg = error.response?.data?.message;
        console.log("Error in userSignUpThunk: ",errMsg);
        return rejectWithValue(errMsg);
     }
})


export const userLogOutThunk =  createAsyncThunk('auth/logout',async (_,{rejectWithValue}) => {
     try{

        const response = await axiosInstance.post('/auth/logout');
        toast.success(response?.data?.message);
        console.log("Successfully Logged Out..!");
     }catch(error){
        const errMsg = error.response?.data?.message;
        console.log("Error in userLogOutThunk : ",errMsg);
        return rejectWithValue(errMsg);
     }
})

