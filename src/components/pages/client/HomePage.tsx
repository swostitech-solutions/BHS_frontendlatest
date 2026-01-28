////// correct one //////

// import { useEffect, useMemo, useState } from "react";
// import { Link } from "react-router-dom";
// import { Star } from "lucide-react";
// import { API_BASE } from "../../../config/api";

// const HomePage = () => {
//   const [services, setServices] = useState<any[]>([]);
//   const [subServices, setSubServices] = useState<any[]>([]);
//   const [activeService, setActiveService] = useState<number | "all">("all");
//   const [searchQuery, setSearchQuery] = useState("");

//   /* ================= FETCH SERVICES ================= */
//   useEffect(() => {
//     fetch(`${API_BASE}/api/services`)
//       .then((res) => res.json())
//       .then((result) => setServices(result.data || []))
//       .catch((err) => console.error(err));
//   }, []);

//   /* ================= FETCH SUB SERVICES ================= */
//   useEffect(() => {
//     fetch(`${API_BASE}/api/subservices`)
//       .then((res) => res.json())
//       .then((result) => setSubServices(result || []))
//       .catch((err) => console.error(err));
//   }, []);

//   /* ================= FILTER ================= */
//   // const filteredSubServices = useMemo(() => {
//   //   if (activeService === "all") return subServices;
//   //   return subServices.filter(
//   //     (item) => Number(item.service_id) === Number(activeService)
//   //   );
//   // }, [activeService, subServices]);
  
//   const filteredSubServices = useMemo(() => {
//     return subServices.filter((item) => {
//       const matchService =
//         activeService === "all" ||
//         Number(item.service_id) === Number(activeService);

//       const matchSearch =
//   item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//   item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//   item.Service?.name?.toLowerCase().includes(searchQuery.toLowerCase());


//       return matchService && matchSearch;
//     });
//   }, [activeService, subServices, searchQuery]);


//   return (
//     <div className="space-y-16 pb-20">
//       {/* ================= HERO ================= */}
//       {/* <section className="relative h-[500px] bg-indigo-950 rounded-[3rem] overflow-hidden flex items-center justify-center text-center">
//         <h1 className="text-6xl sm:text-7xl font-black text-white z-10">
//           Expert help, <span className="text-indigo-400">anywhere.</span>
//         </h1>

        
//         <img
//           src="/hero.png"
//           alt="Expert Service"
//           className="absolute bottom-0 right-24 w-[380px]
//           drop-shadow-[0_35px_80px_rgba(99,102,241,0.8)]"
//         />
//       </section> */}
//       <section className="relative h-[500px] bg-indigo-950 rounded-[3rem] overflow-hidden shadow-2xl mt-8">
//         <img
//           src="https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&q=80&w=2000"
//           alt="Home Services"
//           className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
//         />
//         <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 via-indigo-950/40 to-transparent"></div>
//         <div className="absolute inset-0 flex flex-col justify-center items-center px-6 text-center">
//           <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-8 border border-white/20">
//             India's Leading Home Service Marketplace
//           </span>
//           <h1 className="text-6xl sm:text-8xl font-black text-white mb-8 tracking-tighter leading-none max-w-5xl">
//             Expert help, <span className="text-indigo-400">anywhere.</span>
//           </h1>
//           <div className="flex justify-center px-6 -mt-30 relative z-10">
//             <div className="w-full max-w-3xl relative">
//               <input
//                 type="text"
//                 placeholder="Search AC Repair, Cleaning, Salon..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full pl-6 pr-6 py-6 rounded-[2.5rem]
//       text-lg shadow-2xl outline-none
//       focus:ring-8 focus:ring-indigo-500/20"
//               />
//             </div>
//           </div>
//         </div>
//       </section>

     
//       <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 px-6">
//         {/* LEFT SIDE TEXT */}
//         <div>
//           <h2 className="text-4xl font-black text-gray-900 tracking-tight">
//             Top Rated Services
//           </h2>
//           <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-2">
//             Verified quality across India
//           </p>
//         </div>

//         {/* RIGHT SIDE FILTER BUTTONS */}
//         <div className="flex gap-3 flex-wrap justify-start sm:justify-end">
//           <button
//             onClick={() => setActiveService("all")}
//             className={`px-7 py-3 rounded-full text-xs font-black uppercase tracking-widest transition
//       ${
//         activeService === "all"
//           ? "bg-indigo-600 text-white shadow-xl"
//           : "border hover:border-indigo-400"
//       }`}
//           >
//             All
//           </button>

