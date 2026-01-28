// import { useEffect, useState } from "react";
// import { Trash2, Plus, Minus, ArrowLeft } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// // 👉 Cart Item Type
// interface CartItem {
//   id: number;
//   name: string;
//   price: number;
//   quantity: number;
// }

// const CartPage = () => {
//   const navigate = useNavigate();
//   const [cart, setCart] = useState<CartItem[]>([]);

//   // Load cart from sessionStorage
//   useEffect(() => {
//     const storedCart = sessionStorage.getItem("cart");
//     if (storedCart) {
//       setCart(JSON.parse(storedCart));
//     }
//   }, []);

//   // Save cart to sessionStorage
//   const updateCart = (updatedCart: CartItem[]) => {
//     setCart(updatedCart);
//     sessionStorage.setItem("cart", JSON.stringify(updatedCart));
//   };

//   const increaseQty = (id: number) => {
//     updateCart(
//       cart.map((item) =>
//         item.id === id ? { ...item, quantity: item.quantity + 1 } : item
//       )
//     );
//   };

//   const decreaseQty = (id: number) => {
//     updateCart(
//       cart
//         .map((item) =>
//           item.id === id
//             ? { ...item, quantity: Math.max(1, item.quantity - 1) }
//             : item
//         )
//         .filter((item) => item.quantity > 0)
//     );
//   };

//   const removeItem = (id: number) => {
//     updateCart(cart.filter((item) => item.id !== id));
//   };

//   const totalAmount = cart.reduce(
//     (sum, item) => sum + item.price * item.quantity,
//     0
//   );

//   return (
//     <div className="max-w-5xl mx-auto px-6 py-10">
//       {/* HEADER */}
//       <div className="flex items-center gap-4 mb-8">
//         <button
//           onClick={() => navigate(-1)}
//           className="p-2 rounded-lg hover:bg-gray-100"
//         >
//           <ArrowLeft />
//         </button>
//         <h1 className="text-3xl font-black">Your Cart</h1>
//       </div>

//       {/* EMPTY CART */}
//       {cart.length === 0 ? (
//         <div className="text-center py-20">
//           <p className="text-gray-500 text-lg">Your cart is empty</p>
//         </div>
//       ) : (
//         <div className="grid md:grid-cols-3 gap-8">
//           {/* CART ITEMS */}
//           <div className="md:col-span-2 space-y-4">
//             {cart.map((item) => (
//               <div
//                 key={item.id}
//                 className="bg-white rounded-2xl shadow p-5 flex justify-between items-center"
//               >
//                 <div>
//                   <h3 className="font-bold text-lg">{item.name}</h3>
//                   <p className="text-gray-500">₹{item.price}</p>
//                 </div>

//                 <div className="flex items-center gap-4">
//                   <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-1">
//                     <button onClick={() => decreaseQty(item.id)}>
//                       <Minus size={16} />
//                     </button>
//                     <span className="font-bold">{item.quantity}</span>
//                     <button onClick={() => increaseQty(item.id)}>
//                       <Plus size={16} />
//                     </button>
//                   </div>

//                   <button
//                     onClick={() => removeItem(item.id)}
//                     className="text-red-500 hover:bg-red-50 p-2 rounded-lg"
//                   >
//                     <Trash2 size={18} />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* SUMMARY */}
//           <div className="bg-white rounded-2xl shadow p-6 h-fit">
//             <h2 className="text-xl font-black mb-4">Summary</h2>

//             <div className="flex justify-between mb-3">
//               <span className="text-gray-600">Subtotal</span>
//               <span className="font-bold">₹{totalAmount.toFixed(2)}</span>
//             </div>

//             <button
//               onClick={() => navigate("/checkout")}
//               className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-xl font-black hover:bg-indigo-700 transition"
//             >
//               Proceed to Checkout
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CartPage;

//// cart APi called ////

// import { useEffect, useState } from "react";
// import { Trash2, Plus, Minus, ArrowLeft } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// // 👉 Cart Item Type
// interface CartItem {
//   id: number;
//   name: string;
//   price: number;
//   quantity: number;
//   image?: string;
// }

// const CartPage = () => {
//   const navigate = useNavigate();
//   const [cart, setCart] = useState<CartItem[]>([]);
//   const [loading, setLoading] = useState(true);

//   /* ================= FETCH CART FROM API ================= */
//   useEffect(() => {
//     const user = JSON.parse(sessionStorage.getItem("user") || "{}");

//     if (!user?.id) {
//       alert("Please login first to view your cart.");
//       setLoading(false);
//       return;
//     }

