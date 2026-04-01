


// import React, { useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { Lock, ChevronLeft, Eye, EyeOff } from "lucide-react";
// import { API_BASE } from "../../../config/api";

// const ChangePassword = () => {
//   const navigate = useNavigate();
//   const user = JSON.parse(sessionStorage.getItem("user") || "{}");

//   const [currentPassword, setCurrentPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [retypePassword, setRetypePassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const currentRef = useRef<HTMLInputElement>(null);
//   const newRef = useRef<HTMLInputElement>(null);
//   const retypeRef = useRef<HTMLInputElement>(null);

//   const [showCurrent, setShowCurrent] = useState(false);
//   const [showNew, setShowNew] = useState(false);
//   const [showRetype, setShowRetype] = useState(false);

//   const handleSubmit = async () => {
//     if (!currentPassword || !newPassword || !retypePassword) {
//       alert("All fields are required");
//       return;
//     }

//     if (newPassword.length < 6) {
//       alert("New password must be at least 6 characters");
//       return;
//     }

//     if (newPassword !== retypePassword) {
//       alert("New password and confirm password do not match");
//       return;
//     }

//     if (currentPassword === newPassword) {
//       alert("New password must be different from current password");
//       return;
//     }

//     setLoading(true);

//     try {
//       const res = await fetch(`${API_BASE}/api/change-password`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userId: user.id,
//           currentPassword,
//           newPassword,
//         }),
//       });

//       const data = await res.json();
//       setLoading(false);

//       if (!res.ok) {
//         alert(data.message || "Failed to change password");
//         return;
//       }

//       alert("Password changed successfully!");

//       // Clear fields
//       setCurrentPassword("");
//       setNewPassword("");
//       setRetypePassword("");

//       navigate(-1);
//     } catch (error) {
//       console.error(error);
//       setLoading(false);
//       alert("Something went wrong. Try again.");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col items-center px-6 py-12">
//       <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 space-y-6">
//         <div className="flex items-center gap-4 mb-6">
//           <button
//             onClick={() => navigate(-1)}
//             className="p-2 rounded-lg hover:bg-gray-100"
//           >
//             <ChevronLeft size={24} />
//           </button>
//           <h1 className="text-2xl font-black">Change Password</h1>
//         </div>

//         <div className="space-y-4">
//           {/* Current Password */}
//           <div>
//             <label className="text-slate-600 font-medium text-sm block mb-2">
//               Current Password
//             </label>
//             <div className="relative">
//               <input
//                 ref={currentRef}
//                 type={showCurrent ? "text" : "password"}
//                 value={currentPassword}
//                 onChange={(e) => setCurrentPassword(e.target.value)}
//                 className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-slate-900 focus:outline-none focus:border-indigo-500 pr-12 text-base"
//               />
//               <button
//                 type="button"
//                 onClick={() => {
//                   setShowCurrent(!showCurrent);
//                   currentRef.current?.focus();
//                 }}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 p-1"
//               >
//                 {showCurrent ? <Eye size={18} /> : <EyeOff size={18} />}
//               </button>
//             </div>
//           </div>

//           {/* New Password */}
//           <div>
//             <label className="text-slate-600 font-medium text-sm block mb-2">
//               New Password
//             </label>
//             <div className="relative">
//               <input
//                 ref={newRef}
//                 type={showNew ? "text" : "password"}
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//                 className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-slate-900 focus:outline-none focus:border-indigo-500 pr-12 text-base"
//               />
//               <button
//                 type="button"
//                 onClick={() => {
//                   setShowNew(!showNew);
//                   newRef.current?.focus();
//                 }}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 p-1"
//               >
//                 {showNew ? <Eye size={18} /> : <EyeOff size={18} />}
//               </button>
//             </div>
//           </div>

//           {/* Retype Password */}
//           <div>
//             <label className="text-slate-600 font-medium text-sm block mb-2">
//               Retype New Password
//             </label>
//             <div className="relative">
//               <input
//                 ref={retypeRef}
//                 type={showRetype ? "text" : "password"}
//                 value={retypePassword}
//                 onChange={(e) => setRetypePassword(e.target.value)}
//                 className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-slate-900 focus:outline-none focus:border-indigo-500 pr-12 text-base"
//               />
//               <button
//                 type="button"
//                 onClick={() => {
//                   setShowRetype(!showRetype);
//                   retypeRef.current?.focus();
//                 }}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 p-1"
//               >
//                 {showRetype ? <Eye size={18} /> : <EyeOff size={18} />}
//               </button>
//             </div>
//           </div>

