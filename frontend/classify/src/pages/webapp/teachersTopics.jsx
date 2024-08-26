import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import Loader from "../../components/widgets/loader";
import { api } from "../../utils";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const TeachersTopicPage = () => {
  const [topics, setTopics] = useState(null);
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [topicName, setTopicName] = useState(""); // Input state

  const fetchData = () => {
    api.get(
      `/topics?class_id=${id}`,
      {},
      50000,
      (data, status) => {
        setTopics(data);
      },
      (error, status) => {
        if (status === 404) {
          window.location.href = "/not-found";
        }
      },
      (error) => {
        toast.error("Server is not responding");
      }
    );
  };

  useEffect(fetchData, []);

  // Function to handle form submission
  const handleCreateTopic = (e) => {
    e.preventDefault();
    const data = {
      title: topicName,
    };
    api.post(
      `/topics?class_id=${id}`,
      data,
      {},
      50000,
      (data, status) => {
        setTopicName("");
        setIsModalOpen(false);
        toast.success("Topic created successfully!");
        fetchData(); // Refresh data after creation
      },
      (error, status) => {
        if (status === 404) {
          window.location.href = "/not-found";
        }
      },
      (error) => {
        toast.error("Server is too slow!!");
      }
    );
  };

  if (!topics) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-[40vh]">
      {/* If no topics exist */}
      {topics.length === 0 ? (
        <div className="flex justify-center items-center text-center">
          <div>
          <FontAwesomeIcon
            icon={faSearch}
            className="w-36 h-36 text-slate-700"
          />
          <div className="ml-4">
            <p>You have not created any topic for this class</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="py-2 px-3 bg-purple-900 text-white rounded-sm"
            >
              Create Topic
            </button>
          </div>
          </div>
        </div>
      ) : (
        // If topics exist, render them with more details
        <div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="py-2 px-3 bg-purple-700 text-white rounded-md mb-6"
          >
            Create New Topic
          </button>
          {/* Custom layout for topics */}
          <div>
            {topics.map((topic) => (
              <div key={topic.id} className="p-4 border-b border-gray-300 bg-white">
                <h3 className="text-lg font-bold">{topic.title}</h3>
                <p className="text-sm text-gray-600">Created on: {new Date(topic.date_created).toLocaleDateString()}</p>
                <p className="text-sm text-gray-600">Sub-topics: {topic.sub_topics ? topic.sub_topics.length : 0}</p>
                <div className="mt-4 flex justify-between items-center">
                  <Link to={`/class/${id}/topic?id=${topic.id}&title=${topic.title}`} className="text-purple-600 hover:underline">View Details</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create Topic</h2>
            <form onSubmit={handleCreateTopic}>
              <div className="mb-4">
                <label htmlFor="topic" className="block text-sm font-medium">
                  Topic Name
                </label>
                <input
                  type="text"
                  id="topic"
                  value={topicName}
                  onChange={(e) => setTopicName(e.target.value)}
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeachersTopicPage;
