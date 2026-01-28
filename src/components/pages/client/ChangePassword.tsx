// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Lock, ChevronLeft } from "lucide-react";
// import { API_BASE } from "../../../config/api";

// const ChangePassword = () => {
//   const navigate = useNavigate();
//   const user = JSON.parse(sessionStorage.getItem("user") || "{}");

//   const [currentPassword, setCurrentPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [retypePassword, setRetypePassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async () => {
//     if (!currentPassword || !newPassword || !retypePassword) {
//       alert("All fields are required");
//       return;
//     }
//     if (newPassword !== retypePassword) {
//       alert("New password and retype password do not match");
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await fetch(`${API_BASE}/api/users/change-password/${user.id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           current_password: currentPassword,
//           new_password: newPassword,
//         }),
//       });

//       const data = await res.json();
//       setLoading(false);

//       if (!res.ok) {
//         alert(data.message || "Failed to change password");
//       } else {
//         alert("Password changed successfully!");
//         navigate(-1); // go back to profile
//       }
//     } catch (error) {
//       console.error(error);
//       setLoading(false);
//       alert("Something went wrong. Try again.");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col items-center px-6 py-12">
//       <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 space-y-6">
//         {/* Header */}
//         <div className="flex items-center gap-4 mb-6">
//           <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100">
//             <ChevronLeft size={24} />
//           </button>
//           <h1 className="text-2xl font-black">Change Password</h1>
//         </div>

//         {/* Form */}
//         <div className="space-y-4">
//           <div>
//             <label className="text-slate-600 font-medium text-sm block mb-2">
//               Current Password
//             </label>
//             <input
//               type="password"
//               value={currentPassword}
//               onChange={(e) => setCurrentPassword(e.target.value)}
//               className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 focus:outline-none focus:border-indigo-500"
//             />
//           </div>

//           <div>
//             <label className="text-slate-600 font-medium text-sm block mb-2">
//               New Password
//             </label>
//             <input
//               type="password"
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//               className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 focus:outline-none focus:border-indigo-500"
//             />
//           </div>

//           <div>
//             <label className="text-slate-600 font-medium text-sm block mb-2">
//               Retype New Password
//             </label>
//             <input
//               type="password"
//               value={retypePassword}
//               onChange={(e) => setRetypePassword(e.target.value)}
//               className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 focus:outline-none focus:border-indigo-500"
//             />
//           </div>

//           <button
//             onClick={handleSubmit}
//             disabled={loading}
//             className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition flex justify-center items-center gap-2"
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




































import { useState, useRef } from "react";
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

  // Use refs to keep input focus even when toggling
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
    if (newPassword !== retypePassword) {
      alert("New password and confirm password do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          current_password: currentPassword,
          new_password: newPassword,
          confirm_password: retypePassword,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        alert(data.message || "Failed to change password");
      } else {
        alert("Password changed successfully!");
        navigate(-1);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      alert("Something went wrong. Try again.");
    }
  };

  const PasswordInput = ({
    label,
    value,
    onChange,
    show,
    toggleShow,
    inputRef,
  }: {
    label: string;
    value: string;
    onChange: (val: string) => void;
    show: boolean;
    toggleShow: () => void;
    inputRef: React.RefObject<HTMLInputElement>;
  }) => (
    <div className="w-full">
      <label className="text-slate-600 font-medium text-sm block mb-2">{label}</label>
      <div className="relative">
        <input
          ref={inputRef}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-slate-900 focus:outline-none focus:border-indigo-500 pr-12 text-base"
        />
        <button
          type="button"
          onClick={() => {
            toggleShow();
            inputRef.current?.focus(); // keep focus on input
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 flex items-center justify-center p-1"
        >
          {show ?  <Eye size={18} /> : <EyeOff size={18} /> }
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col items-center px-6 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-2xl font-black">Change Password</h1>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <PasswordInput
            label="Current Password"
            value={currentPassword}
            onChange={setCurrentPassword}
            show={showCurrent}
            toggleShow={() => setShowCurrent(!showCurrent)}
            inputRef={currentRef}
          />

          <PasswordInput
            label="New Password"
            value={newPassword}
            onChange={setNewPassword}
            show={showNew}
            toggleShow={() => setShowNew(!showNew)}
            inputRef={newRef}
          />

          <PasswordInput
            label="Retype New Password"
            value={retypePassword}
            onChange={setRetypePassword}
            show={showRetype}
            toggleShow={() => setShowRetype(!showRetype)}
            inputRef={retypeRef}
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition flex justify-center items-center gap-2"
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