//           {services.map((service) => (
//             <button
//               key={service.id}
//               onClick={() => setActiveService(service.id)}
//               className={`px-7 py-3 rounded-full text-xs font-black uppercase tracking-widest transition
//         ${
//           activeService === service.id
//             ? "bg-indigo-600 text-white shadow-xl"
//             : "border hover:border-indigo-400"
//         }`}
//             >
//               {service.name}
//             </button>
//           ))}
//         </div>
//       </section>

//       {/* ================= SUB SERVICE CARDS ================= */}
//       <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 px-6">
//         {filteredSubServices.length === 0 && (
//           <p className="col-span-full text-center font-bold text-gray-400">
//             No services available
//           </p>
//         )}

//       {filteredSubServices.map((item) => {
//   const imageUrl = item.image
//     ? item.image
//     : "/placeholder-service.jpg";

//   return (
//     <div
//       key={item.id}
//       className="group bg-white rounded-[3rem] overflow-hidden
//       border border-gray-50 shadow-sm hover:shadow-2xl
//       transition-all duration-500 hover:-translate-y-2 flex flex-col"
//     >
//       {/* IMAGE */}
//       <div className="relative h-64 overflow-hidden">
//         <img
//           src={imageUrl}
//           alt={item.name}
//           className="w-full h-full object-cover
//           group-hover:scale-110 transition-transform duration-1000"
//         />

//         {/* Rating (Static for now) */}
//         <div className="absolute top-6 right-6 bg-white px-4 py-2 rounded-2xl flex items-center gap-1 shadow-xl">
//           <Star size={16} className="text-amber-400 fill-amber-400" />
//           <span className="font-black text-sm">4.8</span>
//         </div>

//         {/* Category */}
//         <span className="absolute bottom-6 left-6 bg-indigo-600 text-white text-[10px] px-5 py-2 rounded-xl font-black uppercase tracking-widest">
//           {item.Service?.name}
//         </span>
//       </div>

//       {/* CONTENT */}
//       <div className="p-10 flex flex-col flex-1">
//         <h3 className="text-3xl font-black mb-3">
//           {item.name}
//         </h3>

//         <p className="text-gray-500 font-medium mb-8 line-clamp-2">
//           {item.description}
//         </p>

//         <div className="mt-auto flex justify-between items-center pt-6 border-t">
//           <div>
//             <p className="text-[10px] uppercase tracking-widest font-black text-gray-400">
//               Fee Starts From
//             </p>
//             <p className="text-3xl font-black">
//               ₹{Number(item.price)}
//             </p>
//           </div>

//           <Link
//             to={`/subservice/${item.id}`}
//             className="bg-gray-950 text-white px-8 py-5 rounded-[1.5rem]
//             text-xs font-black uppercase tracking-widest
//             hover:bg-indigo-600 transition"
//           >
//             View Detail
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// })}

//       </section>
//     </div>
//   );
// };

// export default HomePage;





























/// 2nd one ////

// import { useEffect, useMemo, useState } from "react";
// import { Link } from "react-router-dom";
// import { Star, ShoppingCart } from "lucide-react";
// import { API_BASE } from "../../../config/api";

// const HomePage = () => {
//   const [services, setServices] = useState<any[]>([]);
//   const [subServices, setSubServices] = useState<any[]>([]);
//   const [activeService, setActiveService] = useState<number | "all">("all");
//   const [searchQuery, setSearchQuery] = useState("");

//   /* ================= FETCH SERVICES ================= */
//   useEffect(() => {
//     fetch(`${API_BASE}/api/services`)
//       .then((res) => res.json())
//       .then((result) => setServices(result.data || []))
//       .catch(console.error);
//   }, []);

//   /* ================= FETCH SUB SERVICES ================= */
//   useEffect(() => {
//     fetch(`${API_BASE}/api/subservices`)
//       .then((res) => res.json())
//       .then((result) => setSubServices(result || []))
//       .catch(console.error);
//   }, []);

//   /* ================= FILTER ================= */
//   const filteredSubServices = useMemo(() => {
//     return subServices.filter((item) => {
//       const matchService =
//         activeService === "all" ||
//         Number(item.service_id) === Number(activeService);

//       const matchSearch =
//         item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         item.Service?.name?.toLowerCase().includes(searchQuery.toLowerCase());

//       return matchService && matchSearch;
//     });
//   }, [activeService, subServices, searchQuery]);

