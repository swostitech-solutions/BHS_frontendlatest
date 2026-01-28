// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import {
//   ArrowLeft,
//   Star,
//   Navigation,
//   Zap,
//   ChevronRight,
//   Shield,
// } from "lucide-react";
// import { API_BASE } from "../../../config/api";

// const SubServiceDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [subService, setSubService] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   const todayStr = new Date().toISOString().split("T")[0];
//   const [address, setAddress] = useState("");
//   const [bookingDate, setBookingDate] = useState(todayStr);
//   const [bookingTime, setBookingTime] = useState("10:00 AM");
//   const [isEmergency, setIsEmergency] = useState(false);
//   const [isLocating, setIsLocating] = useState(false);


//   /* ================= FETCH SUBSERVICE ================= */
//   useEffect(() => {
//     fetch(`${API_BASE}/api/subservices/id/${id}`)
//       .then((res) => res.json())
//       .then((result) => {
//         setSubService(result.data);
//         setLoading(false);
//       })
//       .catch(() => setLoading(false));
//   }, [id]);

//   const timeSlots = Array.from({ length: 13 }, (_, i) => {
//     const hour = i + 8;
//     const ampm = hour >= 12 ? "PM" : "AM";
//     const displayHour = hour > 12 ? hour - 12 : hour;
//     return `${displayHour}:00 ${ampm}`;
//   });

//   if (loading) {
//     return (
//       <div className="py-60 text-center font-black text-3xl">Loading...</div>
//     );
//   }

//   if (!subService) {
//     return (
//       <div className="py-60 text-center font-black text-3xl">
//         Service Not Found
//       </div>
//     );
//   }

//   /* ================= LOCATION ================= */
//   const handleGetCurrentLocation = () => {
//     if ("geolocation" in navigator) {
//       setIsLocating(true);
//       navigator.geolocation.getCurrentPosition(
//         (p) => {
//           setAddress(
//             `Lat: ${p.coords.latitude.toFixed(
//               4
//             )}, Lng: ${p.coords.longitude.toFixed(4)}`
//           );
//           setIsLocating(false);
//         },
//         () => setIsLocating(false)
//       );
//     }
//   };

//   const price = Number(subService.price);
//   const taxPercent = 18;
//   const emergencyFee = isEmergency ? 500 : 0;
//   const taxAmount = (price * taxPercent) / 100;
//   const total = price + taxAmount + emergencyFee;

//   return (
//     <div className="max-w-7xl mx-auto py-20 px-6">
//       <Link
//         to="/"
//         className="inline-flex items-center gap-3 text-gray-400 font-bold mb-12 hover:text-indigo-600"
//       >
//         <ArrowLeft size={24} /> Back
//       </Link>

//       <div className="bg-white rounded-[4rem] overflow-hidden shadow-2xl border border-gray-100 flex flex-col lg:flex-row min-h-[800px]">
//         {/* ================= LEFT IMAGE ================= */}
//         <div className="lg:w-1/2 relative min-h-[400px]">
//           <img
//             src="/placeholder-service.jpg"
//             alt={subService.name}
//             className="absolute inset-0 w-full h-full object-cover"
//           />

//           <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

//           <div className="absolute bottom-12 left-12 right-12 text-white">
//             <h1 className="text-5xl font-black mb-4 leading-none">
//               {subService.name}
//             </h1>

//             <div className="flex items-center gap-4">
//               <Star className="fill-amber-400 text-amber-400" />
//               <span className="text-2xl font-black">4.5</span>
//             </div>

//             <p className="mt-2 text-sm font-bold uppercase tracking-widest text-white/80">
//               {subService.Service?.name}
//             </p>
//           </div>
//         </div>

//         {/* ================= RIGHT PANEL ================= */}
//         <div className="lg:w-1/2 p-12 lg:p-20 flex flex-col">
//           <p className="text-gray-500 text-lg font-medium mb-12 leading-relaxed">
//             {subService.description}
//           </p>

//           {/* ADDRESS */}
//           <div className="space-y-10 mb-12">
//             <div>
//               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">
//                 Address
//               </label>
//               <div className="relative mt-2">
//                 <input
//                   className="w-full bg-gray-50 rounded-[2rem] px-8 py-6 font-bold outline-none pr-16"
//                   placeholder="Service location..."
//                   value={address}
//                   onChange={(e) => setAddress(e.target.value)}
//                 />
//                 <button
//                   onClick={handleGetCurrentLocation}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-indigo-600 text-white rounded-2xl shadow-xl"
//                 >
//                   {isLocating ? "..." : <Navigation />}
//                 </button>
//               </div>
//             </div>

