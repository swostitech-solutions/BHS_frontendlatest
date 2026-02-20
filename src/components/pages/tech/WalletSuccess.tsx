import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const WalletSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const orderId = searchParams.get("order_id");

  useEffect(() => {
    // Optional: auto redirect after 5 seconds
    const timer = setTimeout(() => {
      navigate("/tech");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl p-10 max-w-md w-full text-center shadow-2xl animate-fadeIn">

        {/* Success Icon */}
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
          <CheckCircle size={40} className="text-white" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-black text-white mb-3">
          Thank You!
        </h1>

        <p className="text-slate-400 mb-4">
          Your wallet has been successfully recharged.
        </p>

        {/* Order ID */}
        {orderId && (
          <div className="bg-slate-800 rounded-xl p-3 mb-6">
            <p className="text-slate-400 text-sm">Order ID</p>
            <p className="text-emerald-400 font-bold text-lg">
              {orderId}
            </p>
          </div>
        )}

        {/* Button */}
        <button
          onClick={() => navigate("/tech")}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-bold transition-all shadow-lg shadow-violet-500/30"
        >
          Go to Home
        </button>

        {/* Auto redirect note */}
        <p className="text-slate-500 text-xs mt-4">
          You will be redirected automatically in 5 seconds...
        </p>
      </div>
    </div>
  );
};

export default WalletSuccess;