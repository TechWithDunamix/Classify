// SubmissionCard.js
import React, { useState } from 'react';

const SubmissionCard = ({ student ,data}) => {
    const [isAnswerVisible, setIsAnswerVisible] = useState(false);

    const toggleAnswer = () => {
        setIsAnswerVisible(!isAnswerVisible);
        
    };

    return (
        <div className="card bg-white p-4 rounded border border-gray-300">
            <div className="flex items-start space-x-3">
                <img className="h-10 w-10 rounded-full" src={data.user.image_url} alt="User Icon" />
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <span className="text-lg text-gray-800">{data.user.username}</span>
                        <button 
                            className="text-blue-500 hover:underline text-sm" 
                            onClick={toggleAnswer}
                        >
                            {isAnswerVisible ? 'Hide Submission' : 'View Submission'}
                        </button>
                    </div>
                    <span className="text-[0.7rem] text-gray-500 -mt-24 rotate-45">{data.user.email}</span>
                    <div className="mt-3 flex flex-col space-y-2">
                        <input 
                            type="number" 
                            className="bg-white w-[187px] border border-gray-300 rounded-md px-2 py-1 text-sm" 
                            placeholder="Grade" 
                        />
                        <input 
                            type="text" 
                            rows="8" 
                            className="bg-white w-[187px] border border-gray-300 rounded-md px-2 py-1 text-sm" 
                            placeholder="Add comments..." 
                        />
                    </div>
                    <div className="mt-3 flex space-x-3">
                        <button className="text-green-500 hover:text-green-700 text-sm">
                            <i className="fas fa-check-circle"></i> Submit
                        </button>
                        <button className="text-red-500 hover:text-red-700 text-sm">
                            <i className="fas fa-times-circle"></i> Reject
                        </button>
                    </div>
                </div>
            </div>
            {isAnswerVisible && (
                <div className="mt-4 bg-gray-50 p-2 rounded-md">
                    <h3 className="text-sm text-gray-700 mb-1">Student's Answer:</h3>
                    <div 
                        className="text-sm text-gray-800"
                        dangerouslySetInnerHTML={{ __html: student.answer }}
                    />
                </div>
            )}
        </div>
    );
};

export default SubmissionCard;