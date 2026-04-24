import React, { isValidElement, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { FaDiscourse } from "react-icons/fa";
import { BiSolidPurchaseTag } from "react-icons/bi";
import { CiSettings } from "react-icons/ci";
import { FiLogIn } from "react-icons/fi";
import { FaSearch } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { RxHamburgerMenu } from "react-icons/rx";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { CiLogout } from "react-icons/ci";
import { BACKEND_URL } from "../../utils/utils";
const Purchases = () => {
  const navigate = useNavigate();
  const [courses, setcourses] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const logOrNot = () => {
    if (!isLoggedIn) {
      toast.error("Please login to purchase the course");
      navigate("/login");
    } 
  };

  useEffect(() => {
    localStorage.getItem("token") ? setisLoggedIn(true) : setisLoggedIn(false);
  }, []);

  const handleLogut = async () => {
    try {
      const resp = await axios.get(`${BACKEND_URL}/user/logout`, {
        withCredentials: true,
      });

      toast.success(resp.data.message);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setisLoggedIn(false);
      navigate("/");
    } catch (error) {
      console.log("error in logout", error);
      toast.error(error.response.data.errros);

    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/user/purchased`,
          {
            withCredentials: true,
            headers: {
            Authorization : `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        setcourses(response.data.courseData);
        setisLoading(false);
        console.log(response.data.courseData);
      } catch (error) {
        console.log("error in fetch course", errors);
      }
    };
    fetchCourses();
  }, []);
  return (
    <div className="flex w-full min-h-screen">
      <div className="bg-cyan-100 w-1/5 min-h-screen px-4 py-4 md:block hidden">
        <div className="flex items-center space-x-[5%]">
          <img
            src="/logo.webp"
            alt="courseHavean"
            className="h-10 w-10 rounded-full"
          />
          <h1 className="font-semibold text-orange-300 text-[clamp(0.5rem,1.5vw,1.5rem)]  ">
            CourseHeaven
          </h1>
        </div>
        <div className="px-3 mt-6 space-y-4">
          <Link
            to="/"
            className="flex items-center gap-2 hover:text-blue-500 cursor-pointer"
          >
            <FaHome /> Home
          </Link>
          <Link
            to="/courses"
            className="flex items-center gap-2 hover:text-blue-500 cursor-pointer"
          >
            <FaDiscourse /> Courses
          </Link>
          <Link
            to="/purchases"
            className="flex items-center gap-2 hover:text-blue-500 cursor-pointer"
          >
            <BiSolidPurchaseTag /> Purchases
          </Link>
          <Link
            to="/settings"
            className="flex items-center gap-2 hover:text-blue-500 cursor-pointer"
          >
            <CiSettings /> settings
          </Link>
          {isLoggedIn && (
            <button
              onClick={handleLogut}
              className="flex items-center gap-2 hover:text-blue-500 cursor-pointer"
            >
              <CiLogout /> Logout
            </button>
          )}
          {!isLoggedIn && (
            <Link
              to="/login"
              className="flex items-center gap-2 hover:text-blue-500 cursor-pointer"
            >
              <FiLogIn /> Login
            </Link>
          )}
        </div>
      </div>
      <div className="min-h-screen md:w-4/5 w-full px-[6%] pt-[2%]">
        {/* header */}
        <div className=" w-full flex justify-between items-center mb-8">
          <div className="font-semibold text-2xl">courses</div>
          <div className=" flex justify-between items-center space-x-2 ">
            <div className="flex  w-48 sm:w-56 md:w-72 lg:w-96 items-center justify-between border border-dotted rounded-lg  max-w-md">
              <input
                type="text"
                placeholder="Search courses..."
                className="outline-none w-full px-1 py-1 border-r-1 border-dotted"
              />
              <button className="flex items-center justify-center px-2  ">
                <FaSearch />
              </button>
            </div>
            <div className="text-3xl md:block hidden">
              <CgProfile />
            </div>
            <div className="relative">
              {/* 🔹 Hamburger */}
              {!isOpen && (
                <button onClick={() => setIsOpen(true)}>
                  <RxHamburgerMenu className="text-3xl md:hidden block" />
                </button>
              )}

              {/* 🔹 Sidebar */}
              <div
                className={`fixed top-0 left-0 h-full sm:w-64 w-40 bg-white shadow-lg transform transition-transform duration-300 z-50
            ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
              >
                {/* ❌ Cross button */}
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center justify-center">
                      <img
                        src="/logo.webp"
                        alt="courseHavean"
                        className="h-10 w-10 rounded-full"
                      />
                      <h1 className="font-semibold text-orange-300 text-[clamp(0.75rem,1.5vw,1.5rem)]  ">
                        CourseHeaven
                      </h1>
                    </div>

                    <div className="">
                      <button onClick={() => setIsOpen(false)}>
                        <RxCross2 className="text-2xl" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* 📋 Menu Items */}
                <div className="px-3 mt-6 space-y-4">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 hover:text-blue-500 cursor-pointer"
                  >
                    <CgProfile /> profile
                  </Link>
                  <Link
                    to="/"
                    className="flex items-center gap-2 hover:text-blue-500 cursor-pointer"
                  >
                    <FaHome /> Home
                  </Link>
                  <Link
                    to="/courses"
                    className="flex items-center gap-2 hover:text-blue-500 cursor-pointer"
                  >
                    <FaDiscourse /> Courses
                  </Link>
                  <Link
                    to="/purchases"
                    className="flex items-center gap-2 hover:text-blue-500 cursor-pointer"
                  >
                    <BiSolidPurchaseTag /> Purchases
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center gap-2 hover:text-blue-500 cursor-pointer"
                  >
                    <CiSettings /> settings
                  </Link>
                  <Link
                    to="/login"
                    className="flex items-center gap-2 hover:text-blue-500 cursor-pointer"
                  >
                    <FiLogIn /> Login
                  </Link>
                </div>
              </div>

              {/* 🔲 Overlay (optional but recommended) */}
              {isOpen && (
                <div
                  onClick={() => setIsOpen(false)}
                  className="fixed inset-0 bg-black/40 z-40"
                ></div>
              )}
            </div>
          </div>
        </div>
        {/* main section */}
        {!isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 space-between gap-4">
            {courses.map((course) => (
              <div
                key={course._id}
                className="w-[90%]  bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 mb-4"
              >
                {/* Image */}
                <img
                  src={course.image.url}
                  alt={course.title}
                  className="w-full aspect-[4/3]  object-cover"
                />

                {/* Content */}

                <div className="p-3 flex flex-col">
                  {/* Name */}
                  <h2 className="text-lg font-semibold">{course.title}</h2>

                  {/* Description */}
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {course.description}
                  </p>

                  {/* Price Section */}
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-green-600">
                      ₹{course.price}
                    </span>
                    <span className="text-sm line-through text-gray-400">
                      ₹6999
                    </span>
                    <span className="text-sm text-red-500">(50% OFF)</span>
                  </div>

                  {/* Button */}

                  <button onClick={logOrNot} className="mt-2 bg-orange-400 hover:bg-orange-500 text-white py-1 rounded-lg transition">
                    <Link to={`/buy/${course._id}`}>Buy Now</Link>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {isLoading && (
          <h1 className="text-center text-xl opacity-40">Loading...</h1>
        )}
      </div>
    </div>
  );
};

export default Purchases;
