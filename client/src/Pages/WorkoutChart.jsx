import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getChartDataThunk } from '../store/workout/workoutThunk'
import { renderChart } from '../utils/renderChart';
import { toast } from 'react-hot-toast'

const WorkoutChart = () => {
  const { exercisesDid, workoutData } = useSelector(state => state.workoutReducer);
  const [chartExercise, setChartExercise] = useState('');
  const dispatch = useDispatch();
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const handleChange = (e) => {
    setChartExercise(e.target.value);
  };

  const handleShowChart = async (e) => {
    e.preventDefault();
    if (chartExercise === '') {
      return toast.error("Select an Exercise..!")
    }
    await dispatch(getChartDataThunk(chartExercise));
  };

  useEffect(() => {
    if (workoutData.length > 0 && chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
      chartInstanceRef.current = renderChart(ctx, workoutData, chartExercise);
    }
  }, [workoutData]);

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-5">
        <select
          onChange={handleChange}
          value={chartExercise}
          id="exerciseSelect"
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition w-full sm:w-auto"
        >
          <option value="" disabled>
            Select an exercise
          </option>
          {exercisesDid.map((exercise, idx) => (
            <option key={idx} value={exercise.Exercise_name}>
              {exercise.Exercise_name}
            </option>
          ))}
        </select>
        <button
          onClick={handleShowChart}
          id="showChartBtn"
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-6 rounded-lg shadow transition-colors duration-200 w-full sm:w-auto"
        >
          Show Chart
        </button>
      </div>
      <div className="w-full h-64 bg-gray-900 rounded-xl shadow flex items-center justify-center p-4">
        {workoutData.length > 0 ? (
          <canvas ref={chartRef} id="exerciseChart" className="w-full h-full" />
        ) : (
          <p className="text-gray-400 text-center text-base">
            Select an exercise and click <span className="text-emerald-400 font-semibold">'Show Chart'</span> to view progress
          </p>
        )}
      </div>
    </div>
  )
}

export default WorkoutChart
