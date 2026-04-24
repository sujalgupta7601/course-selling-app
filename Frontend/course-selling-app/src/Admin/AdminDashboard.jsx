import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../public/logo.webp";
import toast from "react-hot-toast";
import axios from "axios";
import { BACKEND_URL } from "../../utils/utils";

function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}api/v1/admin/logout`, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      localStorage.removeItem("admin");
      // Navigate to login after successful logout
      window.location.href = "/admin/login";
    } catch (error) {
      console.log("Error in logging out ", error);
      toast.error(error.response?.data?.errors || "Error in logging out");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Hamburger Button */}
      <div className="md:hidden p-4 absolute z-20">
        <button onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-full w-64 bg-gray-100 p-5 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 z-10`}
      >
        <div className="flex items-center flex-col mb-10">
          <img src={logo} alt="Profile" className="rounded-full h-20 w-20" />
          <h2 className="text-lg font-semibold mt-4">I'm Admin</h2>
        </div>

        <nav className="flex flex-col space-y-4">
          <Link to="/admin/our-courses">
            <button className="w-full bg-green-700 hover:bg-green-600 text-white py-2 rounded">
              Our Courses
            </button>
          </Link>

          <Link to="/admin/create-course">
            <button className="w-full bg-orange-500 hover:bg-blue-600 text-white py-2 rounded">
              Create Course
            </button>
          </Link>

          <Link to="/">
            <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded">
              Home
            </button>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded"
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center">
        Welcome!!!
      </div>
    </div>
  );
}

export default Dashboard;