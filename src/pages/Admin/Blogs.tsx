import React, { useState } from "react";
import Sidebar from "../../components/layout/Sidebar"; 

const  Blogs = () => {
  // Sidebar open state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const closeSidebar = () => setSidebarOpen(false);

  // Sample posts data including image URLs and content
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "Mental Health Tips",
      author: "Counselor A",
      content: "Here are some useful mental health tips...",
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      status: "pending",
      rejectionReason: "",
    },
    {
      id: 2,
      title: "Understanding Anxiety",
      author: "Psychiatrist B",
      content: "Anxiety is a common condition that...",
      image:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
      status: "approved",
      rejectionReason: "",
    },
    {
      id: 3,
      title: "Stress Management",
      author: "Counselor C",
      content: "Managing stress effectively...",
      image:
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
      status: "rejected",
      rejectionReason: "Content not relevant",
    },
  ]);

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredPosts =
    filterStatus === "all"
      ? posts
      : posts.filter((post) => post.status === filterStatus);

  type Post = {
    id: number;
    title: string;
    author: string;
    content: string;
    image: string;
    status: string;
    rejectionReason: string;
  };

  const openReviewModal = (post: Post) => {
    setSelectedPost(post);
    setRejectionReason("");
  };

  const closeModal = () => {
    setSelectedPost(null);
    setRejectionReason("");
  };

  const approvePost = () => {
    if (!selectedPost) return;
    setPosts(
      posts.map((post) =>
        post.id === selectedPost.id
          ? { ...post, status: "approved", rejectionReason: "" }
          : post
      )
    );
    closeModal();
  };

  const rejectPost = () => {
    if (!selectedPost) return;
    if (rejectionReason.trim() === "") {
      alert("Please enter a reason for rejection.");
      return;
    }
    setPosts(
      posts.map((post) =>
        post.id === selectedPost.id
          ? { ...post, status: "rejected", rejectionReason }
          : post
      )
    );
    closeModal();
  };

  return (
    <div className="bg-gray-100  h-screen flex">
    <Sidebar isOpen={sidebarOpen} onClose={closeSidebar}/>

    <div className="p-6 w-10/12 mx-auto">
    {/* <Navbar onMenuClick={() => { /* handle menu click here if needed */ }

      <h1 className="text-3xl font-bold mb-6 mt-4  "> Blog Posts </h1>

      {/* Filter Buttons */}
      <div className="flex justify-start mb-8 space-x-4">
        {["all", "approved", "rejected", "pending"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-5 py-2 rounded-md font-semibold transition ${
              filterStatus === status
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-300"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.length === 0 ? (
          <p className="text-center text-gray-500 col-span-full">
            No posts found for "{filterStatus}"
          </p>
        ) : (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-5 flex flex-col justify-between h-56">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                  <p className="text-gray-600 mb-1">By {post.author}</p>
                  <p
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      post.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : post.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                    title={
                      post.status === "rejected"
                        ? `Reason: ${post.rejectionReason}`
                        : ""
                    }
                  >
                    {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                  </p>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  {post.status === "pending" ? (
                    <button
                      onClick={() => openReviewModal(post)}
                      className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700 transition"
                    >
                      Review
                    </button>
                  ) : post.status === "approved" ? (
                    <span className="text-green-600 font-semibold">Approved</span>
                  ) : (
                    <span
                      className="italic text-red-600 cursor-help"
                      title={`Rejection reason: ${post.rejectionReason}`}
                    >
                      Rejected
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Review Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full overflow-auto max-h-[90vh] p-6">
            <h2 className="text-2xl font-bold mb-4">{selectedPost.title}</h2>
            <img
              src={selectedPost.image}
              alt={selectedPost.title}
              className="w-full h-64 object-cover rounded mb-4"
            />
            <p className="mb-4 whitespace-pre-line text-gray-700">{selectedPost.content}</p>
            <p className="mb-6 text-sm text-gray-500">Author: {selectedPost.author}</p>

            <textarea
              placeholder="Enter rejection reason (if rejecting)"
              className="w-full border border-gray-300 rounded p-3 mb-6 resize-none"
              rows={4}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />

            <div className="flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="px-5 py-2 rounded-md bg-gray-300 hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={rejectPost}
                className="px-5 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
              >
                Reject
              </button>
              <button
                onClick={approvePost}
                className="px-5 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default  Blogs;