//             {/* DATE & TIME */}
//             <div className="grid grid-cols-2 gap-8">
//               <input
//                 type="date"
//                 min={todayStr}
//                 className="bg-gray-50 rounded-[2rem] px-8 py-6 font-bold outline-none"
//                 value={bookingDate}
//                 onChange={(e) => setBookingDate(e.target.value)}
//               />

//               <select
//                 className="bg-gray-50 rounded-[2rem] px-8 py-6 font-bold outline-none"
//                 value={bookingTime}
//                 onChange={(e) => setBookingTime(e.target.value)}
//               >
//                 {timeSlots.map((slot) => (
//                   <option key={slot}>{slot}</option>
//                 ))}
//               </select>
//             </div>

//             {/* EMERGENCY */}
//             <button
//               onClick={() => setIsEmergency(!isEmergency)}
//               className={`w-full p-8 rounded-[2.5rem] border-2 flex items-center justify-between
//               ${
//                 isEmergency
//                   ? "bg-amber-50 border-amber-500"
//                   : "bg-white border-gray-100"
//               }`}
//             >
//               <div className="flex items-center gap-6">
//                 <Zap
//                   className={isEmergency ? "text-amber-500" : "text-gray-200"}
//                   size={32}
//                 />
//                 <div className="text-left">
//                   <p className="text-xl font-black">Emergency Service</p>
//                   <p className="text-sm font-bold text-gray-400">
//                     Within 45 mins (+₹500)
//                   </p>
//                 </div>
//               </div>
//             </button>
//           </div>

//           {/* PRICE */}
//           <div className="bg-gray-950 rounded-[3rem] p-10 space-y-4 mb-12 text-white">
//             <div className="flex justify-between text-gray-400 font-bold">
//               <span>Base Price</span>
//               <span>₹{price}</span>
//             </div>
//             <div className="flex justify-between text-gray-400 font-bold">
//               <span>Tax (GST {taxPercent}%)</span>
//               <span>₹{taxAmount.toFixed(0)}</span>
//             </div>
//             <div className="pt-8 border-t border-white/10 flex justify-between items-end">
//               <div>
//                 <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">
//                   Total
//                 </p>
//                 <p className="text-5xl font-black tracking-tighter">
//                   ₹{total.toFixed(0)}
//                 </p>
//               </div>
//             </div>
//           </div>

//           <button
//             onClick={() => navigate(`/checkout/${subService.id}`)}
//             className="w-full bg-indigo-600 text-white font-black py-8 rounded-[2.5rem]
//             shadow-2xl hover:bg-indigo-700 transition-all text-2xl flex items-center justify-center gap-4"
//           >
//             Proceed <ChevronRight size={32} />
//           </button>

//           <p className="text-center mt-6 text-gray-400 font-bold text-sm flex items-center justify-center gap-2">
//             <Shield size={16} /> Secure Payment Hub
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SubServiceDetail;


























/// after API image //

// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import {
//   ArrowLeft,
//   Star,
//   Navigation,
//   Zap,
//   ChevronRight,
//   Shield,
// } from "lucide-react";
// import { API_BASE } from "../../../config/api";

// const SubServiceDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [subService, setSubService] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   const todayStr = new Date().toISOString().split("T")[0];

//   const [address, setAddress] = useState("");
//   const [bookingDate, setBookingDate] = useState(todayStr);
//   const [bookingTime, setBookingTime] = useState("10:00 AM");
//   const [isEmergency, setIsEmergency] = useState(false);
//   const [isLocating, setIsLocating] = useState(false);

//   /* ================= FETCH SUB SERVICE ================= */
//   useEffect(() => {
//     setLoading(true);
//     fetch(`${API_BASE}/api/subservices/id/${id}`)
//       .then((res) => res.json())
//       .then((result) => {
//         setSubService(result.data);
//         setLoading(false);
//       })
//       .catch(() => setLoading(false));
//   }, [id]);

//   /* ================= TIME SLOTS ================= */
//   const timeSlots = Array.from({ length: 13 }, (_, i) => {
//     const hour = i + 8;
//     const ampm = hour >= 12 ? "PM" : "AM";
//     const displayHour = hour > 12 ? hour - 12 : hour;
//     return `${displayHour}:00 ${ampm}`;
//   });

//   /* ================= LOCATION ================= */
//   const handleGetCurrentLocation = () => {
//     if ("geolocation" in navigator) {
//       setIsLocating(true);
//       navigator.geolocation.getCurrentPosition(
//         (p) => {
//           setAddress(
//             `Lat: ${p.coords.latitude.toFixed(
//               4
//             )}, Lng: ${p.coords.longitude.toFixed(4)}`
//           );
//           setIsLocating(false);
//         },
//         () => setIsLocating(false)
//       );
//     }
//   };

