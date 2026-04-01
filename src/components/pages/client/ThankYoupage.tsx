import { useSearchParams, useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { API_BASE } from "../../../config/api";

export default function ThankYouPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const orderId = params.get("order_id");

  console.log("ThankYou Page Order:", orderId);



useEffect(() => {
  const clearCart = async () => {
    try {

      let pendingCart = JSON.parse(
        sessionStorage.getItem("pendingCart") || "[]"
      );

      if (pendingCart.length === 0) {
        pendingCart = JSON.parse(sessionStorage.getItem("cart") || "[]");
      }

      console.log("Deleting cart:", pendingCart);

      for (const item of pendingCart) {
        await fetch(`${API_BASE}/api/cart/item/${item.id}`, {
          method: "DELETE",
        }).catch(() => {});
      }

      sessionStorage.removeItem("cart");
      sessionStorage.removeItem("pendingCart");
      sessionStorage.removeItem("bookingData");

    } catch (err) {
      console.error("Cart cleanup error:", err);
    }
  };

  clearCart();
}, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-10 rounded-3xl shadow-xl text-center w-[400px]">
        <CheckCircle className="text-green-500 mx-auto mb-4" size={70} />

        <h1 className="text-3xl font-bold mb-2">
          Payment Successful
        </h1>

        <p className="text-gray-500 mb-6">
          Your booking has been confirmed
        </p>

        <div className="bg-gray-100 p-4 rounded-xl mb-6">
          <p className="text-sm text-gray-500">Order ID</p>
          <p className="text-xl font-bold text-indigo-600">
            {orderId}
          </p>
        </div>

        <button
          onClick={() => navigate("/")}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl w-full"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}
