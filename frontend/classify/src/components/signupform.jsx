import { useState } from 'react';
import 'daisyui/dist/full.css';
import PagesLayout from './UI/pageslayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft, faEnvelope, faLock, faUser, faCalendarDay, faFileImage, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { api } from '../utils';
import { toast } from 'react-toastify';
import Loader from './widgets/loader';
const interestsList = [
  { name: 'Programming', emoji: '💻' },
  { name: 'Design', emoji: '🎨' },
  { name: 'Music', emoji: '🎵' },
  { name: 'Gaming', emoji: '🎮' },
  { name: 'Travel', emoji: '✈️' },
  { name: 'Cooking', emoji: '🍳' },
  { name: 'Reading', emoji: '📚' },
  { name: 'Fitness', emoji: '🏋️‍♂️' },
  { name: 'Movies', emoji: '🎬' },
  { name: 'Photography', emoji: '📸' },
  { name: 'Technology', emoji: '🔧' },
  { name: 'Nature', emoji: '🌿' },
  { name: 'Art', emoji: '🖼️' },
  { name: 'Sports', emoji: '⚽' },
  { name: 'Science', emoji: '🔬' }
];

const SignUpForm = () => {
  const [step, setStep] = useState(1);
  const[isLoading,SetIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    username: '',
    dob: '',
    interest: [],
    profile_image: null,
    intro: '',
    agreeToTerms: false,
  });
  const [formErrors,setFormErrors] = useState(
      {
        "email" : ""
      }
  )
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    setFormData((prev) => ({ ...prev, agreeToTerms: e.target.checked }));
  };

  const handleInterestChange = (interest) => {
    setFormData((prev) => {
      const updatedInterests = prev.interest.includes(interest)
        ? prev.interest.filter((i) => i !== interest)
        : prev.interest.length < 5
        ? [...prev.interest, interest]
        : prev.interest;
      return { ...prev, interest: updatedInterests };
    });
  };

  const handleFileChange = (e) => {
    console.log(e.target.files)
    setFormData((prev) => ({ ...prev, profileImage: e.target.files}));
  };

  const isStep1Complete = () => {
    return formData.email && formData.password && formData.full_name && formData.username && formData.dob;
  };

  const isStep2Complete = () => {
    return formData.interest.length > 0 && formData.agreeToTerms;
  };

  const isStep3Complete = () => {
    return formData.profileImage;
  };

  const handleSubmit = async (e) => {
    SetIsLoading(true)
    e.preventDefault();
    console.log(formData); 
    formData['intrest'] = formData.interest
    const data = new FormData();
    Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
    });
    data.append("profile_image",formData.profileImage[0])
    
    api.post('/auth/signup/', data, {}, 50000,
      (data, status) => {
          SetIsLoading(false)
          console.log(data)
          localStorage.setItem("token",data.token)
          localStorage.setItem("email",data.email)
          localStorage.setItem("id",data.id)
      },
      (err, status) => {

        SetIsLoading(false)
        if (status === 400){
          setStep(1)
          setFormErrors(
            err.message
          )
        }
      },
      (err) => toast.error("Server is slow be petient")
    );
  };

  return (
    <PagesLayout>
      <div className="flex items-center justify-center h-screen  text-gray-800 mt-6">
        {/* Form Section */}
        <div className="relative p-8 bg-white max-w-full md:max-w-lg lg:max-w-2xl xl:max-w-3xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-purple-600 mb-8">Classify</h1>

              <hr />
            </div>
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-6 md:w-[600px]">
                <h2 className="text-2xl font-extralight text-slate-600">Basic Information</h2>
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
                  <p className='text-red-900'>{formErrors.email}</p>
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
                </div>
                <div className="relative">
                  <FontAwesomeIcon icon={faUser} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    name="full_name"
                    placeholder="Full Name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className="input input-bordered w-full border-gray-300 bg-gray-100 text-gray-700 placeholder-gray-500 rounded-md pl-12"
                  />
                </div>
                <div className="relative">
                  <FontAwesomeIcon icon={faUser} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="input input-bordered w-full border-gray-300 bg-gray-100 text-gray-700 placeholder-gray-500 rounded-md pl-12"
                  />
                </div>
                <div className="relative">
                  <FontAwesomeIcon icon={faCalendarDay} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="date"
                    name="dob"
                    placeholder="Date of Birth"
                    value={formData.dob}
                    onChange={handleInputChange}
                    className="input input-bordered w-full border-gray-300 bg-gray-100 text-gray-700 placeholder-gray-500 rounded-md pl-12"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className={`btn ${isStep1Complete() ? 'btn-purple' : 'btn-gray'} w-full rounded-md border-2 border-purple-800 text-pretty text-purple-800`}
                  disabled={!isStep1Complete()}
                >
                  <FontAwesomeIcon icon={faChevronRight} className="w-5 h-5 inline-block mr-2" />
                  Next
                </button>
              </div>
            )}

            {/* Step 2: Interests and Terms */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-extralight text-slate-600">Interests & Terms</h2>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 mb-4">
                  {interestsList.map((interest) => (
                    <button
                      key={interest.name}
                      type="button"
                      onClick={() => handleInterestChange(interest.name)}
                      className={`btn ${formData.interest.includes(interest.name) ? 'bg-purple-600 text-white' : 'btn-gray'} w-full rounded-md`}
                      disabled={formData.interest.includes(interest.name) && formData.interest.length >= 5}
                    >
                      {interest.emoji} {interest.name}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <FontAwesomeIcon icon={faInfoCircle} className="absolute left-3 top-3 text-gray-400" />
                  <textarea
                    name="intro"
                    placeholder="Intro"
                    value={formData.intro}
                    onChange={handleInputChange}
                    className="textarea textarea-bordered w-full border-gray-300 bg-gray-100 text-gray-700 placeholder-gray-500 rounded-md pl-12"
                  />
                </div>
                <label className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleCheckboxChange}
                    className="checkbox checkbox-primary mr-2"
                    required
                  />
                  <span>I agree to the privacy and terms.</span>
                </label>
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
                    type="button"
                    onClick={() => setStep(3)}
                    className={`btn ${isStep2Complete() ? 'btn-purple' : 'btn-gray'} rounded-md text-purple-800 border-2 border-purple-800`}
                    disabled={!isStep2Complete()}
                  >
                    <FontAwesomeIcon icon={faChevronRight} className="w-5 h-5 inline-block mr-2" />
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Profile Image Upload */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-extralight text-slate-400">Profile Image Upload</h2>
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32 mb-4">
                    <img
                      src={formData.profileImage ? URL.createObjectURL(formData.profileImage[0]) : '/path/to/placeholder-avatar.png'}
                      alt="Profile Preview"
                      className="w-full h-full rounded-full object-cover border-2 border-purple-600"
                    />
                    {!formData.profileImage && (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <FontAwesomeIcon icon={faUser} className="w-5 h-5 inline-block mr-2" />
                        
                      </div>
                    )}
                  </div>
                  <label className="relative block mb-4">
                    <FontAwesomeIcon icon={faFileImage} className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="file"
                      name="profileImage"
                      onChange={handleFileChange}
                      className="file-input file-input-bordered file-input-lg w-full border-gray-300 bg-gray-100 text-gray-700 rounded-md pl-12"
                    />
                  </label>
                </div>
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="btn btn-gray rounded-md"
                  >
                    <FontAwesomeIcon icon={faChevronLeft} className="w-5 h-5 inline-block mr-2" />
                    Back
                  </button>
                  <button
                    type="submit"
                    className={`btn ${isStep3Complete() ? 'btn-purple' : 'btn-gray'} rounded-md border-2 text-purple-800 border-purple-800`}
                    disabled={!isStep3Complete()}
                  >
                    <FontAwesomeIcon icon={faChevronRight} className="w-5 h-5 inline-block mr-2" />
                    Finish
                  </button>
                 
                </div>
                {isLoading && <Loader />}
              </div>
            )}
          </form>
        </div>
      </div>
    </PagesLayout>
  );
};

export default SignUpForm;
