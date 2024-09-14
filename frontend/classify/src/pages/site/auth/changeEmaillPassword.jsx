import React, { useState } from "react";
import { api } from "../../../utils";
import DashboardLayout from "../../../components/UI/dashboardlayout";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
const ChangeEmailPassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [isPasswordConfirmed, setIsPasswordConfirmed] = useState(false);

  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading,setIsloading] = useState(false)
  loading && toast.loading("Loading ")

  const handlePasswordConfirmation = (e) => {
    e.preventDefault();
    setIsloading(true)
    const formData = {
        email:localStorage.getItem("email"),
        password : currentPassword
    }
    api.post("/auth/login",formData,{},500000,
        (data,success) => {
            toast.dismiss()

            toast.success("Success .")
            setIsloading(false)
            setIsPasswordConfirmed(true)
            setCurrentPassword("")
        },
        (error,status) => {
            if (status === 400){
                toast.dismiss()

                toast.error("Invalid credentials .")
                setIsloading(false)

            }
        },
        (error)=>{
            toast.error("Server is too slow .")
        }
    )
  };

  const handleEmailUpdate = (e) => {
        e.preventDefault()
        toast.loading("Loading")
        const formData = {
            "email" : newEmail
        }
        api.post("/auth/change_password_email",formData,{},50000,
            (data,status) => {
                console.log(data)
                toast.dismiss()
                localStorage.setItem("email",data.email)
                setIsPasswordConfirmed(true)
                toast.success("Success")
                
            },
            (error,status)=>{

            },
            (error) => {
                toast.error("Server is slow")
            }
        )
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in both password fields.");
    } else if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match.");
    } else {
        e.preventDefault()
        toast.loading("Loading")
        const formData = {
            "password" : newPassword
        }
        api.post("/auth/change_password_email",formData,{},50000,
            (data,status) => {
                console.log(data)
                toast.dismiss()
                localStorage.setItem("email",data.email)
                setIsPasswordConfirmed(true)
                toast.success("Success")

            },
            (error,status)=>{

            },
            (error) => {
                toast.error("Server is slow")
            }
        )
    }
  };

  return (
    <DashboardLayout>
    <div className="container mx-auto px-4 py-8">
    <Link to={"/profile"}><FaArrowLeft /></Link>
      <div className="max-w-lg mx-auto bg-white  rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Account Settings
        </h2>

        {/* Confirm Current Password Section */}
        <div className="mb-6">
          <h3 className="text-xl font-medium text-gray-700 mb-3">
            Confirm Current Password
          </h3>
          <form onSubmit={handlePasswordConfirmation} className="space-y-4">
            <div>
              <label
                htmlFor="confirmCurrentPassword"
                className="block text-gray-600"
              >
                Current Password
              </label>
              <p className="text-sm text-slate-500">You must confirm your password 
                change your email or password .
              </p>
              <input
                type="password"
                id="confirmCurrentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-white px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-purple-300"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
            >
              Confirm Password
            </button>
          </form>
        </div>

        <hr className="my-6" />

        {/* Email Update Section */}
        <div className="mb-6">
          <h3 className="text-xl font-medium text-gray-700 mb-3">Change Email</h3>
          <form onSubmit={handleEmailUpdate} className="space-y-4">
            <div>
              <label htmlFor="newEmail" className="block text-gray-600">
                New Email
              </label>
              <input
                type="email"
                id="newEmail"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full bg-white px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-purple-300"
                disabled={!isPasswordConfirmed}
              />
            </div>
            <button
              type="submit"
              disabled={!isPasswordConfirmed}
              className={`w-full ${
                isPasswordConfirmed
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-gray-400 cursor-not-allowed"
              } text-white py-2 rounded`}
            >
              Update Email
            </button>
          </form>
        </div>

        <hr className="my-6" />

        {/* Password Update Section */}
        <div className="mb-6">
          <h3 className="text-xl font-medium text-gray-700 mb-3">
            Change Password
          </h3>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div>
              <label htmlFor="newPassword" className="block text-gray-600">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring focus:ring-purple-300"
                disabled={!isPasswordConfirmed}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-gray-600">
                Confirm New Password
              </label>
             
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring focus:ring-purple-300"
                disabled={!isPasswordConfirmed}
              />
            </div>
            <button
              type="submit"
              disabled={!isPasswordConfirmed}
              className={`w-full ${
                isPasswordConfirmed
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-gray-400 cursor-not-allowed"
              } text-white py-2 rounded`}
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
};

export default ChangeEmailPassword;
