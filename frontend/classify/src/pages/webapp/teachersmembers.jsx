import React, { useState, useEffect } from 'react';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { api } from '../../utils';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../../components/widgets/loader';

const ClassMembers = () => {
  const [members, setMembers] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newStudentEmail, setNewStudentEmail] = useState('');
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

  const removeStudent = (index) => {
    const newMembers = [...members];
    newMembers.splice(index, 1);
    setMembers(newMembers);
  };

  const handleInviteClick = () => {
    if (newStudentEmail.trim()) {
      const name = newStudentEmail.split('@')[0];
      setMembers([...members, { user: { username: name, image_url: 'https://via.placeholder.com/150' }, showMenu: false }]);
      setNewStudentEmail('');
      setShowModal(false);
    }
  };

  if (!members) {
    return (
      <div className="h-[50vh] flex justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Class Members</h1>
        <div className="flex items-center">
          <span className="text-xs text-slate-400">{members.length} Members</span>
          <AiOutlineUserAdd
            onClick={() => setShowModal(true)}
            className="cursor-pointer inline-block ml-2 text-2xl text-purple-900"
          />
        </div>
      </div>

      {/* Student List */}
      <div className="space-y-4">
        {members.map((member, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-4 flex justify-between items-center border border-gray-300"
          >
            <div className="flex items-center space-x-4">
              <img
                className="w-12 h-12 rounded-full object-cover"
                src={member.user.image_url}
                alt="Profile"
              />
              <div>
                <h2 className="text-lg font-medium text-gray-800">{member.user.username}</h2>
                <p className="text-gray-500">Student</p>
              </div>
            </div>
            <div className="relative">
              <button
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                onClick={() => toggleMenu(index)}
              >
                <BsThreeDotsVertical className="h-6 w-6" />
              </button>
              {/* Options Menu */}
              {member.showMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg">
                  <button
                    onClick={() => removeStudent(index)}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg w-96">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add Student</h2>
            <input
              type="email"
              placeholder="Enter student email"
              value={newStudentEmail}
              onChange={(e) => setNewStudentEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleInviteClick}
                className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-500 focus:outline-none transition duration-200"
              >
                Invite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassMembers;