//   /* ================= LOADING & ERROR ================= */
//   if (loading) {
//     return (
//       <div className="py-60 text-center font-black text-3xl">
//         Loading...
//       </div>
//     );
//   }

//   if (!subService) {
//     return (
//       <div className="py-60 text-center font-black text-3xl">
//         Service Not Found
//       </div>
//     );
//   }

//   /* ================= IMAGE ================= */
//   const imageUrl = subService.image
//     ? subService.image
//     : "/placeholder-service.jpg";

//   /* ================= PRICING ================= */
//   const basePrice = Number(subService.price);
//   const emergencyFee = isEmergency
//     ? Number(subService.emergency_price || 500)
//     : 0;

//   const taxPercent = 18;
//   const taxAmount = ((basePrice + emergencyFee) * taxPercent) / 100;
//   const total = basePrice + emergencyFee + taxAmount;

//   return (
//     <div className="max-w-7xl mx-auto py-20 px-6">
//       {/* BACK */}
//       <Link
//         to="/"
//         className="inline-flex items-center gap-3 text-gray-400 font-bold mb-12 hover:text-indigo-600"
//       >
//         <ArrowLeft size={24} /> Back
//       </Link>

//       <div className="bg-white rounded-[4rem] overflow-hidden shadow-2xl border border-gray-100 flex flex-col lg:flex-row min-h-[800px]">
//         {/* ================= LEFT IMAGE ================= */}
//         <div className="lg:w-1/2 relative min-h-[400px]">
//           <img
//             src={imageUrl}
//             alt={subService.name}
//             className="absolute inset-0 w-full h-full object-cover"
//           />

//           <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

//           <div className="absolute bottom-12 left-12 right-12 text-white">
//             <h1 className="text-5xl font-black mb-4 leading-none">
//               {subService.name}
//             </h1>

//             <div className="flex items-center gap-4">
//               <Star className="fill-amber-400 text-amber-400" />
//               <span className="text-2xl font-black">4.5</span>
//             </div>

//             <p className="mt-2 text-sm font-bold uppercase tracking-widest text-white/80">
//               {subService.Service?.name}
//             </p>
//           </div>
//         </div>

//         {/* ================= RIGHT PANEL ================= */}
//         <div className="lg:w-1/2 p-12 lg:p-20 flex flex-col">
//           <p className="text-gray-500 text-lg font-medium mb-12 leading-relaxed">
//             {subService.description}
//           </p>

//           {/* ADDRESS */}
//           <div className="space-y-10 mb-12">
//             <div>
//               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">
//                 Address
//               </label>
//               <div className="relative mt-2">
//                 <input
//                   className="w-full bg-gray-50 rounded-[2rem] px-8 py-6 font-bold outline-none pr-16"
//                   placeholder="Service location..."
//                   value={address}
//                   onChange={(e) => setAddress(e.target.value)}
//                 />
//                 <button
//                   onClick={handleGetCurrentLocation}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-indigo-600 text-white rounded-2xl shadow-xl"
//                 >
//                   {isLocating ? "..." : <Navigation />}
//                 </button>
//               </div>
//             </div>

//             {/* DATE & TIME */}
//             <div className="grid grid-cols-2 gap-8">
//               <input
//                 type="date"
//                 min={todayStr}
//                 className="bg-gray-50 rounded-[2rem] px-8 py-6 font-bold outline-none"
//                 value={bookingDate}
//                 onChange={(e) => setBookingDate(e.target.value)}
//               />

//               <select
//                 className="bg-gray-50 rounded-[2rem] px-8 py-6 font-bold outline-none"
//                 value={bookingTime}
//                 onChange={(e) => setBookingTime(e.target.value)}
//               >
//                 {timeSlots.map((slot) => (
//                   <option key={slot}>{slot}</option>
//                 ))}
//               </select>
//             </div>

//             {/* EMERGENCY */}
//             <button
//               onClick={() => setIsEmergency(!isEmergency)}
//               className={`w-full p-8 rounded-[2.5rem] border-2 flex items-center justify-between
//               ${
//                 isEmergency
//                   ? "bg-amber-50 border-amber-500"
//                   : "bg-white border-gray-100"
//               }`}
//             >
//               <div className="flex items-center gap-6">
//                 <Zap
//                   className={isEmergency ? "text-amber-500" : "text-gray-300"}
//                   size={32}
//                 />
//                 <div className="text-left">
//                   <p className="text-xl font-black">Emergency Service</p>
//                   <p className="text-sm font-bold text-gray-400">
//                     Within 45 mins (+₹{emergencyFee || 500})
//                   </p>
//                 </div>
//               </div>
//             </button>
//           </div>

