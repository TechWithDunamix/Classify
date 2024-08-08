// components/ProfileSettings.js
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { api } from '../../../utils';
import { faClose } from '@fortawesome/free-solid-svg-icons';
const ProfileSettings1 = ({data}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [image,setImage] = useState()
  const [imageUrl,setImageUrl] = useState(data.image_url)
  
  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

 

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append("profile_image",image)

    api.put("/user/profile",formData,{},5000,
      (data,status) => {
        console.log(data)
        window.location.reload()
        return ;
      },
      (err,status) => {
        console.log(status)
      }
    )
  }

  return (
    <div className="p-4 bg-white rounded-lg border-2 rounded-md">
      <h1 className="text-[1rem] font-extralight mb-4">Profile</h1>
      <p className='mt-4'>Profile picture</p>

      <div className="profile-picture flex mb-4 gap-4 mt-4">
        <img
          src={data.image_url}
          alt="Profile"
          className="rounded-full w-10 h-10"
        />
        <button
          onClick={handleModalOpen}
          className="text-purple-500"
        >
          Change
        </button>
      </div>
      <div className="account-settings mb-4 mt-8">
        <h2 className="text-[1.4rem] ">Account Settings</h2>
        <p className="mt-2 text-[0.8rem]">
          Change your password and security options, and access other Classify services.
          <a className="text-purple-500 btn-sm mt-2">Manage</a>
        </p>
      </div>
      <div className="change-name mt-8">
        <h2 className="text-[1.4rem]">Change Name</h2>
        <p className="mt-2 text-[0.8rem]">
          To change your name, go to your account settings.
          <a className="text-purple-800 mx-5">Go to Account Settings</a>
        </p>
      </div>

      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box min-h-28">
           <div className='flex flex-3 justify-between'>
                <button onClick={(e) => setIsModalOpen(false)}>
                    <FontAwesomeIcon icon={faClose} />
                </button>
                <p className='text-purple-800 text-[1.4rem]'>Cassify</p>
                <p>Profile Image</p>
           </div>


           <p className='text-lg mb-3'>Profile Image</p>
           <p className='text-[0.9rem] text-slate-800 font-extralight'>A picture helps people recognize you and lets you know when you’re 
            signed in to your account
           </p>

           <img
          src={data.image_url}
          alt="Profile"
          className="rounded-full w-[12rem] h-[12rem] text-center mt-8"
            />

         <input onChange = {(e) => setImage(e.target.files[0])} type="file" className="file-input file-input-bordered w-full max-w-xs mt-10 " />

         <button onClick = {handleSubmit} className='mx-2 my-2 btn bg-purple-950 text-white mt-4 rounded-sm'>Upload</button>

           
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings1;
