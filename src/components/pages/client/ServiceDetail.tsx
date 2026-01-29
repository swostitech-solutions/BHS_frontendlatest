// ... your existing imports
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
//       emergencyCalc?.emergency_price ?? Number(subService.price);

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
//   const timeSlots = [
//     { label: "8:00 AM - 10:00 AM" },
//     { label: "10:00 AM - 12:00 PM" },
//     { label: "12:00 PM - 2:00 PM" },
//     { label: "2:00 PM - 4:00 PM" },
//     { label: "4:00 PM - 6:00 PM" },
//   ];

//   // 🔹 DISABLE PAST SLOTS
//   const isSlotDisabled = (slotLabel: string) => {
//     if (bookingDate !== todayStr) return false; // Only check for today

//     const now = new Date();
//     const [start, end] = slotLabel.split(" - ").map((t) => {
//       const [hourMin, period] = t.split(" ");
//       let [hour, min] = hourMin.split(":").map(Number);
//       if (period === "PM" && hour !== 12) hour += 12;
//       if (period === "AM" && hour === 12) hour = 0;
//       return { hour, min };
//     });

//     const endTime = new Date();
//     endTime.setHours(end.hour, end.min, 0, 0);

//     return now >= endTime;
//   };

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

//   const imageUrl = subService.image || "/placeholder-service.jpg";
//   const basePrice = Number(subService.price);
//   const addonPrice = Number(emergencyCalc?.addon_price || 0);
//   const emergencyTotal = Number(emergencyCalc?.emergency_price || 0);
//   const totalGST = Number(gstData?.total_gst || 0);
//   const grandTotal = Number(gstData?.grand_total || basePrice);

// const handleProceed = async () => {
//   // ✅ Check login
//   const user = JSON.parse(sessionStorage.getItem("user") || "{}");
//   if (!user?.id) {
//     alert("Please login first before proceed");
//     navigate("/login");
//     return;
//   }

//   try {
//     // ✅ Prepare payload (same as HomePage)
//     const payload = {
//       user_id: user.id,
//       service_code: subService.service_code,
//       subservice_code: subService.subservice_code,
//       quantity: 1,
//     };

//     // ✅ Add to cart API
//     const res = await fetch(`${API_BASE}/api/cart`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });

//     if (!res.ok) {
//       alert("Failed to add to cart");
//       return;
//     }

//     // ✅ Update sessionStorage cart
//     const cart = JSON.parse(sessionStorage.getItem("cart") || "[]");
//     const existingItem = cart.find((c: any) => c.id === subService.id);

//     if (existingItem) {
//       existingItem.quantity += 1;
//     } else {
//       cart.push({
//         id: subService.id,
//         name: subService.name,
//         price: Number(subService.price),
//         image: subService.image,
//         quantity: 1,
//         address,
//         bookingDate,
//         bookingTime,
//         isEmergency,
//         selectedUrgency,
//       });
//     }

//     sessionStorage.setItem("cart", JSON.stringify(cart));

//     // ✅ Redirect to cart
//     navigate("/cart");
//   } catch (err) {
//     console.error(err);
//     alert("Something went wrong");
//   }
// };

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
//           <p className="text-gray-500 mb-10">{subService.description}</p>

//           {/* ADDRESS */}
//           {/* <div className="mb-8">
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
//           </div> */}

//           {/* DATE & TIME */}
//           {/* <div className="grid grid-cols-2 gap-6 mb-10"> */}
//             {/* DATE */}
//             {/* <div>
//               <label className="text-xs font-bold text-gray-400 uppercase">
//                 Service Date
//               </label>
//               <input
//                 type="date"
//                 min={todayStr}
//                 className="mt-2 w-full bg-gray-50 rounded-2xl px-6 py-4 font-bold"
//                 value={bookingDate}
//                 onChange={(e) => setBookingDate(e.target.value)}
//               />
//             </div> */}

//             {/* TIME SLOTS */}
//             {/* <div>
//               <label className="text-xs font-bold text-gray-400 uppercase">
//                 Time Slot
//               </label>

//               <div className="mt-2 space-y-3">
//                 {timeSlots.map((slot) => {
//                   const disabled = isSlotDisabled(slot.label);
//                   const isSelected = bookingTime === slot.label && !disabled;

