import React, { useEffect, useState } from "react";
// logo is served from the Vite/CRA `public` folder — use an absolute path
import { Link } from "react-router-dom";
import { FaSquareInstagram } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa6";
import { PiCopyrightDuotone } from "react-icons/pi";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { CgProfile } from "react-icons/cg";
import { toast } from "react-hot-toast";
import { BACKEND_URL } from "../../utils/utils";

const Home = () => {
  
  const [courses, setcourses] = useState([]);
  const [isLoggedIn, setisLoggedIn] = useState(false);
  useEffect(() => {
      localStorage.getItem("token") ? setisLoggedIn(true) : setisLoggedIn(false);
  }, []);

  const handleLogut = async () => {
    try {
      const resp = await axios.get(`${BACKEND_URL}api/v1/user/logout`, {
        withCredentials: true,
      });

      toast.success(resp.data.message);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setisLoggedIn(false);
    } catch (error) {
      console.log("error in logout", error);
      toast.error(error.response.data.errros);
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}api/v1/course/courses`,
          {
            withCredentials: true,
          },
        );
        setcourses(response.data.courses);
        console.log(response.data.courses);
      } catch (error) {
        console.log("error in fetch course", error);
      }
    };
    fetchCourses();
  }, []);
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };

  return (
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
          {!isLoggedIn && (
            <div className="space-x-4">
              <Link
                to={"/admin/Dashboard"}
                className="bg-transparent text-white py-2 px-4 border border-white rounded hover:bg-green-400 hover:text-black transition duration-200"
              >
                Admin Dashboard
              </Link>
              <Link
                to={"/Login"}
                className="bg-transparent text-white py-2 px-4 border border-white rounded hover:bg-green-400 hover:text-black transition duration-200"
              >
                Login
              </Link>
              <Link
                to={"/signUp"}
                className="bg-transparent text-white py-2 px-4 border border-white rounded hover:bg-green-400 hover:text-black transition duration-200"
              >
                signUp
              </Link>
            </div>
          )}
          {isLoggedIn && (
            <div className="space-x-4 flex">
               <Link
                to={"/admin/Dashboard"}
                className="bg-transparent text-white py-2 px-4 border border-white rounded hover:bg-green-400 hover:text-black transition duration-200"
              >
                Admin Dashboard
              </Link>
              <Link
                to={""}
                className="bg-transparent text-white py-2 px-4 border border-white rounded hover:bg-green-400 hover:text-black transition duration-200 flex items-center justify-center space-x-1"
              >
                <p>
                  <CgProfile />
                </p>
                <p>profile</p>
              </Link>
              <Link
                to={""}
                className="bg-transparent text-white py-2 px-4 border border-white rounded hover:bg-green-400 hover:text-black transition duration-200"
              >
                My courses
              </Link>
              <Link
                to={""}
                className="bg-transparent text-white py-2 px-4 border border-white rounded hover:bg-green-400 hover:text-black transition duration-200"
              >
                settings
              </Link>
              <button
                onClick={handleLogut}
                className="bg-transparent text-white py-2 px-4 border border-white rounded hover:bg-green-400 hover:text-black transition duration-200"
              >
                Logout
              </button>
            </div>
          )}
        </header>

        {/* Main section */}
        <section className="flex flex-col justify-center items-center mt-20 space-y-4">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-4xl text-orange-300 font-semibold">
              CourseHaven
            </h1>
            <br />
            <p className=" font-light opacity-50">
              sharpen your skills with courses crafted by experts
            </p>
          </div>

          <div className="flex space-x-2 ">
            <Link
              to={"/courses"}
              className="bg-green-500 text-white w-36 p-2 font-bold text-center rounded border border-white hover:bg-white hover:text-black transition duration-200"
            >
              Explore courses
            </Link>
            <a
              href="https://www.youtube.com/@sujalgupta8966"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-black w-36 p-2 font-bold text-center rounded border border-white hover:bg-green-500 hover:text-white transition duration-200"
            >
              Courses video
            </a>
          </div>
        </section>
        <section>
          <Slider {...settings}>
            {courses.map((course) => {
              return (
                <div key={course._id} className="p-4">
                  <div className="relative flex-shrink-0 w-92 transition-transform duration-300 transform hover:scale-105">
                    <div className="bg-gray-900 rounded-lg overflow-hidden p-4">
                      <img
                        src={course.image.url}
                        alt={course.title}
                        className="h-32 w-full object-contain mix-blend-lighten text-white"
                      />
                      <div className="p-6 text-center">
                        <h2>{course.title}</h2>
                        <button className="mt-4 bg-orange-500 hover:bg-blue-500 text-white py-2 px-4 rounded duration-300">
                          Enroll Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </Slider>
        </section>
        <hr />
        <hr />
        {/* Footer */}
        <footer className="mt-6">
          <div className="grid grid-cols-1  md:grid-cols-3">
            <div>
              <div className="flex items-center space-x-2">
                <img
                  src="/logo.webp"
                  alt="CourseHeaven logo"
                  className="w-10 h-10 rounded-full"
                />
                <h1 className="text-2xl font-semibold text-orange-300">
                  CourseHeaven
                </h1>
              </div>
              <div className="flex p-3 mx-6 flex-col space-y-2">
                <h3>follow us on</h3>
                <div className="flex space-x-3 text-2xl">
                  <a
                    href="https://www.instagram.com/sujalrauniyar_4321/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-300 transition duration-300"
                  >
                    <FaSquareInstagram />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/sujal-kumar-7b1b053a1/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-300 transition duration-300"
                  >
                    <FaLinkedin />
                  </a>
                  <a
                    href="https://github.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-300 transition duration-300"
                  >
                    <FaGithub />
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center ">
              <h2 className="text-center text-2xl mb-2">Connects</h2>
              <a
                href=""
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition duration-300 cursor-pointer"
              >
                youtube-Nitian sujal
              </a>
              <a
                href=""
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition duration-300 cursor-pointer"
              >
                telegram-sujal kumar
              </a>
              <a
                href=""
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition duration-300 cursor-pointer"
              >
                github-sujal kumar
              </a>
            </div>
            <div className="">
              <div className="flex space-x-2 items-center justify-center mb-2">
                <h2 className="text-xl font-semibold">Copyrights</h2>
                <p>
                  <PiCopyrightDuotone />{" "}
                </p>
                <p>2024 </p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <ul className="text-gray-400">
                  <li className="text-gray-400 hover:text-white transition duration-300 cursor-pointer">
                    Terms & Conditions
                  </li>
                  <li className="text-gray-400 hover:text-white transition duration-300 cursor-pointer">
                    Privacy Policy
                  </li>
                  <li className="text-gray-400 hover:text-white transition duration-300 cursor-pointer">
                    Refund & Cancellation
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
