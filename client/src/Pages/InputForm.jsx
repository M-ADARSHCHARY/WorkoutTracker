import React, { useState } from 'react'
import { useDispatch , useSelector } from 'react-redux'
import { workoutLogThunk } from '../store/workout/workoutThunk'
import { recentWorkoutsUpdate } from '../store/workout/workoutSlice'
const initialData = {
    workoutname: "",
    date: "",
    exercisename: "",
    sets: "",
    reps: "",
    max_weight: "",
}

const InputForm = () => {
  const dispatch = useDispatch()
  const [workoutData, setWorkoutData] = useState(initialData);

  const handleChange = (e) => {
    setWorkoutData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const handleWorkoutDataSubmit = async (e) => {
    e.preventDefault();
    await dispatch(workoutLogThunk(workoutData));
    await dispatch(recentWorkoutsUpdate(workoutData))
    setWorkoutData(initialData)
  }

  return (
    <div className="bg-gray-900 rounded-2xl shadow-xl p-8 w-full max-w-xl mx-auto">
      <form className="space-y-6" onSubmit={handleWorkoutDataSubmit}>
        <h2 className="text-2xl font-bold text-center text-emerald-400 mb-6 tracking-tight">
          Log Your Workout
        </h2>
        <div>
          <label className="block text-sm font-semibold text-gray-200 mb-2">Workout Name</label>
          <input
            onChange={handleChange}
            type="text"
            name="workoutname"
            value={workoutData.workoutname}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
            placeholder="e.g. Push Day"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-200 mb-2">Date</label>
          <input
            onChange={handleChange}
            type="date"
            name="date"
            value={workoutData.date}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-200 mb-2">Exercise Name</label>
          <input
            onChange={handleChange}
            type="text"
            name="exercisename"
            value={workoutData.exercisename}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
            placeholder="e.g. Bench Press"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">Sets</label>
            <input
              onChange={handleChange}
              type="number"
              name="sets"
              value={workoutData.sets}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
              min="1"
              placeholder="e.g. 4"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">Max Reps</label>
            <input
              onChange={handleChange}
              type="number"
              name="reps"
              value={workoutData.reps}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
              min="1"
              placeholder="e.g. 10"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">Max Weight (Kg)</label>
            <input
              onChange={handleChange}
              type="number"
              name="max_weight"
              value={workoutData.max_weight}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
              min="0"
              placeholder="e.g. 80"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-colors duration-200"
        >
          Save Workout
        </button>
      </form>
    </div>
  )
}

export default InputForm
