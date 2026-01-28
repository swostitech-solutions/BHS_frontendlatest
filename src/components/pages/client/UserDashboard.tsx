// import { useState, useEffect } from "react";
// import {
//   Calendar,
//   Clock,
//   MapPin,
//   Star,
//   Package,
//   CheckCircle2,
//   Circle,
//   ChevronRight,
//   Phone,
//   MessageSquare,
//   RefreshCw,
//   Filter,
//   Search,
//   User,
//   CreditCard,
//   AlertCircle,
//   Truck,
//   Wrench,
//   ThumbsUp,
// } from "lucide-react";
// import { Link } from "react-router-dom";
// import { API_BASE } from "../../../config/api";

// interface Booking {
//   id: number;
//   order_id: string;
//   service_code: string;
//   subservice_code: string;
//   address: string;
//   date: string;
//   time_slot: string;
//   total_price: number;
//   gst: number;
//   work_status: number;
//   work_status_code: string;
//   payment_method: string;
//   technician_allocated: boolean;
//   technician?: {
//     id: number;
//     skill: string;
//     user?: { name: string; mobile: string };
//   };
//   service?: { name: string };
//   subservice?: { name: string; price: number; image?: string };
// }

// interface UserProfile {
//   id: number;
//   name: string;
//   email: string;
//   mobile: string;
//   address: string;
// }

// const UserDashboard = () => {
//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState<UserProfile | null>(null);
//   const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
//   const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
//   const [showRatingModal, setShowRatingModal] = useState(false);
//   const [rating, setRating] = useState(0);
//   const [review, setReview] = useState("");

//   useEffect(() => {
//     const userData = sessionStorage.getItem("user");
//     if (userData) {
//       const u = JSON.parse(userData);
//       setUser(u);
//       fetchBookings(u.id);
//     }
//   }, []);

//   const fetchBookings = async (userId: number) => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_BASE}/api/service-on-booking/user/${userId}`);
//       const data = await res.json();
//       setBookings(data.data || []);
//     } catch (error) {
//       console.error("Error fetching bookings:", error);
//       setBookings([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const submitRating = async () => {
//     if (!selectedBooking || !user) return;
//     try {
//       await fetch(`${API_BASE}/api/feedback`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           user_id: user.id,
//           technician_id: selectedBooking.technician?.id,
//           rating,
//           comment: review,
//           service_code: selectedBooking.service_code,
//           subservice_code: selectedBooking.subservice_code,
//         }),
//       });
//       setShowRatingModal(false);
//       setRating(0);
//       setReview("");
//     } catch (error) {
//       console.error("Error submitting rating:", error);
//     }
//   };

//   const filteredBookings = bookings.filter((b) => {
//     if (filter === "all") return true;
//     if (filter === "active") return b.work_status < 3;
//     if (filter === "completed") return b.work_status === 3;
//     return true;
//   });

//   const stats = {
//     total: bookings.length,
//     active: bookings.filter((b) => b.work_status < 3).length,
//     completed: bookings.filter((b) => b.work_status === 3).length,
//     totalSpent: bookings
//       .filter((b) => b.work_status === 3)
//       .reduce((sum, b) => sum + (b.total_price || 0), 0),
//   };

//   const getStatusInfo = (status: number) => {
//     switch (status) {
//       case 1:
//         return {
//           label: "Pending",
//           color: "text-amber-400",
//           bg: "bg-amber-500/20",
//           icon: Clock,
//           step: 1,
//         };
//       case 2:
//         return {
//           label: "In Progress",
//           color: "text-blue-400",
//           bg: "bg-blue-500/20",
//           icon: Wrench,
//           step: 2,
//         };
//       case 3:
//         return {
//           label: "Completed",
//           color: "text-emerald-400",
//           bg: "bg-emerald-500/20",
//           icon: CheckCircle2,
//           step: 3,
//         };
//       default:
//         return {
//           label: "Unknown",
//           color: "text-slate-400",
//           bg: "bg-slate-500/20",
//           icon: AlertCircle,
//           step: 0,
//         };
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
//           <p className="text-slate-600 font-bold">Loading your bookings...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
//       <div className="max-w-7xl mx-auto px-6 py-12">
//         {/* Header */}
//         <div className="mb-12">
//           <h1 className="text-4xl font-black text-slate-900 mb-2">My Bookings</h1>
//           <p className="text-slate-500 font-medium">
//             Track and manage your service bookings
//           </p>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
//           <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
//             <div className="flex items-center justify-between mb-4">
//               <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
//                 <Package size={24} className="text-indigo-600" />
//               </div>
//               <span className="text-indigo-600 text-sm font-bold">All Time</span>
//             </div>
//             <p className="text-slate-500 text-sm">Total Bookings</p>
//             <p className="text-3xl font-black text-slate-900">{stats.total}</p>
//           </div>

//           <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
//             <div className="flex items-center justify-between mb-4">
//               <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center">
//                 <Clock size={24} className="text-amber-600" />
//               </div>
//               <span className="text-amber-600 text-sm font-bold">Active</span>
//             </div>
//             <p className="text-slate-500 text-sm">In Progress</p>
//             <p className="text-3xl font-black text-slate-900">{stats.active}</p>
//           </div>

//           <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
//             <div className="flex items-center justify-between mb-4">
//               <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
//                 <CheckCircle2 size={24} className="text-emerald-600" />
//               </div>
//               <span className="text-emerald-600 text-sm font-bold">Done</span>
//             </div>
//             <p className="text-slate-500 text-sm">Completed</p>
//             <p className="text-3xl font-black text-slate-900">{stats.completed}</p>
//           </div>

//           <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl p-6 text-white">
//             <div className="flex items-center justify-between mb-4">
//               <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
//                 <CreditCard size={24} className="text-white" />
//               </div>
//               <span className="text-white/80 text-sm font-bold">Spent</span>
//             </div>
//             <p className="text-white/80 text-sm">Total Amount</p>
//             <p className="text-3xl font-black">₹{stats.totalSpent.toLocaleString()}</p>
//           </div>
//         </div>

//         {/* Filter Tabs */}
//         <div className="flex items-center justify-between mb-8">
//           <div className="flex gap-3">
//             {[
//               { id: "all", label: "All Bookings", count: stats.total },
//               { id: "active", label: "Active", count: stats.active },
//               { id: "completed", label: "Completed", count: stats.completed },
//             ].map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setFilter(tab.id as any)}
//                 className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
//                   filter === tab.id
//                     ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
//                     : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-300"
//                 }`}
//               >
//                 {tab.label}
//                 <span
//                   className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
//                     filter === tab.id
//                       ? "bg-white/20 text-white"
//                       : "bg-slate-100 text-slate-500"
//                   }`}
//                 >
//                   {tab.count}
//                 </span>
//               </button>
//             ))}
//           </div>

//           <Link
//             to="/"
//             className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-colors"
//           >
//             Book New Service
//             <ChevronRight size={18} />
//           </Link>
//         </div>

//         {/* Bookings List */}
//         <div className="space-y-6">
//           {filteredBookings.map((booking) => {
//             const status = getStatusInfo(booking.work_status);
//             return (
//               <div
//                 key={booking.id}
//                 className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-lg hover:border-indigo-100 transition-all duration-300"
//               >
//                 <div className="flex flex-col lg:flex-row lg:items-center gap-6">
//                   {/* Service Image */}
//                   <div className="w-full lg:w-32 h-32 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-2xl flex items-center justify-center flex-shrink-0">
//                     <Package size={48} className="text-indigo-400" />
//                   </div>

