import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import 'daisyui/dist/full.css';
import {api} from "../../../utils"
const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    api.post("/auth/reset_email",{"email":email},{},500000,
      (data,status) => {
        console.log(datsa)
      },
      (error,status) => {

      },
      (error) => {

      }
    )
  };

  const isStep1Complete = () => {
    return email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); // Basic email validation
  };

  return (
    <div className="flex items-center justify-center h-screen text-gray-800 mt-6">
      <div className="p-8 bg-white rounded-lg max-w-md w-full">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-purple-600 mb-4">Forgot Password</h1>
            <hr />
          </div> */}

          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-light text-gray-600">Enter your email address</h2>
              <div className="relative">
                <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={email}
                  onChange={handleEmailChange}
                  className="input input-bordered w-full border-gray-300 bg-gray-100 text-gray-700 placeholder-gray-500 rounded-md pl-12"
                  required
                />
                {formErrors && <p className="text-red-600">{formErrors}</p>}
              </div>
              <button
                type="button"
                onClick={() => setStep(2)}
                className={`btn w-full rounded-md border-2 border-purple-800 text-purple-800 ${
                  isStep1Complete() ? 'btn-purple' : 'btn-gray'
                }`}
                disabled={!isStep1Complete()}
              >
                <FontAwesomeIcon icon={faChevronRight} className="w-5 h-5 inline-block mr-2" />
                Next
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-light text-gray-600">Confirm your email</h2>
              <p className="text-gray-700">We will send a password reset link to:</p>
              <div className="bg-gray-100 p-3 rounded-md text-gray-700">{email}</div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn btn-gray rounded-md"
                >
                  <FontAwesomeIcon icon={faChevronLeft} className="w-5 h-5 inline-block mr-2" />
                  Back
                </button>
                <button
                  type="submit"
                  className="btn btn-purple rounded-md"
                >
                  {isLoading ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    'Submit'
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