//   /* ================= ADD TO CART ================= */
//   const addToCart = (item: any) => {
//     const cart = JSON.parse(sessionStorage.getItem("cart") || "[]");

//     const existingItem = cart.find((c: any) => c.id === item.id);

//     if (existingItem) {
//       existingItem.quantity += 1;
//     } else {
//       cart.push({
//         id: item.id,
//         name: item.name,
//         price: Number(item.price),
//         image: item.image,
//         quantity: 1,
//       });
//     }

//     sessionStorage.setItem("cart", JSON.stringify(cart));
//     alert("Added to cart 🛒");
//   };

//   return (
//     <div className="space-y-16 pb-20">
//       {/* ================= HERO ================= */}
//       <section className="relative h-[500px] bg-indigo-950 rounded-[3rem] overflow-hidden shadow-2xl mt-8">
//         <div className="absolute inset-0 flex flex-col justify-center items-center px-6 text-center">
//           <h1 className="text-6xl sm:text-8xl font-black text-white mb-8">
//             Expert help, <span className="text-indigo-400">anywhere.</span>
//           </h1>

//           <input
//             type="text"
//             placeholder="Search services..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full max-w-3xl px-6 py-6 rounded-[2.5rem] text-lg"
//           />
//         </div>
//       </section>

//       {/* ================= FILTER ================= */}
//       <section className="flex justify-between items-center px-6">
//         <h2 className="text-4xl font-black">Top Rated Services</h2>

//         <div className="flex gap-3 flex-wrap">
//           <button
//             onClick={() => setActiveService("all")}
//             className={`px-6 py-3 rounded-full font-black text-xs ${
//               activeService === "all"
//                 ? "bg-indigo-600 text-white"
//                 : "border"
//             }`}
//           >
//             All
//           </button>

//           {services.map((service) => (
//             <button
//               key={service.id}
//               onClick={() => setActiveService(service.id)}
//               className={`px-6 py-3 rounded-full font-black text-xs ${
//                 activeService === service.id
//                   ? "bg-indigo-600 text-white"
//                   : "border"
//               }`}
//             >
//               {service.name}
//             </button>
//           ))}
//         </div>
//       </section>

//       {/* ================= SUB SERVICES ================= */}
//       <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 px-6">
//         {filteredSubServices.map((item) => {
//           const imageUrl = item.image || "/placeholder-service.jpg";

//           return (
//             <div
//               key={item.id}
//               className="bg-white rounded-[3rem] border shadow-sm hover:shadow-2xl transition"
//             >
//               {/* IMAGE */}
//               <div className="relative h-64">
//                 <img
//                   src={imageUrl}
//                   alt={item.name}
//                   className="w-full h-full object-cover rounded-t-[3rem]"
//                 />

//                 <div className="absolute top-6 right-6 bg-white px-4 py-2 rounded-xl flex gap-1">
//                   <Star size={16} className="text-amber-400 fill-amber-400" />
//                   <span className="font-black">4.8</span>
//                 </div>
//               </div>

//               {/* CONTENT */}
//               <div className="p-8 flex flex-col">
//                 <h3 className="text-2xl font-black mb-2">{item.name}</h3>
//                 <p className="text-gray-500 mb-6 line-clamp-2">
//                   {item.description}
//                 </p>

//                 <div className="flex justify-between items-center mt-auto">
//                   <p className="text-2xl font-black">₹{item.price}</p>

//                   <div className="flex gap-3">
//                     <button
//                       onClick={() => addToCart(item)}
//                       className="bg-indigo-600 text-white p-4 rounded-xl hover:bg-indigo-700"
//                     >
//                       <ShoppingCart size={18} />
//                     </button>

//                     <Link
//                       to={`/subservice/${item.id}`}
//                       className="bg-gray-900 text-white px-6 py-4 rounded-xl text-xs font-black"
//                     >
//                       View Detail
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </section>
//     </div>
//   );
// };

// export default HomePage;
















































import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Star, ShoppingCart } from "lucide-react";
import { API_BASE } from "../../../config/api";