//                   {/* Booking Details */}
//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-start justify-between mb-4">
//                       <div>
//                         <div className="flex items-center gap-3 mb-2">
//                           <h3 className="text-xl font-black text-slate-900">
//                             {booking.subservice?.name || booking.subservice_code}
//                           </h3>
//                           <span
//                             className={`px-3 py-1 rounded-full text-xs font-bold ${status.bg} ${status.color}`}
//                           >
//                             {status.label}
//                           </span>
//                         </div>
//                         <p className="text-slate-500 font-medium">
//                           {booking.service?.name || booking.service_code}
//                         </p>
//                         <p className="text-slate-400 text-sm font-mono mt-1">
//                           Order #{booking.order_id}
//                         </p>
//                       </div>
//                       <div className="text-right">
//                         <p className="text-3xl font-black text-slate-900">
//                           ₹{booking.total_price?.toLocaleString() || 0}
//                         </p>
//                         <p className="text-slate-400 text-sm">
//                           incl. {booking.gst}% GST
//                         </p>
//                       </div>
//                     </div>

//                     {/* Info Row */}
//                     <div className="flex flex-wrap items-center gap-6 text-slate-500 text-sm mb-6">
//                       <span className="flex items-center gap-2">
//                         <Calendar size={16} />
//                         {booking.date}
//                       </span>
//                       <span className="flex items-center gap-2">
//                         <Clock size={16} />
//                         {booking.time_slot}
//                       </span>
//                       <span className="flex items-center gap-2">
//                         <MapPin size={16} />
//                         {booking.address?.substring(0, 40) || "Address not set"}...
//                       </span>
//                     </div>

//                     {/* Progress Tracker */}
//                     <div className="mb-6">
//                       <div className="flex items-center gap-2">
//                         {[
//                           { step: 1, label: "Booked", icon: Package },
//                           { step: 2, label: "In Progress", icon: Wrench },
//                           { step: 3, label: "Completed", icon: CheckCircle2 },
//                         ].map((s, idx) => (
//                           <div key={s.step} className="flex items-center">
//                             <div
//                               className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
//                                 booking.work_status >= s.step
//                                   ? "bg-indigo-100 text-indigo-600"
//                                   : "bg-slate-100 text-slate-400"
//                               }`}
//                             >
//                               <s.icon size={16} />
//                               <span className="text-xs font-bold">{s.label}</span>
//                             </div>
//                             {idx < 2 && (
//                               <div
//                                 className={`w-8 h-0.5 ${
//                                   booking.work_status > s.step
//                                     ? "bg-indigo-400"
//                                     : "bg-slate-200"
//                                 }`}
//                               />
//                             )}
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     {/* Technician Info */}
//                     {booking.technician_allocated && booking.technician && (
//                       <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
//                         <div className="flex items-center gap-4">
//                           <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold">
//                             {booking.technician.user?.name?.charAt(0) || "T"}
//                           </div>
//                           <div>
//                             <p className="font-bold text-slate-900">
//                               {booking.technician.user?.name || "Technician Assigned"}
//                             </p>
//                             <p className="text-slate-500 text-sm">
//                               {booking.technician.skill || "Service Expert"}
//                             </p>
//                           </div>
//                         </div>
//                         <div className="flex gap-2">
//                           {booking.technician.user?.mobile && (
//                             <a
//                               href={`tel:${booking.technician.user.mobile}`}
//                               className="p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
//                             >
//                               <Phone size={18} className="text-indigo-600" />
//                             </a>
//                           )}
//                           <button className="p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
//                             <MessageSquare size={18} className="text-indigo-600" />
//                           </button>
//                         </div>
//                       </div>
//                     )}

//                     {/* Actions */}
//                     {booking.work_status === 3 && (
//                       <div className="flex gap-3 mt-4">
//                         <button
//                           onClick={() => {
//                             setSelectedBooking(booking);
//                             setShowRatingModal(true);
//                           }}
//                           className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
//                         >
//                           <Star size={18} />
//                           Rate Service
//                         </button>
//                         <button className="flex items-center gap-2 px-5 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors">
//                           <RefreshCw size={18} />
//                           Book Again
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             );
//           })}

