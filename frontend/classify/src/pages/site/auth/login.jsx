import { useState } from 'react';
import 'daisyui/dist/full.css';
import PagesLayout from './UI/pageslayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({ email: '', password: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log(formData);

    // Add your form validation and API call logic here
    // Simulating API call delay for demo
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Login successful!');
    }, 2000);
  };

  return (
    <PagesLayout>
      <div className="flex items-center justify-center h-screen text-gray-800 mt-6">
        <div className="p-8 bg-white shadow-lg rounded-md max-w-md w-full">
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
