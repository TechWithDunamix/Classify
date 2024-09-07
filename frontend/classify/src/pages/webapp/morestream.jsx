import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../../components/UI/dashboardlayout";
import { api } from "../../utils";
import Loader from "../../components/widgets/loader";
const PostDetail = () => {
  const url = new URL(window.location.href);
  const {id} = useParams()
  const params = new URLSearchParams(url.search);
  const stream_id =params.get("stream")
  const [data,setData] = useState(null)
  const [comment, setComment] = useState({});
  const [newComment, setNewComment] = useState("");

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      setComments([...comments, { id: comments.length + 1, text: newComment, user: "NewUser", time: "Just now" }]);
      setNewComment("");
    }
  };

  const fetchData = () => {
    api.get(`/class/announcement/${stream_id}?class_id=${id}`,{},
      50000,
      (data,status) => {
        console.log(data)
        setData(data)
      },
      (error,status) => {
        if (status === 404){
            window.location.href = "/not-found"
          
        }
      },
      (error) => {
        console.log(error)
      }
    )
  }
 
  const handleComment = function() {
      api.post(`/comment/${stream_id}?class_id=${id}`,{"content":newComment},{},50000,
        (data,status) => {
            fetchData()
        },
        (error,status) => {
          if (status === 404) {
            window.location.href = "/not-found"
          }
        },
        (error) => {

        }
        
      )
  }
  useEffect(fetchData,[])

  if (!data){
    return (
      <DashboardLayout>
        <Loader />
      </DashboardLayout>
    )
  }
  return (
    <DashboardLayout>
    <div className="min-h-screen text-gray-800 px-3">
      {/* Navbar */}
      
      {/* Main Content */}
      <div className="container mx-auto mt-6">
        {/* Post Title */}
        <h1 className="text-xl font-bold mb-4 text-slate-700 ml-2">{data.title}</h1>

        {/* Post Content */}
        <div className="bg-white p-6 rounded-lg border-lg mb-4">
          <div className="text-gray-700   px-3" 
          dangerouslySetInnerHTML={{ __html: data.detail }}
          />
          
        </div>


        {/* Comment Section */}
        <div className="mt-16">
          <h2 className="text-lg font-semibold mb-4">Comments</h2>

          {data.comments.length  === 0 && <div className="text-right"> No Comments .</div>}
          {data.comments.slice(0,8).map((comment) => (
            <div key={comment.id} className="bg-white p-4 rounded-lg shadow-lg mb-2 w-2/6">
              <p className="text-gray-700">{comment.content}</p>
              <small className="text-gray-500">
                Posted by {comment.user_name} - {comment.time}
              </small>
            </div>
          ))}

          {/* Add Comment Section */}
          <form className="bg-white p-4 rounded-lg shadow-lg mt-4" onSubmit={handleCommentSubmit}>
            <textarea
              className="w-full p-2 border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows="3"
              placeholder="Add a comment..."
              value={newComment}
              maxLength={120}
              onChange={(e) => setNewComment(e.target.value)}
            ></textarea>
            <button
              onClick={handleComment}
              type="submit"
              className="bg-purple-600 text-white px-4 py-2 rounded-md mt-2 hover:bg-purple-700"
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