//           {filteredBookings.length === 0 && (
//             <div className="text-center py-20">
//               <div className="w-32 h-32 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
//                 <Package size={64} className="text-slate-300" />
//               </div>
//               <h3 className="text-2xl font-black text-slate-900 mb-2">
//                 No bookings found
//               </h3>
//               <p className="text-slate-500 mb-8">
//                 {filter === "all"
//                   ? "You haven't made any bookings yet"
//                   : `No ${filter} bookings`}
//               </p>
//               <Link
//                 to="/"
//                 className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-colors"
//               >
//                 Browse Services
//                 <ChevronRight size={20} />
//               </Link>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Rating Modal */}
//       {showRatingModal && selectedBooking && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-3xl p-8 w-full max-w-lg animate-in zoom-in-95">
//             <div className="text-center mb-8">
//               <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center">
//                 <Star size={40} className="text-amber-500" />
//               </div>
//               <h3 className="text-2xl font-black text-slate-900 mb-2">
//                 Rate Your Experience
//               </h3>
//               <p className="text-slate-500">
//                 How was your service with{" "}
//                 <span className="font-bold">
//                   {selectedBooking.technician?.user?.name || "the technician"}
//                 </span>
//                 ?
//               </p>
//             </div>

//             {/* Star Rating */}
//             <div className="flex justify-center gap-2 mb-8">
//               {[1, 2, 3, 4, 5].map((star) => (
//                 <button
//                   key={star}
//                   onClick={() => setRating(star)}
//                   className="transition-transform hover:scale-110"
//                 >
//                   <Star
//                     size={40}
//                     className={`${
//                       star <= rating
//                         ? "text-amber-400 fill-amber-400"
//                         : "text-slate-200"
//                     } transition-colors`}
//                   />
//                 </button>
//               ))}
//             </div>

//             {/* Review Text */}
//             <textarea
//               value={review}
//               onChange={(e) => setReview(e.target.value)}
//               placeholder="Share your experience (optional)"
//               rows={4}
//               className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 resize-none mb-6"
//             />

//             {/* Actions */}
//             <div className="flex gap-4">
//               <button
//                 onClick={() => {
//                   setShowRatingModal(false);
//                   setRating(0);
//                   setReview("");
//                 }}
//                 className="flex-1 py-4 border border-slate-200 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={submitRating}
//                 disabled={rating === 0}
//                 className="flex-1 py-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
//               >
//                 Submit Rating
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserDashboard;









































import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Star,
  Package,
  CheckCircle2,
  Circle,
  ChevronRight,
  Phone,
  MessageSquare,
  RefreshCw,
  Filter,
  Search,
  User,
  CreditCard,
  AlertCircle,
  Truck,
  Wrench,
  ThumbsUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { API_BASE } from "../../../config/api";

interface Booking {
  id: number;
  order_id: string;
  service_code: string;
  subservice_code: string;
  address: string;
  date: string;
  time_slot: string;
  total_price: number;
  gst: number;
  work_status: number;
  work_status_code: string;
  payment_method: string;
  technician_allocated: boolean;
  technician?: {
    id: number;
    skill: string;
    user?: { name: string; mobile: string };
  };
  service?: { name: string };
  subservice?: { name: string; price: number; image?: string };
}

interface UserProfile {
  id: number;
  name: string;
  email: string;
  mobile: string;
  address: string;
}

