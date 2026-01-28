import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { XCircle, ArrowLeft, Home, RefreshCw } from "lucide-react";

const PaymentFailed: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center p-6">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-3xl p-10 text-center shadow-xl border border-red-100">
          <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <XCircle size={56} />
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-4">
            Payment Failed
          </h2>
          <p className="text-slate-500 font-medium mb-8 text-lg">
            Your payment could not be processed. Please try again or choose a different payment method.
          </p>

          {orderId && (
            <div className="bg-red-50 rounded-2xl p-6 mb-8 text-left">
              <p className="text-slate-500 text-sm font-medium mb-2">Order Reference</p>
              <p className="text-xl font-bold text-red-600">{orderId}</p>
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={() => navigate("/cart")}
              className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl text-lg flex items-center justify-center gap-3 hover:bg-indigo-700 transition-colors"
            >
              <RefreshCw size={20} />
              Try Again
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full border-2 border-slate-200 text-slate-700 font-bold py-4 rounded-2xl hover:border-slate-300 transition-colors flex items-center justify-center gap-3"
            >
              <Home size={20} />
              Back to Home
            </button>
          </div>

          <p className="text-slate-400 text-sm mt-6">
            If money was deducted, it will be refunded within 5-7 business days.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
