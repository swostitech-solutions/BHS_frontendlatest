import { useState, useEffect, ChangeEvent, useRef } from "react";
import { User, Wrench, ChevronRight, ChevronLeft, Upload, FileText, CreditCard, Building2, Clock, Zap, Check, X, Eye } from "lucide-react";
import { API_BASE } from "../../../config/api";
import { useNavigate } from "react-router-dom";

type Role = "CLIENT" | "TECHNICIAN";

interface ServiceCategory {
  id: number;
  name: string;
  service_code: string;
}

interface FilePreview {
  file: File;
  preview: string;
}

const SignupPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<Role>("CLIENT");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);

  // Fetch service categories for technician signup
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/services`);
        if (res.ok) {
          const response = await res.json();
          // Handle different API response formats
          const services = response.data || response.services || [];
          setServiceCategories(Array.isArray(services) ? services : []);
        } else {
          console.error("Failed to fetch services:", res.status);
          setServiceCategories([]);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        setServiceCategories([]);
      }
    };
    fetchServices();
  }, []);

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    username: "",
    password: "",
    confirmPassword: "",
    // Technician specific
    skill: "",
    experience: "",
    techCategory: "",
    timeDuration: "",
    emergencyAvailable: false,
    aadharCardNo: "",
    panCardNo: "",
    bankName: "",
    ifscNo: "",
    branchName: "",
  });

  // File uploads for technician
  const [files, setFiles] = useState<{
    profileImage?: FilePreview;
    aadharDoc?: FilePreview;
    panDoc?: FilePreview;
    bankPassbookDoc?: FilePreview;
    experienceCertDoc?: FilePreview;
  }>({});

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setErrors({ ...errors, [fieldName]: "File size must be less than 10MB" });
        return;
      }
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
      if (!allowedTypes.includes(file.type)) {
        setErrors({ ...errors, [fieldName]: "Only JPG, PNG, WebP or PDF allowed" });
        return;
      }

      const preview = file.type.startsWith("image/") ? URL.createObjectURL(file) : "";
      setFiles({ ...files, [fieldName]: { file, preview } });
      setErrors({ ...errors, [fieldName]: "" });
    }
  };

  const removeFile = (fieldName: string) => {
    const newFiles = { ...files };
    if (newFiles[fieldName as keyof typeof files]?.preview) {
      URL.revokeObjectURL(newFiles[fieldName as keyof typeof files]!.preview);
    }
    delete newFiles[fieldName as keyof typeof files];
    setFiles(newFiles);
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 2) {
      if (!formData.name.trim()) newErrors.name = "Name is required";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format";
      if (!formData.mobile.trim()) newErrors.mobile = "Phone number is required";
      else if (!/^\d{10}$/.test(formData.mobile)) newErrors.mobile = "Enter valid 10-digit number";
      if (!formData.username.trim()) newErrors.username = "Username is required";
      if (!formData.password) newErrors.password = "Password is required";
      else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    }

    if (role === "TECHNICIAN" && currentStep === 3) {
      if (!formData.skill.trim()) newErrors.skill = "Skill is required";
      if (!formData.experience) newErrors.experience = "Experience is required";
      if (!formData.techCategory) newErrors.techCategory = "Category is required";
    }

    if (role === "TECHNICIAN" && currentStep === 4) {
      if (!formData.aadharCardNo.trim()) newErrors.aadharCardNo = "Aadhar number is required";
      else if (!/^\d{12}$/.test(formData.aadharCardNo)) newErrors.aadharCardNo = "Enter valid 12-digit Aadhar";
      if (!formData.panCardNo.trim()) newErrors.panCardNo = "PAN number is required";
      else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panCardNo.toUpperCase())) 
        newErrors.panCardNo = "Enter valid PAN (e.g., ABCDE1234F)";
      if (!files.aadharDoc) newErrors.aadharDoc = "Please upload Aadhar card";
      if (!files.panDoc) newErrors.panDoc = "Please upload PAN card";
    }

    if (role === "TECHNICIAN" && currentStep === 5) {
      if (!formData.bankName.trim()) newErrors.bankName = "Bank name is required";
      if (!formData.ifscNo.trim()) newErrors.ifscNo = "IFSC code is required";
      else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscNo.toUpperCase())) 
        newErrors.ifscNo = "Enter valid IFSC code";
      if (!formData.branchName.trim()) newErrors.branchName = "Branch name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      const maxStep = role === "CLIENT" ? 2 : 6;
      if (step < maxStep) setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(step)) return;

    setLoading(true);
    try {
      if (role === "CLIENT") {
        const res = await fetch(`${API_BASE}/api/auth/signup/client`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            mobile: formData.mobile,
            address: formData.address,
            username: formData.username,
            password: formData.password,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Signup failed");
        
        setSuccess(true);
      } else {
        // Technician signup with file uploads
        const formDataToSend = new FormData();
        
        // Basic info
        formDataToSend.append("name", formData.name);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("mobile", formData.mobile);
        formDataToSend.append("address", formData.address);
        formDataToSend.append("username", formData.username);
        formDataToSend.append("password", formData.password);
        
        // Technician details
        formDataToSend.append("skill", formData.skill);
        formDataToSend.append("experience", formData.experience);
        formDataToSend.append("techCategory", formData.techCategory);
        formDataToSend.append("timeDuration", formData.timeDuration);
        formDataToSend.append("emergencyAvailable", String(formData.emergencyAvailable));
        formDataToSend.append("aadharCardNo", formData.aadharCardNo);
        formDataToSend.append("panCardNo", formData.panCardNo.toUpperCase());
        formDataToSend.append("bankName", formData.bankName);
        formDataToSend.append("ifscNo", formData.ifscNo.toUpperCase());
        formDataToSend.append("branchName", formData.branchName);

        // Files
        if (files.profileImage) formDataToSend.append("profileImage", files.profileImage.file);
        if (files.aadharDoc) formDataToSend.append("aadharDoc", files.aadharDoc.file);
        if (files.panDoc) formDataToSend.append("panDoc", files.panDoc.file);
        if (files.bankPassbookDoc) formDataToSend.append("bankPassbookDoc", files.bankPassbookDoc.file);
        if (files.experienceCertDoc) formDataToSend.append("experienceCertDoc", files.experienceCertDoc.file);

        const res = await fetch(`${API_BASE}/api/auth/signup/technician`, {
          method: "POST",
          body: formDataToSend,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Signup failed");
        
        setSuccess(true);
      }
    } catch (err: any) {
      alert(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  // Success screen
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center animate-bounce">
            <Check size={48} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-white mb-4">
            {role === "CLIENT" ? "Welcome to BHS!" : "Application Submitted!"}
          </h1>
          <p className="text-slate-400 mb-8">
            {role === "CLIENT"
              ? "Your account has been created successfully. You can now login and start booking services."
              : "Your technician application has been submitted. Our team will review your documents and approve your account within 24-48 hours."}
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-bold py-4 rounded-2xl hover:opacity-90 transition-opacity"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const totalSteps = role === "CLIENT" ? 2 : 6;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm font-medium">Step {step} of {totalSteps}</span>
            <span className="text-slate-400 text-sm font-medium">
              {Math.round((step / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-3xl p-8 md:p-12">
          {/* Step 1: Role Selection */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-3xl font-black text-white mb-2">Join BHS India</h2>
              <p className="text-slate-400 mb-8">Choose how you want to use BHS</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <button
                  type="button"
                  onClick={() => setRole("CLIENT")}
                  className={`p-6 rounded-2xl border-2 text-left transition-all duration-300 group ${
                    role === "CLIENT"
                      ? "border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/20"
                      : "border-slate-600 hover:border-slate-500"
                  }`}
                >
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all ${
                      role === "CLIENT"
                        ? "bg-gradient-to-br from-indigo-500 to-violet-500 text-white"
                        : "bg-slate-700 text-slate-400 group-hover:bg-slate-600"
                    }`}
                  >
                    <User size={28} />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Client</p>
                  <p className="text-xl font-bold text-white">Book Services</p>
                  <p className="text-slate-400 text-sm mt-2">Browse and book home services</p>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("TECHNICIAN")}
                  className={`p-6 rounded-2xl border-2 text-left transition-all duration-300 group ${
                    role === "TECHNICIAN"
                      ? "border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/20"
                      : "border-slate-600 hover:border-slate-500"
                  }`}
                >
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all ${
                      role === "TECHNICIAN"
                        ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white"
                        : "bg-slate-700 text-slate-400 group-hover:bg-slate-600"
                    }`}
                  >
                    <Wrench size={28} />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Technician</p>
                  <p className="text-xl font-bold text-white">Work with BHS</p>
                  <p className="text-slate-400 text-sm mt-2">Join our professional network</p>
                </button>
              </div>

              <button
                onClick={nextStep}
                className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-bold py-4 rounded-2xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                Continue <ChevronRight size={20} />
              </button>
            </div>
          )}

          {/* Step 2: Basic Info (Both roles) */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-2xl font-black text-white mb-2">Personal Information</h2>
              <p className="text-slate-400 mb-8">Tell us about yourself</p>

              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                    placeholder="John Doe"
                  />
                  <InputField
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    placeholder="john@example.com"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField
                    label="Phone Number"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    error={errors.mobile}
                    placeholder="9876543210"
                  />
                  <InputField
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    error={errors.username}
                    placeholder="johndoe"
                  />
                </div>

                <InputField
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Your full address"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    placeholder="••••••••"
                  />
                  <InputField
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={errors.confirmPassword}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={prevStep}
                  className="flex-1 bg-slate-700 text-white font-bold py-4 rounded-2xl hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
                >
                  <ChevronLeft size={20} /> Back
                </button>
                <button
                  onClick={role === "CLIENT" ? handleSubmit : nextStep}
                  disabled={loading}
                  className="flex-[2] bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-bold py-4 rounded-2xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? "Processing..." : role === "CLIENT" ? "Create Account" : "Continue"}
                  {!loading && <ChevronRight size={20} />}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Skills & Experience (Technician Only) */}
          {step === 3 && role === "TECHNICIAN" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-2xl font-black text-white mb-2">Skills & Experience</h2>
              <p className="text-slate-400 mb-8">Tell us about your expertise</p>

              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField
                    label="Primary Skill"
                    name="skill"
                    value={formData.skill}
                    onChange={handleChange}
                    error={errors.skill}
                    placeholder="e.g., Plumbing, Electrical"
                  />
                  <InputField
                    label="Experience (Years)"
                    name="experience"
                    type="number"
                    value={formData.experience}
                    onChange={handleChange}
                    error={errors.experience}
                    placeholder="e.g., 5"
                  />
                </div>

                <div>
                  <label className="text-slate-300 text-sm font-medium block mb-2">
                    Service Specialization <span className="text-red-400">*</span>
                  </label>
                  <p className="text-slate-500 text-xs mb-2">
                    Choose the service category you specialize in. You will receive job requests only for this category.
                  </p>
                  <select
                    name="techCategory"
                    value={formData.techCategory}
                    onChange={handleChange}
                    className={`w-full bg-slate-700/50 border rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-indigo-500 transition-colors ${
                      errors.techCategory ? "border-red-500" : "border-slate-600"
                    }`}
                  >
                    <option value="">Select your service specialization</option>
                    {Array.isArray(serviceCategories) && serviceCategories.length > 0 ? (
                      serviceCategories.map((service) => (
                        <option key={service.id} value={service.service_code}>
                          {service.name}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>Loading services...</option>
                    )}
                  </select>
                  {errors.techCategory && <p className="text-red-400 text-xs mt-1">{errors.techCategory}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-slate-300 text-sm font-medium block mb-2">Availability</label>
                    <select
                      name="timeDuration"
                      value={formData.timeDuration}
                      onChange={handleChange}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    >
                      <option value="">Select availability</option>
                      <option value="Full-time">Full-time (8AM - 8PM)</option>
                      <option value="Part-time Morning">Part-time Morning (8AM - 2PM)</option>
                      <option value="Part-time Evening">Part-time Evening (2PM - 8PM)</option>
                      <option value="Weekends Only">Weekends Only</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          name="emergencyAvailable"
                          checked={formData.emergencyAvailable}
                          onChange={handleChange}
                          className="sr-only peer"
                        />
                        <div className="w-12 h-7 bg-slate-600 rounded-full peer-checked:bg-emerald-500 transition-colors" />
                        <div className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform" />
                      </div>
                      <div>
                        <p className="text-white font-medium flex items-center gap-2">
                          <Zap size={16} className="text-amber-400" />
                          Emergency Available
                        </p>
                        <p className="text-slate-400 text-xs">Get emergency job requests</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Profile Image Upload */}
                <FileUpload
                  label="Profile Photo (Optional)"
                  name="profileImage"
                  file={files.profileImage}
                  onFileChange={handleFileChange}
                  onRemove={removeFile}
                  accept="image/*"
                  icon={<User size={24} />}
                />
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={prevStep}
                  className="flex-1 bg-slate-700 text-white font-bold py-4 rounded-2xl hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
                >
                  <ChevronLeft size={20} /> Back
                </button>
                <button
                  onClick={nextStep}
                  className="flex-[2] bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-bold py-4 rounded-2xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  Continue <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Identity Documents (Technician Only) */}
          {step === 4 && role === "TECHNICIAN" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-2xl font-black text-white mb-2">Identity Verification</h2>
              <p className="text-slate-400 mb-8">Upload your identity documents for verification</p>

              <div className="space-y-6">
                {/* Aadhar Card */}
                <div className="p-5 bg-slate-700/30 rounded-2xl border border-slate-600">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
                      <CreditCard size={20} className="text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold">Aadhar Card</h3>
                      <p className="text-slate-400 text-sm">12-digit unique ID</p>
                    </div>
                  </div>
                  
                  <InputField
                    label="Aadhar Number"
                    name="aadharCardNo"
                    value={formData.aadharCardNo}
                    onChange={handleChange}
                    error={errors.aadharCardNo}
                    placeholder="XXXX XXXX XXXX"
                    maxLength={12}
                  />

                  <div className="mt-4">
                    <FileUpload
                      label="Upload Aadhar Card"
                      name="aadharDoc"
                      file={files.aadharDoc}
                      onFileChange={handleFileChange}
                      onRemove={removeFile}
                      error={errors.aadharDoc}
                      required
                    />
                  </div>
                </div>

                {/* PAN Card */}
                <div className="p-5 bg-slate-700/30 rounded-2xl border border-slate-600">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                      <FileText size={20} className="text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold">PAN Card</h3>
                      <p className="text-slate-400 text-sm">Permanent Account Number</p>
                    </div>
                  </div>
                  
                  <InputField
                    label="PAN Number"
                    name="panCardNo"
                    value={formData.panCardNo}
                    onChange={handleChange}
                    error={errors.panCardNo}
                    placeholder="ABCDE1234F"
                    maxLength={10}
                    style={{ textTransform: "uppercase" }}
                  />

                  <div className="mt-4">
                    <FileUpload
                      label="Upload PAN Card"
                      name="panDoc"
                      file={files.panDoc}
                      onFileChange={handleFileChange}
                      onRemove={removeFile}
                      error={errors.panDoc}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={prevStep}
                  className="flex-1 bg-slate-700 text-white font-bold py-4 rounded-2xl hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
                >
                  <ChevronLeft size={20} /> Back
                </button>
                <button
                  onClick={nextStep}
                  className="flex-[2] bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-bold py-4 rounded-2xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  Continue <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Bank Details (Technician Only) */}
          {step === 5 && role === "TECHNICIAN" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-2xl font-black text-white mb-2">Bank Details</h2>
              <p className="text-slate-400 mb-8">For receiving payments after completing jobs</p>

              <div className="space-y-5">
                <div className="p-5 bg-slate-700/30 rounded-2xl border border-slate-600">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                      <Building2 size={20} className="text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold">Bank Account</h3>
                      <p className="text-slate-400 text-sm">For receiving payouts</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <InputField
                      label="Bank Name"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleChange}
                      error={errors.bankName}
                      placeholder="e.g., State Bank of India"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField
                        label="IFSC Code"
                        name="ifscNo"
                        value={formData.ifscNo}
                        onChange={handleChange}
                        error={errors.ifscNo}
                        placeholder="e.g., SBIN0001234"
                        style={{ textTransform: "uppercase" }}
                      />
                      <InputField
                        label="Branch Name"
                        name="branchName"
                        value={formData.branchName}
                        onChange={handleChange}
                        error={errors.branchName}
                        placeholder="e.g., Main Branch"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <FileUpload
                      label="Upload Bank Passbook / Cancelled Cheque (Optional)"
                      name="bankPassbookDoc"
                      file={files.bankPassbookDoc}
                      onFileChange={handleFileChange}
                      onRemove={removeFile}
                    />
                  </div>
                </div>

                {/* Experience Certificate */}
                <div className="p-5 bg-slate-700/30 rounded-2xl border border-slate-600">
                  <FileUpload
                    label="Experience Certificate (Optional)"
                    name="experienceCertDoc"
                    file={files.experienceCertDoc}
                    onFileChange={handleFileChange}
                    onRemove={removeFile}
                    icon={<FileText size={24} />}
                  />
                  <p className="text-slate-500 text-xs mt-2">
                    Upload any relevant work experience certificates to strengthen your profile
                  </p>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={prevStep}
                  className="flex-1 bg-slate-700 text-white font-bold py-4 rounded-2xl hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
                >
                  <ChevronLeft size={20} /> Back
                </button>
                <button
                  onClick={nextStep}
                  className="flex-[2] bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-bold py-4 rounded-2xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  Review Application <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}

          {/* Step 6: Review & Submit (Technician Only) */}
          {step === 6 && role === "TECHNICIAN" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-2xl font-black text-white mb-2">Review Your Application</h2>
              <p className="text-slate-400 mb-8">Please verify all information before submitting</p>

              <div className="space-y-4">
                {/* Personal Info */}
                <ReviewSection title="Personal Information">
                  <ReviewItem label="Name" value={formData.name} />
                  <ReviewItem label="Email" value={formData.email} />
                  <ReviewItem label="Phone" value={formData.mobile} />
                  <ReviewItem label="Username" value={formData.username} />
                </ReviewSection>

                {/* Skills */}
                <ReviewSection title="Skills & Experience">
                  <ReviewItem label="Primary Skill" value={formData.skill} />
                  <ReviewItem label="Experience" value={`${formData.experience} years`} />
                  <ReviewItem label="Category" value={formData.techCategory} />
                  <ReviewItem label="Availability" value={formData.timeDuration || "Not specified"} />
                  <ReviewItem label="Emergency Available" value={formData.emergencyAvailable ? "Yes" : "No"} />
                </ReviewSection>

                {/* Documents */}
                <ReviewSection title="Documents Uploaded">
                  <ReviewItem label="Aadhar Card" value={formData.aadharCardNo} />
                  <ReviewItem label="PAN Card" value={formData.panCardNo.toUpperCase()} />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {files.aadharDoc && <DocBadge label="Aadhar Doc" />}
                    {files.panDoc && <DocBadge label="PAN Doc" />}
                    {files.bankPassbookDoc && <DocBadge label="Bank Passbook" />}
                    {files.experienceCertDoc && <DocBadge label="Experience Cert" />}
                    {files.profileImage && <DocBadge label="Profile Photo" />}
                  </div>
                </ReviewSection>

                {/* Bank Details */}
                <ReviewSection title="Bank Details">
                  <ReviewItem label="Bank Name" value={formData.bankName} />
                  <ReviewItem label="IFSC Code" value={formData.ifscNo.toUpperCase()} />
                  <ReviewItem label="Branch" value={formData.branchName} />
                </ReviewSection>
              </div>

              {/* Terms */}
              <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                <p className="text-amber-400 text-sm">
                  <strong>Important:</strong> By submitting this application, you confirm that all information provided is accurate and the documents are genuine. False information may lead to rejection or account suspension.
                </p>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={prevStep}
                  className="flex-1 bg-slate-700 text-white font-bold py-4 rounded-2xl hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
                >
                  <ChevronLeft size={20} /> Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-[2] bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold py-4 rounded-2xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Check size={20} />
                      Submit Application
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Already have account */}
          <p className="text-center text-slate-400 mt-8">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-indigo-400 font-semibold hover:text-indigo-300"
            >
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// ==================== HELPER COMPONENTS ====================

interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  maxLength?: number;
  style?: React.CSSProperties;
}

const InputField = ({ label, name, value, onChange, error, type = "text", placeholder, maxLength, style }: InputFieldProps) => (
  <div>
    <label className="text-slate-300 text-sm font-medium block mb-2">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      maxLength={maxLength}
      style={style}
      className={`w-full bg-slate-700/50 border rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors ${
        error ? "border-red-500" : "border-slate-600"
      }`}
    />
    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
  </div>
);

interface FileUploadProps {
  label: string;
  name: string;
  file?: FilePreview;
  onFileChange: (e: ChangeEvent<HTMLInputElement>, name: string) => void;
  onRemove: (name: string) => void;
  error?: string;
  accept?: string;
  required?: boolean;
  icon?: React.ReactNode;
}

const FileUpload = ({ label, name, file, onFileChange, onRemove, error, accept = "image/*,.pdf", required, icon }: FileUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <label className="text-slate-300 text-sm font-medium block mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>

      {file ? (
        <div className="flex items-center gap-4 p-4 bg-slate-700/50 border border-slate-600 rounded-xl">
          {file.preview ? (
            <img src={file.preview} alt="Preview" className="w-16 h-16 object-cover rounded-lg" />
          ) : (
            <div className="w-16 h-16 bg-slate-600 rounded-lg flex items-center justify-center">
              <FileText size={24} className="text-slate-400" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium truncate">{file.file.name}</p>
            <p className="text-slate-400 text-sm">{(file.file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
          <button
            type="button"
            onClick={() => onRemove(name)}
            className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
          >
            <X size={20} className="text-red-400" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`w-full p-6 border-2 border-dashed rounded-xl text-center transition-all hover:border-slate-500 hover:bg-slate-700/30 ${
            error ? "border-red-500" : "border-slate-600"
          }`}
        >
          <div className="flex flex-col items-center gap-2">
            {icon || <Upload size={24} className="text-slate-400" />}
            <p className="text-slate-400">
              Click to upload <span className="text-indigo-400">or drag and drop</span>
            </p>
            <p className="text-slate-500 text-xs">JPG, PNG, PDF up to 10MB</p>
          </div>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={(e) => onFileChange(e, name)}
        className="hidden"
      />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
};

const ReviewSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="p-4 bg-slate-700/30 rounded-xl border border-slate-600">
    <h4 className="text-white font-bold mb-3">{title}</h4>
    <div className="space-y-2">{children}</div>
  </div>
);

const ReviewItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between text-sm">
    <span className="text-slate-400">{label}</span>
    <span className="text-white font-medium">{value || "-"}</span>
  </div>
);

const DocBadge = ({ label }: { label: string }) => (
  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-medium flex items-center gap-1">
    <Check size={12} />
    {label}
  </span>
);

export default SignupPage;
