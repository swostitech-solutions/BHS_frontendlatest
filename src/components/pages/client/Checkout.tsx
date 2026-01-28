import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Package,
  MapPin,
  Calendar,
  Clock,
  CreditCard,
  Loader2,
} from "lucide-react";
import { API_BASE } from "../../../config/api";

type Step = "REVIEW" | "PROCESSING" | "SUCCESS" | "ERROR";

interface CartItem {
  id: number;
  subservice_id: number;
  name: string;
  price: number;
  quantity: number;
  emergencyPrice?: number;
  urgency_level?: string;
  service_code?: string;
  subservice_code?: string;
}

interface BookingData {
  address: string;
  date: string;
  time_slot: string;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("REVIEW");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [createdBookings, setCreatedBookings] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "ONLINE">("ONLINE");

  // Load user, cart, and booking data from session
  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    const cartData = sessionStorage.getItem("cart");
    const bookingInfo = sessionStorage.getItem("bookingData");

    if (!userData) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    if (cartData) {
      setCart(JSON.parse(cartData));
    }

    if (bookingInfo) {
      setBookingData(JSON.parse(bookingInfo));
    }

    setLoading(false);
  }, [navigate]);

  // Calculate totals
  const subtotal = cart.reduce(
    (sum, item) => sum + (item.emergencyPrice ?? item.price) * item.quantity,
    0
  );
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  // Create booking for each cart item
  const handleConfirmBooking = async () => {
    if (!user?.id) {
      setError("Please login to continue");
      return;
    }

    if (cart.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setStep("PROCESSING");
    setError("");

    try {
      const bookings = [];

      // If ONLINE payment, use Juspay
      if (paymentMethod === "ONLINE") {
        // For online payment, we'll process the first item (or combine all)
        const firstItem = cart[0];
        
        const response = await fetch(`${API_BASE}/api/payment/juspay/initiate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: total,
            customerId: user.id,
            email: user.email || "",
            mobile: user.mobile || "",
            service_code: firstItem.service_code || "",
            subservice_code: firstItem.subservice_code || firstItem.subservice_id?.toString() || "",
            address: bookingData?.address || user.address || "Not specified",
            date: bookingData?.date || new Date().toISOString().split("T")[0],
            time_slot: bookingData?.time_slot || "10:00 AM - 12:00 PM",
            gst: gst.toFixed(2),
            emergency_price: firstItem.emergencyPrice ? firstItem.emergencyPrice - firstItem.price : 0,
            quantity: firstItem.quantity,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Payment initiation failed");
        }

        // Redirect to Juspay payment page
        if (data.payment_urls?.web) {
          // Clear cart before redirect
          sessionStorage.removeItem("cart");
          sessionStorage.removeItem("bookingData");
          
          if (user.id) {
            await fetch(`${API_BASE}/api/cart/clear/${user.id}`, {
              method: "DELETE",
            }).catch(() => {});
          }

          // Redirect to payment gateway
          window.location.href = data.payment_urls.web;
          return;
        } else {
          throw new Error("Payment URL not received");
        }
      }

      // COD flow - create bookings directly
      for (const item of cart) {
        // Create booking for each cart item
        const response = await fetch(`${API_BASE}/api/service-on-booking`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.id,
            service_code: item.service_code || "",
            subservice_code: item.subservice_code || item.subservice_id?.toString() || "",
            address: bookingData?.address || user.address || "Not specified",
            date: bookingData?.date || new Date().toISOString().split("T")[0],
            time_slot: bookingData?.time_slot || "10:00 AM - 12:00 PM",
            gst: (item.price * 0.18).toFixed(2),
            emergency_price: item.emergencyPrice ? item.emergencyPrice - item.price : 0,
            quantity: item.quantity,
            price: item.price,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to create booking");
        }

        bookings.push(data.booking);
      }

      setCreatedBookings(bookings);

      // Clear cart after successful booking
      sessionStorage.removeItem("cart");
      sessionStorage.removeItem("bookingData");

      // Clear cart from database
      if (user.id) {
        await fetch(`${API_BASE}/api/cart/clear/${user.id}`, {
          method: "DELETE",
        }).catch(() => {}); // Ignore errors
      }

      setStep("SUCCESS");
    } catch (err: any) {
      console.error("Booking error:", err);
      setError(err.message || "Failed to create booking. Please try again.");
      setStep("ERROR");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
          <p className="text-slate-600 font-bold">Loading checkout...</p>
        </div>
      </div>
    );
  }

  /* ================= PROCESSING ================= */
  if (step === "PROCESSING") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-6">
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 border-8 border-indigo-100 rounded-full" />
            <div className="absolute inset-0 border-8 border-indigo-600 rounded-full border-t-transparent animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <ShieldCheck className="text-indigo-600" size={48} />
            </div>
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4">
            Creating Your Booking
          </h2>
          <p className="text-slate-500 font-medium">
            Please wait while we process your order...
          </p>
        </div>
      </div>
    );
  }

  /* ================= SUCCESS ================= */
  if (step === "SUCCESS") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-6">
        <div className="max-w-lg w-full">
          <div className="bg-white rounded-3xl p-10 text-center shadow-xl border border-slate-100">
            <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
              <CheckCircle2 size={56} />
            </div>
            <h2 className="text-4xl font-black text-slate-900 mb-4">
              Booking Confirmed!
            </h2>
            <p className="text-slate-500 font-medium mb-8 text-lg">
              Your service has been booked successfully. A technician will be assigned soon.
            </p>

            {createdBookings.length > 0 && (
              <div className="bg-slate-50 rounded-2xl p-6 mb-8 text-left">
                <p className="text-slate-500 text-sm font-medium mb-2">Booking ID</p>
                <p className="text-2xl font-black text-indigo-600">
                  {createdBookings[0]?.order_id || "N/A"}
                </p>
              </div>
            )}

            <div className="space-y-4">
              <button
                onClick={() => navigate("/bookings")}
                className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl text-lg flex items-center justify-center gap-3 hover:bg-indigo-700 transition-colors"
              >
                View My Bookings
                <ArrowRight size={20} />
              </button>
              <button
                onClick={() => navigate("/")}
                className="w-full border-2 border-slate-200 text-slate-700 font-bold py-4 rounded-2xl hover:border-slate-300 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ================= ERROR ================= */
  if (step === "ERROR") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-6">
        <div className="max-w-lg w-full">
          <div className="bg-white rounded-3xl p-10 text-center shadow-xl border border-red-100">
            <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-8">
              <AlertCircle size={56} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4">
              Booking Failed
            </h2>
            <p className="text-red-500 font-medium mb-8">
              {error || "Something went wrong. Please try again."}
            </p>

            <div className="space-y-4">
              <button
                onClick={() => setStep("REVIEW")}
                className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-indigo-700 transition-colors"
              >
                <ArrowLeft size={20} />
                Try Again
              </button>
              <button
                onClick={() => navigate("/cart")}
                className="w-full border-2 border-slate-200 text-slate-700 font-bold py-4 rounded-2xl hover:border-slate-300 transition-colors"
              >
                Back to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ================= REVIEW (Main Checkout) ================= */
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <button
            onClick={() => navigate("/cart")}
            className="p-3 hover:bg-white rounded-xl transition-colors"
          >
            <ArrowLeft size={24} className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-900">Checkout</h1>
            <p className="text-slate-500">Review and confirm your booking</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left - Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cart Items */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <Package className="text-indigo-600" size={24} />
                Order Summary
              </h2>

              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl"
                  >
                    <div>
                      <p className="font-bold text-slate-900">{item.name}</p>
                      <p className="text-slate-500 text-sm">
                        Qty: {item.quantity}
                        {item.urgency_level && (
                          <span className="ml-2 text-amber-600">
                            (Emergency: {item.urgency_level})
                          </span>
                        )}
                      </p>
                    </div>
                    <p className="font-black text-slate-900">
                      ₹{((item.emergencyPrice ?? item.price) * item.quantity).toFixed(0)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Details */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-xl font-black text-slate-900 mb-6">
                Service Details
              </h2>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center gap-2 text-slate-500 mb-2">
                    <MapPin size={18} />
                    <span className="text-sm font-medium">Address</span>
                  </div>
                  <p className="font-bold text-slate-900 text-sm">
                    {bookingData?.address || user?.address || "Not specified"}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center gap-2 text-slate-500 mb-2">
                    <Calendar size={18} />
                    <span className="text-sm font-medium">Date</span>
                  </div>
                  <p className="font-bold text-slate-900">
                    {bookingData?.date || new Date().toLocaleDateString()}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center gap-2 text-slate-500 mb-2">
                    <Clock size={18} />
                    <span className="text-sm font-medium">Time Slot</span>
                  </div>
                  <p className="font-bold text-slate-900">
                    {bookingData?.time_slot || "10:00 AM - 12:00 PM"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Payment Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 sticky top-6">
              <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <CreditCard className="text-indigo-600" size={24} />
                Payment Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-bold">₹{subtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">GST (18%)</span>
                  <span className="font-bold">₹{gst.toFixed(0)}</span>
                </div>
                <div className="border-t border-slate-200 pt-4 flex justify-between">
                  <span className="text-lg font-black">Total</span>
                  <span className="text-2xl font-black text-indigo-600">
                    ₹{total.toFixed(0)}
                  </span>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="mb-6">
                <p className="text-sm font-medium text-slate-500 mb-3">Payment Method</p>
                <div className="space-y-3">
                  <button
                    onClick={() => setPaymentMethod("ONLINE")}
                    className={`w-full p-4 rounded-2xl border-2 flex items-center gap-4 transition-all ${
                      paymentMethod === "ONLINE"
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === "ONLINE" ? "border-indigo-500" : "border-slate-300"
                    }`}>
                      {paymentMethod === "ONLINE" && (
                        <div className="w-3 h-3 bg-indigo-500 rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-bold text-slate-900">Pay Online</p>
                      <p className="text-slate-500 text-sm">Credit/Debit Card, UPI, Net Banking</p>
                    </div>
                    <CreditCard className={paymentMethod === "ONLINE" ? "text-indigo-500" : "text-slate-400"} size={24} />
                  </button>

                  <button
                    onClick={() => setPaymentMethod("COD")}
                    className={`w-full p-4 rounded-2xl border-2 flex items-center gap-4 transition-all ${
                      paymentMethod === "COD"
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === "COD" ? "border-indigo-500" : "border-slate-300"
                    }`}>
                      {paymentMethod === "COD" && (
                        <div className="w-3 h-3 bg-indigo-500 rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-bold text-slate-900">Cash on Delivery</p>
                      <p className="text-slate-500 text-sm">Pay when service is completed</p>
                    </div>
                    <Package className={paymentMethod === "COD" ? "text-indigo-500" : "text-slate-400"} size={24} />
                  </button>
                </div>
              </div>

              <button
                onClick={handleConfirmBooking}
                className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl text-lg flex items-center justify-center gap-3 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
              >
                {paymentMethod === "ONLINE" ? (
                  <>
                    <CreditCard size={24} />
                    Pay ₹{total.toFixed(0)} Now
                  </>
                ) : (
                  <>
                    <ShieldCheck size={24} />
                    Confirm Booking
                  </>
                )}
              </button>

              <p className="text-center text-slate-500 text-sm mt-4">
                By confirming, you agree to our terms of service
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
