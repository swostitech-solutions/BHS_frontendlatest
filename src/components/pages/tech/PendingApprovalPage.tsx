import { Clock, Shield, CheckCircle2, FileText, Phone, Mail, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PendingApprovalPageProps {
  user?: {
    name: string;
    email: string;
    mobile?: string;
    technicianDetails?: {
      skill?: string;
      status?: string;
    };
  };
}

const PendingApprovalPage = ({ user }: PendingApprovalPageProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Main Card */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-3xl overflow-hidden">
          {/* Header */}
          <div className="p-8 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-b border-amber-500/30 text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center animate-pulse">
              <Clock size={40} className="text-white" />
            </div>
            <h1 className="text-2xl font-black text-white mb-2">
              Application Under Review
            </h1>
            <p className="text-amber-200/80">
              Your technician application is being reviewed by our admin team
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* User Info */}
            {user && (
              <div className="mb-8 p-4 bg-slate-700/30 rounded-xl">
                <p className="text-white font-semibold text-lg mb-2">
                  Welcome, {user.name}!
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Mail size={16} />
                    <span>{user.email}</span>
                  </div>
                  {user.mobile && (
                    <div className="flex items-center gap-2 text-slate-400">
                      <Phone size={16} />
                      <span>{user.mobile}</span>
                    </div>
                  )}
                  {user.technicianDetails?.skill && (
                    <div className="flex items-center gap-2 text-slate-400">
                      <Shield size={16} />
                      <span>Skill: {user.technicianDetails.skill}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Status Steps */}
            <div className="space-y-4 mb-8">
              <h3 className="text-white font-semibold mb-4">Application Status</h3>
              
              {/* Step 1 - Completed */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 size={20} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Application Submitted</p>
                  <p className="text-slate-500 text-sm">Your application has been received</p>
                </div>
              </div>

              {/* Step 2 - In Progress */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0 animate-pulse">
                  <FileText size={20} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Document Verification</p>
                  <p className="text-slate-500 text-sm">Admin is reviewing your documents</p>
                </div>
              </div>

              {/* Step 3 - Pending */}
              <div className="flex items-start gap-4 opacity-50">
                <div className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield size={20} className="text-slate-500" />
                </div>
                <div>
                  <p className="text-slate-400 font-medium">Account Activation</p>
                  <p className="text-slate-600 text-sm">Your account will be activated after approval</p>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl mb-6">
              <p className="text-blue-300 text-sm">
                <strong>What's next?</strong> Once approved, you'll be able to:
              </p>
              <ul className="text-blue-200/80 text-sm mt-2 space-y-1 list-disc list-inside">
                <li>View and accept job requests</li>
                <li>Manage your schedule</li>
                <li>Track your earnings</li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="text-center text-slate-500 text-sm mb-6">
              <p>Need help? Contact support at</p>
              <a href="mailto:support@bhs.com" className="text-violet-400 hover:text-violet-300">
                support@bhs.com
              </a>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full py-3 border border-slate-600 rounded-xl text-slate-300 font-medium hover:bg-slate-700/50 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft size={18} />
              Back to Login
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-sm mt-6">
          Approval typically takes 24-48 hours
        </p>
      </div>
    </div>
  );
};

export default PendingApprovalPage;