const HomePage = () => {
  const [services, setServices] = useState<any[]>([]);
  const [subServices, setSubServices] = useState<any[]>([]);
  const [activeService, setActiveService] = useState<number | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  /* ================= FETCH SERVICES ================= */
  useEffect(() => {
    fetch(`${API_BASE}/api/services`)
      .then((res) => res.json())
      .then((result) => setServices(result.data || []))
      .catch(console.error);
  }, []);

  /* ================= FETCH SUB SERVICES ================= */
  useEffect(() => {
    fetch(`${API_BASE}/api/subservices`)
      .then((res) => res.json())
      .then((result) => setSubServices(result || []))
      .catch(console.error);
  }, []);

  /* ================= FILTER ================= */
  const filteredSubServices = useMemo(() => {
    return subServices.filter((item) => {
      const matchService =
        activeService === "all" ||
        Number(item.service_id) === Number(activeService);

      const matchSearch =
        item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.Service?.name?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchService && matchSearch;
    });
  }, [activeService, subServices, searchQuery]);

  /* ================= ADD TO CART ================= */
  const addToCart = async (item: any) => {
    try {
      // ✅ Get logged-in user
      const user = JSON.parse(sessionStorage.getItem("user") || "{}");
      if (!user?.id) {
        alert("Please login first to add items to cart.");
        return;
      }

      // ✅ POST request payload
      const payload = {
        user_id: user.id,
        service_code: item.service_code,        // From API
        subservice_code: item.subservice_code,  // From API
        quantity: 1,
      };

      // ✅ POST API call
      const res = await fetch(`${API_BASE}/api/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        console.error(errData);
        alert("Failed to add to cart");
        return;
      }

      // ✅ Update sessionStorage cart
      const cart = JSON.parse(sessionStorage.getItem("cart") || "[]");
      const existingItem = cart.find((c: any) => c.id === item.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          id: item.id,
          name: item.name,
          price: Number(item.price),
          image: item.image,
          quantity: 1,
        });
      }

      sessionStorage.setItem("cart", JSON.stringify(cart));
      alert("Added to cart 🛒");
    } catch (err) {
      console.error(err);
      alert("Error adding to cart");
    }
  };

  return (
    <div className="space-y-16 pb-20">
      {/* ================= HERO ================= */}
      <section className="relative h-[500px] bg-indigo-950 rounded-[3rem] overflow-hidden shadow-2xl mt-8">
        <div className="absolute inset-0 flex flex-col justify-center items-center px-6 text-center">
          <h1 className="text-6xl sm:text-8xl font-black text-white mb-8">
            Expert help, <span className="text-indigo-400">anywhere.</span>
          </h1>

          <input
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-3xl px-6 py-6 rounded-[2.5rem] text-lg"
          />
        </div>
      </section>

      {/* ================= FILTER ================= */}
      <section className="flex justify-between items-center px-6">
        <h2 className="text-4xl font-black">Top Rated Services</h2>

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => setActiveService("all")}
            className={`px-6 py-3 rounded-full font-black text-xs ${
              activeService === "all"
                ? "bg-indigo-600 text-white"
                : "border"
            }`}
          >
            All
          </button>

          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => setActiveService(service.id)}
              className={`px-6 py-3 rounded-full font-black text-xs ${
                activeService === service.id
                  ? "bg-indigo-600 text-white"
                  : "border"
              }`}
            >
              {service.name}
            </button>
          ))}
        </div>
      </section>

      {/* ================= SUB SERVICES ================= */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 px-6">
        {filteredSubServices.map((item) => {
          const imageUrl = item.image || "/placeholder-service.jpg";

          return (
            <div
              key={item.id}
              className="bg-white rounded-[3rem] border shadow-sm hover:shadow-2xl transition"
            >
              {/* IMAGE */}
              <div className="relative h-64">
                <img
                  src={imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-t-[3rem]"
                />

                <div className="absolute top-6 right-6 bg-white px-4 py-2 rounded-xl flex gap-1">
                  <Star size={16} className="text-amber-400 fill-amber-400" />
                  <span className="font-black">4.8</span>
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-8 flex flex-col">
                <h3 className="text-2xl font-black mb-2">{item.name}</h3>
                <p className="text-gray-500 mb-6 line-clamp-2">
                  {item.description}
                </p>

                <div className="flex justify-between items-center mt-auto">
                  <p className="text-2xl font-black">₹{item.price}</p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => addToCart(item)}
                      className="bg-indigo-600 text-white p-4 rounded-xl hover:bg-indigo-700"
                    >
                      <ShoppingCart size={18} />
                    </button>

                    <Link
                      to={`/subservice/${item.id}`}
                      className="bg-gray-900 text-white px-6 py-4 rounded-xl text-xs font-black"
                    >
                      View Detail
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default HomePage;
