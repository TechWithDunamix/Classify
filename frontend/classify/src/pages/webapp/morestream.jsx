import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../../components/UI/dashboardlayout";
import { api } from "../../utils";
import Loader from "../../components/widgets/loader";

const PostDetail = () => {
  const url = new URL(window.location.href);
  const { id } = useParams();
  const params = new URLSearchParams(url.search);
  const stream_id = params.get("stream");
  const [data, setData] = useState(null);
  const [newComment, setNewComment] = useState("");

  const fetchData = () => {
    api.get(`/class/announcement/${stream_id}?class_id=${id}`, {}, 50000,
      (data, status) => {
        setData(data);
      },
      (error, status) => {
        if (status === 404) {
          window.location.href = "/not-found";
        }
      },
      (error) => console.log(error)
    );
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      api.post(`/comment/${stream_id}?class_id=${id}`, { content: newComment }, {}, 50000,
        (data, status) => {
          fetchData();
          setNewComment("");
        },
        (error, status) => {
          if (status === 404) {
            window.location.href = "/not-found";
          }
        }
      );
    }
  };

  useEffect(fetchData, []);

  if (!data) {
    return (
      <DashboardLayout>
        <Loader />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen px-4 lg:px-8 py-6 text-gray-800">
        <div className="container mx-auto">
          {/* Post Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {data.title}
          </h1>

          {/* Post Content */}
          <div className="bg-white rounded-lg p-6 mb-8 border border-gray-200">
            <div
              className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: data.detail }}
            />
          </div>

          {/* Comment Section */}
          <div className="bg-gray-50 rounded-lg p-6 mt-10 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Comments
            </h2>

            {/* Comments List */}
            {data.comments.length === 0 ? (
              <div className="text-center text-gray-600 italic">
                No comments yet.
              </div>
            ) : (
              <div className="space-y-4">
                {data.comments.slice(0, 8).map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-white p-4 rounded-lg border border-gray-200"
                  >

                    <small className="text-purple-600">Posted by {comment.user_name}</small>
                    <p className="text-gray-800 mb-2">{comment.content}</p>
                    <small className="text-slate-500">
                       - {comment.date}
                    </small>
                  </div>
                ))}
              </div>
            )}

            {/* Add Comment Form */}
            <form
              className="mt-6 space-y-4"
              onSubmit={handleComment}
            >
              <textarea
                className="w-full p-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-purple-500"
                rows="4"
                placeholder="Add a comment..."
                value={newComment}
                maxLength={120}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button
                type="submit"
                className="bg-purple-600 text-white font-medium px-4 py-2 rounded-md hover:bg-purple-700 transition"
              >
                Post Comment
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PostDetail;
