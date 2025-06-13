import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from 'react-hot-toast'



export const workoutLogThunk = createAsyncThunk('/insert',
  async (workoutData, { rejectWithValue }) => {
    try {
    //   console.log(workoutData)
      const response = await axiosInstance.post('/insert',workoutData); 
      toast.success(response?.data?.message);
    } catch (error) {
      toast.error(error.response?.data?.message);
      return rejectWithValue(error.response?.data?.message || 'Not added');
    }
  }
);


export const getDataThunk = createAsyncThunk('/getdata',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/'); 
      console.log(response?.data);
      return response?.data
    } catch (error) {
      toast.error(error.response?.data?.message);
      return rejectWithValue(error.response?.data?.message || 'No data');
    }
  }
);


export const getChartDataThunk = createAsyncThunk('/getData/:id',
  async (chartExercise, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/getData/${chartExercise}`); 
      // console.log(response?.data?.chartData)
      return response?.data;
    } catch (error) {
      toast.error(error.response?.data?.message);
      return rejectWithValue(error.response?.data?.message || 'No data');
    }
  }
);


export const workoutHistoryThunk = createAsyncThunk('/History',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/history`); 
      console.log(response?.data?.workoutHistory)
      return response?.data;
    } catch (error) {
      toast.error(error.response?.data?.message);
      return rejectWithValue(error.response?.data?.message || 'No data');
    }
  }
);


export const editDataThunk = createAsyncThunk('/editData',
  async ({
           Workoutname,
           Exercise_name,
           reps,
           t_sets,
           weight,
           _id
          }, { rejectWithValue }) => {
    try {
      let data = {Workoutname,Exercise_name,reps,t_sets,weight,_id};
      const response = await axiosInstance.patch(`/edit`,data); 
      //console.log("successfully edited: ",response?.data);
      if(response?.data?.success){
        toast.success(response?.data?.message)
        return data;
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to edit data');
    }
  }
);


export const deleteSingleRowThunk = createAsyncThunk('/delete-single',
  async ( _id , { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/delete/${_id}`); 
      // console.log("successfully deleted: ",_id);
      toast.success(response?.data?.message);
      return _id;
    } catch (error) {
      const errMsg = error.response?.data?.message;
      toast.error(errMsg);
      console.log("Error in deleteSingleRowThunk: ",errMsg)
      return rejectWithValue(errMsg || 'Failed to delete data');
    }
  }
);


export const deleteAllDataThunk = createAsyncThunk('/delete-all',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/deleteAll`); 
      toast.success(response?.data?.message);
    } catch (error) {
      const errMsg = error.response?.data?.message;
      toast.error(errMsg);
      console.log("Error in deleteAllDataThunk: ",errMsg)
      return rejectWithValue(errMsg || 'Failed to delete data');
    }
  }
);