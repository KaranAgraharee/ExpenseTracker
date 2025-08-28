import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Auth from './pages/Auth';


function App() {
  const router = createBrowserRouter ([
    {
      path:'/',
      element:<LandingPage/>
    },
    {
      path:'/Home',
      element:<Home/>
    },
    {
      path:'/Auth/Home/Profile',
      element:<Profile/>
    },
    {
      path:'/Auth',
      element:<Auth/>
    },
  ])
  
  return (
    <>
    <RouterProvider router={router}/>
    </>
  )
}

export default App
