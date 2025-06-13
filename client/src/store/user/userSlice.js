import { createSlice } from '@reduxjs/toolkit';
import { checkAuthThunk, userLogInThunk, userSignUpThunk ,userLogOutThunk} from './userThunk';

const initialState = {
  isAuthenticated: false,
  userProfile: null,
  loading: true,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
  
      builder.addCase(checkAuthThunk.pending,(state,action)=>{
        // state.loading = true;
        // state.isAuthenticated = false;
      });

      builder.addCase(checkAuthThunk.fulfilled,(state,action)=>{
        state.isAuthenticated = true;
        // console.log(state.isAuthenticated)
        state.loading = false;
        state.userProfile = action?.payload;
      });

      builder.addCase(checkAuthThunk.rejected,(state,action)=>{
        state.loading = false;
        state.isAuthenticated = false;
      })

      
    builder .addCase(userLogInThunk.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(userLogInThunk.fulfilled, (state, action) => {
      state.loading = false;
      // console.log("action.payload:",action.payload)
      state.isAuthenticated = true;
      // console.log(state.isAuthenticated , state.loading )
      state.userProfile = action?.payload; // <-- response.data from thunk
    })

    builder.addCase(userLogInThunk.rejected, (state, action) => {
      state.loading = false;
          // action.payload <-- rejectWithValue(errMsg)
    });

    builder.addCase(userSignUpThunk.pending , (state)=>{
        state.loading = true;
    })

    builder.addCase(userSignUpThunk.fulfilled , (state,action)=>{
        state.loading = false;
        state.userProfile = action?.payload?.userProfile
        state.isAuthenticated = true;
    })

    builder.addCase(userSignUpThunk.rejected , (state,action)=>{
        state.loading = false;
    })

    // Logout
    // builder.addCase(userLogOutThunk.pending , (state)=>{
    //     // state.loading = false;
    // });

    builder.addCase(userLogOutThunk.fulfilled , (state,action)=>{
        state.loading = false;
        state.isAuthenticated = false;
        state.userProfile = null;
    });

    builder.addCase(userLogOutThunk.rejected , (state)=>{
        state.loading = false;
    });

},

});

export const { logIn } = userSlice.actions;
export default userSlice.reducer;
