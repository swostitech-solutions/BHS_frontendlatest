import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  Briefcase,
  Clock,
  CheckCircle2,
  XCircle,
  MapPin,
  Calendar,
  DollarSign,
  Star,
  User,
  Phone,
  Mail,
  ChevronRight,
  AlertCircle,
  Play,
  Camera,
  Upload,
  Wallet,
  TrendingUp,
  Award,
  Shield,
  Bell,
  Settings,
  LogOut,
  FileText,
  Image,
  X,
  Check,
  Pause,
  ThumbsUp,
  ThumbsDown,
  Timer,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  MessageSquare,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../../config/api";

// Types
interface Booking {
  id: number;
  order_id: string;
  service_code: string;
  subservice_code: string;
  address: string;
  date: string;
  time_slot: string;
  total_price: number;
  work_status: number; // 0=New, 1=Accepted/Pending, 2=In Progress, 3=Completed, 4=Rejected
  work_status_code: string;
  technician_allocated: boolean;
  image?: string;
  User?: { name: string; mobile: string; email: string };
  service?: { name: string };
  subservice?: { name: string; price: number };
}

interface TechnicianProfile {
  id: number;
  name: string;
  email: string;
  mobile: string;
  address: string;
  username: string;
  technicianDetails?: {
    id: number;
    skill: string;
    experience: number;
    status: string;
    techCategory: string;
    profileImage?: string;
    rating?: { avg_rating: string; rating_count: number };
    timeDuration?: string;
    emergencyAvailable?: boolean;
    aadharCardNo?: string;
    panCardNo?: string;
    bankName?: string;
    ifscNo?: string;
    branchName?: string;
  };
}

type TabType = "dashboard" | "jobs" | "earnings" | "profile";

// Work Status Constants
const WORK_STATUS = {
  NEW: 0,
  PENDING: 1,
  IN_PROGRESS: 2,
  COMPLETED: 3,
  REJECTED: 4,
};

const TechDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [profile, setProfile] = useState<TechnicianProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Booking | null>(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [notifications, setNotifications] = useState<Booking[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Get user from session
  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setProfile(user);
      // Use the user.id (userId) to fetch available bookings matching technician's category
      fetchBookings(user.id);
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch available bookings for technician (matches their service category)
  const fetchBookings = async (techUserId: number) => {
    setLoading(true);
    try {
      // Use the new endpoint that fetches bookings matching technician's techCategory
      const res = await fetch(
        `${API_BASE}/api/service-on-booking/technician/${techUserId}/available`
      );

      if (!res.ok) throw new Error("Failed to fetch bookings");

      const data = await res.json();

      const bookingList = data.bookings || [];

      setBookings(bookingList);

      // New bookings = unassigned ones that match category
      setNotifications(
        bookingList.filter(
          (b: Booking) =>
            b.work_status === WORK_STATUS.NEW ||
            (b.work_status === WORK_STATUS.PENDING && !b.technician_allocated)
        )
      );
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };


  const handleAcceptJob = async (bookingId: number) => {
    try {
      // First, assign the technician to this booking
      await fetch(`${API_BASE}/api/service-on-booking/${bookingId}/assign`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ technician_id: profile?.id }),
      });
      
      // Then update the status
      await fetch(`${API_BASE}/api/service-on-booking/${bookingId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ work_status: WORK_STATUS.PENDING, work_status_code: "ACCEPTED" }),
      });
      
      if (profile?.id) fetchBookings(profile.id);
      setShowJobModal(false);
    } catch (error) {
      console.error("Error accepting job:", error);
    }
  };

  const handleRejectJob = async (bookingId: number) => {
    try {
      await fetch(`${API_BASE}/api/service-on-booking/${bookingId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ work_status: WORK_STATUS.REJECTED, work_status_code: "REJECTED" }),
      });
      if (profile?.id) fetchBookings(profile.id);
      setShowJobModal(false);
    } catch (error) {
      console.error("Error rejecting job:", error);
    }
  };

  const updateWorkStatus = async (bookingId: number, status: number, statusCode: string, imageFile?: File) => {
    try {
      const formData = new FormData();
      formData.append("work_status", String(status));
      formData.append("work_status_code", statusCode);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      await fetch(`${API_BASE}/api/service-on-booking/${bookingId}/status`, {
        method: "PATCH",
        body: formData,
      });
      
      if (profile?.id) fetchBookings(profile.id);
      setShowStatusModal(false);
      setSelectedJob(null);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
    window.location.reload();
  };

  // Check if technician is approved
  const isPending = profile?.technicianDetails?.status === "PENDING";
  const isRejected = profile?.technicianDetails?.status === "REJECT";

  // Stats update
  // const stats = {
  //   totalJobs: bookings.length,
  //   completedJobs: bookings.filter((b) => b.work_status === WORK_STATUS.COMPLETED).length,
  //   activeJobs: bookings.filter((b) => b.work_status === WORK_STATUS.IN_PROGRESS).length,
  //   pendingJobs: bookings.filter((b) => b.work_status === WORK_STATUS.PENDING || b.work_status === WORK_STATUS.NEW).length,
    const stats = {
    totalJobs: bookings.length,
    completedJobs: bookings.filter((b) => b.work_status === WORK_STATUS.COMPLETED).length,
    activeJobs: bookings.filter((b) => b.work_status === WORK_STATUS.IN_PROGRESS).length,
    pendingJobs: bookings.filter((b) => b.work_status === WORK_STATUS.PENDING || b.work_status === WORK_STATUS.NEW).length,
    // totalEarnings: bookings
    //   .filter((b) => b.work_status === WORK_STATUS.COMPLETED)
    //   .reduce((sum, b) => sum + (b.total_price || 0), 0),

    totalEarnings: bookings
  .filter((b) => b.work_status === WORK_STATUS.COMPLETED)
  .reduce((sum, b) => {
    const price = Number(b.total_price);
    return sum + (isNaN(price) ? 0 : price);
  }, 0),

  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "jobs", label: "My Jobs", icon: Briefcase, badge: stats.pendingJobs },
    { id: "earnings", label: "Earnings", icon: Wallet },
    { id: "profile", label: "Profile", icon: User },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-white font-bold">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  // Pending Approval Screen
  if (isPending) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="max-w-lg w-full text-center">
          <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full flex items-center justify-center animate-pulse">
            <Clock size={64} className="text-amber-400" />
          </div>
          <h1 className="text-4xl font-black text-white mb-4">Verification in Progress</h1>
          <p className="text-slate-400 text-lg mb-8">
            Your account is currently under review. Our team is verifying your documents and credentials. This usually takes 24-48 hours.
          </p>
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-400">Application Status</span>
              <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm font-bold">
                PENDING REVIEW
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 mb-2">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full animate-pulse" style={{ width: "60%" }} />
            </div>
            <p className="text-slate-500 text-sm">Document verification in progress</p>
          </div>
          <button onClick={handleLogout} className="text-slate-400 hover:text-white transition-colors font-medium">
            Logout and check later
          </button>
        </div>
      </div>
    );
  }

  // Rejected Screen
  if (isRejected) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="max-w-lg w-full text-center">
          <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-red-500/20 to-rose-500/20 rounded-full flex items-center justify-center">
            <XCircle size={64} className="text-red-400" />
          </div>
          <h1 className="text-4xl font-black text-white mb-4">Application Rejected</h1>
          <p className="text-slate-400 text-lg mb-8">
            Unfortunately, your technician application was not approved. This could be due to incomplete documents or verification issues.
          </p>
          <div className="bg-slate-900/50 border border-red-500/30 rounded-2xl p-6 mb-8">
            <p className="text-red-400 text-sm mb-4">
              If you believe this is an error, please contact our support team with your application details.
            </p>
            <button className="px-6 py-3 bg-red-500/20 text-red-400 rounded-xl font-semibold hover:bg-red-500/30 transition-colors">
              Contact Support
            </button>
          </div>
          <button onClick={handleLogout} className="text-slate-400 hover:text-white transition-colors font-medium">
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900/50 backdrop-blur-xl border-r border-slate-800 p-6 flex flex-col">
        {/* Profile Summary */}
        <div className="flex items-center gap-4 mb-4 p-4 bg-slate-800/30 rounded-2xl">
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
            {profile?.name?.charAt(0) || "T"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold truncate">{profile?.name}</p>
            <div className="flex items-center gap-1 text-amber-400">
              <Star size={14} className="fill-amber-400" />
              <span className="text-sm font-semibold">
                {profile?.technicianDetails?.rating?.avg_rating || "0.0"}
              </span>
              <span className="text-slate-500 text-xs">
                ({profile?.technicianDetails?.rating?.rating_count || 0})
              </span>
            </div>
          </div>
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
        </div>

        {/* Service Specialization Badge */}
        {profile?.technicianDetails?.techCategory && (
          <div className="mb-6 p-3 bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 rounded-xl">
            <p className="text-violet-400 text-xs font-bold uppercase tracking-wider mb-1">Specialization</p>
            <p className="text-white font-semibold text-sm">{profile.technicianDetails.techCategory}</p>
            <p className="text-slate-500 text-xs mt-1">You receive jobs matching this category</p>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as TabType)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl font-semibold transition-all duration-300 group
                ${activeTab === item.id
                  ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-white border border-emerald-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
            >
              <item.icon
                size={20}
                className={activeTab === item.id ? "text-emerald-400" : "text-slate-500 group-hover:text-emerald-400"}
              />
              {item.label}
              {item.badge !== undefined && item.badge > 0 && (
                <span className="ml-auto bg-amber-500 text-slate-900 text-xs font-black px-2 py-0.5 rounded-full animate-pulse">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Quick Stats */}
        <div className="p-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl mb-4">
          <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">This Month</p>
          <p className="text-3xl font-black text-white">₹{stats.totalEarnings.toLocaleString()}</p>
          <p className="text-slate-500 text-sm">{stats.completedJobs} jobs completed</p>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-3.5 rounded-xl font-semibold text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black text-white">
              {activeTab === "dashboard" ? "Welcome back!" : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
            <p className="text-slate-500 font-medium mt-1">
              {activeTab === "dashboard" ? "Here's your activity overview" : `Manage your ${activeTab}`}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-3 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-emerald-500 transition-colors"
              >
                <Bell size={20} className="text-slate-400" />
                {stats.pendingJobs > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full text-white text-xs font-bold flex items-center justify-center animate-pulse">
                    {stats.pendingJobs}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-14 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden">
                  <div className="p-4 border-b border-slate-800">
                    <h3 className="text-white font-bold">New Job Requests</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.slice(0, 5).map((job) => (
                        <button
                          key={job.id}
                          onClick={() => {
                            setSelectedJob(job);
                            setShowJobModal(true);
                            setShowNotifications(false);
                          }}
                          className="w-full p-4 hover:bg-slate-800/50 border-b border-slate-800 text-left transition-colors"
                        >
                          <p className="text-white font-semibold">{job.subservice?.name || job.subservice_code}</p>
                          <p className="text-slate-400 text-sm">{job.date} • {job.time_slot}</p>
                          <p className="text-emerald-400 font-bold text-sm mt-1">₹{job.total_price}</p>
                        </button>
                      ))
                    ) : (
                      <p className="p-4 text-slate-500 text-center">No new requests</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button className="p-3 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-emerald-500 transition-colors">
              <Settings size={20} className="text-slate-400" />
            </button>
          </div>
        </header>

        {/* Tab Content */}
        {activeTab === "dashboard" && (
          <DashboardTab
            stats={stats}
            bookings={bookings}
            onViewJob={(job) => {
              setSelectedJob(job);
              if (job.work_status === WORK_STATUS.NEW || job.work_status === WORK_STATUS.PENDING) {
                setShowJobModal(true);
              } else {
                setShowStatusModal(true);
              }
            }}
          />
        )}
        {activeTab === "jobs" && (
          <JobsTab
            bookings={bookings}
            onViewJob={(job) => {
              setSelectedJob(job);
              if (job.work_status === WORK_STATUS.NEW) {
                setShowJobModal(true);
              } else {
                setShowStatusModal(true);
              }
            }}
            onAccept={handleAcceptJob}
            onReject={handleRejectJob}
          />
        )}
        {activeTab === "earnings" && <EarningsTab bookings={bookings} stats={stats} />}
        {activeTab === "profile" && <ProfileTab profile={profile} onProfileUpdate={(updated) => setProfile(updated)} />}
      </main>

      {/* Job Detail Modal (Accept/Reject) */}
      {showJobModal && selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => {
            setShowJobModal(false);
            setSelectedJob(null);
          }}
          onAccept={() => handleAcceptJob(selectedJob.id)}
          onReject={() => handleRejectJob(selectedJob.id)}
        />
      )}

      {/* Update Status Modal */}
      {showStatusModal && selectedJob && (
        <UpdateStatusModal
          job={selectedJob}
          onClose={() => {
            setShowStatusModal(false);
            setSelectedJob(null);
          }}
          onUpdate={updateWorkStatus}
        />
      )}
    </div>
  );
};

// ==================== JOB DETAIL MODAL (Accept/Reject) ====================
const JobDetailModal = ({
  job,
  onClose,
  onAccept,
  onReject,
}: {
  job: Booking;
  onClose: () => void;
  onAccept: () => void;
  onReject: () => void;
}) => {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes to respond

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg animate-in zoom-in-95 duration-200">
        {/* Header with Timer */}
        <div className="p-6 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-b border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <Briefcase size={24} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider">New Job Request</p>
                <p className="text-white font-bold text-lg">#{job.order_id}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-xl transition-colors">
              <X size={20} className="text-slate-400" />
            </button>
          </div>

          {/* Timer */}
          <div className="flex items-center gap-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
            <Timer size={20} className="text-amber-400" />
            <div className="flex-1">
              <p className="text-amber-400 text-sm font-semibold">Respond within</p>
              <p className="text-white font-bold">{formatTime(timeLeft)}</p>
            </div>
            <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 transition-all"
                style={{ width: `${(timeLeft / 300) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {job.subservice?.name || job.subservice_code}
            </h3>
            <p className="text-slate-400">{job.service?.name || job.service_code}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-800/50 rounded-xl">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Calendar size={16} />
                <span className="text-sm">Date</span>
              </div>
              <p className="text-white font-semibold">{job.date}</p>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-xl">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Clock size={16} />
                <span className="text-sm">Time Slot</span>
              </div>
              <p className="text-white font-semibold">{job.time_slot}</p>
            </div>
          </div>

          <div className="p-4 bg-slate-800/50 rounded-xl">
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <MapPin size={16} />
              <span className="text-sm">Location</span>
            </div>
            <p className="text-white">{job.address || "Address will be shared after acceptance"}</p>
          </div>

          {job.User && (
            <div className="p-4 bg-slate-800/50 rounded-xl">
              <p className="text-slate-400 text-sm mb-2">Customer</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <User size={20} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">{job.User.name}</p>
                  <p className="text-slate-400 text-sm">{job.User.mobile}</p>
                </div>
              </div>
            </div>
          )}

          {/* Payment */}
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Your Earnings</span>
              <span className="text-3xl font-black text-emerald-400">
                ₹{job.total_price?.toLocaleString() || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-slate-800 flex gap-4">
          <button
            onClick={onReject}
            className="flex-1 py-4 bg-red-500/20 text-red-400 rounded-xl font-bold hover:bg-red-500/30 transition-colors flex items-center justify-center gap-2"
          >
            <ThumbsDown size={20} />
            Reject
          </button>
          <button
            onClick={onAccept}
            className="flex-[2] py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <ThumbsUp size={20} />
            Accept Job
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== UPDATE STATUS MODAL ====================
const UpdateStatusModal = ({
  job,
  onClose,
  onUpdate,
}: {
  job: Booking;
  onClose: () => void;
  onUpdate: (id: number, status: number, code: string, image?: File) => void;
}) => {
  const [selectedStatus, setSelectedStatus] = useState(job.work_status);
  const [note, setNote] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const statusOptions = [
    {
      status: WORK_STATUS.PENDING,
      code: "PENDING",
      label: "Pending",
      description: "Accepted, waiting to start",
      icon: Clock,
      color: "amber",
    },
    // {
    //   status: WORK_STATUS.IN_PROGRESS,
    //   code: "WORKING",
    //   label: "In Progress",
    //   description: "Currently working on this job",
    //   icon: Play,
    //   color: "blue",
    // },
    {
      status: WORK_STATUS.COMPLETED,
      code: "COMPLETED",
      label: "Completed",
      description: "Job finished successfully",
      icon: CheckCircle2,
      color: "emerald",
    },
  ];

  const getColorClasses = (color: string, isSelected: boolean) => {
    const colors: Record<string, { border: string; bg: string; text: string }> = {
      amber: { border: "border-amber-500", bg: "bg-amber-500/10", text: "text-amber-400" },
      blue: { border: "border-blue-500", bg: "bg-blue-500/10", text: "text-blue-400" },
      emerald: { border: "border-emerald-500", bg: "bg-emerald-500/10", text: "text-emerald-400" },
    };
    return isSelected ? colors[color] : { border: "border-slate-700", bg: "", text: "text-slate-400" };
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg animate-in zoom-in-95">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-white">Update Job Status</h3>
            <p className="text-slate-500">Order #{job.order_id}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-xl transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Options */}
          <div className="space-y-3">
            {statusOptions.map((option) => {
              const isSelected = selectedStatus === option.status;
              const colors = getColorClasses(option.color, isSelected);

              return (
                <button
                  key={option.status}
                  onClick={() => setSelectedStatus(option.status)}
                  className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${colors.border} ${isSelected ? colors.bg : "hover:border-slate-600"}`}
                >
                  <option.icon size={24} className={colors.text} />
                  <div className="flex-1 text-left">
                    <p className="text-white font-semibold">{option.label}</p>
                    <p className="text-slate-500 text-sm">{option.description}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${colors.border}`}>
                    {isSelected && <div className={`w-2.5 h-2.5 rounded-full ${colors.text.replace("text", "bg")}`} />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Notes */}
          <div>
            <label className="text-slate-400 text-sm font-medium block mb-2">Add Notes (Optional)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Any additional notes about the work..."
              rows={3}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="text-slate-400 text-sm font-medium block mb-2">Upload Work Photo (Optional)</label>
            {imagePreview ? (
              <div className="relative">
                <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
                <button
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                  className="absolute top-2 right-2 p-2 bg-red-500 rounded-lg"
                >
                  <X size={16} className="text-white" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-6 border-2 border-dashed border-slate-700 rounded-xl text-center hover:border-slate-600 transition-colors"
              >
                <Camera size={32} className="text-slate-500 mx-auto mb-2" />
                <p className="text-slate-500 text-sm">Click to upload photo</p>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-slate-800 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-slate-700 rounded-xl text-white font-semibold hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              const option = statusOptions.find((o) => o.status === selectedStatus);
              if (option) {
                onUpdate(job.id, option.status, option.code, imageFile || undefined);
              }
            }}
            className="flex-[2] py-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-white font-bold hover:opacity-90 transition-opacity"
          >
            Update Status
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== DASHBOARD TAB ====================
const DashboardTab = ({
  stats,
  bookings,
  onViewJob,
}: {
  stats: any;
  bookings: Booking[];
  onViewJob: (job: Booking) => void;
}) => {
  const statCards = [
    { label: "New Requests", value: stats.pendingJobs, icon: Bell, color: "from-amber-500 to-orange-500" },
    { label: "Active Jobs", value: stats.activeJobs, icon: Play, color: "from-blue-500 to-cyan-500" },
    { label: "Completed", value: stats.completedJobs, icon: CheckCircle2, color: "from-emerald-500 to-teal-500" },
    { label: "Earnings", value: `₹${stats.totalEarnings.toLocaleString()}`, icon: Wallet, color: "from-violet-500 to-purple-500" },
  ];

  const activeJobs = bookings.filter((b) => b.work_status === WORK_STATUS.IN_PROGRESS || b.work_status === WORK_STATUS.PENDING);
  const newJobs = bookings.filter((b) => b.work_status === WORK_STATUS.NEW);

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all">
            <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon size={24} className="text-white" />
            </div>
            <p className="text-slate-500 text-sm">{stat.label}</p>
            <p className="text-3xl font-black text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* New Job Requests */}
      {newJobs.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
              <Bell size={20} className="text-amber-400" />
            </div>
            <div>
              <h3 className="text-white font-bold">New Job Requests</h3>
              <p className="text-slate-400 text-sm">{newJobs.length} requests waiting for your response</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {newJobs.slice(0, 4).map((job) => (
              <button
                key={job.id}
                onClick={() => onViewJob(job)}
                className="p-4 bg-slate-900/50 rounded-xl text-left hover:bg-slate-900/80 transition-colors border border-transparent hover:border-amber-500/30"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-semibold">{job.subservice?.name || job.subservice_code}</span>
                  <span className="text-emerald-400 font-bold">₹{job.total_price}</span>
                </div>
                <div className="flex items-center gap-4 text-slate-400 text-sm">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {job.date}</span>
                  <span className="flex items-center gap-1"><Clock size={14} /> {job.time_slot}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active Jobs */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Active Jobs</h3>
          <span className="text-slate-400 text-sm">{activeJobs.length} jobs</span>
        </div>

        <div className="space-y-4">
          {activeJobs.map((job) => (
            <div
              key={job.id}
              onClick={() => onViewJob(job)}
              className="p-4 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <Briefcase size={20} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">{job.subservice?.name || job.subservice_code}</p>
                    <p className="text-slate-500 text-sm">#{job.order_id}</p>
                  </div>
                </div>
                {/* <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  job.work_status === WORK_STATUS.IN_PROGRESS
                    ? "bg-blue-500/20 text-blue-400"
                    : "bg-amber-500/20 text-amber-400"
                }`}>
                  {job.work_status === WORK_STATUS.IN_PROGRESS ? "In Progress" : "Pending"}
                </span> */}
              </div>
              <div className="flex items-center gap-6 text-slate-400 text-sm">
                <span className="flex items-center gap-1"><MapPin size={14} /> {job.address?.substring(0, 25)}...</span>
                <span className="flex items-center gap-1"><Calendar size={14} /> {job.date}</span>
                <span className="flex items-center gap-1"><Clock size={14} /> {job.time_slot}</span>
              </div>
            </div>
          ))}

          {activeJobs.length === 0 && (
            <div className="text-center py-12">
              <Briefcase size={48} className="text-slate-600 mx-auto mb-4" />
              <p className="text-slate-500">No active jobs</p>
              <p className="text-slate-600 text-sm mt-1">Accept new requests to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Award size={24} className="text-emerald-400" />
          </div>
          <div>
            <h4 className="text-white font-bold mb-1">Pro Tip</h4>
            <p className="text-slate-400 text-sm">
              Respond to job requests quickly and maintain high ratings to get more bookings. Customers prefer technicians who respond within 5 minutes!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== JOBS TAB ====================
const JobsTab = ({
  bookings,
  onViewJob,
  onAccept,
  onReject,
}: {
  bookings: Booking[];
  onViewJob: (job: Booking) => void;
  onAccept: (id: number) => void;
  onReject: (id: number) => void;
}) => {
  const [filter, setFilter] = useState<"all" | "new" | "active" | "completed">("all");

  const filterBookings = () => {
    switch (filter) {
      case "new": return bookings.filter((b) => b.work_status === WORK_STATUS.NEW || b.work_status === WORK_STATUS.PENDING);
      case "active": return bookings.filter((b) => b.work_status === WORK_STATUS.IN_PROGRESS);
      case "completed": return bookings.filter((b) => b.work_status === WORK_STATUS.COMPLETED);
      default: return bookings.filter((b) => b.work_status !== WORK_STATUS.REJECTED);
    }
  };

  const filteredBookings = filterBookings();

  const getStatusConfig = (status: number) => {
    switch (status) {
      case WORK_STATUS.NEW: return { label: "New", color: "bg-violet-500/20 text-violet-400" };
      case WORK_STATUS.PENDING: return { label: "Accepted", color: "bg-amber-500/20 text-amber-400" };
      // case WORK_STATUS.IN_PROGRESS: return { label: "In Progress", color: "bg-blue-500/20 text-blue-400" };
      case WORK_STATUS.COMPLETED: return { label: "Completed", color: "bg-emerald-500/20 text-emerald-400" };
      default: return { label: "Unknown", color: "bg-slate-500/20 text-slate-400" };
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        {[
          { id: "all", label: "All Jobs" },
          { id: "new", label: "New Requests" },
          // { id: "active", label: "In Progress" },
          { id: "completed", label: "Completed" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id as any)}
            className={`px-5 py-2.5 rounded-xl font-semibold transition-all ${
              filter === f.id ? "bg-emerald-500 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredBookings.map((job) => {
          const statusConfig = getStatusConfig(job.work_status);
          const isNew = job.work_status === WORK_STATUS.NEW;

          return (
            <div
              key={job.id}
              className={`bg-slate-900/50 backdrop-blur-xl border rounded-2xl p-6 hover:border-slate-700 transition-all ${
                isNew ? "border-violet-500/50" : "border-slate-800"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusConfig.color}`}>
                  {statusConfig.label}
                </span>
                <p className="text-slate-500 text-sm font-mono">#{job.order_id}</p>
              </div>

              <h4 className="text-xl font-bold text-white mb-2">{job.subservice?.name || job.subservice_code}</h4>
              <p className="text-slate-500 text-sm mb-4">{job.service?.name || job.service_code}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <MapPin size={16} />
                  <span className="truncate">{job.address || "Address not provided"}</span>
                </div>
                <div className="flex items-center gap-4 text-slate-400 text-sm">
                  <span className="flex items-center gap-1"><Calendar size={16} /> {job.date}</span>
                  <span className="flex items-center gap-1"><Clock size={16} /> {job.time_slot}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <p className="text-2xl font-black text-emerald-400">₹{job.total_price?.toLocaleString() || 0}</p>
                
                {isNew ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => onReject(job.id)}
                      className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg font-semibold hover:bg-red-500/30 transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => onAccept(job.id)}
                      className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-400 transition-colors"
                    >
                      Accept
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => onViewJob(job)}
                    className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg font-semibold hover:bg-emerald-500/30 transition-colors"
                  >
                    {job.work_status === WORK_STATUS.COMPLETED ? "View Details" : "Update Status"}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {filteredBookings.length === 0 && (
          <div className="col-span-full text-center py-16">
            <Briefcase size={48} className="text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500">No jobs found</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ==================== EARNINGS TAB ====================
const EarningsTab = ({ bookings, stats }: { bookings: Booking[]; stats: any }) => {
  const completedJobs = bookings.filter((b) => b.work_status === WORK_STATUS.COMPLETED);
  const commission = Math.round(stats.totalEarnings * 0.1); // 10% platform commission
  const netEarnings = stats.totalEarnings - commission;

  return (
    <div className="space-y-6">
      {/* Earnings Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-2xl p-6">
          <p className="text-emerald-400 text-sm font-medium mb-2">Total Earnings</p>
          <p className="text-4xl font-black text-white">₹{stats.totalEarnings.toLocaleString()}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
          <p className="text-slate-400 text-sm font-medium mb-2">Platform Fee (10%)</p>
          <p className="text-4xl font-black text-red-400">-₹{commission.toLocaleString()}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
          <p className="text-slate-400 text-sm font-medium mb-2">Net Earnings</p>
          <p className="text-4xl font-black text-emerald-400">₹{netEarnings.toLocaleString()}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
          <p className="text-slate-400 text-sm font-medium mb-2">Jobs Completed</p>
          <p className="text-4xl font-black text-white">{stats.completedJobs}</p>
        </div>
      </div>

      {/* Payout Status */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Payout Status</h3>
          <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm font-bold">
            Next payout: 15th
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-800/50 rounded-xl">
            <p className="text-slate-400 text-sm mb-1">Pending Payout</p>
            <p className="text-2xl font-bold text-white">₹{netEarnings.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-slate-800/50 rounded-xl">
            <p className="text-slate-400 text-sm mb-1">Last Payout</p>
            <p className="text-2xl font-bold text-emerald-400">₹0</p>
          </div>
          <div className="p-4 bg-slate-800/50 rounded-xl">
            <p className="text-slate-400 text-sm mb-1">Lifetime Earnings</p>
            <p className="text-2xl font-bold text-violet-400">₹{netEarnings.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">Transaction History</h3>
          <button className="text-emerald-400 text-sm font-semibold hover:text-emerald-300">
            Download Report
          </button>
        </div>
        <div className="divide-y divide-slate-800">
          {completedJobs.map((job) => (
            <div key={job.id} className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <DollarSign size={20} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">{job.subservice?.name || job.subservice_code}</p>
                  <p className="text-slate-500 text-sm">#{job.order_id}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-emerald-400 font-bold">+₹{job.total_price?.toLocaleString() || 0}</p>
                <p className="text-slate-500 text-sm">{job.date}</p>
              </div>
            </div>
          ))}

          {completedJobs.length === 0 && (
            <div className="p-8 text-center text-slate-500">No completed jobs yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

// ==================== PROFILE TAB ====================
const ProfileTab = ({ profile, onProfileUpdate }: { profile: TechnicianProfile | null; onProfileUpdate?: (updatedProfile: TechnicianProfile) => void }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    skill: "",
    experience: 0,
    bankName: "",
    ifscNo: "",
    branchName: "",
    timeDuration: "",
    emergencyAvailable: false,
    techCategory: "",
  });

  useEffect(() => {
    if (profile) {
      setEditData({
        name: profile.name || "",
        email: profile.email || "",
        mobile: profile.mobile || "",
        address: profile.address || "",
        skill: profile.technicianDetails?.skill || "",
        experience: profile.technicianDetails?.experience || 0,
        bankName: profile.technicianDetails?.bankName || "",
        ifscNo: profile.technicianDetails?.ifscNo || "",
        branchName: profile.technicianDetails?.branchName || "",
        timeDuration: profile.technicianDetails?.timeDuration || "",
        emergencyAvailable: profile.technicianDetails?.emergencyAvailable || false,
        techCategory: profile.technicianDetails?.techCategory || "",
      });
    }
  }, [profile]);

  if (!profile) return null;

  const tech = profile.technicianDetails;

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("userId", String(profile.id));
      formData.append("name", editData.name);
      formData.append("email", editData.email);
      formData.append("mobile", editData.mobile);
      formData.append("address", editData.address);
      formData.append("skill", editData.skill);
      formData.append("experience", String(editData.experience));
      formData.append("bankName", editData.bankName);
      formData.append("ifscNo", editData.ifscNo);
      formData.append("branchName", editData.branchName);
      formData.append("timeDuration", editData.timeDuration);
      formData.append("emergencyAvailable", String(editData.emergencyAvailable));
      formData.append("techCategory", editData.techCategory);

      const token = sessionStorage.getItem("accessToken");
      const res = await fetch(`${API_BASE}/api/auth/technician/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        // Update session storage and trigger parent update
        const updatedProfile: TechnicianProfile = {
          ...profile,
          name: editData.name,
          email: editData.email,
          mobile: editData.mobile,
          address: editData.address,
          technicianDetails: {
            ...profile.technicianDetails!,
            skill: editData.skill,
            experience: editData.experience,
            bankName: editData.bankName,
            ifscNo: editData.ifscNo,
            branchName: editData.branchName,
            timeDuration: editData.timeDuration,
            emergencyAvailable: editData.emergencyAvailable,
            techCategory: editData.techCategory,
          },
        };
        
        sessionStorage.setItem("user", JSON.stringify(updatedProfile));
        onProfileUpdate?.(updatedProfile);
        setIsEditing(false);
        alert("Profile updated successfully!");
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-white font-black text-4xl">
            {(isEditing ? editData.name : profile.name).charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {isEditing ? (
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="text-2xl font-bold text-white bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 focus:outline-none focus:border-emerald-500"
                />
              ) : (
                <h3 className="text-2xl font-bold text-white">{profile.name}</h3>
              )}
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-bold">Verified</span>
            </div>
            <p className="text-slate-400 mb-4">@{profile.username}</p>
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <Star className="text-amber-400 fill-amber-400" size={18} />
                <span className="text-white font-semibold">{tech?.rating?.avg_rating || "0.0"}</span>
                <span className="text-slate-500">({tech?.rating?.rating_count || 0} reviews)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Award size={18} />
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={editData.experience}
                      onChange={(e) => handleInputChange("experience", parseInt(e.target.value) || 0)}
                      className="w-16 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-white focus:outline-none focus:border-emerald-500"
                      min="0"
                    />
                    <span className="text-white">years experience</span>
                  </div>
                ) : (
                  <span>{tech?.experience || 0} years experience</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Zap size={18} className={editData.emergencyAvailable ? "text-amber-400" : "text-slate-500"} />
                {isEditing ? (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editData.emergencyAvailable}
                      onChange={(e) => handleInputChange("emergencyAvailable", e.target.checked)}
                      className="w-4 h-4 accent-emerald-500"
                    />
                    <span className="text-white">Emergency Available</span>
                  </label>
                ) : (
                  tech?.emergencyAvailable && <span className="text-amber-400">Emergency Available</span>
                )}
              </div>
            </div>
          </div>
          {/* Edit Button */}
          <button
            onClick={() => {
              if (isEditing) {
                handleSaveProfile();
              } else {
                setIsEditing(true);
              }
            }}
            disabled={saving}
            className={`px-5 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              isEditing
                ? "bg-emerald-500 text-white hover:bg-emerald-400"
                : "bg-slate-800 text-slate-400 hover:text-white hover:border-emerald-500 border border-slate-700"
            }`}
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : isEditing ? (
              <>
                <Check size={18} />
                Save Changes
              </>
            ) : (
              <>
                <Settings size={18} />
                Edit Profile
              </>
            )}
          </button>
          {isEditing && (
            <button
              onClick={() => {
                setIsEditing(false);
                // Reset to original values
                setEditData({
                  name: profile.name || "",
                  email: profile.email || "",
                  mobile: profile.mobile || "",
                  address: profile.address || "",
                  skill: profile.technicianDetails?.skill || "",
                  experience: profile.technicianDetails?.experience || 0,
                  bankName: profile.technicianDetails?.bankName || "",
                  ifscNo: profile.technicianDetails?.ifscNo || "",
                  branchName: profile.technicianDetails?.branchName || "",
                  timeDuration: profile.technicianDetails?.timeDuration || "",
                  emergencyAvailable: profile.technicianDetails?.emergencyAvailable || false,
                  techCategory: profile.technicianDetails?.techCategory || "",
                });
              }}
              className="px-5 py-2.5 rounded-xl font-semibold bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all flex items-center gap-2"
            >
              <X size={18} />
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Contact & Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
          <h4 className="text-lg font-bold text-white mb-4">Contact Information</h4>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-slate-500" />
              {isEditing ? (
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Email address"
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              ) : (
                <span className="text-white">{profile.email || "Not provided"}</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Phone size={18} className="text-slate-500" />
              {isEditing ? (
                <input
                  type="tel"
                  value={editData.mobile}
                  onChange={(e) => handleInputChange("mobile", e.target.value)}
                  placeholder="Mobile number"
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              ) : (
                <span className="text-white">{profile.mobile || "Not provided"}</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={18} className="text-slate-500" />
              {isEditing ? (
                <input
                  type="text"
                  value={editData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Address"
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              ) : (
                <span className="text-white">{profile.address || "Not provided"}</span>
              )}
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
          <h4 className="text-lg font-bold text-white mb-4">Skills & Expertise</h4>
          <div className="space-y-4">
            <div>
              <p className="text-slate-500 text-sm mb-1">Primary Skill</p>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.skill}
                  onChange={(e) => handleInputChange("skill", e.target.value)}
                  placeholder="e.g., Electrician, Plumber"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              ) : (
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm font-medium">
                  {tech?.skill || "General"}
                </span>
              )}
            </div>
            <div>
              <p className="text-slate-500 text-sm mb-1">Category</p>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.techCategory}
                  onChange={(e) => handleInputChange("techCategory", e.target.value)}
                  placeholder="e.g., Home Services"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              ) : (
                <span className="text-white">{tech?.techCategory || "All Services"}</span>
              )}
            </div>
            <div>
              <p className="text-slate-500 text-sm mb-1">Availability</p>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.timeDuration}
                  onChange={(e) => handleInputChange("timeDuration", e.target.value)}
                  placeholder="e.g., Full Time, Part Time"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              ) : (
                <span className="text-white">{tech?.timeDuration || "Full Time"}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bank Details */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-bold text-white">Bank Details (For Payouts)</h4>
          {isEditing && (
            <span className="text-amber-400 text-sm flex items-center gap-1">
              <AlertCircle size={14} />
              Update carefully - used for payouts
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-800/50 rounded-xl">
            <p className="text-slate-500 text-sm mb-1">Bank Name</p>
            {isEditing ? (
              <input
                type="text"
                value={editData.bankName}
                onChange={(e) => handleInputChange("bankName", e.target.value)}
                placeholder="Enter bank name"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            ) : (
              <p className="text-white font-medium">{tech?.bankName || "Not provided"}</p>
            )}
          </div>
          <div className="p-4 bg-slate-800/50 rounded-xl">
            <p className="text-slate-500 text-sm mb-1">IFSC Code</p>
            {isEditing ? (
              <input
                type="text"
                value={editData.ifscNo}
                onChange={(e) => handleInputChange("ifscNo", e.target.value.toUpperCase())}
                placeholder="e.g., SBIN0001234"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white uppercase focus:outline-none focus:border-emerald-500"
              />
            ) : (
              <p className="text-white font-medium">{tech?.ifscNo || "Not provided"}</p>
            )}
          </div>
          <div className="p-4 bg-slate-800/50 rounded-xl">
            <p className="text-slate-500 text-sm mb-1">Branch</p>
            {isEditing ? (
              <input
                type="text"
                value={editData.branchName}
                onChange={(e) => handleInputChange("branchName", e.target.value)}
                placeholder="Enter branch name"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            ) : (
              <p className="text-white font-medium">{tech?.branchName || "Not provided"}</p>
            )}
          </div>
        </div>
      </div>

      {/* Documents */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
        <h4 className="text-lg font-bold text-white mb-4">Verified Documents</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "Aadhar Card", value: tech?.aadharCardNo },
            { name: "PAN Card", value: tech?.panCardNo },
            { name: "Bank Passbook", value: tech?.bankName },
            { name: "Experience Certificate", value: "Uploaded" },
          ].map((doc) => (
            <div key={doc.name} className="p-4 bg-slate-800/50 rounded-xl flex items-center gap-3">
              <FileText size={20} className={doc.value ? "text-emerald-400" : "text-slate-600"} />
              <div>
                <p className="text-white text-sm font-medium">{doc.name}</p>
                <p className={doc.value ? "text-emerald-400 text-xs" : "text-slate-500 text-xs"}>
                  {doc.value ? "Verified" : "Not uploaded"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechDashboard;