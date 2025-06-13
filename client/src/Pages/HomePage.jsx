import React from 'react'
import { useSelector } from 'react-redux'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import InputForm from './InputForm'
import WorkoutChart from './WorkoutChart'
import {Link} from 'react-router-dom'

const HomePage = () => {
  const { userProfile } = useSelector(state => state.userReducer)
  const {exercisesDid,recentWorkouts,totalSessions} = useSelector(state => state.workoutReducer) 
  return (
    <>
      <Navbar />
      <div className="bg-[#0a0a0a] min-h-screen w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_2fr] transition-all">
        {/* Form Area */}
        <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 md:p-10 flex items-center justify-center">
          <div className="w-full max-w-lg">
            <InputForm/>
          </div>
        </div>

        {/* Metrics Area */}
        <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 md:p-10 flex flex-col">
          <h2 className="text-3xl font-extrabold text-center text-white mb-8 tracking-tight drop-shadow">
            Workout Statistics
          </h2>

          <div className="w-full text-center mb-8 p-6 rounded-xl border border-gray-700 bg-gray-900 shadow-lg">
            <p className="text-base font-medium text-gray-400 mb-2">Total Workout Sessions</p>
            <p className="text-4xl font-extrabold text-emerald-400 tracking-wide">{totalSessions}</p>
          </div>

          <Link
            to='/workout-history'
            className="w-fit mx-auto mb-8 border border-emerald-500 text-emerald-400 py-2 px-8 rounded-lg font-semibold hover:bg-emerald-500 hover:text-white transition-colors duration-200 shadow"
          >
            View All Workouts
          </Link>

          <div className="mt-2 w-full rounded-2xl p-6 border border-gray-700 bg-gray-900 shadow-md flex flex-col">
            <WorkoutChart/>
          </div>

          <div id="historicalData" className="w-full mt-8 overflow-auto flex-grow">
            <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
              <i className="fa-solid fa-clock-rotate-left"></i>
              Recent Workouts
            </h3>
            <ul>
              {recentWorkouts.map((workout) => (
                <li
                  key={workout._id}
                  className="flex justify-between items-center bg-gray-800 px-4 py-3 rounded-lg border border-gray-700 mb-3 hover:bg-gray-700 transition"
                >
                  <span className="text-gray-200 font-medium truncate max-w-[60%]">
                    {workout.Workoutname || workout.workoutname}
                  </span>
                  <span className="text-emerald-300 text-sm font-mono">
                    {new Date(workout.workout_date).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default HomePage
