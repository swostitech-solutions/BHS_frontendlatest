// import { Link, useNavigate } from "react-router-dom";
// import { Menu, User, Settings, Wrench, LogOut } from "lucide-react";
// import { useEffect, useState } from "react";
// // import logo from "../assets/logo.png";

// type UserType = {
//   name: string;
//   roleName: "Admin" | "Client" | "Technician";
// };

// const Navbar = () => {
//   const [user, setUser] = useState<UserType | null>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const u = sessionStorage.getItem("user");
//     if (u) setUser(JSON.parse(u));
//   }, []);

//   const logout = () => {
//     sessionStorage.clear();
//     // navigate("/login");
//     navigate("");

//     window.location.reload();
//   };

//   return (
//     <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-md bg-white/90">
//       <div className="max-w-7xl mx-auto px-6">
//         <div className="flex justify-between h-20 items-center">
//           {/* LOGO + HOME */}
//           <div className="flex items-center gap-6">
//             <Link to="/" className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center">
//                 <span className="text-white font-black text-lg">B</span>
//               </div>
//               <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 tracking-tighter">
//                 BHS
//               </span>
//             </Link>
//             <Link to="/" className="text-gray-600 font-semibold hover:text-indigo-600 transition">
//               Home
//             </Link>
//           </div>

//           {/* DESKTOP RIGHT */}
//           {!user ? (
//             <div className="md:flex gap-8 font-bold text-sm items-center">
//               <Link
//                 to="/login"
//                 className="text-gray-600 font-bold text-sm hover:text-indigo-600 transition"
//               >
//                 Login
//               </Link>
//               <Link
//                 to="/signup"
//                 className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition"
//               >
//                 Register
//               </Link>
//             </div>
//           ) : (
//             <div className="md:flex relative group cursor-pointer">
//               <div className="flex items-center gap-2 font-bold text-sm">
//                 <User size={18} />
//                 <div>
//                   <p>{user.name}</p>
//                   <p className="text-xs text-gray-400">{user.roleName}</p>
//                 </div>
//               </div>

//               {/* DROPDOWN */}
//               <div className="absolute right-0 mt-10 w-52 bg-white shadow-xl rounded-xl hidden group-hover:block overflow-hidden">
//                 {user.roleName === "Admin" && (
//                   <Link
//                     to="/admin"
//                     className="menu-item w-full flex items-center gap-2 px-4 py-3"
//                   >
//                     <Settings size={16} /> Admin Panel
//                   </Link>
//                 )}

//                 {user.roleName === "Technician" && (
//                   <Link
//                     to="/tech"
//                     className="menu-item w-full flex items-center gap-2 px-4 py-3"
//                   >
//                     <Wrench size={16} /> Tech Profile
//                   </Link>
//                 )}

//                 {user.roleName === "Client" && (
//                   <Link
//                     to="/profile"
//                     className="menu-item w-full flex items-center gap-2 px-4 py-3 "
//                   >
//                     <User size={16} /> Profile
//                   </Link>
//                 )}

//                 <button
//                   onClick={logout}
//                   className="w-full flex items-center gap-2 px-4 py-3 text-red-500 hover:bg-red-50"
//                 >
//                   <LogOut size={16} /> Logout
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;































// import { Link, useNavigate } from "react-router-dom";
// import { User, Settings, Wrench, LogOut } from "lucide-react";
// import { useEffect, useState } from "react";

// type UserType = {
//   name: string;
//   roleName: "Admin" | "Client" | "Technician";
// };

// const Navbar = () => {
//   const [user, setUser] = useState<UserType | null>(null);
//   const [showMenu, setShowMenu] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const u = sessionStorage.getItem("user");
//     if (u) setUser(JSON.parse(u));
//   }, []);

//   const logout = () => {
//     sessionStorage.clear();
//     navigate("/login");
//     window.location.reload();
//   };

//   return (
//     <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-md bg-white/90">
//       <div className="max-w-7xl mx-auto px-6">
//         <div className="flex justify-between h-20 items-center">
//           {/* LOGO */}
//           <div className="flex items-center gap-6">
//             <Link to="/" className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center">
//                 <span className="text-white font-black text-lg">B</span>
//               </div>
//               <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
//                 BHS
//               </span>
//             </Link>

//             <Link
//               to="/"
//               className="text-gray-600 font-semibold hover:text-indigo-600 transition"
//             >
//               Home
//             </Link>
//           </div>

//           {/* RIGHT */}
//           {!user ? (
//             <div className="flex gap-8 items-center">
//               <Link
//                 to="/login"
//                 className="text-gray-600 font-bold hover:text-indigo-600"
//               >
//                 Login
//               </Link>
//               <Link
//                 to="/signup"
//                 className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-black shadow-lg hover:bg-indigo-700"
//               >
//                 Register
//               </Link>
//             </div>
//           ) : (
//             // <div
//             //   className="relative"
//             //   onMouseEnter={() => setShowMenu(true)}
//             //   onMouseLeave={() => setShowMenu(false)}
//             // >
//             //   {/* PROFILE */}
//             //   <button className="flex items-center gap-2 font-bold text-sm">
//             //     <User size={18} />
//             //     <div className="text-left">
//             //       <p>{user.name}</p>
//             //       <p className="text-xs text-gray-400">{user.roleName}</p>
//             //     </div>
//             //   </button>

