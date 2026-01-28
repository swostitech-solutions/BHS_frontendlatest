import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, ArrowRight, Home } from "lucide-react";

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center p-6">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-3xl p-10 text-center shadow-xl border border-emerald-100">
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
            <CheckCircle2 size={56} />
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-4">
            Payment Successful!
          </h2>
          <p className="text-slate-500 font-medium mb-8 text-lg">
            Your payment has been processed successfully. A technician will be assigned to your booking soon.
          </p>

          {orderId && (
            <div className="bg-emerald-50 rounded-2xl p-6 mb-8 text-left">
              <p className="text-slate-500 text-sm font-medium mb-2">Booking ID</p>
              <p className="text-2xl font-black text-emerald-600">{orderId}</p>
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={() => navigate("/bookings")}
              className="w-full bg-emerald-600 text-white font-black py-4 rounded-2xl text-lg flex items-center justify-center gap-3 hover:bg-emerald-700 transition-colors"
            >
              View My Bookings
              <ArrowRight size={20} />
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full border-2 border-slate-200 text-slate-700 font-bold py-4 rounded-2xl hover:border-slate-300 transition-colors flex items-center justify-center gap-3"
            >
              <Home size={20} />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
