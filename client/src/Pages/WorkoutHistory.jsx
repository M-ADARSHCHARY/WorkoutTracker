import react , {useState,useEffect} from 'react';
import {
  Home,
  LogOut,
  Plus,
  Trash2,
  Dumbbell,
  Flame,
  TrendingUp,
  Edit2,
  ChevronLeft,
  ChevronRight,
  Menu, 
  Save
} from 'lucide-react';

import { FaEdit } from 'react-icons/fa';
import {Link} from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer';
import { useDispatch, useSelector } from 'react-redux';
import {workoutHistoryThunk,editDataThunk,deleteSingleRowThunk,deleteAllDataThunk} from '../store/workout/workoutThunk'


const WorkoutHistory = () => {
  const [isEditing,setIsEditing] = useState(false)
  const {workoutHistory, totalPages} = useSelector(state => state.workoutReducer)
  const dispatch = useDispatch()
  const [editingId,setEditingId] = useState(null);

  const[page, setPage] = useState(1);
  
  const [editableData,setEditableData] = useState(null);
  
  useEffect(()=>{
    if(page < 1 || page > totalPages) return;
          dispatch(workoutHistoryThunk(page))
  },[page])

  const handleChange = (e)=>
  {
    const {name,value} = e.target;
   setEditableData({...editableData,[name]:value})
  }

  const handleEditWorkoutRow = (e,item)=>{
    setEditingId(item.id)
    setEditableData({
      workoutName: item?.workout_name,
      exerciseName: item?.exercise_name,
      sets: item?.sets,
      reps: item?.reps,
      maxWeight: item?.weight,
      workoutId: item?.id,
    })
  }

  const handleSaveData = async ()=> {
    // console.log(editableData)
    await dispatch(editDataThunk(editableData))
    setEditableData(null);
    setEditingId(null);
  }

  const handleDelete = (id) => {
     dispatch(deleteSingleRowThunk(id));
  }

  const handleDeleteAllData = ()=>{
    dispatch(deleteAllDataThunk());
  }

  const handlePrevPage = () => {
    setPage(Math.max(page - 1, 1));
  }

  const handleNextPage = () => {
    console.log("handleNextPage called: ",page);
    setPage(Math.min(page + 1, totalPages));
  }
  
  return (
    <>
    <Navbar/>
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen flex flex-col text-gray-100">

      {/* Main Content */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white">Workout History</h1>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link to='/' className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded flex items-center justify-center text-sm font-medium transition-all">
              <Plus className="w-4 h-4 mr-2" />
              Add Workout
            </Link>
            <button onClick={handleDeleteAllData}className="bg-red-900/50 hover:bg-red-900/70 text-red-200 px-4 py-2 rounded flex items-center justify-center text-sm font-medium transition-all">
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          {[
            {
              icon: <Dumbbell className="w-5 h-5" />,
              label: "Total Exercise's",
              value: `${ workoutHistory?.length || 0}`
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-gray-800/50 backdrop-blur-sm p-4 lg:p-6 rounded shadow-sm hover:bg-gray-800/70 transition"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 flex items-center justify-center bg-white/10 text-white rounded">
                  {stat.icon}
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-light text-white mt-1">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center sm:justify-end mb-4 gap-2">
          <button 
            className="text-black bg-white rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed p-1 hover:bg-gray-200 transition" 
            onClick={handlePrevPage} 
            disabled={page === 1}
          >
            <ChevronLeft size={24} />
          </button>
          <div className="flex items-center px-4 py-1 bg-gray-800 rounded-full text-white font-medium">
            <span className="text-sm">{page} / {totalPages}</span>
          </div>
          <button 
            className="text-black bg-white rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed p-1 hover:bg-gray-200 transition" 
            onClick={handleNextPage} 
            disabled={page === totalPages}
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Mobile Card View */}
        <div className="block md:hidden space-y-4">
          {(workoutHistory?.length > 0) ? workoutHistory.map((item) => (
            <div 
              key={item.id} 
              className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:bg-gray-800/70 transition"
            >
              {editingId === item.id ? (
                // Edit Mode for Mobile
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Workout Name</label>
                    <input 
                      onChange={handleChange} 
                      type="text" 
                      name="workoutName" 
                      value={editableData.workoutName} 
                      className="w-full bg-gray-900 border-2 border-gray-600 rounded p-2 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Exercise</label>
                    <input 
                      onChange={handleChange} 
                      type="text" 
                      name="exerciseName" 
                      value={editableData.exerciseName} 
                      className="w-full bg-gray-900 border-2 border-gray-600 rounded p-2 text-white text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Sets</label>
                      <input 
                        onChange={handleChange} 
                        type="number" 
                        name="sets" 
                        value={editableData.sets} 
                        className="w-full bg-gray-900 border-2 border-gray-600 rounded p-2 text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Reps</label>
                      <input 
                        onChange={handleChange} 
                        type="number" 
                        name="reps" 
                        value={editableData.reps} 
                        className="w-full bg-gray-900 border-2 border-gray-600 rounded p-2 text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Weight</label>
                      <input 
                        onChange={handleChange} 
                        type="number" 
                        name="maxWeight" 
                        value={editableData.maxWeight} 
                        className="w-full bg-gray-900 border-2 border-gray-600 rounded p-2 text-white text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button 
                      onClick={handleSaveData} 
                      className="flex-1 bg-green-500 text-black font-semibold py-2 px-4 rounded flex items-center justify-center gap-2 hover:bg-green-600 transition"
                    >
                      <Save className="w-4 h-4" /> Save
                    </button>
                    <button 
                      onClick={() => {setEditableData(null); setEditingId(null)}} 
                      className="flex-1 bg-blue-400 text-white font-semibold py-2 px-4 rounded hover:bg-blue-500 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode for Mobile
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-lg mb-1">{item.workout_name}</h3>
                      <p className="text-emerald-400 text-sm">{item.exercise_name}</p>
                    </div>
                    <span className="text-gray-400 text-xs">{new Date(item.workout_date).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 mb-3 bg-gray-900/50 rounded p-3">
                    <div className="text-center">
                      <p className="text-gray-400 text-xs mb-1">Sets</p>
                      <p className="text-white font-bold text-lg">{item.sets}</p>
                    </div>
                    <div className="text-center border-x border-gray-700">
                      <p className="text-gray-400 text-xs mb-1">Reps</p>
                      <p className="text-white font-bold text-lg">{item.reps}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-400 text-xs mb-1">Weight (Kg)</p>
                      <p className="text-white font-bold text-lg">{item.weight}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => {setIsEditing(!isEditing); handleEditWorkoutRow(e, item)}} 
                      className="flex-1 bg-gray-700 text-white py-2 px-4 rounded flex items-center justify-center gap-2 hover:bg-gray-600 transition"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)} 
                      className="flex-1 bg-red-900/50 text-red-200 py-2 px-4 rounded flex items-center justify-center gap-2 hover:bg-red-900/70 transition"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          )) : (
            <div className="text-center py-12 text-gray-400">
              <p>No workout history found</p>
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto bg-gray-800/50 rounded overflow-y-auto max-h-[58vh]">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr className="bg-gray-900/50">
                {['Workout', 'Date', 'Exercise', 'Sets', 'Reps', 'Max Weight', 'Actions'].map((h, i) => (
                  <th
                    key={i}
                    className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {(workoutHistory?.length > 0) ? workoutHistory.map((item) => (
                <tr key={item.id} className={`hover:bg-gray-700/50 transition`}>
                  <td className="px-4 lg:px-6 py-4 text-sm text-gray-300 whitespace-nowrap"><input onChange={handleChange} type="text" name="workoutName" value = {editingId !== item.id ? item.workout_name : editableData.workoutName } className={`${item.id} bg-transparent w-full max-w-[150px] overflow-hidden text-ellipsis ${editingId === item.id ? 'border-2 border-[rgba(255,255,255,0.4)] p-1':""}`} disabled = {editingId !== item.id}/></td>
                  <td className="px-4 lg:px-6 py-4 text-sm text-gray-300 whitespace-nowrap"><span name="workout_date" className="bg-transparent w-full max-w-[150px] overflow-hidden text-ellipsis">{new Date(item.workout_date).toLocaleDateString()}</span></td>
                  <td className="px-4 lg:px-6 py-4 text-sm text-gray-300 whitespace-nowrap"><input onChange={handleChange} type="text" name="exerciseName" value = {editingId !== item.id ? item.exercise_name:editableData.exerciseName} className={`bg-transparent w-full max-w-[150px] overflow-hidden text-ellipsis ${editingId === item.id ? 'border-2 border-[rgba(255,255,255,0.4)] p-1':""}`} disabled = {editingId !== item.id}/></td>
                  <td className="px-4 lg:px-6 py-4 text-sm text-gray-300 whitespace-nowrap"><input onChange={handleChange} type="number" name="sets" value = {editingId !== item.id ? item.sets:editableData.sets} className={`bg-transparent w-full max-w-[150px] overflow-hidden text-ellipsis ${editingId === item.id ? 'border-2 border-[rgba(255,255,255,0.4)] p-1':""}`} disabled = {editingId !== item.id}/></td>
                  <td className="px-4 lg:px-6 py-4 text-sm text-gray-300 whitespace-nowrap"><input onChange={handleChange} type="number" name="reps" value = {editingId !== item.id ? item.reps:editableData.reps} className={`bg-transparent w-full max-w-[150px] overflow-hidden text-ellipsis ${editingId === item.id ? 'border-2 border-[rgba(255,255,255,0.4)] p-1':""}`} disabled = {editingId !== item.id}/></td>
                  <td className="px-4 lg:px-6 py-4 text-sm text-gray-300 whitespace-nowrap"><input onChange={handleChange} type="number" name="maxWeight" value = {editingId !== item.id ? item.weight:editableData.maxWeight} className={`bg-transparent w-full max-w-[150px] overflow-hidden text-ellipsis ${editingId === item.id ? 'border-2 border-[rgba(255,255,255,0.4)] p-1':""}`} disabled = {editingId !== item.id}/></td>
                  <td className="px-4 lg:px-6 py-4 text-sm text-gray-300 whitespace-nowrap">
                    <div className="flex space-x-2">
                      {
                        (editingId !== item.id) ? (<button className="text-gray-400 hover:text-white" onClick={(e)=>{setIsEditing(!isEditing);handleEditWorkoutRow(e,item)}}>
                             <FaEdit />
                      </button>):(
                        <>
                        <button onClick={()=>{setEditableData(null);setEditingId(null)}}className="rounded-md bg-blue-400 w-fit h-fit p-2 mr-2">cancel</button>
                        <button className="bg-green-500 h-fit w-fit p-2 rounded-md mr-2 text-black  flex items-center gap-0.4"onClick={handleSaveData}>  <Save className="w-4 h-4 mr-1" /> save</button></>)
                      }
                      <button className="text-red-400 hover:text-red-300" onClick={()=>{handleDelete(item.id)}}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )):null}
            </tbody>
          </table>
        </div>
      </main>
    </div>
    <Footer/>
    </>
  );
};

export default WorkoutHistory;
