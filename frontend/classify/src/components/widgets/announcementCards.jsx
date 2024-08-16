import React, { useState } from "react";

const AnnouncementCard = ({ announcement, date }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Convert the date to a more human-readable format
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="w-full bg-base-100 border-b-2 mb-2">
      <div className="card-body p-4">
        <div className="flex justify-between items-center">
          {/* Human-readable date */}
          <span className="text-sm text-gray-500">{formattedDate}</span>
        </div>
        <p className={`text-gray-700 ${isOpen ? "line-clamp-none" : "line-clamp-2"}`}>
          {announcement}
        </p>
        <div className="card-actions justify-end">
          <button
            className="btn btn-sm btn-primary mt-2 bg-transparent text-purple-950"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? "Show Less" : "Show More"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementCard;
