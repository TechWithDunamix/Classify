import React, { useState } from 'react';
import { FaPen } from 'react-icons/fa'; // Import the pencil icon
import { api } from '../../../utils';
import {toast} from "react-toastify"
import { useEffect } from 'react';
import {Link} from "react-router-dom"
const ProfileSettings1 = () => {
  const [activeTab, setActiveTab] = useState('personalInfo');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [image,setImage] = useState()
  const [userData,setUserData] = useState()
  const fetchAPI = () => {
    api.get('/user/profile', {}, 50000,
        (data, status) => {
            
            setUserData(data)
            console.log(status)

           
        },
        (err, status) => {
            console.log(err,status)
         },
        
        (err) => {
            console.log(err)
        }

    )
}
useEffect(() => {
    fetchAPI()
},[])
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
        toast.success("Image Changed")
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

  const handleProfileChange = (e)=> {
    const {name, value} = e.target;
    setUserData((data) => ({
      ...data,
      [name]:value
    }))

  }

  const handlePrivacyChange = (key,value) => {
    setUserData((data) => ({
        ...data,
        [key]:value

    }))
  }
  const handleSubmitProfileData = () => {
    delete userData.profile_image
    api.put("/user/profile",userData,{},50000,
      (data,status) => {
        fetchAPI()
        console.log("updated")
        toast.success("Profile edited")
      },
      (error,status) => {
        if (status === 400){
          toast.error("AN error occured")
        }
      },
      (error) => {
        toast.error("Server is not to responding .")
      }
    )
  }

  const handlePrivacySubmit = (e) => {
    e.preventDefault()
    handleSubmitProfileData()
    fetchAPI()
  }
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
            src={newImage || userData?.profile_image}
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
        <h4 className="text-gray-900 text-2xl font-bold">{userData?.username}</h4>
        <p className="text-gray-500 text-base">{userData?.email}</p>
      </div>

      <div className="flex justify-center gap-4 md:gap-14 mb-6">
        <div className="flex flex-col items-center">
          <h3 className="text-purple-600 text-2xl font-bold">{userData?.post}</h3>
          <p className="text-gray-500 text-sm">Posts</p>
        </div>
        <div className="flex flex-col items-center">
          <h3 className="text-blue-600 text-2xl font-bold">{userData?.teaching}</h3>
          <p className="text-gray-500 text-sm">Teaching</p>
        </div>
        <div className="flex flex-col items-center">
          <h3 className="text-blue-600 text-2xl font-bold">{userData?.learning}</h3>
          <p className="text-gray-500 text-sm">Learning</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap mb-4 border-b border-gray-200">
        <button
          className={`flex-1 py-2 px-4 text-center ${activeTab === 'personalInfo' ? 'border-b-4 border-purple-600 font-semibold' : 'border-b-n border-transparent text-gray-600'} hover:border-b-none hover:border-purple-400 rounded-none`}
          onClick={() => setActiveTab('personalInfo')}
        >
          Personal Info
        </button>
        <button
          className={`flex-1 py-2 px-4 text-center ${activeTab === 'security' ? 'border-b-4 border-purple-600 font-semibold' : 'border-b-2 border-transparent text-gray-600'} hover:border-b-4 hover:border-purple-400 rounded-none`}
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
            <p>Go to account setting to change email or password . </p>
            <div className="space-y-2">
              <small className='text-slate-700 ml-4'>Username</small>
              <input
                type="text"
                placeholder=""
                name="username"
                value={userData?.username}
                onChange={handleProfileChange}
                className="w-full p-2 border border-gray-300 bg-white rounded-lg"
              />
              <small className='text-slate-700 ml-4'>Short Intro about yourself . </small>
              
              <textarea
                rows={5}
                name="intro"
                placeholder="Bio"
                value={userData?.intro}
                onChange={handleProfileChange}

                className="w-full p-2 border border-gray-300 bg-white rounded-lg"
              />
              <small className='text-slate-700 ml-4'>Date Of Birth</small>
              <br/>
              <input 
              type='date'
              name="dob"
              onChange={handleProfileChange}

              className='bg-white p-2 border '
              value={userData?.dob}
              />
            </div>
            <button 
            onClick={handleSubmitProfileData}
            className="mt-4 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 dark:hover:bg-purple-500">
              Save Changes
            </button>
          </div>
        )}
        {activeTab === 'security' && (
           <div class="container mx-auto my-8">
           <div class="bg-white shadow-md rounded-lg p-6">
               <h2 class="text-2xl font-semibold text-gray-800 mb-4">Settings</h2>
               
               <div class="mb-6">
                   <h3 class="text-xl font-bold mb-3 text-purple-600">Profile Settings</h3>
                    <p>To Change You Email and password go to <Link to="/auth/change/email-password" className="text-purple-500">Account Info .</Link> </p>

                   
               </div>
   
               <div class="mb-6">
                   <h3 class="text-xl font-bold mb-3 text-purple-600">Notification Settings</h3>
                   <form>
                       <div class="flex items-center mb-4">
                           <input 
                           onChange={() => handlePrivacyChange("notify",!userData.notify)}
                           type="checkbox" checked={userData?.notify} id="emailNotifications" class="h-4 bg-white w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" />

                           <label for="emailNotifications" class="ml-2 text-gray-700">Receive Email Notifications</label>
                       </div>
                       <div class="flex items-center mb-4">
                           <input 
                           onChange={() => handlePrivacyChange("recieve_email",!userData.recieve_email)}

                           type="checkbox" checked={userData?.recieve_email} id="smsNotifications" class="h-4 w-4 bg-white text-purple-600 focus:ring-purple-500 border-gray-300 rounded" />
                           <label for="smsNotifications" class="ml-2 text-gray-700 ">Receive Email Update</label>
                       </div>
                       <button 
                       onClick={handlePrivacySubmit}

                       type="submit" class="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">Save Notifications</button>
                   </form>
               </div>
   
               <div>
                   <h3 class="text-xl font-bold mb-3 text-purple-600">Privacy Settings</h3>
                   <form>
                       <div class="flex items-center mb-4">
                           <input
                           onChange={() => handlePrivacyChange("profile_type","public")}

                           checked={userData?.profile_type === "public"}
                           type="radio" name="profile_type" id="public" class="h-4 w-4 bg-white text-purple-600 focus:ring-purple-500 border-gray-300" />
                           <label for="public" class="ml-2 text-gray-700 bg-white">Public Profile</label>
                       </div>
                       <div class="flex items-center mb-4">
                           <input
                           onChange={() => handlePrivacyChange("profile_type","private")}

                           checked={userData?.profile_type === "private"}
                           
                           type="radio" name="profile_type" id="private" class="h-4 bg-white w-4 text-purple-600 focus:ring-purple-500 border-gray-300" />

                           <label for="private" class="ml-2 text-gray-700 bg-white">Private Profile</label>
                       </div>
                       <div class="flex items-center mb-4">
                           <input
                           onChange={() => handlePrivacyChange("profile_type","costum")}

                           checked={userData?.profile_type === "costum"}
                           
                           type="radio" name="profile_type" id="custom" class="h-4 w-4 bg-white  text-purple-600 focus:ring-purple-500 border-gray-300" />
                           <label for="custom" class="ml-2 text-gray-700  bg-white">Custom Privacy Settings</label>
                       </div>
                       <button type="submit" 
                       onClick={handlePrivacySubmit}
                       class="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">Save Privacy Settings</button>
                   </form>
               </div>
   
           </div>
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
            <img src={userData?.profile_image} alt="" className="w-36 h-36 rounded-full my-8" />
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
