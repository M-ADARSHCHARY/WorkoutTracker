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
  const {workoutHistory} = useSelector(state => state.workoutReducer)
  const dispatch = useDispatch()
  const [editingId,setEditingId] = useState(null);
  
  const [editableData,setEditableData] = useState(null);
  
  useEffect(()=>{
       dispatch(workoutHistoryThunk())
       
  },[])

  const handleChange = (e)=>{
    const {name,value} = e.target;
   setEditableData({...editableData,[name]:value})
  //  console.log(editableData)
  }

  const handleEditWorkoutRow = (e,item)=>{
    setEditingId(item._id)
    setEditableData(item)
  }

  const handleSaveData = async ()=> {
    // console.log(editableData)
    await dispatch(editDataThunk(editableData))
    setEditableData(null);
    setEditingId(null);
  }

  const handleDelete = (_id) => {
     dispatch(deleteSingleRowThunk(_id));
  }

  const handleDeleteAllData = ()=>{
    dispatch(deleteAllDataThunk());
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
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

        {/* Workout Table for Desktop */}
        <div className=" md:block overflow-x-auto bg-gray-800/50 rounded overflow-y-auto max-h-[58vh]">
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
              {( workoutHistory?.length > 0) ? workoutHistory.map((item) => (
                <tr key={item._id} className={`hover:bg-gray-700/50 transition`}>
                  <td className="px-4 lg:px-6 py-4 text-sm text-gray-300 whitespace-nowrap"><input onChange={handleChange} type="text" name="Workoutname" value = {editingId !== item._id ? item.Workoutname : editableData.Workoutname } className={`${item._id} bg-transparent w-full max-w-[150px] overflow-hidden text-ellipsis ${editingId === item._id ? 'border-2 border-[rgba(255,255,255,0.4)] p-1':""}`} disabled = {editingId !== item._id}/></td>
                  <td className="px-4 lg:px-6 py-4 text-sm text-gray-300 whitespace-nowrap"><span name="workout_date" className="bg-transparent w-full max-w-[150px] overflow-hidden text-ellipsis">{new Date(item.workout_date).toLocaleDateString()}</span></td>
                  <td className="px-4 lg:px-6 py-4 text-sm text-gray-300 whitespace-nowrap"><input onChange={handleChange} type="text" name="Exercise_name" value = {editingId !== item._id ? item.Exercise_name:editableData.Exercise_name} className={`bg-transparent w-full max-w-[150px] overflow-hidden text-ellipsis ${editingId === item._id ? 'border-2 border-[rgba(255,255,255,0.4)] p-1':""}`} disabled = {editingId !== item._id}/></td>
                  <td className="px-4 lg:px-6 py-4 text-sm text-gray-300 whitespace-nowrap"><input onChange={handleChange} type="number" name="t_sets" value = {editingId !== item._id ? item.t_sets:editableData.t_sets} className={`bg-transparent w-full max-w-[150px] overflow-hidden text-ellipsis ${editingId === item._id ? 'border-2 border-[rgba(255,255,255,0.4)] p-1':""}`} disabled = {editingId !== item._id}/></td>
                  <td className="px-4 lg:px-6 py-4 text-sm text-gray-300 whitespace-nowrap"><input onChange={handleChange} type="number" name="reps" value = {editingId !== item._id ? item.reps:editableData.reps} className={`bg-transparent w-full max-w-[150px] overflow-hidden text-ellipsis ${editingId === item._id ? 'border-2 border-[rgba(255,255,255,0.4)] p-1':""}`} disabled = {editingId !== item._id}/></td>
                  <td className="px-4 lg:px-6 py-4 text-sm text-gray-300 whitespace-nowrap"><input onChange={handleChange} type="number" name="weight" value = {editingId !== item._id ? item.weight:editableData.weight} className={`bg-transparent w-full max-w-[150px] overflow-hidden text-ellipsis ${editingId === item._id ? 'border-2 border-[rgba(255,255,255,0.4)] p-1':""}`} disabled = {editingId !== item._id}/></td>
                  <td className="px-4 lg:px-6 py-4 text-sm text-gray-300 whitespace-nowrap">
                    <div className="flex space-x-2">
                      {
                        (editingId !== item._id) ? (<button className="text-gray-400 hover:text-white" onClick={(e)=>{setIsEditing(!isEditing);handleEditWorkoutRow(e,item)}}>
                             <FaEdit />
                      </button>):(
                        <>
                        <button onClick={()=>{setEditableData(null);setEditingId(null)}}className="rounded-md bg-blue-400 w-fit h-fit p-2 mr-2">cancel</button>
                        <button className="bg-green-500 h-fit w-fit p-2 rounded-md mr-2 text-black  flex items-center gap-0.4"onClick={handleSaveData}>  <Save className="w-4 h-4 mr-1" /> save</button></>)
                      }
                      <button className="text-red-400 hover:text-red-300" onClick={()=>{handleDelete(item._id)}}>
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
