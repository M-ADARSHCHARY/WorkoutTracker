import React, { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getChartDataThunk } from '../store/workout/workoutThunk'
import { toast } from 'react-hot-toast'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'

const WorkoutChart = () => {
  const { exercisesDid, workoutData } = useSelector(state => state.workoutReducer);
  const [chartExercise, setChartExercise] = useState('');
  const dispatch = useDispatch();

  const chartData = useMemo(() => {
    return workoutData.map((item) => ({
      ...item,
      dateLabel: new Date(item.workout_date).toLocaleDateString(),
    }));
  }, [workoutData]);

  const weightDomain = useMemo(() => {
    if (workoutData.length === 0) return [0, 10];
    const weights = workoutData.map((item) => Number(item.weight) || 0);
    const min = Math.min(...weights);
    const max = Math.max(...weights);
    return [Math.max(0, min - 5), max + 5];
  }, [workoutData]);

  const repsDomain = useMemo(() => {
    if (workoutData.length === 0) return [0, 10];
    const reps = workoutData.map((item) => Number(item.reps) || 0);
    const min = Math.min(...reps);
    const max = Math.max(...reps);
    return [Math.max(0, min - 5), max + 5];
  }, [workoutData]);

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
            <option key={idx} value={exercise.exercise_name}>
              {exercise.exercise_name}
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
      <div className="w-full h-80 bg-gray-900 rounded-xl shadow p-4">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="dateLabel" stroke="#cbd5e1" tick={{ fill: '#cbd5e1' }} />
              <YAxis
                yAxisId="left"
                stroke="#34d399"
                tick={{ fill: '#34d399' }}
                domain={weightDomain}
                label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft', fill: '#34d399' }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#60a5fa"
                tick={{ fill: '#60a5fa' }}
                domain={repsDomain}
                label={{ value: 'Reps', angle: 90, position: 'insideRight', fill: '#60a5fa' }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '12px' }}
                labelStyle={{ color: '#e5e7eb' }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="weight"
                name="Weight (kg)"
                stroke="#34d399"
                strokeWidth={3}
                dot={{ r: 4, fill: '#34d399' }}
                activeDot={{ r: 6 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="reps"
                name="Reps"
                stroke="#60a5fa"
                strokeWidth={3}
                dot={{ r: 4, fill: '#60a5fa' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
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
