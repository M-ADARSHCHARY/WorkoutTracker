import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import workoutReducer from './workout/workoutSlice'
export const store = configureStore({
  reducer: {
    userReducer,// state.userReducer
    workoutReducer, // state.workoutReducer
  },
});
