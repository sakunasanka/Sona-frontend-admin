import React from 'react'
import { Sidebar } from "../../components/layout";

import { useState } from "react";
import EditProfile  from "./../Admin/EditProfile";

const Profile = () => {
  const [showModal, setShowModal] = useState(false);

  // Simulated profile data (can be fetched from API)
  type User = {
    name: string;
    email: string;
    phone: string;
  };

  const [user, setUser] = useState<User>({
    name: "Imesha Dias",
    email: "imesha@example.com",
    phone: "+94 77 123 4567",
  });

  const handleUpdate = (updatedUser: User) => {
    setUser(updatedUser);
    setShowModal(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">My Profile</h2>

      <div className="space-y-3">
        <div>
          <strong>Name:</strong> {user.name}
        </div>
        <div>
          <strong>Email:</strong> {user.email}
        </div>
        <div>
          <strong>Phone:</strong> {user.phone}
        </div>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Edit Profile
        </button>
      </div>

      {showModal && (
        <EditProfile 
          user={user}
          onClose={() => setShowModal(false)}
          onSave={handleUpdate}
        />
      )}
    </div>
  );
};

export default Profile;
