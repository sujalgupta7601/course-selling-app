import React, { useDebugValue } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";
import { toast } from "react-hot-toast";
import { BACKEND_URL } from "../../utils/utils";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [click, setclick] = useState(true);
  const [errorMessage, seterrorMessage] = useState("");
  const hamToDropdown = (e) => {
    e.preventDefault();
    setclick(!click);
  };
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    seterrorMessage("");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resp = await axios.post(
        `${BACKEND_URL}/admin/login`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-type": "application/json",
          },
        },
      );
      toast.success(resp.data.message);
      console.log("Admin login response:", resp.data);
      localStorage.setItem("admin", JSON.stringify(resp.data));
      navigate("/admin/Dashboard");
    } catch (error) {
      seterrorMessage(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Something went wrong",
      );
    }
  };
  return (
    <div>
      <div className="bg-gradient-to-r from-black to-blue-950 px-6 min-h-screen ">
        <div className="min-h-screen text-white container px-4 py-4">
          {/* Header */}
          <header className="flex  items-center justify-between">
            <div className="flex items-center space-x-2">
              <img
                src="/logo.webp"
                alt="CourseHeaven logo"
                className="w-10 h-10 rounded-full"
              />
              <h1 className="text-xl font-semibold text-orange-300">
                CourseHeaven
              </h1>
            </div>
            <div className="space-x-4 hidden sm:block">
              <Link
                to={"/"}
                className="bg-transparent text-white py-2 px-4 border border-white rounded hover:bg-green-400 hover:text-black transition duration-200"
              >
                Home
              </Link>
              <Link
                to={"/Admin/signUp"}
                className="bg-green-500 text-white py-2 px-4 border border-white rounded hover:bg-transparent hover:text-white transition duration-200"
              >
                SignUp
              </Link>
            </div>
            <div className="block sm:hidden">
              {click && (
                <button className="text-2xl" onClick={hamToDropdown}>
                  <RxHamburgerMenu />
                </button>
              )}
              {!click && (
                <div>
                  <button className="text-2xl" onClick={hamToDropdown}>
                    <RxCross2 />
                  </button>
                  <div className="bg-white text-black rounded px-2 py-2 shadow-lg absolute right-11 top-12 w-20">
                    <ul>
                      <li className=" hover:bg-gray-200 cursor-pointer">
                        <Link to={"/"}>Home</Link>
                      </li>
                      <li className=" hover:bg-gray-200 cursor-pointer">
                        <Link to={"/Admin/signUp"}>sign up</Link>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </header>
          <div className="w-full h-full flex items-center justify-center  mt-10 sm:mt-2 py-6">
            <div className="bg-gray-800 text-white md:w-1/4 sm:2/4 3/4 h-full px-3 py-4 flex-col space-y-4 rounded-lg shadow-2xl">
              <div className="text-center">
                <h1>
                  welcome to{" "}
                  <span className="text-xl font-semibold text-orange-300">
                    CourseHeaven
                  </span>
                </h1>
                <p className="opacity-50">Login to access admin dashboard</p>
              </div>
              <div className=" ">
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label htmlFor="email" className="block mb-1">
                      Email
                    </label>
                    <input
                      id="email"
                      className="w-full bg-gray-700 h-10 border border-gray-600 rounded px-2"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      type="email"
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block mb-1">
                      Password
                    </label>
                    <input
                      id="password"
                      className="w-full bg-gray-700 h-10 border border-gray-600 rounded px-2"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      type="password"
                    />
                  </div>
                  {errorMessage && (
                    <p className="text-red-400 text-center">{errorMessage}</p>
                  )}
                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-green-400 transition"
                  >
                    Submit
                  </button>
                  <div className="flex justify-between">
                    <p className="opacity-50">Don't have an account? </p>
                    <Link
                      to={"/Admin/signUp"}
                      className="text-blue-500 underline"
                    >
                      {" "}
                      SignUp
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
