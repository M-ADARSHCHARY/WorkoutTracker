import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { Provider } from 'react-redux';
import {store} from './store/store.js';
import HomePage from './Pages/HomePage.jsx';
import LoginPage from './Pages/Auth/LoginPage.jsx';
import SignUpPage from './Pages/Auth/SignUpPage.jsx';
import WorkoutHistory from './Pages/WorkoutHistory.jsx';


const router = createBrowserRouter([
  {
    path:"/",
    element: ( <ProtectedRoute>
                    <HomePage/>
               </ProtectedRoute>
              ),
  },
  {
     path:"/login",
     element:<LoginPage/>
  },
  {
    path:"/signup",
    element:<SignUpPage/>
  },
  {
    path:"/workout-history",

    element:<ProtectedRoute>
              <WorkoutHistory/>
            </ProtectedRoute>
  }
])


createRoot(document.getElementById("root")).render(
  <>
      <Provider store={store}>
          <App/>
          <RouterProvider router={router} />
      </Provider>
  </>
);
