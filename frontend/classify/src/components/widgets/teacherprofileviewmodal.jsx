// components/ProfileModal.jsx
import React from 'react';

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

const getEmojiForInterest = (interest) => {
  const item = interestsList.find(i => i.name === interest);
  return item ? item.emoji : '';
};

const ProfileModal = ({ user, onClose }) => {
  if (!user) return null;

  // Convert interests string to a list of tags
  const interestsArray = user.intrest.split(',').map(interest => interest.trim());
  
  const interestTags = interestsArray.map(interest => (
    <span key={interest} className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2 inline-flex items-center">
      <span className="mr-1">{getEmojiForInterest(interest)}</span>{interest}
    </span>
  ));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 max-w-lg">
        <div className="flex items-center mb-6">
          <img
            className="w-20 h-20 rounded-full mr-4"
            src={user.image_url}
            alt="Profile"
          />
          <div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-2">{user.username}</h2>
            <p className="text-gray-500 text-lg">{user.email}</p>
          </div>
        </div>
        <div className="mb-4">
          <p className="text-lg font-semibold text-gray-800 mb-1"><strong>Date of Birth:</strong></p>
          <p className="text-gray-600">{user.dob}</p>
        </div>
        <div className="mb-4">
          <p className="text-lg font-semibold text-gray-800 mb-1"><strong>Interests:</strong></p>
          <div className="flex flex-wrap">
            {interestTags}
          </div>
        </div>
        <div className="mb-4">
          <p className="text-lg font-semibold text-gray-800 mb-1"><strong>Introduction:</strong></p>
          <p className="text-gray-600">{user.intro}</p>
        </div>
        <div className="mb-4">
          <p className="text-lg font-semibold text-gray-800 mb-1"><strong>Date Joined:</strong></p>
          <p className="text-gray-600">{user.date_created.split('T')[0]}</p>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none transition duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
