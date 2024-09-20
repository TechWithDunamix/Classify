import { useState } from 'react';
import 'daisyui/dist/full.css';
import PagesLayout from '../../../components/UI/pageslayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { api } from '../../../utils';
const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({ email: '', password: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    toast.loading("Loading")
    e.preventDefault();
    // setIsLoading(true);
    console.log(formData);

    api.post("/auth/login",formData,{},500000,
      (data,status) => {
        window.location.href = "/d"
      },
      (error,status) => {
        setFormErrors((prev) => ({...prev,['email']:"Invalid user credentials."}))
        // toast.warn("INvalid")
        toast.dismiss()
        
      },
      (error) => {
        console.log(error)
      }

    )
  };

  return (
    <PagesLayout>
      <div className="flex items-center justify-center h-3/4 text-gray-800 mt-6">
        <div className="p-8 bg-white rounded-md max-w-md w-full">
          <h1 className="text-3xl font-bold text-center text-purple-600 mb-8">Classify Login</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="input input-bordered w-full border-gray-300 bg-gray-100 text-gray-700 placeholder-gray-500 rounded-md pl-12"
                required
              />
              {formErrors.email && <p className="text-red-600 text-sm mt-1">{formErrors.email}</p>}
            </div>
            <div className="relative">
              <FontAwesomeIcon icon={faLock} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="input input-bordered w-full border-gray-300 bg-gray-100 text-gray-700 placeholder-gray-500 rounded-md pl-12"
                required
              />
              {formErrors.password && <p className="text-red-600 text-sm mt-1">{formErrors.password}</p>}
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <a href="/forgot-password" className="text-sm text-purple-600 hover:underline">
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`btn ${isLoading ? 'loading' : 'btn-purple'} w-full bg-purple-600 text-white rounded-md`}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </PagesLayout>
  );
};

export default LoginForm;
