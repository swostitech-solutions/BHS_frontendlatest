import { useState, ChangeEvent } from "react";
import { LogIn, User, Wrench, Shield, Eye, EyeOff, AlertCircle, ChevronRight, Loader2 } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE } from "../../../config/api";

type RoleType = "CLIENT" | "TECHNICIAN" | "ADMIN";

const LoginPage = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<RoleType>("CLIENT");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLogin = async () => {
    if (!formData.username.trim()) {
      setError("Please enter your username");
      return;
    }
    if (!formData.password) {
      setError("Please enter your password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        // Handle specific error cases
        if (res.status === 403) {
          setError("Your technician account is pending approval. Please wait for admin verification.");
        } else {
          setError(data.message || "Login failed. Please check your credentials.");
        }
        return;
      }

      // Validate role matches selection
      const userRole = data.user.roleName;
      if (
        (role === "CLIENT" && userRole !== "Client") ||
        (role === "TECHNICIAN" && userRole !== "Technician") ||
        (role === "ADMIN" && userRole !== "Admin")
      ) {
        setError(`This account is registered as ${userRole}. Please select the correct role.`);
        return;
      }

      // Save user and tokens to session
      sessionStorage.setItem("user", JSON.stringify(data.user));
      if (data.accessToken) {
        sessionStorage.setItem("accessToken", data.accessToken);
      }
      if (data.refreshToken) {
        sessionStorage.setItem("refreshToken", data.refreshToken);
      }

      // Role-based navigation
      if (userRole === "Admin") {
        navigate("/admin");
      } else if (userRole === "Technician") {
        // Check if technician is pending approval
        if (data.user.technicianDetails?.status === "PENDING") {
          navigate("/tech/pending");
        } else {
          navigate("/tech");
        }
      } else {
        navigate("/");
      }
      window.location.reload();
    } catch (err) {
      setError("Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  const roleOptions = [
    {
      id: "CLIENT" as RoleType,
      label: "Client",
      description: "Book home services",
      icon: User,
      color: "from-blue-500 to-cyan-500",
      borderColor: "border-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      id: "TECHNICIAN" as RoleType,
      label: "Technician",
      description: "Manage your jobs",
      icon: Wrench,
      color: "from-emerald-500 to-teal-500",
      borderColor: "border-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      id: "ADMIN" as RoleType,
      label: "Admin",
      description: "System management",
      icon: Shield,
      color: "from-violet-500 to-fuchsia-500",
      borderColor: "border-violet-500",
      bgColor: "bg-violet-500/10",
    },
  ];

  const selectedRole = roleOptions.find((r) => r.id === role)!;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-2xl flex items-center justify-center">
            <span className="text-white font-black text-2xl">B</span>
          </div>
          <h1 className="text-3xl font-black text-white">Welcome Back</h1>
          <p className="text-slate-400 mt-2">Sign in to your BHS account</p>
        </div>

        {/* Main Card */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-3xl overflow-hidden">
          {/* Step 1: Role Selection */}
          {step === 1 && (
            <div className="p-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-white mb-2">I am a...</h2>
              <p className="text-slate-400 text-sm mb-6">Select your account type</p>

              <div className="space-y-3">
                {roleOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setRole(option.id)}
                    className={`w-full p-4 rounded-2xl border-2 flex items-center gap-4 transition-all duration-300 ${
                      role === option.id
                        ? `${option.borderColor} ${option.bgColor}`
                        : "border-slate-600 hover:border-slate-500"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        role === option.id
                          ? `bg-gradient-to-br ${option.color} text-white`
                          : "bg-slate-700 text-slate-400"
                      }`}
                    >
                      <option.icon size={24} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-white font-semibold">{option.label}</p>
                      <p className="text-slate-400 text-sm">{option.description}</p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        role === option.id
                          ? `${option.borderColor} ${option.bgColor}`
                          : "border-slate-600"
                      }`}
                    >
                      {role === option.id && (
                        <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-br ${option.color}`} />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setStep(2)}
                className={`w-full mt-6 py-4 rounded-2xl font-bold text-white bg-gradient-to-r ${selectedRole.color} hover:opacity-90 transition-opacity flex items-center justify-center gap-2`}
              >
                Continue as {selectedRole.label}
                <ChevronRight size={20} />
              </button>
            </div>
          )}

          {/* Step 2: Credentials */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              {/* Role Badge Header */}
              <div className={`p-4 ${selectedRole.bgColor} border-b border-slate-700`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selectedRole.color} flex items-center justify-center text-white`}>
                    <selectedRole.icon size={20} />
                  </div>
                  <div>
                    <p className="text-white font-semibold">Logging in as {selectedRole.label}</p>
                    <button
                      onClick={() => setStep(1)}
                      className="text-slate-400 text-sm hover:text-white transition-colors"
                    >
                      Change role →
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-8">
                {/* Error Alert */}
                {error && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
                    <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <div className="space-y-5">
                  {/* Username */}
                  <div>
                    <label className="text-slate-300 text-sm font-medium block mb-2">
                      Username
                    </label>
          <input
            name="username"
                      value={formData.username}
            onChange={handleChange}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter your username"
                      autoComplete="username"
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="text-slate-300 text-sm font-medium block mb-2">
                      Password
                    </label>
                    <div className="relative">
          <input
                        type={showPassword ? "text" : "password"}
            name="password"
                        value={formData.password}
            onChange={handleChange}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* Forgot Password */}
                  <div className="flex justify-end">
                    <button className="text-indigo-400 text-sm font-medium hover:text-indigo-300 transition-colors">
                      Forgot password?
                    </button>
                  </div>

                  {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
                    className={`w-full py-4 rounded-2xl font-bold text-white bg-gradient-to-r ${selectedRole.color} hover:opacity-90 transition-opacity flex items-center justify-center gap-3 disabled:opacity-50`}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        <LogIn size={20} />
                        Sign In
                      </>
                    )}
                  </button>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4 my-6">
                  <div className="flex-1 h-px bg-slate-700" />
                  <span className="text-slate-500 text-sm">or</span>
                  <div className="flex-1 h-px bg-slate-700" />
                </div>

                {/* Back Button */}
                <button
                  onClick={() => setStep(1)}
                  className="w-full py-3 border border-slate-600 rounded-xl text-slate-300 font-medium hover:bg-slate-700/50 transition-colors"
                >
                  ← Back to role selection
          </button>
              </div>
            </div>
          )}
        </div>

        {/* Sign Up Link */}
        <p className="text-center text-slate-400 mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">
            Create one now
          </Link>
        </p>

        {/* Demo Credentials */}
        <div className="mt-8 p-4 bg-slate-800/30 border border-slate-700 rounded-xl">
          <p className="text-slate-400 text-xs font-medium mb-2 text-center">Demo Credentials</p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <p className="text-blue-400 font-semibold">Client</p>
              <p className="text-slate-500">client1 / client123</p>
            </div>
            <div className="text-center">
              <p className="text-emerald-400 font-semibold">Technician</p>
              <p className="text-slate-500">tech1 / tech123</p>
            </div>
            <div className="text-center">
              <p className="text-violet-400 font-semibold">Admin</p>
              <p className="text-slate-500">admin / admin123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
