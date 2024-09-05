import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loader from "../../components/widgets/loader";
import { api } from "../../utils";
import {
  faPen,
  faCommentDots,
  faStream,
  faCode,
  faLink,
} from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const ClassSettings = () => {
  const { id } = useParams();
  const [classData, setClassData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = () => {
    api.get(
      `/class/${id}`,
      {},
      50000,
      (data, status) => {
        const ClassData = {
          name: data.name,
          category: data.category,
          description: data.description,
          default_grade: data.setting.default_grade,
          student_can_post: data.setting.student_can_post,
          student_can_comment: data.setting.student_can_comment,
          use_code: data.setting.use_code,
        };
        setClassData(ClassData);
        console.log(classData);
      },
      (error, status) => {
        console.error("Fetch error:", error);
        if (status === 400) {
          window.location.href = "/not-found";
        }
      },
      (error) => {
        toast.error("Server is too slow. Try refreshing");
      }
    );
  };

  useEffect(fetchData, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === "checkbox" ? checked : value;

    setClassData((prevClassData) => ({
      ...prevClassData,
      [name]: inputValue,
    }));
  };

  const handleSubmit = () => {
    setIsLoading(true);
    api.put(
      `/class/${id}`,
      classData,
      {},
      50000,
      (data, status) => {
        window.location.href = "/d";
      },
      (err, status) => {
        setIsLoading(false);

        if (status === 404) {
          window.location.href = "/not-found";
        }
      },
      (error) => {
        setIsLoading(false);
        alert("Error: Timeout");
      }
    );
  };

  const handleDelete = () => {
    api.delete()
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-xl">
        {/* Basic Info Section */}
        <div className="md:p-4 border-2 p-6 rounded-md bg-white shadow-lg">
          <p className="mx-3 flex items-center text-slate-700 text-lg">
            <FontAwesomeIcon icon={faPen} className="mr-2 text-slate-500" />
            Basic info
          </p>
          <input
            name="name"
            value={classData.name}
            onChange={handleInputChange}
            placeholder="Class Name (required)"
            className="form-input bg-slate-100 w-full py-4 border-0 border-b-[1px] border-slate-400 px-4"
            required
          />

          <textarea
            name="description"
            value={classData.description}
            onChange={handleInputChange}
            rows={3}
            placeholder="Class Description (required)"
            className="my-6 form-input bg-slate-100 w-full py-4 border-0 border-b-[1px] border-slate-400 px-4"
            required
          />

          <input
            name="category"
            value={classData.category}
            onChange={handleInputChange}
            placeholder="Class Category (required)"
            className="form-input bg-slate-100 w-full py-4 border-0 border-b-[1px] border-slate-400 px-4 my-6"
            required
          />
        </div>

        {/* Settings Section */}
        <div className="mt-8">
          <p className="mx-3 flex items-center text-slate-700 text-lg">
            <FontAwesomeIcon icon={faPen} className="mr-2 text-slate-500" />
            Settings
          </p>
          <div className="md:p-4 border-2 p-6 rounded-md mt-6 bg-white shadow-lg space-y-6">
            {/* Stream Settings */}
            <div className="flex justify-between items-center">
              <label className="flex items-center text-slate-700">
                <FontAwesomeIcon
                  icon={faCommentDots}
                  className="mr-2 text-slate-500"
                />
                Students can post
              </label>
              <input
                name="student_can_post"
                type="checkbox"
                checked={classData.student_can_post}
                onChange={handleInputChange}
                className="toggle toggle-primary checked:bg-purple-600"
              />
            </div>

            <hr className="border-slate-300" />

            <div className="flex justify-between items-center">
              <label className="flex items-center text-slate-700">
                <FontAwesomeIcon
                  icon={faCommentDots}
                  className="mr-2 text-slate-500"
                />
                Students can comment
              </label>
              <input
                name="student_can_comment"
                type="checkbox"
                checked={classData.student_can_comment}
                onChange={handleInputChange}
                className="toggle toggle-primary checked:bg-purple-600"
              />
            </div>

            <div className="flex justify-between items-center">
              <label className="flex items-center text-slate-700">
                <FontAwesomeIcon icon={faStream} className="mr-2 text-slate-500" />
                Classwork on the Stream
              </label>
              <input
                type="checkbox"
                className="toggle toggle-primary checked:bg-purple-600"
              />
            </div>

            {/* Class Link */}
            <div className="flex justify-between items-center">
              <label className="flex items-center text-slate-700">
                <FontAwesomeIcon icon={faCode} className="mr-2 text-slate-500" />
                Class Link
              </label>
              <input
                type="checkbox"
                name="use_code"
                checked={classData.use_code}
                onChange={handleInputChange}
                className="toggle toggle-primary checked:bg-purple-600"
              />
            </div>

            <hr className="border-slate-300" />

            {/* Manage Meet Link */}
            <div className="flex justify-between items-center">
              <label className="flex items-center text-slate-700">
                <FontAwesomeIcon icon={faLink} className="mr-2 text-slate-500" />
                Manage Meet link
              </label>
            </div>

            <div className="text-slate-600 mt-4">
              <p>Classroom Meet link</p>
              <p>Classroom Meet links offer added safety features.</p>
              <a
                href="#"
                className="text-blue-600 underline cursor-pointer hover:text-blue-800"
              >
                Learn more
              </a>
              <p className="mt-2 text-red-600">
                You don’t have permission to create or edit the Meet link.
                Contact your admin to get access.
              </p>
            </div>

            {/* Default Grade */}
            <div className="flex justify-between items-center">
              <input
                type="number"
                value={classData.default_grade}
                onChange={handleInputChange}
                name="default_grade"
                placeholder="Default grade"
                className="form-input bg-slate-100 w-full py-4 border-0 border-b-[1px] border-slate-400 px-4"
              />
            </div>

            <button
              className="btn bg-purple-800 text-white ml-auto mt-4"
              onClick={handleSubmit}
            >
              Apply
            </button>

            {isLoading && <Loader />}

            <button
              className="btn bg-red-200 text-white ml-auto mt-4"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>

          
         
        </div>
      </div>
    </div>
  );
};

export default ClassSettings;
