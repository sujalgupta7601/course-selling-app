import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { Link } from "react-router-dom";
import { BACKEND_URL } from "../../utils/utils";

const OurCourses = () => {
  const [courses, setcourses] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const admin = JSON.parse(localStorage.getItem("admin"));
  const token = admin?.token;

  console.log("Admin data:", admin);
  console.log("Token:", token);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setisLoading(true);
        const response = await axios.get(
          `${BACKEND_URL}/course/courses`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setcourses(response.data.courses);
        console.log("Courses response:", response.data.courses);
        setisLoading(false);
      } catch (error) {
        console.log("error in fetch course", error);
        console.log("Error response:", error.response);
        setisLoading(false);
      }
    };

    if (token) {
      fetchCourses();
    } else {
      console.log("No token found, admin not logged in");
      setisLoading(false);
    }
  }, [token]);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `${BACKEND_URL}api/v1/course/delete/${id}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success(response.data.message);
      console.log(response.data);
      // Remove the deleted course from the state
      setcourses(courses.filter((course) => course._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.error || "Error in deleting course");
      console.log("error in delete course", error);
    }
  };

  if (isLoading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (!token) {
    return (
      <div className="bg-gray-100 p-8 space-y-4">
        <h1 className="text-3xl font-bold text-center mb-8">Our Courses</h1>
        <p className="text-center text-red-500">Please login as admin to view courses</p>
        <Link
          className="bg-orange-400 py-2 px-4 rounded-lg text-white hover:bg-orange-950 duration-300 block text-center"
          to={"/admin/login"}
        >
          Login as Admin
        </Link>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="bg-gray-100 p-8 space-y-4">
        <h1 className="text-3xl font-bold text-center mb-8">Our Courses</h1>
        <p className="text-center text-gray-500">No courses found. Create your first course!</p>
        <Link
          className="bg-orange-400 py-2 px-4 rounded-lg text-white hover:bg-orange-950 duration-300 block text-center"
          to={"/admin/create-course"}
        >
          Create Course
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-8 space-y-4">
      <h1 className="text-3xl font-bold text-center mb-8">Our Courses</h1>
      <Link
        className="bg-orange-400 py-2 px-4 rounded-lg text-white hover:bg-orange-950 duration-300"
        to={"/admin/Dashboard"}
      >
        Go to dashboard
      </Link>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course._id} className="bg-white shadow-md rounded-lg p-4">
            {/* Course Image */}
            <img
              src={course?.image?.url}
              alt={course.title}
              className="h-40 w-full object-cover rounded-t-lg"
            />
            {/* Course Title */}
            <h2 className="text-xl font-semibold mt-4 text-gray-800">
              {course.title}
            </h2>
            {/* Course Description */}
            <p className="text-gray-600 mt-2 text-sm">
              {course.description.length > 200
                ? `${course.description.slice(0, 200)}...`
                : course.description}
            </p>
            {/* Course Price */}
            <div className="flex justify-between mt-4 text-gray-800 font-bold">
              <div>
                {" "}
                ₹{course.price}{" "}
                <span className="line-through text-gray-500">₹300</span>
              </div>
              <div className="text-green-600 text-sm mt-2">10 % off</div>
            </div>

            <div className="flex justify-between">
              <Link
                to={`/admin/course/update/${course._id}`}
                className="bg-orange-500 text-white py-2 px-4 mt-4 rounded hover:bg-blue-600"
              >
                Update
              </Link>
              <button
                onClick={() => handleDelete(course._id)}
                className="bg-red-500 text-white py-2 px-4 mt-4 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurCourses;
