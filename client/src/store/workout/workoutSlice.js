import { createSlice, current } from "@reduxjs/toolkit";
import {
  getDataThunk,
  workoutLogThunk,
  getChartDataThunk,
  workoutHistoryThunk,
  editDataThunk,
  deleteSingleRowThunk,
  deleteAllDataThunk,
} from "./workoutThunk";

const initialState = {
  workoutData: [],
  // loading: false,
  error: null,
  totalSessions: 0,
  recentWorkouts: [],
  exercisesDid: [],
  workoutHistory: [],
  
};

// Slice
const workoutSlice = createSlice({
  name: "workout",
  initialState,
  reducers: {
    recentWorkoutsUpdate: (state, action) => {
      let addedWorkout = action.payload;

      // Clone existing recent workouts
      let recentWorkouts = current(state.recentWorkouts);

      // Normalize existing workout dates
      let allWorkouts = recentWorkouts.map((w) => {
        const date = new Date(w.workout_date || w.date);
        return { ...w, workout_date: date.toISOString() };
      });

      // Normalize the new workout's date
      const date = new Date(addedWorkout.workout_date || addedWorkout.date);
      addedWorkout = { ...addedWorkout, workout_date: date.toISOString() };

      // Combine and sort by date (latest first)
      allWorkouts = [...allWorkouts, addedWorkout].sort(
        (a, b) => new Date(b.workout_date) - new Date(a.workout_date)
      );

      // Keep only latest 3
      state.recentWorkouts = allWorkouts.slice(0, 3);
      // console.log("After updating: ",state.recentWorkouts)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(workoutLogThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(workoutLogThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.totalSessions = state.totalSessions + 1;
      })
      .addCase(workoutLogThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });

    builder.addCase(getDataThunk.pending, (state) => {
      //
    });

    builder.addCase(getDataThunk.fulfilled, (state, action) => {
      state.totalSessions = action?.payload?.homePageData?.t_sessions;
      state.recentWorkouts = action?.payload?.homePageData?.recentWorkouts;
      state.exercisesDid = action?.payload?.homePageData?.exercisesDid;
    });

    builder.addCase(getDataThunk.rejected, (state) => {
      //
    });

    builder.addCase(getChartDataThunk.pending, (state) => {});

    builder.addCase(getChartDataThunk.fulfilled, (state, action) => {
      state.workoutData = action.payload?.chartData;
    });

    builder.addCase(getChartDataThunk.rejected, (state) => {});

    builder.addCase(workoutHistoryThunk.fulfilled, (state, action) => {
      // console.log("action payload: ",action?.payload?.workoutHistory)
      state.workoutHistory = action.payload?.workoutHistory;

      // Pr's

      const workoutHistory = state.workoutHistory;

    });

    builder.addCase(editDataThunk.fulfilled, (state, action) => {
      const updatedRowData = action?.payload;
      let oldData = state.workoutHistory;
      oldData.forEach((data) => {
        if (data._id === updatedRowData._id) {
          data.Workoutname = updatedRowData.Workoutname;
          data.Exercise_name = updatedRowData.Exercise_name;
          data.t_sets = updatedRowData.t_sets;
          data.reps = updatedRowData.reps;
          data.weight = updatedRowData.weight;
        }
      });
      state.workoutHistory = oldData;
    });

    builder.addCase(deleteSingleRowThunk.fulfilled, (state, action) => {
      let historyCopy = state.workoutHistory;
      state.workoutHistory = historyCopy.filter(
        (data) => data._id !== action?.payload
      );
    });

    builder.addCase(deleteAllDataThunk.fulfilled, (state, action) => {
      state.workoutData = [];
      state.totalSessions = 0;
      state.recentWorkouts = [];
      state.exercisesDid = [];
      state.workoutHistory = [];
    });
  },
});

export const { recentWorkoutsUpdate } =workoutSlice.actions;
export default workoutSlice.reducer;