//           <button
//             onClick={handleSubmit}
//             disabled={loading}
//             className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition flex justify-center items-center gap-2 disabled:opacity-60"
//           >
//             {loading ? "Updating..." : "Change Password"}
//             <Lock size={18} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChangePassword;








































import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../../config/api";
import { Lock, Eye, EyeOff } from "lucide-react";

const ChangePassword = () => {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");

  const [step, setStep] = useState(1);

  const [currentPassword, setCurrentPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [token, setToken] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  /* =====================================================
     STEP 1 → REQUEST OTP
  ===================================================== */
  const handleRequestOtp = async () => {
    if (!currentPassword) {
      return alert("Enter current password");
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${API_BASE}/api/change-password/request-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: user.username,
            current_password: currentPassword,
          }),
        }
      );

      const data = await res.json();
      setLoading(false);

      if (!res.ok) return alert(data.message);

      alert("OTP sent to your registered mobile");
      setStep(2);
    } catch (err) {
      setLoading(false);
      alert("Something went wrong");
    }
  };

  /* =====================================================
     STEP 2 → VERIFY OTP
  ===================================================== */
  const handleVerifyOtp = async () => {
    if (!otp) return alert("Enter OTP");

    setLoading(true);

    try {
      const res = await fetch(
        `${API_BASE}/api/change-password/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: user.username,
            otp,
          }),
        }
      );

      const data = await res.json();
      setLoading(false);

      if (!res.ok) return alert(data.message);

      setToken(data.token);
      setStep(3);
    } catch (err) {
      setLoading(false);
      alert("Something went wrong");
    }
  };

  /* =====================================================
     STEP 3 → CHANGE PASSWORD
  ===================================================== */
  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      return alert("All fields required");
    }

    if (newPassword.length < 6) {
      return alert("Password must be at least 6 characters");
    }

    if (newPassword !== confirmPassword) {
      return alert("Passwords do not match");
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user.username,
          token,
          new_password: newPassword,
          confirm_password: confirmPassword,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) return alert(data.message);

      alert("Password changed successfully ✅");
      navigate(-1);
    } catch (err) {
      setLoading(false);
      alert("Something went wrong");
    }
  };

return (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    
    <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6 space-y-6 relative">

      {/* CLOSE BUTTON */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
      >
        ✕
      </button>

      <h2 className="text-2xl font-bold text-center">
        Change Password
      </h2>

      {/* ================= STEP 1 ================= */}
      {step === 1 && (
        <>
          <div>
            <label className="text-sm text-gray-600">
              Current Password
            </label>

            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full mt-1 p-3 border rounded-lg"
              />

              <button
                className="absolute right-3 top-3 text-gray-500"
                onClick={() => setShowCurrent(!showCurrent)}
              >
                {showCurrent ? <Eye size={18}/> : <EyeOff size={18}/>}
              </button>
            </div>
          </div>

          <button
            onClick={handleRequestOtp}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-500"
            disabled={loading}
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </>
      )}

      {/* ================= STEP 2 ================= */}
      {step === 2 && (
        <>
          <div>
            <label className="text-sm text-gray-600">
              Enter OTP
            </label>

            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full mt-1 p-3 border rounded-lg text-center tracking-widest"
            />
          </div>

          <button
            onClick={handleVerifyOtp}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-500"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </>
      )}

      {/* ================= STEP 3 ================= */}
      {step === 3 && (
        <>
          <div>
            <label className="text-sm text-gray-600">
              New Password
            </label>

            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full mt-1 p-3 border rounded-lg"
              />

              <button
                className="absolute right-3 top-3 text-gray-500"
                onClick={() => setShowNew(!showNew)}
              >
                {showNew ? <Eye size={18}/> : <EyeOff size={18}/>}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600">
              Confirm Password
            </label>

            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full mt-1 p-3 border rounded-lg"
              />

              <button
                className="absolute right-3 top-3 text-gray-500"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <Eye size={18}/> : <EyeOff size={18}/>}
              </button>
            </div>
          </div>

          <button
            onClick={handleChangePassword}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-500"
            disabled={loading}
          >
            {loading ? "Updating..." : "Change Password"}
          </button>
        </>
      )}

    </div>
  </div>
);
};

export default ChangePassword;