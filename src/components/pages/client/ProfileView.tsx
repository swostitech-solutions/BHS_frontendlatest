import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit3,
  Camera,
  Shield,
  CreditCard,
  Bell,
  Lock,
  ChevronRight,
  LogOut,
  Star,
  Package,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../../config/api";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  mobile: string;
  address: string;
  username: string;
  roleId: number;
  roleName: string;
}

const ProfileView = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
  });
  const [bookingStats, setBookingStats] = useState({
    total: 0,
    completed: 0,
    totalSpent: 0,
  });

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      const u = JSON.parse(userData);
      setUser(u);
      setEditData({
        name: u.name || "",
        email: u.email || "",
        mobile: u.mobile || "",
        address: u.address || "",
      });
      fetchBookingStats(u.id);
    }
  }, []);

  const fetchBookingStats = async (userId: number) => {
    try {
      const res = await fetch(`${API_BASE}/api/service-on-booking/user/${userId}`);
      const data = await res.json();
      const bookings = data.data || [];
      setBookingStats({
        total: bookings.length,
        completed: bookings.filter((b: any) => b.work_status === 3).length,
        totalSpent: bookings
          .filter((b: any) => b.work_status === 3)
          .reduce((sum: number, b: any) => sum + (b.total_price || 0), 0),
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
    window.location.reload();
  };

  const handleSave = async () => {
    // In a real app, this would make an API call to update the user
    const updatedUser = { ...user, ...editData };
    sessionStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser as UserProfile);
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Profile Header */}
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden mb-8">
          {/* Cover */}
          <div className="h-40 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 relative">
            <div className="absolute inset-0 opacity-30" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }} />
          </div>

          {/* Profile Info */}
          <div className="px-8 pb-8 -mt-16 relative">
            <div className="flex flex-col md:flex-row md:items-end gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-3xl border-4 border-white shadow-xl flex items-center justify-center text-white text-5xl font-black">
                  {user.name?.charAt(0) || "U"}
                </div>
                <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center hover:bg-slate-50 transition-colors">
                  <Camera size={18} className="text-slate-600" />
                </button>
              </div>

              {/* Name & Role */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-3xl font-black text-slate-900">{user.name}</h1>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                    Verified
                  </span>
                </div>
                <p className="text-slate-500 font-medium">@{user.username}</p>
              </div>

              {/* Edit Button */}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors"
              >
                <Edit3 size={16} />
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="text-center p-4 bg-slate-50 rounded-2xl">
                <p className="text-3xl font-black text-slate-900">
                  {bookingStats.total}
                </p>
                <p className="text-slate-500 text-sm font-medium">Total Bookings</p>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-2xl">
                <p className="text-3xl font-black text-emerald-600">
                  {bookingStats.completed}
                </p>
                <p className="text-slate-500 text-sm font-medium">Completed</p>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-2xl">
                <p className="text-3xl font-black text-indigo-600">
                  ₹{bookingStats.totalSpent.toLocaleString()}
                </p>
                <p className="text-slate-500 text-sm font-medium">Total Spent</p>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form / Profile Details */}
        {isEditing ? (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Edit Profile</h2>
            <div className="space-y-5">
              <div>
                <label className="text-slate-600 text-sm font-medium block mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-slate-600 text-sm font-medium block mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) =>
                    setEditData({ ...editData, email: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-slate-600 text-sm font-medium block mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={editData.mobile}
                  onChange={(e) =>
                    setEditData({ ...editData, mobile: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-slate-600 text-sm font-medium block mb-2">
                  Address
                </label>
                <textarea
                  value={editData.address}
                  onChange={(e) =>
                    setEditData({ ...editData, address: e.target.value })
                  }
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-slate-900 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-4 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              Contact Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <Mail size={20} className="text-indigo-600" />
                </div>
                <div>
                  <p className="text-slate-500 text-sm">Email</p>
                  <p className="text-slate-900 font-semibold">
                    {user.email || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Phone size={20} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-slate-500 text-sm">Phone</p>
                  <p className="text-slate-900 font-semibold">
                    {user.mobile || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <MapPin size={20} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-slate-500 text-sm">Address</p>
                  <p className="text-slate-900 font-semibold">
                    {user.address || "Not provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden mb-8">
          <h2 className="text-xl font-bold text-slate-900 p-8 pb-4">Quick Actions</h2>
          <div className="divide-y divide-slate-100">
            {[
              {
                icon: Package,
                label: "My Bookings",
                desc: "View and track your service bookings",
                href: "/bookings",
                color: "text-indigo-600 bg-indigo-100",
              },
              {
                icon: CreditCard,
                label: "Payment Methods",
                desc: "Manage your payment options",
                href: "#",
                color: "text-emerald-600 bg-emerald-100",
              },
              {
                icon: Bell,
                label: "Notifications",
                desc: "Manage notification preferences",
                href: "#",
                color: "text-amber-600 bg-amber-100",
              },
              {
                icon: Lock,
                label: "Change Password",
                desc: "Update your account password",
                href: "/change-password",
                color: "text-violet-600 bg-violet-100",
              },
              {
                icon: Shield,
                label: "Privacy Settings",
                desc: "Control your data and privacy",
                href: "#",
                color: "text-blue-600 bg-blue-100",
              },
            ].map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                className="flex items-center gap-4 p-6 hover:bg-slate-50 transition-colors group"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.color}`}
                >
                  <item.icon size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-slate-900 font-semibold">{item.label}</p>
                  <p className="text-slate-500 text-sm">{item.desc}</p>
                </div>
                <ChevronRight
                  size={20}
                  className="text-slate-300 group-hover:text-slate-500 transition-colors"
                />
              </a>
            ))}
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 p-5 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition-colors"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileView;