//             //   {/* DROPDOWN */}
//             //   {showMenu && (
//             //     <div className="absolute right-0 mt-4 w-52 bg-white shadow-xl rounded-xl overflow-hidden z-50">
//             //       {user.roleName === "Admin" && (
//             //         <Link
//             //           to="/admin"
//             //           className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50"
//             //         >
//             //           <Settings size={16} /> Admin Panel
//             //         </Link>
//             //       )}

//             //       {user.roleName === "Technician" && (
//             //         <Link
//             //           to="/tech"
//             //           className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50"
//             //         >
//             //           <Wrench size={16} /> Tech Profile
//             //         </Link>
//             //       )}

//             //       {user.roleName === "Client" && (
//             //         <Link
//             //           to="/profile"
//             //           className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50"
//             //         >
//             //           <User size={16} /> Profile
//             //         </Link>
//             //       )}

//             //       <button
//             //         onClick={logout}
//             //         className="w-full flex items-center gap-2 px-4 py-3 text-red-500 hover:bg-red-50"
//             //       >
//             //         <LogOut size={16} /> Logout
//             //       </button>
//             //     </div>
//             //   )}
//             // </div>

//             <div
//   className="relative"
//   onMouseEnter={() => setShowMenu(true)}
//   onMouseLeave={() => setShowMenu(false)}
// >
//   {/* PROFILE */}
//   <button className="flex items-center gap-2 font-bold text-sm px-2 py-1">
//     <User size={18} />
//     <div className="text-left">
//       <p>{user.name}</p>
//       <p className="text-xs text-gray-400">{user.roleName}</p>
//     </div>
//   </button>

//   {/* DROPDOWN */}
//   {showMenu && (
//     <div className="absolute right-0 top-full pt-2 z-50">
//       <div className="w-52 bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100">
//         {/* {user.roleName === "Admin" && (
//           <Link
//             to="/admin"
//             className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50"
//           >
//             <Settings size={16} /> Admin Panel
//           </Link>
//         )} */}
// {/* 
//         {user.roleName === "Technician" && (
//           <Link
//             to="/tech"
//             // to="/tech_profile"
//             className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50"
//           >
//             <Wrench size={16} /> Tech Profile
//           </Link>
//         )} */}

//         {user.roleName === "Client" && (
//           <Link
//             to="/profile"
//             className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50"
//           >
//             <User size={16} /> Profile
//           </Link>
//         )}

//         <button
//           onClick={logout}
//           className="w-full flex items-center gap-2 px-4 py-3 text-red-500 hover:bg-red-50"
//         >
//           <LogOut size={16} /> Logout
//         </button>
//       </div>
//     </div>
//   )}
// </div>

//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

























































import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";

type UserType = {
  name: string;
  roleName: "Admin" | "Client" | "Technician";
};

type CartItem = {
  id: number;
  name: string;
  price: number;
  qty: number;
};

const Navbar = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const u = sessionStorage.getItem("user");
    if (u) setUser(JSON.parse(u));

    const c = sessionStorage.getItem("cart");
    if (c) setCart(JSON.parse(c));
  }, []);

  const logout = () => {
    sessionStorage.clear();
    navigate("/login");
    window.location.reload();
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-md bg-white/90">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between h-20 items-center">
          {/* LOGO */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-black text-lg">B</span>
              </div>
              <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                BHS
              </span>
            </Link>

            <Link to="/" className="text-gray-600 font-semibold hover:text-indigo-600">
              Home
            </Link>
          </div>

          {/* RIGHT */}
          {!user ? (
            <div className="flex gap-8 items-center">
              <Link to="/login" className="font-bold text-gray-600 hover:text-indigo-600">
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-black"
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-6">
{/* ================= CLIENT CART ================= */}
{user.roleName === "Client" && (
  <button
    onClick={() => navigate("/cart")}
    className="relative p-2 hover:bg-gray-100 rounded-xl transition"
    title="View Cart"
  >
    <ShoppingCart size={22} />

    {cart.length > 0 && (
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
        {cart.length}
      </span>
    )}
  </button>
)}


              {/* ================= PROFILE ================= */}
              <div
                className="relative"
                onMouseEnter={() => setShowMenu(true)}
                onMouseLeave={() => setShowMenu(false)}
              >
                <button className="flex items-center gap-2 font-bold text-sm px-2 py-1">
                  <User size={18} />
                  <div className="text-left">
                    <p>{user.name}</p>
                    <p className="text-xs text-gray-400">{user.roleName}</p>
                  </div>
                </button>

                {showMenu && (
                  <div className="absolute right-0 top-full pt-2 z-50">
                    <div className="w-52 bg-white shadow-xl rounded-xl overflow-hidden border">
                      {user.roleName === "Client" && (
                        <Link
                          to="/profile"
                          className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50"
                        >
                          <User size={16} /> Profile
                        </Link>
                      )}

                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2 px-4 py-3 text-red-500 hover:bg-red-50"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