//           {/* PRICE */}
//           <div className="bg-gray-950 rounded-[3rem] p-10 space-y-4 mb-12 text-white">
//             <div className="flex justify-between text-gray-400 font-bold">
//               <span>Base Price</span>
//               <span>₹{basePrice}</span>
//             </div>
//             <div className="flex justify-between text-gray-400 font-bold">
//               <span>Emergency Fee</span>
//               <span>₹{emergencyFee}</span>
//             </div>
//             <div className="flex justify-between text-gray-400 font-bold">
//               <span>Tax (GST {taxPercent}%)</span>
//               <span>₹{taxAmount.toFixed(0)}</span>
//             </div>

//             <div className="pt-8 border-t border-white/10 flex justify-between items-end">
//               <div>
//                 <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">
//                   Total
//                 </p>
//                 <p className="text-5xl font-black tracking-tighter">
//                   ₹{total.toFixed(0)}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* PROCEED */}
//           <button
//             onClick={() => navigate(`/checkout/${subService.id}`)}
//             className="w-full bg-indigo-600 text-white font-black py-8 rounded-[2.5rem]
//             shadow-2xl hover:bg-indigo-700 transition-all text-2xl flex items-center justify-center gap-4"
//           >
//             Proceed <ChevronRight size={32} />
//           </button>

//           <p className="text-center mt-6 text-gray-400 font-bold text-sm flex items-center justify-center gap-2">
//             <Shield size={16} /> Secure Payment Hub
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SubServiceDetail;



















//// current code ////

// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import {
//   ArrowLeft,
//   Star,
//   Navigation,
//   Zap,
//   ChevronRight,
//   Shield,
// } from "lucide-react";
// import { API_BASE } from "../../../config/api";

// const SubServiceDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [subService, setSubService] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   /* ================= ADDRESS / DATE / TIME ================= */
//   const todayStr = new Date().toISOString().split("T")[0];
//   const [address, setAddress] = useState("");
//   const [bookingDate, setBookingDate] = useState(todayStr);
//   const [bookingTime, setBookingTime] = useState("10:00 AM");
//   const [isLocating, setIsLocating] = useState(false);

//   /* ================= EMERGENCY ================= */
//   const [isEmergency, setIsEmergency] = useState(false);
//   const [urgencyList, setUrgencyList] = useState<any[]>([]);
//   const [selectedUrgency, setSelectedUrgency] = useState<string | null>(null);
//   const [emergencyCalc, setEmergencyCalc] = useState<any>(null);
//   const [emergencyLoading, setEmergencyLoading] = useState(false);

//   /* ================= GST ================= */
//   const [gstData, setGstData] = useState<any>(null);
//   const [gstLoading, setGstLoading] = useState(false);

//   /* ================= FETCH SUBSERVICE ================= */
//   useEffect(() => {
//     fetch(`${API_BASE}/api/subservices/id/${id}`)
//       .then((res) => res.json())
//       .then((res) => {
//         setSubService(res.data);
//         setLoading(false);
//       })
//       .catch(() => setLoading(false));
//   }, [id]);

//   /* ================= FETCH EMERGENCY OPTIONS ================= */
//   useEffect(() => {
//     if (!isEmergency) return;

//     fetch(`${API_BASE}/api/emergency-pricing`)
//       .then((res) => res.json())
//       .then((res) => setUrgencyList(res));
//   }, [isEmergency]);

//   /* ================= CALCULATE EMERGENCY PRICE ================= */
//   useEffect(() => {
//     if (!selectedUrgency || !subService) return;

//     setEmergencyLoading(true);

//     fetch(`${API_BASE}/api/emergency-pricing/calculate`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         subservice_id: subService.id,
//         urgency_level: selectedUrgency,
//       }),
//     })
//       .then((res) => res.json())
//       .then((res) => {
//         setEmergencyCalc(res.data);
//         setEmergencyLoading(false);
//       })
//       .catch(() => setEmergencyLoading(false));
//   }, [selectedUrgency, subService]);

//   /* ================= GST CALCULATION ================= */
//   useEffect(() => {
//     if (!subService) return;

//     const taxableAmount =
//       emergencyCalc?.emergency_price ??
//       Number(subService.price);

//     setGstLoading(true);

//     fetch(`${API_BASE}/api/gst/calculate`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         base_amount: taxableAmount,
//         is_inter_state: false,
//       }),
//     })
//       .then((res) => res.json())
//       .then((res) => {
//         setGstData(res.data);
//         setGstLoading(false);
//       })
//       .catch(() => setGstLoading(false));
//   }, [subService, emergencyCalc]);