//     fetch(`http://localhost:4000/api/cart/${user.id}`)
//       .then((res) => res.json())
//       .then((data) => {
//         // Transform API response to CartItem[]
//         const cartItems: CartItem[] = data.items.map((item: any) => ({
//           id: item.id,
//           name: item.SubService?.name || item.Service?.name,
//           price: Number(item.SubService?.price || item.price),
//           quantity: item.quantity,
//           image: item.SubService?.imageUrl || item.Service?.imageUrl,
//         }));

//         setCart(cartItems);
//         sessionStorage.setItem("cart", JSON.stringify(cartItems));
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error(err);
//         setLoading(false);
//       });
//   }, []);

//   /* ================= UPDATE CART LOCALLY ================= */
//   const updateCart = (updatedCart: CartItem[]) => {
//     setCart(updatedCart);
//     sessionStorage.setItem("cart", JSON.stringify(updatedCart));
//   };

//   const increaseQty = (id: number) => {
//     updateCart(
//       cart.map((item) =>
//         item.id === id ? { ...item, quantity: item.quantity + 1 } : item
//       )
//     );
//   };

//   const decreaseQty = (id: number) => {
//     updateCart(
//       cart
//         .map((item) =>
//           item.id === id
//             ? { ...item, quantity: Math.max(1, item.quantity - 1) }
//             : item
//         )
//         .filter((item) => item.quantity > 0)
//     );
//   };

//   const removeItem = (id: number) => {
//     updateCart(cart.filter((item) => item.id !== id));
//   };

//   const totalAmount = cart.reduce(
//     (sum, item) => sum + item.price * item.quantity,
//     0
//   );

//   if (loading) {
//     return (
//       <div className="text-center py-20 font-black text-2xl">
//         Loading your cart...
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-5xl mx-auto px-6 py-10">
//       {/* HEADER */}
//       <div className="flex items-center gap-4 mb-8">
//         <button
//           onClick={() => navigate(-1)}
//           className="p-2 rounded-lg hover:bg-gray-100"
//         >
//           <ArrowLeft />
//         </button>
//         <h1 className="text-3xl font-black">Your Cart</h1>
//       </div>

//       {/* EMPTY CART */}
//       {cart.length === 0 ? (
//         <div className="text-center py-20">
//           <p className="text-gray-500 text-lg">Your cart is empty</p>
//         </div>
//       ) : (
//         <div className="grid md:grid-cols-3 gap-8">
//           {/* CART ITEMS */}
//           <div className="md:col-span-2 space-y-4">
//             {cart.map((item) => (
//               <div
//                 key={item.id}
//                 className="bg-white rounded-2xl shadow p-5 flex justify-between items-center"
//               >
//                 <div className="flex gap-4 items-center">
//                   {item.image && (
//                     <img
//                       src={item.image}
//                       alt={item.name}
//                       className="w-20 h-20 rounded-xl object-cover"
//                     />
//                   )}
//                   <div>
//                     <h3 className="font-bold text-lg">{item.name}</h3>
//                     <p className="text-gray-500">₹{item.price}</p>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-4">
//                   <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-1">
//                     <button onClick={() => decreaseQty(item.id)}>
//                       <Minus size={16} />
//                     </button>
//                     <span className="font-bold">{item.quantity}</span>
//                     <button onClick={() => increaseQty(item.id)}>
//                       <Plus size={16} />
//                     </button>
//                   </div>

//                   <button
//                     onClick={() => removeItem(item.id)}
//                     className="text-red-500 hover:bg-red-50 p-2 rounded-lg"
//                   >
//                     <Trash2 size={18} />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* SUMMARY */}
//           <div className="bg-white rounded-2xl shadow p-6 h-fit">
//             <h2 className="text-xl font-black mb-4">Summary</h2>

//             <div className="flex justify-between mb-3">
//               <span className="text-gray-600">Subtotal</span>
//               <span className="font-bold">₹{totalAmount.toFixed(2)}</span>
//             </div>

//             <button
//               onClick={() => navigate("/checkout")}
//               className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-xl font-black hover:bg-indigo-700 transition"
//             >
//               Proceed to Checkout
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CartPage;

///// currently code /////
// ... Keep the previous imports
import { useEffect, useState } from "react";
import { API_BASE } from "../../../config/api";
import { Trash2, Plus, Minus, ArrowLeft, Navigation } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CartItem {
  id: number;
  subservice_id: number;
  service_code?: string;
  subservice_code?: string;
  name: string;
  price: number;
  quantity: number;
  emergencyPrice?: number;
  urgency_level?: string;
  image?: string;
}

interface GSTData {
  base_amount: number;
  gst_type: string;
  cgst: string;
  sgst: string;
  igst: number;
  total_gst: string;
  grand_total: string;
}

