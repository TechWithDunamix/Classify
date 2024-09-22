import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from "../../../utils";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { token } = useParams();  // Get token from URL params
  const [tokenValid, setTokenValid] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [authToken,setAuthToken] = useState(localStorage.getItem("token"))

  // Validate token when the component mounts
  useEffect(() => {
    toast.dismiss()
    toast.loading("Validating token...");
    const validateToken = async () => {
      api.post(`/auth/verify_token/${token}`, {}, {}, 500000,
        (data, status) => {
          setTokenValid(true);
          toast.dismiss();
          localStorage.setItem("token",data.token)
          localStorage.setItem("id",data.id)
          localStorage.setItem("email",data.email)
          setAuthToken(data.token)

          

        },
        (error, status) => {
          if (status === 400) {
            // setTokenValid(false);
            toast.dismiss();
            toast.error("Invalid Token");
            setTokenValid(false)
          }
        }
      );
    };

    validateToken();
  }, [token]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    api.post("/auth/change_password_email",{"password":password},{
      'Authorization': `Token ${authToken}`
      
    },50000,
      (data,status) => {
          console.log(data)
          toast.dismiss()
          localStorage.setItem("email",data.email)
          // setIsPasswordConfirmed(true)
          toast.success("Success")
          window.location.href = "/d"

      },
      (error,status)=>{

      },
      (error) => {
          toast.error("Server is slow")
      }
  )
    // Continue with password reset logic
    // toast.success("Passssword reset successfully!");
  };

  if (tokenValid === false){
    return (
    <div className="flex h-[80%] justify-center items-center bg-gray-100">
    <div className="text-center">
    <h1 className="text-4xl font-bold mb-4  text-purple-600">Classify</h1>
    <p className="text-lg  text-red-600">Invalid token</p>
    </div>
    </div>

    )
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg  w-full max-w-md">
        <p className='text-center text-purple-800'>Classify</p>
        <h2 className="text-2xl font-semibold text-center mb-6">Reset Your Password</h2>
        {error && <div className="text-red-600 mb-4 text-center">{error}</div>}
        {success && <div className="text-green-600 mb-4 text-center">{success}</div>}
        
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition-colors">
              Reset Password
            </button>
          </form>
        

        {/* {!tokenValid && <div className="text-red-600 text-center">Invalid or expired token.</div>} */}
      </div>
    </div>
  );
};

export default ResetPassword;
