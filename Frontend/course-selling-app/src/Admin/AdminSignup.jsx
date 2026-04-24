import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";
import { toast } from "react-hot-toast";
import { BACKEND_URL } from "../../utils/utils";


const AdminSignup = () => {
  const navigate = useNavigate();
  const [click, setclick] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, seterrorMessage] = useState("")
  const hamToDropdown =(e)=>{
    e.preventDefault();
    setclick(!click);
  }
  const [formData, setFormData] = useState({
    firstName: "",
    LastName: "",
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    seterrorMessage("");
  };
  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
      const resp=await axios.post(`${BACKEND_URL}api/v1/admin/signUp`,formData
        ,{
          withCredentials:true,
          headers:{
            "Content-Type":"application/json"
          }
        }
      );
        toast.success(resp.data.message);
        console.log(formData);
        navigate("/Admin/Login");
      
    }
    catch(error){
       console.log("error in AdminSignup",error.response.data);
       seterrorMessage(error.response.data.error);
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
                to={"/Admin/Login"}
                className="bg-transparent text-white py-2 px-4 border border-white rounded hover:bg-green-400 hover:text-black transition duration-200"
              >
                Login
              </Link>
              <Link
                to={"/AdminSignup"}
                className="bg-green-500 text-white py-2 px-4 border border-white rounded hover:bg-transparent hover:text-white transition duration-200"
              >
                join now
              </Link>
            </div>
            <div className="block sm:hidden">
              {click && <button className="text-2xl"
              onClick={hamToDropdown} 
              >
                  <RxHamburgerMenu />
              </button>}
              {!click && 
                <div>
                  <button className="text-2xl"  onClick={hamToDropdown}>
                  <RxCross2 />
                  </button>
                  <div className="bg-white text-black rounded px-2 py-2 shadow-lg absolute right-11 top-12 w-20">
                    <ul>
                      <li className=" hover:bg-gray-200 cursor-pointer">
                        <Link to={"/"}>Home</Link>
                      </li>
                      <li className=" hover:bg-gray-200 cursor-pointer">
                        <Link to={"/Admin/Login"}>Login</Link>
                      </li>
                      <li className=" hover:bg-gray-200 cursor-pointer">
                        <Link to={"/AdminSignup"}>join now</Link>
                      </li>
                    </ul>
                  </div>

                </div>
              }
            </div>
          </header>
          <div className="w-full h-full flex items-center justify-center  sm:mt-2 py-6 mt-16">
            <div className="bg-gray-800 text-white w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 h-full px-3 py-4 flex-col space-y-4 rounded-lg shadow-2xl">
              <div className="text-center">
                <h1>
                  welcome to{" "}
                  <span className="text-xl font-semibold text-orange-300">
                    CourseHeaven
                  </span>
                </h1>
                <p className="opacity-50">just Signup to mess with dashboard</p>
              </div>
              <div className=" ">
                <form  onSubmit={handleSubmit} className="space-y-3"  >
                  <div>
                    <label htmlFor="firstName" className="block mb-1">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      className="w-full bg-gray-700 h-10 border border-gray-600 rounded px-2"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter your first name"
                      type="text"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="LastName" className="block mb-1">
                      Last Name
                    </label>
                    <input
                      id="LastName"
                      className="w-full bg-gray-700 h-10 border border-gray-600 rounded px-2"
                      name="LastName"
                      value={formData.LastName}
                      onChange={handleChange}
                      placeholder="Enter your last name"
                      type="text"
                      required
                    />
                  </div>

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
                      required
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
                      required
                    />
                  </div>
                  {errorMessage && 
                    <p className="text-red-400 text-center">{errorMessage}</p>
                  }
                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-green-400 transition"
                  >
                    Submit
                  </button>
                  
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;