//   /* ================= LOCATION ================= */
//   const handleGetCurrentLocation = () => {
//     if (!("geolocation" in navigator)) return;

//     setIsLocating(true);
//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         setAddress(
//           `Lat: ${pos.coords.latitude.toFixed(
//             4
//           )}, Lng: ${pos.coords.longitude.toFixed(4)}`
//         );
//         setIsLocating(false);
//       },
//       () => setIsLocating(false)
//     );
//   };

//   /* ================= TIME SLOTS ================= */
//     const timeSlots = [
//   { label: "8:00 AM - 10:00 AM" },
//   { label: "10:00 AM - 12:00 PM" },
//   { label: "12:00 PM - 2:00 PM" },
//   { label: "2:00 PM - 4:00 PM"},
//   { label: "4:00 PM - 6:00 PM" },
// ];


//   if (loading) {
//     return (
//       <div className="py-60 text-center font-black text-3xl">
//         Loading...
//       </div>
//     );
//   }

//   if (!subService) {
//     return (
//       <div className="py-60 text-center font-black text-3xl">
//         Service Not Found
//       </div>
//     );
//   }

//   const imageUrl = subService.image || "/placeholder-service.jpg";
//   const basePrice = Number(subService.price);
//   const addonPrice = Number(emergencyCalc?.addon_price || 0);
//   const emergencyTotal = Number(
//     emergencyCalc?.emergency_price || 0
//   );
//   const totalGST = Number(gstData?.total_gst || 0);
//   const grandTotal = Number(
//     gstData?.grand_total || basePrice
//   );

//   return (
//     <div className="max-w-7xl mx-auto py-20 px-6">
//       <Link
//         to="/"
//         className="inline-flex items-center gap-3 text-gray-400 font-bold mb-12"
//       >
//         <ArrowLeft size={24} /> Back
//       </Link>

//       <div className="bg-white rounded-[4rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row">
//         {/* IMAGE */}
//         <div className="lg:w-1/2 relative min-h-[400px]">
//           <img
//             src={imageUrl}
//             alt={subService.name}
//             className="absolute inset-0 w-full h-full object-cover"
//           />
//         </div>

//         {/* RIGHT PANEL */}
//         <div className="lg:w-1/2 p-16">
//           <p className="text-gray-500 mb-10">
//             {subService.description}
//           </p>

//           {/* ADDRESS */}
//           <div className="mb-8">
//             <label className="text-xs font-bold text-gray-400 uppercase">
//               Address
//             </label>
//             <div className="relative mt-2">
//               <input
//                 className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-bold"
//                 value={address}
//                 onChange={(e) => setAddress(e.target.value)}
//               />
//               <button
//                 onClick={handleGetCurrentLocation}
//                 className="absolute right-4 top-1/2 -translate-y-1/2 bg-indigo-600 text-white p-3 rounded-xl"
//               >
//                 {isLocating ? "..." : <Navigation size={18} />}
//               </button>
//             </div>
//           </div>

// {/* DATE & TIME */}
// <div className="grid grid-cols-2 gap-6 mb-10">
//   {/* DATE */}
//   <div>
//     <label className="text-xs font-bold text-gray-400 uppercase">
//       Service Date
//     </label>
//     <input
//       type="date"
//       min={todayStr}
//       className="mt-2 w-full bg-gray-50 rounded-2xl px-6 py-4 font-bold"
//       value={bookingDate}
//       onChange={(e) => setBookingDate(e.target.value)}
//     />
//   </div>

//   {/* TIME SLOTS */}
//   <div>
//     <label className="text-xs font-bold text-gray-400 uppercase">
//       Time Slot
//     </label>

//     <div className="mt-2 space-y-3">
//       {timeSlots.map((slot) => {
//         const isSelected = bookingTime === slot.label;

//         return (
//           <button
//             key={slot.label}
//             type="button"
//             onClick={() => setBookingTime(slot.label)}
//             className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 transition
//               ${
//                 isSelected
//                   ? "border-indigo-600 bg-indigo-50"
//                   : "border-gray-200 hover:border-indigo-300"
//               }`}
//           >
//             <div className="flex items-center gap-4">
//               {/* RADIO DOT */}
//               <span
//                 className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
//                   ${
//                     isSelected
//                       ? "border-indigo-600"
//                       : "border-gray-300"
//                   }`}
//               >
//                 {isSelected && (
//                   <span className="w-2 h-2 bg-indigo-600 rounded-full" />
//                 )}
//               </span>

//               <span className="font-bold text-sm">
//                 {slot.label}
//               </span>
//             </div>

//           </button>
//         );
//       })}
//     </div>
//   </div>
// </div>


