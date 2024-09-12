import React, { useState } from 'react';
import { FaPen } from 'react-icons/fa'; // Import the pencil icon
import { api } from '../../../utils';
import {toast} from "react-toastify"
const ProfileSettings1 = ({ data }) => {
  const [activeTab, setActiveTab] = useState('personalInfo');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [image,setImage] = useState()

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(file)
      setNewImage(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = () => {
    const formData = new FormData()
    formData.append("profile_image",image)
    api.put("/user/profile",formData,{},50000,
      (data,status) => {
        setIsModalOpen(false)
      },
      (error,status) => {
        if (status === 400){
          toast.error("FIleType not supported or to large")
        }
      },
      (error) => {
        toast.error("Server is not to responding .")
      }
    )
  };

  return (
    <div className="relative mx-auto max-w-3xl bg-white shadow-3xl rounded-lg p-4">
      {/* Banner Image */}
      <div 
        className="relative h-44 bg-cover bg-center rounded-xl mb-16" 
        style={{ backgroundImage: 'url("https://i.ibb.co/FWggPq1/banner.png")' }}
      >
        {/* Profile Picture and Pencil Icon */}
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <img
            className="h-2/3 w-2/3 rounded-full"
            src={newImage || data?.profile_image}
            alt="Profile"
          />
          <button
            className="absolute p-3 bottom-0 right-24  bg-gray-200 rounded-full hover:bg-gray-300"
            onClick={() => setIsModalOpen(true)}
          >
            <FaPen className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* General Info */}
      <div className="text-center mb-6">
        <h4 className="text-gray-900 text-2xl font-bold">{data?.username}</h4>
        <p className="text-gray-500 text-base">{data?.email}</p>
      </div>

      <div className="flex justify-center gap-4 md:gap-14 mb-6">
        <div className="flex flex-col items-center">
          <h3 className="text-purple-600 text-2xl font-bold">17</h3>
          <p className="text-gray-500 text-sm">Posts</p>
        </div>
        <div className="flex flex-col items-center">
          <h3 className="text-blue-600 text-2xl font-bold">9.7K</h3>
          <p className="text-gray-500 text-sm">Followers</p>
        </div>
        <div className="flex flex-col items-center">
          <h3 className="text-blue-600 text-2xl font-bold">434</h3>
          <p className="text-gray-500 text-sm">Following</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap mb-4 border-b border-gray-200">
        <button
          className={`flex-1 py-2 px-4 text-center ${activeTab === 'personalInfo' ? 'border-b-4 border-purple-600 font-semibold' : 'border-b-4 border-transparent text-gray-600'} hover:border-b-4 hover:border-purple-400`}
          onClick={() => setActiveTab('personalInfo')}
        >
          Personal Info
        </button>
        <button
          className={`flex-1 py-2 px-4 text-center ${activeTab === 'security' ? 'border-b-4 border-purple-600 font-semibold' : 'border-b-4 border-transparent text-gray-600'} hover:border-b-4 hover:border-purple-400`}
          onClick={() => setActiveTab('security')}
        >
          Security
        </button>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'personalInfo' && (
          <div className="p-4 bg-gray-100 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Personal Information</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg"
              />
              <input
                type="tel"
                placeholder="Phone"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg"
              />
            </div>
            <button className="mt-4 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 dark:hover:bg-purple-500">
              Save Changes
            </button>
          </div>
        )}
        {activeTab === 'security' && (
          <div className="p-4 bg-gray-100 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Security Settings</h2>
            <p className="text-gray-500 dark:text-gray-400">Security settings content goes here.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center z-50 justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white py-2 px-3 rounded-lg shadow-lg w-3/4">
            <div className="flex justify-center w-full text-purple-900 border-b-[0.8px]">
              
              <p>Classify</p>
            </div>
            <h3 className="text-lg font-semibold mb-4">Upload New Profile Image</h3>
            <img src={data?.profile_image} alt="" className="w-36 h-36 rounded-full my-8" />
            <p className='text-sm text-slate-700 my-3'>
            Your profile photo represents you visually, making it easier for others to recognize you and adding a personal touch.
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mb-4"
            />
           
           <div>
        <button
              onClick={handleImageUpload}
              className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700"
            >
              Upload
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="ml-4 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>

        </div>
          </div>
        
        </div>
      )}
    </div>
  );
};

export default ProfileSettings1;