//                   return (
//                     <button
//                       key={slot.label}
//                       type="button"
//                       onClick={() => !disabled && setBookingTime(slot.label)}
//                       disabled={disabled}
//                       className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 transition
//                         ${
//                           disabled
//                             ? "bg-gray-100 border-gray-300 cursor-not-allowed opacity-50"
//                             : isSelected
//                               ? "border-indigo-600 bg-indigo-50"
//                               : "border-gray-200 hover:border-indigo-300"
//                         }`}
//                     >
//                       <div className="flex items-center gap-4">
//                         <span
//                           className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
//                             ${
//                               isSelected
//                                 ? "border-indigo-600"
//                                 : "border-gray-300"
//                             }`}
//                         >
//                           {isSelected && (
//                             <span className="w-2 h-2 bg-indigo-600 rounded-full" />
//                           )}
//                         </span>

//                         <span className="font-bold text-sm">{slot.label}</span>
//                       </div>
//                     </button>
//                   );
//                 })}
//               </div>
//             </div> */}
//           {/* </div> */}

//           {/* EMERGENCY BUTTON & OPTIONS */}
//           <button
//             onClick={() => {
//               setIsEmergency(!isEmergency);
//               setSelectedUrgency(null);
//               setEmergencyCalc(null);
//             }}
//             className={`w-full mb-6 p-6 rounded-3xl border-2 flex justify-between ${
//               isEmergency ? "border-amber-500 bg-amber-50" : "border-gray-200"
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
//                     onChange={() => setSelectedUrgency(u.urgency_level)}
//                   />
//                   <span className="font-bold">{u.label}</span>
//                 </label>
//               ))}
//             </div>
//           )}

//           {/* PRICE PANEL */}
//           <div className="bg-gray-950 text-white rounded-3xl p-8 space-y-4">
//             <div className="flex justify-between">
//               <span>Base Price</span>
//               <span>₹{basePrice}</span>
//             </div>

//             {addonPrice > 0 && (
//               <div className="flex justify-between">
//                 <span>Emergency Add-on</span>
//                 <span>{emergencyLoading ? "..." : addonPrice}</span>
//               </div>
//             )}

//             <div className="flex justify-between">
//               <span>GST</span>
//               <span>{gstLoading ? "..." : totalGST}</span>
//             </div>

//             <div className="pt-6 border-t border-white/20 flex justify-between">
//               <span className="font-black text-xl">Total</span>
//               <span className="font-black text-3xl">
//                 ₹{gstLoading ? "..." : grandTotal}
//               </span>
//             </div>
//           </div>

//           {/* <button
//             // onClick={() => navigate(`/checkout/${subService.id}`)}
//             onClick={handleProceed}
//             className="w-full mt-10 bg-indigo-600 text-white font-black py-6 rounded-3xl text-xl flex justify-center gap-3"
//           >
//             Proceed <ChevronRight />
//           </button> */}

//           {/* <p className="text-center mt-4 text-gray-400 flex justify-center gap-2">
//             <Shield size={16} /> Secure Payment
//           </p> */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SubServiceDetail;






//currently working code 
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  Navigation,
  Zap,
  ChevronRight,
  Shield,
} from "lucide-react";
import { API_BASE } from "../../../config/api";

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
  const handleGetCurrentLocation = () => {
    if (!("geolocation" in navigator)) return;

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setAddress(
          `Lat: ${pos.coords.latitude.toFixed(
            4,
          )}, Lng: ${pos.coords.longitude.toFixed(4)}`,
        );
        setIsLocating(false);
      },
      () => setIsLocating(false),
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

  const handleProceed = async () => {
    // ✅ Check login
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");
    if (!user?.id) {
      alert("Please login first before proceed");
      navigate("/login");
      return;
    }

    try {
      // ✅ Prepare payload (same as HomePage)
      const payload = {
        user_id: user.id,
        service_code: subService.service_code,
        subservice_code: subService.subservice_code,
        quantity: 1,
      };

      // ✅ Add to cart API
      const res = await fetch(`${API_BASE}/api/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        alert("Failed to add to cart");
        return;
      }

      // ✅ Update sessionStorage cart
      const cart = JSON.parse(sessionStorage.getItem("cart") || "[]");
      const existingItem = cart.find((c: any) => c.id === subService.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          id: subService.id,
          name: subService.name,
          price: Number(subService.price),
          image: subService.image,
          quantity: 1,
          address,
          bookingDate,
          bookingTime,
          isEmergency,
          selectedUrgency,
        });
      }

      sessionStorage.setItem("cart", JSON.stringify(cart));

      // ✅ Redirect to cart
      navigate("/cart");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

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

          
        </div>
      </div>
    </div>
  );
};

export default SubServiceDetail;