//           {/* EMERGENCY */}
//           <button
//             onClick={() => {
//               setIsEmergency(!isEmergency);
//               setSelectedUrgency(null);
//               setEmergencyCalc(null);
//             }}
//             className={`w-full mb-6 p-6 rounded-3xl border-2 flex justify-between ${
//               isEmergency
//                 ? "border-amber-500 bg-amber-50"
//                 : "border-gray-200"
//             }`}
//           >
//             <div className="flex gap-4">
//               <Zap className="text-amber-500" />
//               <div>
//                 <p className="font-black">Emergency Service</p>
//                 <p className="text-sm text-gray-500">
//                   Faster service with surge pricing
//                 </p>
//               </div>
//             </div>
//           </button>

//           {/* URGENCY OPTIONS */}
//           {isEmergency && (
//             <div className="space-y-4 mb-10">
//               {urgencyList.map((u) => (
//                 <label
//                   key={u.id}
//                   className="flex items-center gap-4 p-4 border rounded-xl cursor-pointer"
//                 >
//                   <input
//                     type="radio"
//                     checked={selectedUrgency === u.urgency_level}
//                     onChange={() =>
//                       setSelectedUrgency(u.urgency_level)
//                     }
//                   />
//                   <span className="font-bold">{u.label}</span>
//                 </label>
//               ))}
//             </div>
//           )}

//           {/* PRICE */}
//           <div className="bg-gray-950 text-white rounded-3xl p-8 space-y-4">
//             <div className="flex justify-between">
//               <span>Base Price</span>
//               <span>₹{basePrice}</span>
//             </div>

//             {addonPrice > 0 && (
//               <div className="flex justify-between">
//                 <span>Emergency Add-on</span>
//                 <span>
//                   ₹{emergencyLoading ? "..." : addonPrice}
//                 </span>
//               </div>
//             )}

//             {/* {emergencyTotal > 0 && (
//               <div className="flex justify-between font-bold">
//                 <span>Emergency Total</span>
//                 <span>₹{emergencyTotal}</span>
//               </div>
//             )} */}

//             <div className="flex justify-between">
//               <span>GST</span>
//               <span>₹{gstLoading ? "..." : totalGST}</span>
//             </div>

//             <div className="pt-6 border-t border-white/20 flex justify-between">
//               <span className="font-black text-xl">Total</span>
//               <span className="font-black text-3xl">
//                 ₹{gstLoading ? "..." : grandTotal}
//               </span>
//             </div>
//           </div>

//           <button
//             onClick={() => navigate(`/checkout/${subService.id}`)}
//             className="w-full mt-10 bg-indigo-600 text-white font-black py-6 rounded-3xl text-xl flex justify-center gap-3"
//           >
//             Proceed <ChevronRight />
//           </button>

//           <p className="text-center mt-4 text-gray-400 flex justify-center gap-2">
//             <Shield size={16} /> Secure Payment
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SubServiceDetail;



























// ... your existing imports
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  Navigation,
  Zap,
  ChevronRight,
  Shield,
  MapPin,
  Loader2,
  X,
} from "lucide-react";
import { API_BASE } from "../../../config/api";

// Google Maps API Key (add to .env as VITE_GOOGLE_MAPS_API_KEY)
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

const SubServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [subService, setSubService] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  /* ================= ADDRESS / DATE / TIME ================= */
  const todayStr = new Date().toISOString().split("T")[0];
  const [address, setAddress] = useState("");
  const [bookingDate, setBookingDate] = useState(todayStr);
  const [bookingTime, setBookingTime] = useState("10:00 AM");
  const [isLocating, setIsLocating] = useState(false);

  /* ================= EMERGENCY ================= */
  const [isEmergency, setIsEmergency] = useState(false);
  const [urgencyList, setUrgencyList] = useState<any[]>([]);
  const [selectedUrgency, setSelectedUrgency] = useState<string | null>(null);
  const [emergencyCalc, setEmergencyCalc] = useState<any>(null);
  const [emergencyLoading, setEmergencyLoading] = useState(false);

  /* ================= GST ================= */
  const [gstData, setGstData] = useState<any>(null);
  const [gstLoading, setGstLoading] = useState(false);

  /* ================= FETCH SUBSERVICE ================= */
  useEffect(() => {
    fetch(`${API_BASE}/api/subservices/id/${id}`)
      .then((res) => res.json())
      .then((res) => {
        setSubService(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  /* ================= FETCH EMERGENCY OPTIONS ================= */
  useEffect(() => {
    if (!isEmergency) return;

    fetch(`${API_BASE}/api/emergency-pricing`)
      .then((res) => res.json())
      .then((res) => setUrgencyList(res));
  }, [isEmergency]);

  /* ================= CALCULATE EMERGENCY PRICE ================= */
  useEffect(() => {
    if (!selectedUrgency || !subService) return;

    setEmergencyLoading(true);

    fetch(`${API_BASE}/api/emergency-pricing/calculate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subservice_id: subService.id,
        urgency_level: selectedUrgency,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        setEmergencyCalc(res.data);
        setEmergencyLoading(false);
      })
      .catch(() => setEmergencyLoading(false));
  }, [selectedUrgency, subService]);

  /* ================= GST CALCULATION ================= */
  useEffect(() => {
    if (!subService) return;

    const taxableAmount =
      emergencyCalc?.emergency_price ?? Number(subService.price);

    setGstLoading(true);

    fetch(`${API_BASE}/api/gst/calculate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        base_amount: taxableAmount,
        is_inter_state: false,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        setGstData(res.data);
        setGstLoading(false);
      })
      .catch(() => setGstLoading(false));
  }, [subService, emergencyCalc]);

  /* ================= LOCATION ================= */
  const [locationCoords, setLocationCoords] = useState<{lat: number, lng: number} | null>(null);

  // Reverse geocode using Google Maps API
  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    if (!GOOGLE_MAPS_API_KEY) {
      // Fallback without API key
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();

      if (data.status === "OK" && data.results[0]) {
        return data.results[0].formatted_address;
      }
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    } catch (error) {
      console.error("Geocode error:", error);
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  };

  const handleGetCurrentLocation = async () => {
    if (!("geolocation" in navigator)) {
      alert("Geolocation not supported by your browser");
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocationCoords({ lat: latitude, lng: longitude });

        // Get readable address using Google Maps
        const readableAddress = await reverseGeocode(latitude, longitude);
        setAddress(readableAddress);
        setIsLocating(false);
      },
      (error) => {
        console.error("Location error:", error);
        setIsLocating(false);
        alert("Unable to get location. Please enter address manually.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  /* ================= TIME SLOTS ================= */
  const timeSlots = [
    { label: "8:00 AM - 10:00 AM" },
    { label: "10:00 AM - 12:00 PM" },
    { label: "12:00 PM - 2:00 PM" },
    { label: "2:00 PM - 4:00 PM" },
    { label: "4:00 PM - 6:00 PM" },
  ];

  // 🔹 DISABLE PAST SLOTS
  const isSlotDisabled = (slotLabel: string) => {
    if (bookingDate !== todayStr) return false; // Only check for today

    const now = new Date();
    const [start, end] = slotLabel.split(" - ").map((t) => {
      const [hourMin, period] = t.split(" ");
      let [hour, min] = hourMin.split(":").map(Number);
      if (period === "PM" && hour !== 12) hour += 12;
      if (period === "AM" && hour === 12) hour = 0;
      return { hour, min };
    });

    const endTime = new Date();
    endTime.setHours(end.hour, end.min, 0, 0);

    return now >= endTime;
  };

  if (loading) {
    return (
      <div className="py-60 text-center font-black text-3xl">Loading...</div>
    );
  }

  if (!subService) {
    return (
      <div className="py-60 text-center font-black text-3xl">
        Service Not Found
      </div>
    );
  }

  const imageUrl = subService.image || "/placeholder-service.jpg";
  const basePrice = Number(subService.price);
  const addonPrice = Number(emergencyCalc?.addon_price || 0);
  const emergencyTotal = Number(emergencyCalc?.emergency_price || 0);
  const totalGST = Number(gstData?.total_gst || 0);
  const grandTotal = Number(gstData?.grand_total || basePrice);

  return (
    <div className="max-w-7xl mx-auto py-20 px-6">
      <Link
        to="/"
        className="inline-flex items-center gap-3 text-gray-400 font-bold mb-12"
      >
        <ArrowLeft size={24} /> Back
      </Link>

      <div className="bg-white rounded-[4rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row">
        {/* IMAGE */}
        <div className="lg:w-1/2 relative min-h-[400px]">
          <img
            src={imageUrl}
            alt={subService.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* RIGHT PANEL */}
        <div className="lg:w-1/2 p-16">
          <p className="text-gray-500 mb-10">{subService.description}</p>

          {/* ADDRESS */}
          <div className="mb-8">
            <label className="text-xs font-bold text-gray-400 uppercase">
              Service Address
            </label>
            <div className="relative mt-2">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <MapPin size={20} />
              </div>
              <input
                className="w-full bg-gray-50 rounded-2xl pl-12 pr-28 py-4 font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your service address..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {address && (
                  <button
                    onClick={() => {
                      setAddress("");
                      setLocationCoords(null);
                    }}
                    className="p-2 hover:bg-gray-200 rounded-lg"
                  >
                    <X size={18} className="text-gray-400" />
                  </button>
                )}
                <button
                  onClick={handleGetCurrentLocation}
                  disabled={isLocating}
                  className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                  title="Use my current location"
                >
                  {isLocating ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Navigation size={18} />
                  )}
                </button>
              </div>
            </div>
            {/* Show coordinates if available */}
            {locationCoords && (
              <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                <MapPin size={12} />
                <span>GPS: {locationCoords.lat.toFixed(5)}, {locationCoords.lng.toFixed(5)}</span>
              </div>
            )}
            {/* API Key hint for development */}
            {!GOOGLE_MAPS_API_KEY && (
              <p className="mt-1 text-xs text-amber-600">
                Tip: Add VITE_GOOGLE_MAPS_API_KEY to .env for address lookup
              </p>
            )}
          </div>

          {/* DATE & TIME */}
          <div className="grid grid-cols-2 gap-6 mb-10">
            {/* DATE */}
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">
                Service Date
              </label>
              <input
                type="date"
                min={todayStr}
                className="mt-2 w-full bg-gray-50 rounded-2xl px-6 py-4 font-bold"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
              />
            </div>

            {/* TIME SLOTS */}
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">
                Time Slot
              </label>

              <div className="mt-2 space-y-3">
                {timeSlots.map((slot) => {
                  const disabled = isSlotDisabled(slot.label);
                  const isSelected = bookingTime === slot.label && !disabled;

                  return (
                    <button
                      key={slot.label}
                      type="button"
                      onClick={() => !disabled && setBookingTime(slot.label)}
                      disabled={disabled}
                      className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 transition
                        ${
                          disabled
                            ? "bg-gray-100 border-gray-300 cursor-not-allowed opacity-50"
                            : isSelected
                            ? "border-indigo-600 bg-indigo-50"
                            : "border-gray-200 hover:border-indigo-300"
                        }`}
                    >
                      <div className="flex items-center gap-4">
                        <span
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                            ${
                              isSelected ? "border-indigo-600" : "border-gray-300"
                            }`}
                        >
                          {isSelected && (
                            <span className="w-2 h-2 bg-indigo-600 rounded-full" />
                          )}
                        </span>

                        <span className="font-bold text-sm">{slot.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* EMERGENCY BUTTON & OPTIONS */}
          <button
            onClick={() => {
              setIsEmergency(!isEmergency);
              setSelectedUrgency(null);
              setEmergencyCalc(null);
            }}
            className={`w-full mb-6 p-6 rounded-3xl border-2 flex justify-between ${
              isEmergency ? "border-amber-500 bg-amber-50" : "border-gray-200"
            }`}
          >
            <div className="flex gap-4">
              <Zap className="text-amber-500" />
              <div>
                <p className="font-black">Emergency Service</p>
                <p className="text-sm text-gray-500">
                  Faster service with surge pricing
                </p>
              </div>
            </div>
          </button>

          {isEmergency && (
            <div className="space-y-4 mb-10">
              {urgencyList.map((u) => (
                <label
                  key={u.id}
                  className="flex items-center gap-4 p-4 border rounded-xl cursor-pointer"
                >
                  <input
                    type="radio"
                    checked={selectedUrgency === u.urgency_level}
                    onChange={() => setSelectedUrgency(u.urgency_level)}
                  />
                  <span className="font-bold">{u.label}</span>
                </label>
              ))}
            </div>
          )}

          {/* PRICE PANEL */}
          <div className="bg-gray-950 text-white rounded-3xl p-8 space-y-4">
            <div className="flex justify-between">
              <span>Base Price</span>
              <span>₹{basePrice}</span>
            </div>

            {addonPrice > 0 && (
              <div className="flex justify-between">
                <span>Emergency Add-on</span>
                <span>{emergencyLoading ? "..." : addonPrice}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>GST</span>
              <span>{gstLoading ? "..." : totalGST}</span>
            </div>

            <div className="pt-6 border-t border-white/20 flex justify-between">
              <span className="font-black text-xl">Total</span>
              <span className="font-black text-3xl">
                ₹{gstLoading ? "..." : grandTotal}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate(`/checkout/${subService.id}`)}
            className="w-full mt-10 bg-indigo-600 text-white font-black py-6 rounded-3xl text-xl flex justify-center gap-3"
          >
            Proceed <ChevronRight />
          </button>

          <p className="text-center mt-4 text-gray-400 flex justify-center gap-2">
            <Shield size={16} /> Secure Payment
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubServiceDetail;