const UserDashboard = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");




  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      const u = JSON.parse(userData);
      setUser(u);
      fetchBookings(u.id);
    }
  }, []);

  // const fetchBookings = async (userId: number) => {
  //   setLoading(true);
  //   try {
  //     const res = await fetch(`${API_BASE}/api/service-on-booking/user/${userId}`);
  //     const data = await res.json();
  //     setBookings(data.data || []);
  //   } catch (error) {
  //     console.error("Error fetching bookings:", error);
  //     setBookings([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchBookings = async (userId: number) => {
  setLoading(true);
  try {
    const res = await fetch(
      `${API_BASE}/api/service-on-booking/user/${userId}`
    );
    const data = await res.json();

    // 🔥 FIX IS HERE
    setBookings(data.bookings || []);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    setBookings([]);
  } finally {
    setLoading(false);
  }
};


  const submitRating = async () => {
    if (!selectedBooking || !user) return;
    try {
      await fetch(`${API_BASE}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          technician_id: selectedBooking.technician?.id,
          rating,
          comment: review,
          service_code: selectedBooking.service_code,
          subservice_code: selectedBooking.subservice_code,
        }),
      });
      setShowRatingModal(false);
      setRating(0);
      setReview("");
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filter === "all") return true;
    if (filter === "active") return b.work_status < 3;
    if (filter === "completed") return b.work_status === 3;
    return true;
  });

  // const stats = {
  //   total: bookings.length,
  //   active: bookings.filter((b) => b.work_status < 3).length,
  //   completed: bookings.filter((b) => b.work_status === 3).length,
  //   totalSpent: bookings
  //     .filter((b) => b.work_status === 3)
  //     .reduce((sum, b) => sum + (b.total_price || 0), 0),
  // };

  const stats = {
  total: bookings.length,
  active: bookings.filter((b) => b.work_status < 3).length,
  completed: bookings.filter((b) => b.work_status === 3).length,
  totalSpent: bookings
    .filter((b) => b.work_status === 3)
    .reduce((sum, b) => {
      const price = Number(b.total_price);
      return sum + (isNaN(price) ? 0 : price);
    }, 0),
};


  const getStatusInfo = (status: number) => {
    switch (status) {
      case 1:
        return {
          label: "Pending",
          color: "text-amber-400",
          bg: "bg-amber-500/20",
          icon: Clock,
          step: 1,
        };
      case 2:
        return {
          label: "In Progress",
          color: "text-blue-400",
          bg: "bg-blue-500/20",
          icon: Wrench,
          step: 2,
        };
      case 3:
        return {
          label: "Completed",
          color: "text-emerald-400",
          bg: "bg-emerald-500/20",
          icon: CheckCircle2,
          step: 3,
        };
      default:
        return {
          label: "Unknown",
          color: "text-slate-400",
          bg: "bg-slate-500/20",
          icon: AlertCircle,
          step: 0,
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-600 font-bold">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 mb-2">My Bookings</h1>
          <p className="text-slate-500 font-medium">
            Track and manage your service bookings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
                <Package size={24} className="text-indigo-600" />
              </div>
              <span className="text-indigo-600 text-sm font-bold">All Time</span>
            </div>
            <p className="text-slate-500 text-sm">Total Bookings</p>
            <p className="text-3xl font-black text-slate-900">{stats.total}</p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center">
                <Clock size={24} className="text-amber-600" />
              </div>
              <span className="text-amber-600 text-sm font-bold">Active</span>
            </div>
            <p className="text-slate-500 text-sm">In Progress</p>
            <p className="text-3xl font-black text-slate-900">{stats.active}</p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                <CheckCircle2 size={24} className="text-emerald-600" />
              </div>
              <span className="text-emerald-600 text-sm font-bold">Done</span>
            </div>
            <p className="text-slate-500 text-sm">Completed</p>
            <p className="text-3xl font-black text-slate-900">{stats.completed}</p>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <CreditCard size={24} className="text-white" />
              </div>
              <span className="text-white/80 text-sm font-bold">Spent</span>
            </div>
            <p className="text-white/80 text-sm">Total Amount</p>
            <p className="text-3xl font-black">₹{stats.totalSpent.toLocaleString()}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-3">
            {[
              { id: "all", label: "All Bookings", count: stats.total },
              { id: "active", label: "Active", count: stats.active },
              { id: "completed", label: "Completed", count: stats.completed },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
                  filter === tab.id
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-300"
                }`}
              >
                {tab.label}
                <span
                  className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    filter === tab.id
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-colors"
          >
            Book New Service
            <ChevronRight size={18} />
          </Link>
        </div>

        {/* Bookings List */}
        <div className="space-y-6">
          {filteredBookings.map((booking) => {
            const status = getStatusInfo(booking.work_status);
            return (
              <div
                key={booking.id}
                className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-lg hover:border-indigo-100 transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  {/* Service Image */}
                  <div className="w-full lg:w-32 h-32 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Package size={48} className="text-indigo-400" />
                  </div>

                  {/* Booking Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-black text-slate-900">
                            {booking.subservice?.name || booking.subservice_code}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${status.bg} ${status.color}`}
                          >
                            {status.label}
                          </span>
                        </div>
                        <p className="text-slate-500 font-medium">
                          {booking.service?.name || booking.service_code}
                        </p>
                        <p className="text-slate-400 text-sm font-mono mt-1">
                          Order #{booking.order_id}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-black text-slate-900">
                          ₹{booking.total_price?.toLocaleString() || 0}
                        </p>
                        <p className="text-slate-400 text-sm">
                          incl. {booking.gst}% GST
                        </p>
                      </div>
                    </div>

                    {/* Info Row */}
                    <div className="flex flex-wrap items-center gap-6 text-slate-500 text-sm mb-6">
                      <span className="flex items-center gap-2">
                        <Calendar size={16} />
                        {booking.date}
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock size={16} />
                        {booking.time_slot}
                      </span>
                      <span className="flex items-center gap-2">
                        <MapPin size={16} />
                        {booking.address?.substring(0, 40) || "Address not set"}...
                      </span>
                    </div>

                    {/* Progress Tracker */}
                    <div className="mb-6">
                      <div className="flex items-center gap-2">
                        {[
                          { step: 1, label: "Booked", icon: Package },
                          { step: 2, label: "In Progress", icon: Wrench },
                          { step: 3, label: "Completed", icon: CheckCircle2 },
                        ].map((s, idx) => (
                          <div key={s.step} className="flex items-center">
                            <div
                              className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
                                booking.work_status >= s.step
                                  ? "bg-indigo-100 text-indigo-600"
                                  : "bg-slate-100 text-slate-400"
                              }`}
                            >
                              <s.icon size={16} />
                              <span className="text-xs font-bold">{s.label}</span>
                            </div>
                            {idx < 2 && (
                              <div
                                className={`w-8 h-0.5 ${
                                  booking.work_status > s.step
                                    ? "bg-indigo-400"
                                    : "bg-slate-200"
                                }`}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Technician Info */}
                    {booking.technician_allocated && booking.technician && (
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold">
                            {booking.technician.user?.name?.charAt(0) || "T"}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">
                              {booking.technician.user?.name || "Technician Assigned"}
                            </p>
                            <p className="text-slate-500 text-sm">
                              {booking.technician.skill || "Service Expert"}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {booking.technician.user?.mobile && (
                            <a
                              href={`tel:${booking.technician.user.mobile}`}
                              className="p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                            >
                              <Phone size={18} className="text-indigo-600" />
                            </a>
                          )}
                          <button className="p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <MessageSquare size={18} className="text-indigo-600" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    {booking.work_status === 3 && (
                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowRatingModal(true);
                          }}
                          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
                        >
                          <Star size={18} />
                          Rate Service
                        </button>
                        <button className="flex items-center gap-2 px-5 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors">
                          <RefreshCw size={18} />
                          Book Again
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {filteredBookings.length === 0 && (
            <div className="text-center py-20">
              <div className="w-32 h-32 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
                <Package size={64} className="text-slate-300" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">
                No bookings found
              </h3>
              <p className="text-slate-500 mb-8">
                {filter === "all"
                  ? "You haven't made any bookings yet"
                  : `No ${filter} bookings`}
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-colors"
              >
                Browse Services
                <ChevronRight size={20} />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Rating Modal */}
      {showRatingModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg animate-in zoom-in-95">
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center">
                <Star size={40} className="text-amber-500" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">
                Rate Your Experience
              </h3>
              <p className="text-slate-500">
                How was your service with{" "}
                <span className="font-bold">
                  {selectedBooking.technician?.user?.name || "the technician"}
                </span>
                ?
              </p>
            </div>

            {/* Star Rating */}
            <div className="flex justify-center gap-2 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={40}
                    className={`${
                      star <= rating
                        ? "text-amber-400 fill-amber-400"
                        : "text-slate-200"
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>

            {/* Review Text */}
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your experience (optional)"
              rows={4}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 resize-none mb-6"
            />

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowRatingModal(false);
                  setRating(0);
                  setReview("");
                }}
                className="flex-1 py-4 border border-slate-200 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitRating}
                disabled={rating === 0}
                className="flex-1 py-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
