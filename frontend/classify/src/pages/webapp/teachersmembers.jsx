import React, { useState, useEffect } from 'react';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { api } from '../../utils';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../../components/widgets/loader';
import ProfileModal from '../../components/widgets/teacherprofileviewmodal';
import { ExclamationCircleIcon } from '@heroicons/react/outline';
const ClassMembers = () => {
  const [members, setMembers] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { id } = useParams();

  const fetchData = () => {
    api.get(
      `/class/${id}`,
      {},
      50000,
      (data, status) => setMembers(data.members),
      (error, status) => {
        if (status === 404) {
          window.location.href = '/not-found';
        }
        console.error('Fetch error:', error);
      },
      (error) => {
        toast.error('Server is too slow!');
      }
    );
  };

  useEffect(fetchData, [id]);

  const toggleMenu = (index) => {
    setMembers(members.map((member, i) => ({
      ...member,
      showMenu: i === index ? !member.showMenu : false
    })));
  };

  const removeStudent = (student_id) => {
    api.delete(`/class/members/${student_id}?class_id=${id}`,{},50000,
        (data,staus) => {
            toast.success("Student remover succesfully")
            fetchData()

        },
        (error,status) => {
            if (status === 404){
                toast.error("Not Found")
            }
        },
        (error) => {
            toast.error("Sevrer is not responding !")
        }
    )
    
  };

  const handleInviteClick = () => {
    if (newStudentEmail.trim()) {
      const name = newStudentEmail.split('@')[0];
      setMembers([
        ...members,
        {
          user: { username: name, image_url: 'https://via.placeholder.com/150' },
          date_joined: new Date().toLocaleDateString(),
          showMenu: false
        }
      ]);
      setNewStudentEmail('');
      setShowModal(false);
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowProfile(true);
  };

  const handleCloseProfile = () => {
    setShowProfile(false);
    setSelectedUser(null);
  };

  if (!members) {
    return (
      <div className="h-[50vh] flex justify-center">
        <Loader />
      </div>
    );
  }

  const filteredMembers = members.filter(member =>
    member.user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filteredMembers.length === 0){
    return (
      
        <div className='h-[70vh] flex items-center justify-center text-slate-700'>
            <div>
            <ExclamationCircleIcon />
            <p>No Members Yet!</p>
            </div>
        </div>
    )
  }
  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="md:flex justify-between items-center mb-8">
        <h1 className="md:text-xl  text-gray-800">Class Members</h1>
        <div className="md:flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search by username"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          {/* <AiOutlineUserAdd
            onClick={() => setShowModal(true)}
            className="cursor-pointer inline-block ml-2 text-2xl text-purple-900"
          /> */}
          <p className="text-xs text-slate-400">{filteredMembers.length} Members</p>
          
        </div>
      </div>

      {/* Student List */}
      <div className="space-y-4">
        {filteredMembers.map((member, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-4 flex justify-between items-center border border-gray-300"
          >
            <div className="flex items-center space-x-4">
              <img
                className="w-12 h-12 rounded-full object-cover cursor-pointer"
                src={member.user.image_url}
                alt="Profile"
                onClick={() => handleUserClick(member.user)}
              />
              <div>
                <h2 className="text-lg font-medium text-gray-800">{member.user.username}</h2>
                <p className="text-gray-500">Student</p>
                <p className="text-gray-400 text-sm">Date Joined: {member.date_joined || 'N/A'}</p>
              </div>
            </div>
            <div className="relative">
              <button
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                onClick={() => toggleMenu(index)}
              >
                <BsThreeDotsVertical className="h-6 w-6" />
              </button>
              {member.showMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg">
                  <button
                    onClick={() => removeStudent(member.user.id)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Remove Student
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Adding Students */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Add New Student</h2>
            <input
              type="email"
              placeholder="Enter student email"
              value={newStudentEmail}
              onChange={(e) => setNewStudentEmail(e.target.value)}
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <div className="flex justify-end">
              <button
                className="bg-purple-500 text-white px-4 py-2 rounded-md"
                onClick={handleInviteClick}
              >
                Invite
              </button>
              <button
                className="ml-2 bg-gray-500 text-white px-4 py-2 rounded-md"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfile && selectedUser && (
        <ProfileModal user={selectedUser} onClose={handleCloseProfile} />
        
      )}
    </div>
  );
};

export default ClassMembers;
