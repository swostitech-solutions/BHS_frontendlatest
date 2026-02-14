


import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, ChevronLeft, Eye, EyeOff } from "lucide-react";
import { API_BASE } from "../../../config/api";

const ChangePassword = () => {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [loading, setLoading] = useState(false);

  const currentRef = useRef<HTMLInputElement>(null);
  const newRef = useRef<HTMLInputElement>(null);
  const retypeRef = useRef<HTMLInputElement>(null);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showRetype, setShowRetype] = useState(false);

  const handleSubmit = async () => {
    if (!currentPassword || !newPassword || !retypePassword) {
      alert("All fields are required");
      return;
    }

    if (newPassword.length < 6) {
      alert("New password must be at least 6 characters");
      return;
    }

    if (newPassword !== retypePassword) {
      alert("New password and confirm password do not match");
      return;
    }

    if (currentPassword === newPassword) {
      alert("New password must be different from current password");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/change-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        alert(data.message || "Failed to change password");
        return;
      }

      alert("Password changed successfully!");

      // Clear fields
      setCurrentPassword("");
      setNewPassword("");
      setRetypePassword("");

      navigate(-1);
    } catch (error) {
      console.error(error);
      setLoading(false);
      alert("Something went wrong. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col items-center px-6 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-2xl font-black">Change Password</h1>
        </div>

        <div className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="text-slate-600 font-medium text-sm block mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                ref={currentRef}
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-slate-900 focus:outline-none focus:border-indigo-500 pr-12 text-base"
              />
              <button
                type="button"
                onClick={() => {
                  setShowCurrent(!showCurrent);
                  currentRef.current?.focus();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 p-1"
              >
                {showCurrent ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="text-slate-600 font-medium text-sm block mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                ref={newRef}
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-slate-900 focus:outline-none focus:border-indigo-500 pr-12 text-base"
              />
              <button
                type="button"
                onClick={() => {
                  setShowNew(!showNew);
                  newRef.current?.focus();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 p-1"
              >
                {showNew ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          </div>

          {/* Retype Password */}
          <div>
            <label className="text-slate-600 font-medium text-sm block mb-2">
              Retype New Password
            </label>
            <div className="relative">
              <input
                ref={retypeRef}
                type={showRetype ? "text" : "password"}
                value={retypePassword}
                onChange={(e) => setRetypePassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-slate-900 focus:outline-none focus:border-indigo-500 pr-12 text-base"
              />
              <button
                type="button"
                onClick={() => {
                  setShowRetype(!showRetype);
                  retypeRef.current?.focus();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 p-1"
              >
                {showRetype ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition flex justify-center items-center gap-2 disabled:opacity-60"
          >
            {loading ? "Updating..." : "Change Password"}
            <Lock size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
