import React from 'react'
import {Routes,Route, Navigate} from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import SignUp from './components/SignUp'
import { Toaster } from 'react-hot-toast';
import Buy from './components/Buy'
import Purchases from './components/Purchases'
import Course from './components/Courses'
import AdminSignup from './Admin/AdminSignup'
import AdminLogin from './Admin/AdminLogin'
import AdminDashboard from './Admin/AdminDashboard'
import CourseCreate from './Admin/CourseCreate'
import UpdateCourse from './Admin/UpdateCourse'
import OurCourses from './Admin/OurCourses'

const App = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const admin = JSON.parse(localStorage.getItem("admin"));
  console.log("Admin from localStorage:", admin);
  console.log("Admin truthy?", !!admin);
  return (
    <div>
     <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/Login" element={<Login/>} />
      <Route path="/signUp" element={<SignUp/>} />

      {/* other routes */}
      <Route path="/buy/:courseId" element={<Buy/>} />
      <Route path="/purchases" 
      element={(user || token) ? <Purchases/> : <Navigate to="/Login" />} />
      <Route path="/courses" element={<Course/>} />

      {/* Admin routes */}
      <Route path="/admin/signUp" element={<AdminSignup/>} />
      <Route path="/admin/Login" element={<AdminLogin/>} />
      <Route path="/admin/Dashboard" element={admin? <AdminDashboard/>: <Navigate to="/admin/login" />} />
      <Route path="/admin/create-course" element={<CourseCreate/>} />
      <Route path="/admin/course/update/:courseId" element={<UpdateCourse/>} />
      <Route path="/admin/our-courses" element={<OurCourses/>} />


     </Routes>
     <Toaster />
    </div>
  )
}

export default App