interface EmergencyOption {
  id: number;
  urgency_level: string;
  label: string;
  percentage_markup: string;
  multiplier: string;
}

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [gstData, setGstData] = useState<GSTData | null>(null);
  const [emergencyOptions, setEmergencyOptions] = useState<EmergencyOption[]>(
    [],
  );
  const [selectedCartItem, setSelectedCartItem] = useState<number | null>(null);

  // Location, date, and time slot
  const todayStr = new Date().toISOString().split("T")[0];
  const [address, setAddress] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [selectedDate, setSelectedDate] = useState(todayStr);

  const timeSlots = [
    { label: "8:00 AM - 10:00 AM" },
    { label: "10:00 AM - 12:00 PM" },
    { label: "12:00 PM - 2:00 PM" },
    { label: "2:00 PM - 4:00 PM" },
    { label: "4:00 PM - 6:00 PM" },
  ];
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(
    "10:00 AM - 12:00 PM",
  );

  const user = JSON.parse(sessionStorage.getItem("user") || "{}");

  /* ================= FETCH CART ================= */
  useEffect(() => {
    if (!user?.id) return;

    fetch(`${API_BASE}/api/cart/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        const cartItems: CartItem[] = data.items.map((item: any) => ({
          id: item.id,
          subservice_id: item.SubService?.id || item.Service?.id,
          service_code:
            item.SubService?.service_code || item.Service?.service_code || "",
          subservice_code:
            item.SubService?.subservice_code ||
            item.SubService?.id?.toString() ||
            "",
          name: item.SubService?.name || item.Service?.name,
          price: Number(item.SubService?.price || item.price),
          quantity: item.quantity,
          image: item.SubService?.imageUrl || item.Service?.imageUrl,
        }));

        setCart(cartItems);
        sessionStorage.setItem("cart", JSON.stringify(cartItems));
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [user?.id]);

  /* ================= UPDATE CART ================= */
  const updateCart = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    sessionStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const increaseQty = (id: number) => {
    updateCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  };

  const decreaseQty = (id: number) => {
    const updatedCart = cart
      .map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item,
      )
      .filter((item) => item.quantity > 0);
    updateCart(updatedCart);
  };

  const deleteCartItem = (cartId: number) => {
    fetch(`${API_BASE}/api/cart/item/${cartId}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete item");
        updateCart(cart.filter((item) => item.id !== cartId));
      })
      .catch((err) => console.error(err));
  };

  /* ================= FETCH GST ================= */
  useEffect(() => {
    const subtotal = cart.reduce(
      (sum, item) =>
        sum +
        (item.emergencyPrice !== undefined ? item.emergencyPrice : item.price) *
          item.quantity,
      0,
    );

    if (subtotal === 0) {
      setGstData(null);
      return;
    }

    fetch(`${API_BASE}/api/gst/calculate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ base_amount: subtotal, is_inter_state: false }),
    })
      .then((res) => res.json())
      .then((res) => setGstData(res.data))
      .catch((err) => console.error(err));
  }, [cart]);

  /* ================= FETCH EMERGENCY OPTIONS ================= */
  const handleFetchEmergency = (cartItemId: number) => {
    fetch(`${API_BASE}/api/emergency-pricing`)
      .then((res) => res.json())
      .then((data) => {
        setEmergencyOptions(data);
        setSelectedCartItem(cartItemId);
      })
      .catch(console.error);
  };

  const handleSelectEmergency = (
    cartItem: CartItem,
    option: EmergencyOption,
  ) => {
    fetch(`${API_BASE}/api/emergency-pricing/calculate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subservice_id: cartItem.subservice_id,
        urgency_level: option.urgency_level,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        const updatedCart = cart.map((item) =>
          item.id === cartItem.id
            ? {
                ...item,
                emergencyPrice: Number(res.data.emergency_price),
                urgency_level: option.urgency_level,
              }
            : item,
        );
        updateCart(updatedCart);
        setSelectedCartItem(null);
      })
      .catch(console.error);
  };

  const subtotal = cart.reduce(
    (sum, item) =>
      sum +
      (item.emergencyPrice !== undefined ? item.emergencyPrice : item.price) *
        item.quantity,
    0,
  );

  const handleGetCurrentLocation = () => {
    if (!("geolocation" in navigator)) return;

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setAddress(
          `Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)}`,
        );
        setIsLocating(false);
      },
      () => setIsLocating(false),
    );
  };

  // ================= TIME SLOT VALIDATION =================
  const isSlotDisabled = (slotLabel: string) => {
    if (selectedDate !== todayStr) return false; // Only check for today

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
      <div className="text-center py-20 font-black text-2xl">
        Loading your cart...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <ArrowLeft />
        </button>
        <h1 className="text-3xl font-black">Your Cart</h1>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">Your cart is empty</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {/* CART ITEMS */}
          <div className="md:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow p-5 flex flex-col gap-4"
              >
                <div className="flex justify-between items-center">
                  <div className="flex gap-4 items-center">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 rounded-xl object-cover"
                      />
                    )}
                    <div>
                      <h3 className="font-bold text-lg">{item.name}</h3>
                      <p className="text-gray-500">
                        ₹{item.emergencyPrice ?? item.price}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-1">
                      <button onClick={() => decreaseQty(item.id)}>
                        <Minus size={16} />
                      </button>
                      <span className="font-bold">{item.quantity}</span>
                      <button onClick={() => increaseQty(item.id)}>
                        <Plus size={16} />
                      </button>
                    </div>

                    <button
                      onClick={() => deleteCartItem(item.id)}
                      className="text-red-500 hover:bg-red-50 p-2 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* EMERGENCY BUTTON */}
                <div>
                  <button
                    onClick={() => handleFetchEmergency(item.id)}
                    className="px-4 py-2 bg-amber-500 text-white font-bold rounded-xl"
                  >
                    {item.urgency_level ? "Change Emergency" : "Add Emergency"}
                  </button>

                  {selectedCartItem === item.id && (
                    <div className="mt-2 space-y-2">
                      {emergencyOptions.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => handleSelectEmergency(item, opt)}
                          className="w-full text-left px-4 py-2 border rounded-xl hover:bg-amber-50"
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* SUMMARY */}
          <div className="bg-white rounded-2xl shadow p-6 h-fit space-y-6">
            {/* LOCATION */}
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">
                Address
              </label>
              <div className="relative mt-2">
                <input
                  className="w-full bg-gray-50 rounded-2xl px-6 py-4 font-bold"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your location"
                />
                <button
                  onClick={handleGetCurrentLocation}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-indigo-600 text-white p-3 rounded-xl"
                >
                  {isLocating ? "..." : <Navigation size={18} />}
                </button>
              </div>
            </div>

            {/* DATE */}
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">
                Service Date
              </label>
              <input
                type="date"
                min={todayStr}
                className="mt-2 w-full bg-gray-50 rounded-2xl px-6 py-4 font-bold"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
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
                  const isSelected =
                    selectedTimeSlot === slot.label && !disabled;

                  return (
                    <button
                      key={slot.label}
                      type="button"
                      onClick={() =>
                        !disabled && setSelectedTimeSlot(slot.label)
                      }
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
                            ${isSelected ? "border-indigo-600" : "border-gray-300"}`}
                        >
                          {isSelected && (
                            <span className="w-2 h-2 bg-indigo-600 rounded-full" />
                          )}
                        </span>
                        <span className="font-bold">{slot.label}</span>
                      </div>
                      {/* {slot.popular && <span className="text-sm text-amber-500 font-bold">🔥 Popular</span>} */}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SUBTOTAL AND GST */}
            <h2 className="text-xl font-black">Summary</h2>
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-bold">₹{subtotal.toFixed(2)}</span>
            </div>

            {gstData && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    GST ({gstData.gst_type})
                  </span>
                  <span className="font-bold">₹{gstData.total_gst}</span>
                </div>
                <div className="flex justify-between font-black text-lg">
                  <span>Grand Total</span>
                  <span>₹{gstData.grand_total}</span>
                </div>
              </>
            )}

            {/* <button
              onClick={() => navigate("/checkout")}
              className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-xl font-black hover:bg-indigo-700 transition"
            >
              Proceed to Checkout
            </button> */}
            {/* ...inside the SUMMARY div at the bottom */}
            <button
              onClick={() => {
                if (cart.length === 0) {
                  alert("Your cart is empty");
                  return;
                }
                if (!address.trim()) {
                  alert("Please enter your service address");
                  return;
                }

                // Save booking data to session for checkout
                sessionStorage.setItem(
                  "bookingData",
                  JSON.stringify({
                    address: address,
                    date: selectedDate,
                    time_slot: selectedTimeSlot,
                  }),
                );

                // Save cart with service codes
                const cartWithCodes = cart.map((item) => ({
                  ...item,
                  service_code: item.service_code || "",
                  subservice_code:
                    item.subservice_code ||
                    item.subservice_id?.toString() ||
                    "",
                }));
                sessionStorage.setItem("cart", JSON.stringify(cartWithCodes));

                navigate("/checkout");
              }}
              className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-xl font-black hover:bg-indigo-700 transition flex justify-center gap-3"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
