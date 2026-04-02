import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  Wrench,
  Users,
  UserCog,
  Settings,
  TrendingUp,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  ChevronRight,
  Search,
  Filter,
  MoreVertical,
  LogOut,
  Bell,
  Star,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  CreditCard,
  Building2,
  Phone,
  Mail,
  MapPin,
  Award,
  X,
  ExternalLink,
  Download,
  Shield,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../../config/api";

// Types
interface User {
  userId: number;
  name: string;
  email: string;
  mobile: string;
  address: string;
  username: string;
  roleId: number;
  roleName: string;
  technician?: TechnicianDetails;
}

interface TechnicianDetails {
  skill: string;
  experience: number;
  status: "PENDING" | "ACCEPT" | "REJECT";
  techCategory: string;
  timeDuration: string;
  emergencyAvailable: boolean;
  aadharCardNo: string;
  panCardNo: string;
  bankName: string;
  ifscNo: string;
  branchName: string;
  profileImage?: string;
  aadharDoc?: string;
  panDoc?: string;
  bankPassbookDoc?: string;
  experienceCertDoc?: string;
  rating?: { avg_rating: string; rating_count: number };
}

interface Service {
  id: number;
  service_code: string;
  name: string;
  description: string;
  image: string;
  status: "ACTIVE" | "INACTIVE";
}

interface SubService {
  id: number;
  subservice_code: string;
  name: string;
  price: number;
  description: string;
  service_id: number;
  Service?: { name: string };
}

interface Booking {
  id: number;
  order_id: string;
  service_code: string;
  subservice_code: string;
  address: string;
  date: string;
  time_slot: string;
  total_price: number;
  gst: number;
  work_status: number;
  work_status_code: string;
  payment_method: string;
  technician_allocated: boolean;
  technician_id?: number;
  user_id: number;
  User?: { id: number; name: string; email: string; mobile: string };
  service?: { name: string; service_code?: string };
  subservice?: { name: string; price: number };
  technician?: any;
  createdAt: string;
}

type TabType =
  | "overview"
  | "bookings"
  | "services"
  | "technicians"
  | "clients"
  | "settings";

// Helper function to match technician category with service
// Handles: service codes (A10002), service names (Electrical), and variations (Electrician)
const categoryMatchesService = (
  techCategory: string,
  serviceName: string,
  serviceCode?: string,
): boolean => {
  if (!techCategory) return false;
  if (!serviceName && !serviceCode) return false;

  const techCat = techCategory.toLowerCase().trim();
  const svcName = (serviceName || "").toLowerCase().trim();
  const svcCode = (serviceCode || "").toLowerCase().trim();

  // Direct match with service code (e.g., techCategory="A10002" matches serviceCode="A10002")
  if (svcCode && techCat === svcCode) return true;

  // Direct match with service name
  if (svcName && techCat === svcName) return true;

  // Contains match (either way)
  if (svcName && (techCat.includes(svcName) || svcName.includes(techCat)))
    return true;

  // Service code to service name mapping
  const serviceCodeToName: Record<string, string[]> = {
    a10001: ["plumbing", "plumber"],
    a10002: ["electrical", "electrician", "electric"],
    a10003: ["ac repair", "ac", "air conditioner", "hvac", "ac technician"],
    a10004: ["cleaning", "cleaner", "housekeeping"],
  };

  // If techCategory is a service code, check if service name matches
  const techCatMappedNames = serviceCodeToName[techCat] || [];
  if (techCatMappedNames.length > 0) {
    for (const mappedName of techCatMappedNames) {
      if (svcName.includes(mappedName) || mappedName.includes(svcName)) {
        return true;
      }
    }
  }

  // Common category mappings for name variations
  const categoryMappings: Record<string, string[]> = {
    electrical: [
      "electrician",
      "electric",
      "wiring",
      "socket",
      "switch",
      "electrical",
    ],
    electrician: ["electrical", "electric", "wiring", "socket", "switch"],
    plumbing: ["plumber", "pipe", "tap", "leak", "drainage", "plumbing"],
    plumber: ["plumbing", "pipe", "tap", "leak", "drainage"],
    "ac repair": [
      "ac",
      "air conditioner",
      "cooling",
      "hvac",
      "ac technician",
      "ac service",
    ],
    "ac technician": ["ac repair", "ac", "air conditioner", "cooling", "hvac"],
    ac: ["ac repair", "ac technician", "air conditioner", "cooling", "hvac"],
    cleaning: ["cleaner", "housekeeping", "maid", "cleaning service"],
    cleaner: ["cleaning", "housekeeping", "maid"],
    carpentry: ["carpenter", "wood", "furniture", "carpentry"],
    carpenter: ["carpentry", "wood", "furniture"],
    painting: ["painter", "wall", "paint"],
    painter: ["painting", "wall", "paint"],
    appliance: ["appliance repair", "appliances", "home appliance"],
    "appliance repair": ["appliance", "appliances", "home appliance"],
  };

  // Check if techCategory maps to serviceName or vice versa
  const techMappings = categoryMappings[techCat] || [];
  const svcMappings = categoryMappings[svcName] || [];

  // Check if service name is in technician's category mappings
  for (const mapping of techMappings) {
    if (svcName.includes(mapping) || mapping.includes(svcName)) {
      return true;
    }
  }

  // Check if technician's category is in service's mappings
  for (const mapping of svcMappings) {
    if (techCat.includes(mapping) || mapping.includes(techCat)) {
      return true;
    }
  }

  // Check root word match (remove common suffixes)
  const getRootWord = (word: string) => {
    return word
      .replace(/ian$/, "") // electrician -> electric
      .replace(/er$/, "") // plumber -> plumb
      .replace(/ing$/, "") // cleaning -> clean
      .replace(/or$/, "") // contractor -> contract
      .replace(/ist$/, ""); // specialist -> special
  };

  const techRoot = getRootWord(techCat);
  const svcRoot = getRootWord(svcName);

  if (techRoot.length >= 4 && svcRoot.length >= 4) {
    if (techRoot.includes(svcRoot) || svcRoot.includes(techRoot)) {
      return true;
    }
  }

  return false;
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [users, setUsers] = useState<User[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [subServices, setSubServices] = useState<SubService[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all data
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [usersRes, servicesRes, subServicesRes, bookingsRes] =
        await Promise.all([
          fetch(`${API_BASE}/api/auth/users`),
          fetch(`${API_BASE}/api/services`),
          fetch(`${API_BASE}/api/subservices`),
          fetch(`${API_BASE}/api/service-on-booking`),
        ]);

      const usersData = await usersRes.json();
      const servicesData = await servicesRes.json();
      const subServicesData = await subServicesRes.json();
      const bookingsData = await bookingsRes.json();

      setUsers(usersData.data || []);
      setServices(servicesData.data || []);
      setSubServices(subServicesData || []);
      setBookings(bookingsData.bookings || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Stats calculations
  const stats = {
    totalUsers: users.filter((u) => u.roleId === 2).length,
    totalTechnicians: users.filter((u) => u.roleId === 3).length,
    pendingTechnicians: users.filter(
      (u) => u.roleId === 3 && u.technician?.status === "PENDING",
    ).length,
    totalServices: services.length,
    totalSubServices: subServices.length,
    activeTechnicians: users.filter(
      (u) => u.roleId === 3 && u.technician?.status === "ACCEPT",
    ).length,
  };

  // Handle technician status update
  const handleTechnicianStatus = async (
    userId: number,
    status: "APPROVE" | "REJECT",
  ) => {
    try {
      const token = sessionStorage.getItem("accessToken");
      const res = await fetch(
        `${API_BASE}/api/auth/technician/${userId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        },
      );

      if (res.ok) {
        fetchAllData();
      } else {
        const errorData = await res.json();
        console.error("Error response:", errorData);
        alert(
          `Failed to update status: ${errorData.message || "Unknown error"}`,
        );
      }
    } catch (error) {
      console.error("Error updating technician status:", error);
      alert("Failed to update technician status. Please try again.");
    }
  };

  // Logout
  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
    window.location.reload();
  };

  // Sidebar navigation items
  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    {
      id: "bookings",
      label: "Bookings",
      icon: Calendar,
      badge: bookings.filter((b) => b.work_status === 0 || b.work_status === 1)
        .length,
    },
    { id: "services", label: "Services", icon: Package },
    { id: "technicians", label: "Technicians", icon: UserCog },
    { id: "clients", label: "Clients", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-white font-bold">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900/50 backdrop-blur-xl border-r border-slate-800 p-6 flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-12">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center">
            <span className="text-white font-black text-xl">B</span>
          </div>
          <div>
            <h1 className="text-white font-black text-xl">BHS Admin</h1>
            <p className="text-slate-500 text-xs font-medium">Control Panel</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as TabType)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl font-semibold transition-all duration-300 group
                ${
                  activeTab === item.id
                    ? "bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 text-white border border-violet-500/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
            >
              <item.icon
                size={20}
                className={
                  activeTab === item.id
                    ? "text-violet-400"
                    : "text-slate-500 group-hover:text-violet-400"
                }
              />
              {item.label}
              {item.id === "technicians" && stats.pendingTechnicians > 0 && (
                <span className="ml-auto bg-amber-500 text-slate-900 text-xs font-black px-2 py-0.5 rounded-full animate-pulse">
                  {stats.pendingTechnicians}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-3.5 rounded-xl font-semibold text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black text-white capitalize">
              {activeTab === "overview" ? "Dashboard Overview" : activeTab}
            </h2>
            <p className="text-slate-500 font-medium mt-1">
              Welcome back, Admin! Here's what's happening today.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            {/* <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 w-64 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div> */}

            {/* Notifications */}
            {/* <button className="relative p-3 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-violet-500 transition-colors">
              <Bell size={20} className="text-slate-400" />
              {stats.pendingTechnicians > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs font-bold flex items-center justify-center animate-pulse">
                  {stats.pendingTechnicians}
                </span>
              )}
            </button> */}
          </div>
        </header>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <OverviewTab
            stats={stats}
            users={users}
            services={services}
            bookings={bookings}
            subServices={subServices}
            onViewTechnicians={() => setActiveTab("technicians")}
            onAddService={() => setActiveTab("services")}
            onViewSettings={() => setActiveTab("settings")}
            onViewBookings={() => setActiveTab("bookings")}
          />
        )}
        {activeTab === "bookings" && (
          <BookingsTab
            bookings={bookings}
            technicians={users.filter(
              (u) => u.roleId === 3 && u.technician?.status === "ACCEPT",
            )}
            onRefresh={fetchAllData}
            searchQuery={searchQuery}
          />
        )}
        {activeTab === "services" && (
          <ServicesTab
            services={services}
            subServices={subServices}
            onRefresh={fetchAllData}
            searchQuery={searchQuery}
          />
        )}
        {activeTab === "technicians" && (
          <TechniciansTab
            users={users.filter((u) => u.roleId === 3)}
            onStatusUpdate={handleTechnicianStatus}
            searchQuery={searchQuery}
          />
        )}
        {activeTab === "clients" && (
          <ClientsTab
            users={users.filter((u) => u.roleId === 2)}
            searchQuery={searchQuery}
          />
        )}
        {activeTab === "settings" && <SettingsTab />}
      </main>
    </div>
  );
};

// ==================== OVERVIEW TAB ====================
const OverviewTab = ({
  stats,
  users,
  services,
  bookings,
  subServices,
  onViewTechnicians,
  onAddService,
  onViewSettings,
  onViewBookings,
}: {
  stats: any;
  users: User[];
  services: Service[];
  bookings: Booking[];
  subServices: SubService[];
  onViewTechnicians: () => void;
  onAddService: () => void;
  onViewSettings: () => void;
  onViewBookings: () => void;
}) => {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const statCards = [
    {
      label: "Total Clients",
      value: stats.totalUsers,
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      // change: "+12%",
      // up: true,
    },
    {
      label: "Active Technicians",
      value: stats.activeTechnicians,
      icon: UserCog,
      color: "from-emerald-500 to-teal-500",
      // change: "+8%",
      // up: true,
    },
    {
      label: "Pending Approvals",
      value: stats.pendingTechnicians,
      icon: Clock,
      color: "from-amber-500 to-orange-500",
      // change: stats.pendingTechnicians > 0 ? "Action Required" : "All Clear",
      // up: false,
    },
    {
      label: "Total Services",
      value: stats.totalSubServices,
      icon: Package,
      color: "from-violet-500 to-fuchsia-500",
      // change: "+5%",
      // up: true,
    },
  ];

  const pendingTechs = users.filter(
    (u) => u.roleId === 3 && u.technician?.status === "PENDING",
  );

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <div
            key={idx}
            className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all duration-300 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}
              >
                <stat.icon size={24} className="text-white" />
              </div>
              {/* <span
                className={`flex items-center gap-1 text-xs font-bold ${
                  stat.up ? "text-emerald-400" : "text-amber-400"
                }`}
              >
                {stat.up ? (
                  <ArrowUpRight size={14} />
                ) : (
                  <AlertCircle size={14} />
                )}
                {stat.change}
              </span> */}
            </div>
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            <p className="text-4xl font-black text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Pending Approvals Alert */}
      {pendingTechs.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertCircle size={24} className="text-amber-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-lg mb-1">
                {pendingTechs.length} Technician
                {pendingTechs.length > 1 ? "s" : ""} Awaiting Approval
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                New technician applications have been submitted. Review their
                documents and credentials.
              </p>
              <button
                onClick={onViewTechnicians}
                className="px-5 py-2.5 bg-amber-500 text-slate-900 rounded-xl font-bold hover:bg-amber-400 transition-colors flex items-center gap-2"
              >
                <Eye size={18} />
                Review Applications
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Technicians */}
        <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Recent Technicians</h3>
            <button
              onClick={onViewTechnicians}
              className="text-violet-400 text-sm font-semibold hover:text-violet-300 flex items-center gap-1"
            >
              View All <ChevronRight size={16} />
            </button>
          </div>

          <div className="space-y-4">
            {users
              .filter((u) => u.roleId === 3)
              .slice(0, 5)
              .map((tech) => (
                <div
                  key={tech.userId}
                  className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center text-white font-bold">
                      {tech.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-semibold">{tech.name}</p>
                      <p className="text-slate-500 text-sm">
                        {tech.technician?.skill || "General"}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      tech.technician?.status === "ACCEPT"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : tech.technician?.status === "PENDING"
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {tech.technician?.status || "PENDING"}
                  </span>
                </div>
              ))}

            {users.filter((u) => u.roleId === 3).length === 0 && (
              <p className="text-center text-slate-500 py-8">
                No technicians registered yet
              </p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={onAddService}
              className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30 rounded-xl text-white font-semibold hover:from-violet-500/30 hover:to-fuchsia-500/30 transition-all"
            >
              <Plus size={20} className="text-violet-400" />
              Add New Service
            </button>
            <button
              onClick={onViewTechnicians}
              className="w-full flex items-center gap-4 p-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white font-semibold hover:border-slate-600 transition-all"
            >
              <UserCog size={20} className="text-slate-400" />
              Manage Technicians
            </button>
            <button
              onClick={() => setShowAnalytics(true)}
              className="w-full flex items-center gap-4 p-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white font-semibold hover:border-slate-600 transition-all"
            >
              <TrendingUp size={20} className="text-slate-400" />
              View Analytics
            </button>
            <button
              onClick={onViewSettings}
              className="w-full flex items-center gap-4 p-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white font-semibold hover:border-slate-600 transition-all"
            >
              <Settings size={20} className="text-slate-400" />
              System Settings
            </button>
          </div>
        </div>
      </div>

      {/* Services Overview */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Service Categories</h3>
          <button
            onClick={onAddService}
            className="text-violet-400 text-sm font-semibold hover:text-violet-300 flex items-center gap-1"
          >
            Manage Services <ChevronRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {services.slice(0, 6).map((service) => (
            <div
              key={service.id}
              className="p-4 bg-slate-800/30 rounded-xl text-center hover:bg-slate-800/50 transition-colors group cursor-pointer"
            >
              <div className="w-14 h-14 mx-auto mb-3 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-xl flex items-center justify-center group-hover:from-violet-500/30 group-hover:to-fuchsia-500/30 transition-colors">
                <Wrench size={24} className="text-violet-400" />
              </div>
              <p className="text-white font-semibold text-sm truncate">
                {service.name}
              </p>
              <p className="text-slate-500 text-xs mt-1">
                {service.status === "ACTIVE" ? "Active" : "Inactive"}
              </p>
            </div>
          ))}

          {services.length === 0 && (
            <div className="col-span-full text-center py-8 text-slate-500">
              No services added yet
            </div>
          )}
        </div>
      </div>

      {/* Analytics Modal */}
      {showAnalytics && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900 z-10 rounded-t-3xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center">
                  <TrendingUp size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Platform Analytics</h3>
                  <p className="text-slate-500 text-sm">Overview of key metrics & performance</p>
                </div>
              </div>
              <button
                onClick={() => setShowAnalytics(false)}
                className="p-2 hover:bg-slate-800 rounded-xl transition-colors"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Key Metrics */}
              {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Total Revenue", value: `₹${bookings.filter(b => b.work_status === 3).reduce((sum, b) => sum + (b.total_price || 0), 0).toLocaleString()}`, icon: DollarSign, color: "from-emerald-500 to-teal-500" },
                  { label: "Total Bookings", value: bookings.length, icon: Calendar, color: "from-blue-500 to-cyan-500" },
                  { label: "Completion Rate", value: bookings.length > 0 ? `${Math.round((bookings.filter(b => b.work_status === 3).length / bookings.length) * 100)}%` : "0%", icon: CheckCircle2, color: "from-violet-500 to-fuchsia-500" },
                  { label: "Avg. Order Value", value: bookings.filter(b => b.work_status === 3).length > 0 ? `₹${Math.round(bookings.filter(b => b.work_status === 3).reduce((sum, b) => sum + (b.total_price || 0), 0) / bookings.filter(b => b.work_status === 3).length).toLocaleString()}` : "₹0", icon: CreditCard, color: "from-amber-500 to-orange-500" },
                ].map((metric, idx) => (
                  <div key={idx} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                    <div className={`w-10 h-10 bg-gradient-to-br ${metric.color} rounded-lg flex items-center justify-center mb-3`}>
                      <metric.icon size={18} className="text-white" />
                    </div>
                    <p className="text-slate-500 text-xs font-medium">{metric.label}</p>
                    <p className="text-2xl font-bold text-white mt-1">{metric.value}</p>
                  </div>
                ))}
              </div> */}

              {/* Key Metrics */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {(() => {
    const completedBookings = bookings.filter(b => b.work_status === 3);

    const totalRevenue = completedBookings.reduce(
      (sum, b) => sum + (Number(b.total_price) || 0),
      0
    );

    const totalBookings = bookings.length;

    const completionRate =
      totalBookings > 0
        ? Math.round((completedBookings.length / totalBookings) * 100)
        : 0;

    const avgOrderValue =
      completedBookings.length > 0
        ? Math.round(totalRevenue / completedBookings.length)
        : 0;

    const metrics = [
      {
        label: "Total Revenue",
        value: `₹${totalRevenue.toLocaleString("en-IN")}`,
        icon: DollarSign,
        color: "from-emerald-500 to-teal-500",
      },
      {
        label: "Total Bookings",
        value: totalBookings.toLocaleString("en-IN"),
        icon: Calendar,
        color: "from-blue-500 to-cyan-500",
      },
      {
        label: "Completion Rate",
        value: `${completionRate}%`,
        icon: CheckCircle2,
        color: "from-violet-500 to-fuchsia-500",
      },
      {
        label: "Avg. Order Value",
        value: `₹${avgOrderValue.toLocaleString("en-IN")}`,
        icon: CreditCard,
        color: "from-amber-500 to-orange-500",
      },
    ];

    return metrics.map((metric, idx) => (
      <div
        key={idx}
        className="bg-slate-800/50 border border-slate-700 rounded-xl p-4"
      >
        <div
          className={`w-10 h-10 bg-gradient-to-br ${metric.color} rounded-lg flex items-center justify-center mb-3`}
        >
          <metric.icon size={18} className="text-white" />
        </div>

        <p className="text-slate-500 text-xs font-medium">
          {metric.label}
        </p>

        {/* 🔥 FIX: prevent overflow */}
        <p className="text-xl md:text-2xl font-bold text-white mt-1 break-words">
          {metric.value}
        </p>
      </div>
    ));
  })()}
</div>

              {/* Booking Status Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                  <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Calendar size={18} className="text-violet-400" />
                    Booking Status Breakdown
                  </h4>
                  <div className="space-y-3">
                    {[
                      { label: "Unassigned", count: bookings.filter(b => !b.technician_allocated).length, color: "bg-red-500", textColor: "text-red-400" },
                      { label: "Assigned / Accepted", count: bookings.filter(b => b.technician_allocated && b.work_status === 1).length, color: "bg-amber-500", textColor: "text-amber-400" },
                      { label: "In Progress", count: bookings.filter(b => b.work_status === 2).length, color: "bg-violet-500", textColor: "text-violet-400" },
                      { label: "Completed", count: bookings.filter(b => b.work_status === 3).length, color: "bg-emerald-500", textColor: "text-emerald-400" },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${item.color}`} />
                          <span className="text-slate-300 text-sm">{item.label}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${item.color} rounded-full transition-all`}
                              style={{ width: bookings.length > 0 ? `${(item.count / bookings.length) * 100}%` : '0%' }}
                            />
                          </div>
                          <span className={`font-bold text-sm ${item.textColor} min-w-[2rem] text-right`}>{item.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* User Distribution */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                  <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Users size={18} className="text-blue-400" />
                    User Distribution
                  </h4>
                  <div className="space-y-3">
                    {[
                      { label: "Clients", count: stats.totalUsers, color: "bg-blue-500", textColor: "text-blue-400" },
                      { label: "Active Technicians", count: stats.activeTechnicians, color: "bg-emerald-500", textColor: "text-emerald-400" },
                      { label: "Pending Technicians", count: stats.pendingTechnicians, color: "bg-amber-500", textColor: "text-amber-400" },
                      { label: "Rejected Technicians", count: users.filter(u => u.roleId === 3 && u.technician?.status === "REJECT").length, color: "bg-red-500", textColor: "text-red-400" },
                    ].map((item, idx) => {
                      const totalUsers = stats.totalUsers + stats.activeTechnicians + stats.pendingTechnicians + users.filter(u => u.roleId === 3 && u.technician?.status === "REJECT").length;
                      return (
                        <div key={idx} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${item.color}`} />
                            <span className="text-slate-300 text-sm">{item.label}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${item.color} rounded-full transition-all`}
                                style={{ width: totalUsers > 0 ? `${(item.count / totalUsers) * 100}%` : '0%' }}
                              />
                            </div>
                            <span className={`font-bold text-sm ${item.textColor} min-w-[2rem] text-right`}>{item.count}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Service Performance */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Package size={18} className="text-fuchsia-400" />
                  Service Performance
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-3 px-4 text-slate-400 text-sm font-semibold">Service</th>
                        <th className="text-left py-3 px-4 text-slate-400 text-sm font-semibold">Sub-Services</th>
                        <th className="text-left py-3 px-4 text-slate-400 text-sm font-semibold">Bookings</th>
                        <th className="text-left py-3 px-4 text-slate-400 text-sm font-semibold">Revenue</th>
                        <th className="text-left py-3 px-4 text-slate-400 text-sm font-semibold">Completed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {services.map(service => {
                        // const serviceBookings = bookings.filter(b => b.service_code === service.service_code);
                        const serviceBookings = bookings.filter(
  (b) => b.service_code === service.service_code
);
                        // const completedBookings = serviceBookings.filter(b => b.work_status === 3);
                        const completedBookings = serviceBookings.filter(
  (b) => b.work_status === 3
);  
                        // const revenue = completedBookings.reduce((sum, b) => sum + (b.total_price || 0), 0);
                        const revenue = completedBookings.reduce(
  (sum, b) => sum + (Number(b.total_price) || 0),
  0
);
                        // const subCount = subServices.filter(s => s.service_id === service.id).length;
                        const subCount = subServices.filter(
  (s) => s.service_id === service.id
).length;
                        return (
                          <tr key={service.id} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-lg flex items-center justify-center">
                                  <Wrench size={14} className="text-violet-400" />
                                </div>
                                <div>
                                  <p className="text-white font-medium text-sm">{service.name}</p>
                                  <p className="text-slate-500 text-xs font-mono">{service.service_code}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-slate-300 text-sm">{subCount}</td>
                            <td className="py-3 px-4 text-slate-300 text-sm">{serviceBookings.length}</td>
                            {/* <td className="py-3 px-4 text-emerald-400 font-semibold text-sm">₹{revenue.toLocaleString()}</td> */}
                            <td className="py-3 px-4 text-emerald-400 font-semibold text-sm break-words">
  ₹{revenue.toLocaleString("en-IN")}
</td>
                            <td className="py-3 px-4">
                              <span className="text-emerald-400 text-sm font-medium">{completedBookings.length}</span>
                              <span className="text-slate-500 text-sm"> / {serviceBookings.length}</span>
                            </td>
                          </tr>
                        );
                      })}
                      {services.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-slate-500">No services to analyze</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quick Stats Footer */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-800/30 rounded-xl p-4 text-center">
                  <p className="text-slate-500 text-xs">Total Services</p>
                  <p className="text-white text-xl font-bold break-words">{services.length}</p>
                </div>
                <div className="bg-slate-800/30 rounded-xl p-4 text-center">
                  <p className="text-slate-500 text-xs">Total Sub-Services</p>
                  <p className="text-white text-xl font-bold break-words">{subServices.length}</p>
                </div>
                <div className="bg-slate-800/30 rounded-xl p-4 text-center">
                  <p className="text-slate-500 text-xs">Payment Methods</p>
                 <p className="text-white text-xl font-bold break-words">{[...new Set(bookings.map(b => b.payment_method).filter(Boolean))].length || 0}</p>
                </div>
                <div className="bg-slate-800/30 rounded-xl p-4 text-center">
                  <p className="text-slate-500 text-xs">GST Collected</p>
                  <p className="text-white text-xl font-bold break-words">{(() => {
  const completedBookings = bookings.filter(b => b.work_status === 3);

  const totalGST = completedBookings.reduce(
    (sum, b) => sum + (Number(b.gst) || 0),
    0
  );

  return `₹${totalGST.toLocaleString("en-IN")}`;
})()}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={onViewBookings}
                  className="px-5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-semibold hover:border-violet-500 transition-colors flex items-center gap-2"
                >
                  <Calendar size={16} />
                  View All Bookings
                </button>
                <button
                  onClick={() => setShowAnalytics(false)}
                  className="px-5 py-2.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== SERVICES TAB ====================
const ServicesTab = ({
  services,
  subServices,
  onRefresh,
  searchQuery,
}: {
  services: Service[];
  subServices: SubService[];
  onRefresh: () => void;
  searchQuery: string;
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    service_code: "",
    description: "",
    status: "ACTIVE",
  });
  const [serviceImage, setServiceImage] = useState<File | null>(null);
  const [subFormData, setSubFormData] = useState({
    name: "",
    subservice_code: "",
    description: "",
    price: "",
    service_code: "", // Changed from service_id to service_code
  });
  const [subServiceImage, setSubServiceImage] = useState<File | null>(null);
  const [editingSubService, setEditingSubService] = useState<SubService | null>(null);
  const [showEditSubModal, setShowEditSubModal] = useState(false);
  const [editSubFormData, setEditSubFormData] = useState({
    description: "",
    price: "",
  });
  const [editSubServiceImage, setEditSubServiceImage] = useState<File | null>(null);
  const [localSearch, setLocalSearch] = useState("");

  const filteredServices = services.filter((s) => {
  const searchText = localSearch.toLowerCase();

  return (
    s.name?.toLowerCase().includes(searchText) ||
    s.service_code?.toLowerCase().includes(searchText)
  );
});

  // Show success message
  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 5001);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      alert("Service name is required");
      return;
    }

    setSaving(true);
    try {
      const method = editingService ? "PATCH" : "POST";
      const url = editingService
        ? `${API_BASE}/api/services/${editingService.id}`
        : `${API_BASE}/api/services`;

      // Use FormData for image upload
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("description", formData.description);
      if (formData.service_code)
        submitData.append("service_code", formData.service_code);
      if (serviceImage) submitData.append("image", serviceImage);

      const res = await fetch(url, {
        method,
        body: submitData, // No Content-Type header - browser sets it with boundary
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to save service");
      }

      setShowModal(false);
      setEditingService(null);
      setFormData({
        name: "",
        service_code: "",
        description: "",
        status: "ACTIVE",
      });
      setServiceImage(null);
      showSuccess(
        editingService
          ? "Service updated successfully!"
          : "Service added successfully!",
      );
      await onRefresh(); // Wait for refresh
    } catch (error: any) {
      console.error("Error saving service:", error);
      alert(error.message || "Failed to save service");
    } finally {
      setSaving(false);
    }
  };

  const handleSubSubmit = async () => {
    if (
      !subFormData.name.trim() ||
      !subFormData.price ||
      !subFormData.service_code
    ) {
      alert("Name, price, and category are required");
      return;
    }

    setSaving(true);
    try {
      // Use FormData for image upload
      const submitData = new FormData();
      submitData.append("name", subFormData.name);
      submitData.append("description", subFormData.description);
      submitData.append("price", subFormData.price);
      submitData.append("service_code", subFormData.service_code); // Backend expects service_code
      if (subServiceImage) submitData.append("image", subServiceImage);

      const res = await fetch(`${API_BASE}/api/subservices`, {
        method: "POST",
        body: submitData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to save sub-service");
      }

      setShowSubModal(false);
      setSubFormData({
        name: "",
        subservice_code: "",
        description: "",
        price: "",
        service_code: "",
      });
      setSubServiceImage(null);
      showSuccess("Sub-service added successfully!");
      await onRefresh(); // Wait for refresh
    } catch (error: any) {
      console.error("Error saving subservice:", error);
      alert(error.message || "Failed to save sub-service");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      await fetch(`${API_BASE}/api/services/${id}`, { method: "DELETE" });
      showSuccess("Service deleted successfully!");
      onRefresh();
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  const handleSubEdit = async () => {
    if (!editingSubService) return;
    if (!editSubFormData.price) {
      alert("Price is required");
      return;
    }

    setSaving(true);
    try {
      const submitData = new FormData();
      submitData.append("price", editSubFormData.price);
      submitData.append("description", editSubFormData.description);
      if (editSubServiceImage) submitData.append("image", editSubServiceImage);

      const res = await fetch(`${API_BASE}/api/subservices/${editingSubService.id}`, {
        method: "PUT",
        body: submitData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to update sub-service");
      }

      setShowEditSubModal(false);
      setEditingSubService(null);
      setEditSubFormData({ description: "", price: "" });
      setEditSubServiceImage(null);
      showSuccess("Sub-service updated successfully!");
      await onRefresh();
    } catch (error: any) {
      console.error("Error updating subservice:", error);
      alert(error.message || "Failed to update sub-service");
    } finally {
      setSaving(false);
    }
  };

  const handleSubDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this sub-service?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/subservices/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to delete sub-service");
      }
      showSuccess("Sub-service deleted successfully!");
      await onRefresh();
    } catch (error: any) {
      console.error("Error deleting subservice:", error);
      alert(error.message || "Failed to delete sub-service");
    }
  };


// const filteredSubServices = subServices
//   .filter((sub) => {
//     const searchText = localSearch.toLowerCase();

//     return (
//       sub.name?.toLowerCase().includes(searchText) ||
//       sub.subservice_code?.toLowerCase().includes(searchText) ||
//       sub.Service?.name?.toLowerCase().includes(searchText)
//     );
//   })
//   .slice(0, 5);



const filteredSubServices = subServices.filter((sub) => {
  const searchText = localSearch.toLowerCase();

  return (
    sub.name?.toLowerCase().includes(searchText) ||
    sub.subservice_code?.toLowerCase().includes(searchText) ||
    sub.Service?.name?.toLowerCase().includes(searchText)
  );
});

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMsg && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-lg animate-in slide-in-from-top-2 duration-300 flex items-center gap-2">
          <CheckCircle2 size={20} />
          {successMsg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">All Services</h3>
          <p className="text-slate-500 text-sm">
            {services.length} categories, {subServices.length} services
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowSubModal(true)}
            className="flex items-center gap-2 px-5 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white font-semibold hover:border-violet-500 transition-colors"
          >
            <Plus size={18} />
            Add Sub-Service
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity"
          >
            <Plus size={18} />
            Add Category
          </button>
        </div>
      </div>

      {/* Services Grid */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> */}
      <div className="max-h-[650px] overflow-y-auto pr-2">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all group"
          >
            {/* <div className="h-32 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center">
              <Package size={48} className="text-violet-400" />
            </div> */}
            {/* IMAGE / ICON SECTION */}
            <div className="h-32 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center overflow-hidden">
              {service.image ? (
                <img
                  src={service.image}
                  alt={service.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <Package size={48} className="text-violet-400" />
              )}
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-white font-bold text-lg">
                    {service.name}
                  </h4>
                  <p className="text-slate-500 text-xs font-mono">
                    {service.service_code}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-lg text-xs font-bold ${
                    service.status === "ACTIVE"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {service.status}
                </span>
              </div>
              <p className="text-slate-400 text-sm line-clamp-2 mb-4">
                {service.description || "No description available"}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <span className="text-slate-500 text-sm">
                  {
                    subServices.filter((s) => s.service_id === service.id)
                      .length
                  }{" "}
                  sub-services
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingService(service);
                      setFormData({
                        name: service.name,
                        service_code: service.service_code,
                        description: service.description,
                        status: service.status,
                      });
                      setShowModal(true);
                    }}
                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <Edit3 size={16} className="text-slate-400" />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} className="text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredServices.length === 0 && (
          <div className="col-span-full text-center py-16">
            <Package size={48} className="text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500">No services found</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 text-violet-400 font-semibold hover:text-violet-300"
            >
              Add your first service
            </button>
          </div>
        )}
      </div>
      </div>



      {/* Search Bar */}
<div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
  <input
    type="text"
    placeholder="Search Service (AC Repair) or Sub-Service (AC Deep Cleaning)..."
    value={localSearch}
   onChange={(e) => setLocalSearch(e.target.value)}
    className="w-full bg-transparent text-white placeholder:text-slate-500 outline-none"
  />
</div>

      {/* Sub-Services Table */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h3 className="text-xl font-bold text-white">Sub-Services</h3>
        </div>
        {/* <div className="overflow-x-auto"> */}
        <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="text-left p-4 text-slate-400 font-semibold text-sm">
                  Service
                </th>
                <th className="text-left p-4 text-slate-400 font-semibold text-sm">
                  Code
                </th>
                <th className="text-left p-4 text-slate-400 font-semibold text-sm">
                  Category
                </th>
                <th className="text-left p-4 text-slate-400 font-semibold text-sm">
                  Price
                </th>
                <th className="text-left p-4 text-slate-400 font-semibold text-sm">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {/* {subServices.map((sub) => ( */}
              {filteredSubServices.map((sub) => (
                <tr
                  key={sub.id}
                  className="border-t border-slate-800 hover:bg-slate-800/30 transition-colors"
                >
                  <td className="p-4">
                    <p className="text-white font-semibold">{sub.name}</p>
                    <p className="text-slate-500 text-sm line-clamp-1">
                      {sub.description}
                    </p>
                  </td>
                  <td className="p-4">
                    <span className="text-slate-400 font-mono text-sm">
                      {sub.subservice_code}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-violet-500/20 text-violet-400 rounded-lg text-sm font-medium">
                      {sub.Service?.name || "Uncategorized"}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-emerald-400 font-bold">
                      ₹{sub.price}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingSubService(sub);
                          setEditSubFormData({
                            description: sub.description || "",
                            price: String(sub.price),
                          });
                          setEditSubServiceImage(null);
                          setShowEditSubModal(true);
                        }}
                        className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                        title="Edit sub-service"
                      >
                        <Edit3 size={16} className="text-slate-400" />
                      </button>
                      <button
                        onClick={() => handleSubDelete(sub.id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                        title="Delete sub-service"
                      >
                        <Trash2 size={16} className="text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {/* {subServices.length === 0 && ( */}
              {filteredSubServices.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    No sub-services added yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Service Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 w-full max-w-lg mx-4 animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-bold text-white mb-6">
              {editingService
                ? "Edit Service Category"
                : "Add Service Category"}
            </h3>
            <div className="space-y-4">
              {/* Image Upload */}
              <div>
                <label className="text-slate-400 text-sm font-medium block mb-2">
                  Category Image (Thumbnail)
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-slate-800 border-2 border-dashed border-slate-600 rounded-xl flex items-center justify-center overflow-hidden">
                    {serviceImage ? (
                      <img
                        src={URL.createObjectURL(serviceImage)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : editingService?.image ? (
                      <img
                        src={editingService.image}
                        alt="Current"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package size={24} className="text-slate-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setServiceImage(e.target.files?.[0] || null)
                      }
                      className="hidden"
                      id="service-image"
                    />
                    <label
                      htmlFor="service-image"
                      className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 hover:border-violet-500 transition-colors"
                    >
                      <Plus size={16} />
                      {serviceImage ? "Change Image" : "Upload Image"}
                    </label>
                    <p className="text-slate-500 text-xs mt-1">
                      JPG, PNG up to 2MB
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-slate-400 text-sm font-medium block mb-2">
                  Service Name {!editingService && '*'}
                </label>
                {editingService ? (
                  <div className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-300 flex items-center justify-between">
                    <span>{formData.name}</span>
                    {formData.service_code && (
                      <span className="text-xs bg-violet-500/20 text-violet-400 px-2 py-0.5 rounded-full">
                        {formData.service_code}
                      </span>
                    )}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., AC Repair"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                  />
                )}
              </div>
              <div>
                <label className="text-slate-400 text-sm font-medium block mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Service description..."
                  rows={3}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 resize-none"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingService(null);
                    setServiceImage(null);
                  }}
                  disabled={saving}
                  className="flex-1 py-3 border border-slate-700 rounded-xl text-white font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="flex-1 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : editingService ? (
                    "Save Changes"
                  ) : (
                    "Add Service"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Sub-Service Modal */}
      {showSubModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 w-full max-w-lg mx-4 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-white mb-6">
              Add Sub-Service
            </h3>
            <div className="space-y-4">
              {/* Image Upload */}
              <div>
                <label className="text-slate-400 text-sm font-medium block mb-2">
                  Service Image (Thumbnail)
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-slate-800 border-2 border-dashed border-slate-600 rounded-xl flex items-center justify-center overflow-hidden">
                    {subServiceImage ? (
                      <img
                        src={URL.createObjectURL(subServiceImage)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Wrench size={24} className="text-slate-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setSubServiceImage(e.target.files?.[0] || null)
                      }
                      className="hidden"
                      id="subservice-image"
                    />
                    <label
                      htmlFor="subservice-image"
                      className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 hover:border-violet-500 transition-colors"
                    >
                      <Plus size={16} />
                      {subServiceImage ? "Change Image" : "Upload Image"}
                    </label>
                    <p className="text-slate-500 text-xs mt-1">
                      JPG, PNG up to 2MB
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-slate-400 text-sm font-medium block mb-2">
                  Category *
                </label>
                <select
                  value={subFormData.service_code}
                  onChange={(e) =>
                    setSubFormData({
                      ...subFormData,
                      service_code: e.target.value,
                    })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500"
                >
                  <option value="">Select category</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.service_code}>
                      {s.name} ({s.service_code})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-slate-400 text-sm font-medium block mb-2">
                  Service Name *
                </label>
                <input
                  type="text"
                  value={subFormData.name}
                  onChange={(e) =>
                    setSubFormData({ ...subFormData, name: e.target.value })
                  }
                  placeholder="e.g., AC Gas Refill"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>
              <div>
                <label className="text-slate-400 text-sm font-medium block mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  value={subFormData.price}
                  onChange={(e) =>
                    setSubFormData({ ...subFormData, price: e.target.value })
                  }
                  placeholder="e.g., 1500"
                  min="0"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>
              <div>
                <label className="text-slate-400 text-sm font-medium block mb-2">
                  Description
                </label>
                <textarea
                  value={subFormData.description}
                  onChange={(e) =>
                    setSubFormData({
                      ...subFormData,
                      description: e.target.value,
                    })
                  }
                  placeholder="Service description..."
                  rows={3}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 resize-none"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => {
                    setShowSubModal(false);
                    setSubServiceImage(null);
                  }}
                  disabled={saving}
                  className="flex-1 py-3 border border-slate-700 rounded-xl text-white font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubSubmit}
                  disabled={saving}
                  className="flex-1 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Sub-Service"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Sub-Service Modal */}
      {showEditSubModal && editingSubService && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 w-full max-w-lg mx-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Edit Sub-Service</h3>
              <button
                onClick={() => {
                  setShowEditSubModal(false);
                  setEditingSubService(null);
                  setEditSubServiceImage(null);
                }}
                className="p-2 hover:bg-slate-800 rounded-xl transition-colors"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>
            <div className="space-y-5">
              {/* Service Name (Read-only) */}
              <div>
                <label className="text-slate-400 text-sm font-medium block mb-2">
                  Service Name
                </label>
                <div className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-300 flex items-center justify-between">
                  <span className="font-medium">{editingSubService.name}</span>
                  <span className="text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded-md font-mono">
                    {editingSubService.subservice_code}
                  </span>
                </div>
                <p className="text-slate-600 text-xs mt-1">Name cannot be changed</p>
              </div>

              {/* Category (Read-only) */}
              <div>
                <label className="text-slate-400 text-sm font-medium block mb-2">
                  Category
                </label>
                <div className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-300">
                  <span className="px-3 py-1 bg-violet-500/20 text-violet-400 rounded-lg text-sm font-medium">
                    {editingSubService.Service?.name || "Uncategorized"}
                  </span>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="text-slate-400 text-sm font-medium block mb-2">
                  Service Image
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-slate-800 border-2 border-dashed border-slate-600 rounded-xl flex items-center justify-center overflow-hidden">
                    {editSubServiceImage ? (
                      <img
                        src={URL.createObjectURL(editSubServiceImage)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Wrench size={24} className="text-slate-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setEditSubServiceImage(e.target.files?.[0] || null)
                      }
                      className="hidden"
                      id="edit-subservice-image"
                    />
                    <label
                      htmlFor="edit-subservice-image"
                      className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 hover:border-violet-500 transition-colors"
                    >
                      <Plus size={16} />
                      {editSubServiceImage ? "Change Image" : "Upload New Image"}
                    </label>
                    <p className="text-slate-500 text-xs mt-1">JPG, PNG up to 2MB</p>
                  </div>
                </div>
              </div>

              {/* Price (Editable) */}
              <div>
                <label className="text-slate-400 text-sm font-medium block mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  value={editSubFormData.price}
                  onChange={(e) =>
                    setEditSubFormData({ ...editSubFormData, price: e.target.value })
                  }
                  placeholder="e.g., 1500"
                  min="0"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              {/* Description (Editable) */}
              <div>
                <label className="text-slate-400 text-sm font-medium block mb-2">
                  Description
                </label>
                <textarea
                  value={editSubFormData.description}
                  onChange={(e) =>
                    setEditSubFormData({ ...editSubFormData, description: e.target.value })
                  }
                  placeholder="Service description..."
                  rows={3}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => {
                    setShowEditSubModal(false);
                    setEditingSubService(null);
                    setEditSubServiceImage(null);
                  }}
                  disabled={saving}
                  className="flex-1 py-3 border border-slate-700 rounded-xl text-white font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubEdit}
                  disabled={saving}
                  className="flex-1 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== TECHNICIANS TAB ====================
const TechniciansTab = ({
  users,
  onStatusUpdate,
  searchQuery,
}: {
  users: User[];
  onStatusUpdate: (id: number, status: "APPROVE" | "REJECT") => void;
  searchQuery: string;
}) => {
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "ACCEPT" | "REJECT">(
    "ALL",
  );
  const [selectedTech, setSelectedTech] = useState<User | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [localSearch, setLocalSearch] = useState("");
  const [activeMap, setActiveMap] = useState<Record<number, boolean>>({});

  // const filteredUsers = users.filter((u) => {
  //   const matchesSearch =
  //     u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     u.email?.toLowerCase().includes(searchQuery.toLowerCase());
  //   const matchesFilter = filter === "ALL" || u.technician?.status === filter;
  //   return matchesSearch && matchesFilter;
  // });

const filteredUsers = users.filter((u) => {
  const searchText = localSearch.toLowerCase(); // ✅ FIXED

  const matchesSearch =
    u.name?.toLowerCase().includes(searchText) ||
    u.email?.toLowerCase().includes(searchText) ||
    u.technician?.skill?.toLowerCase().includes(searchText) || // skill
    u.technician?.status?.toLowerCase().includes(searchText); // status

  const matchesFilter =
    filter === "ALL" || u.technician?.status === filter;

  return matchesSearch && matchesFilter;
});

  const pendingCount = users.filter(
    (u) => u.technician?.status === "PENDING",
  ).length;
  const approvedCount = users.filter(
    (u) => u.technician?.status === "ACCEPT",
  ).length;
  const rejectedCount = users.filter(
    (u) => u.technician?.status === "REJECT",
  ).length;

  const openDetail = (tech: User) => {
    setSelectedTech(tech);
    setShowDetailModal(true);
  };



//   useEffect(() => {
//   const initialMap: Record<number, boolean> = {};

//   users.forEach((u) => {
//     // assuming backend sends isActive inside technician
//     initialMap[u.userId] = (u as any)?.technician?.isActive ?? true;
//   });

//   setActiveMap(initialMap);
// }, [users]);


useEffect(() => {
  const initialMap: Record<number, boolean> = {};

  users.forEach((u) => {
    // ❌ If rejected → always inactive
    if (u.technician?.status === "REJECT") {
      initialMap[u.userId] = false;
    } else {
      initialMap[u.userId] = (u as any)?.technician?.isActive ?? true;
    }
  });

  setActiveMap(initialMap);
}, [users]);


// const handleToggleActive = async (userId: number) => {
//   try {
//     const token = sessionStorage.getItem("accessToken");

//     const res = await fetch(
//       `${API_BASE}/api/auth/technician/${userId}/toggle-active`,
//       {
//         method: "PATCH",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     // ✅ ONLY toggle AFTER success (status 200)
//     if (res.status === 200) {
//       setActiveMap((prev) => {
//         const currentState = prev[userId] ?? true;

//         return {
//           ...prev,
//           [userId]: !currentState, // toggle Active <-> Inactive
//         };
//       });
//     } else {
//       alert("Failed to update status");
//     }
//   } catch (error) {
//     console.error("Toggle error:", error);
//     alert("Something went wrong");
//   }
// };



// const handleToggleActive = async (userId: number) => {
//   try {
//     const token = sessionStorage.getItem("accessToken");

//     const res = await fetch(
//       `${API_BASE}/api/auth/technician/${userId}/toggle-active`,
//       {
//         method: "PATCH",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     const data = await res.json();

//     if (res.status === 200) {
//       // ✅ USE BACKEND VALUE (IMPORTANT)
//       setActiveMap((prev) => ({
//         ...prev,
//         [userId]: data.isActive,
//       }));
//     } else {
//       alert(data.message || "Failed to update status");
//     }
//   } catch (error) {
//     console.error("Toggle error:", error);
//     alert("Something went wrong");
//   }
// };




const handleToggleActive = async (userId: number) => {
  const tech = users.find((u) => u.userId === userId);

  // ❌ Prevent toggling if rejected
  if (tech?.technician?.status === "REJECT") {
    return;
  }

  try {
    const token = sessionStorage.getItem("accessToken");

    const res = await fetch(
      `${API_BASE}/api/auth/technician/${userId}/toggle-active`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (res.status === 200) {
      setActiveMap((prev) => ({
        ...prev,
        [userId]: data.isActive,
      }));
    } else {
      alert(data.message || "Failed to update status");
    }
  } catch (error) {
    console.error("Toggle error:", error);
    alert("Something went wrong");
  }
};



  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button
          onClick={() => setFilter("ALL")}
          className={`p-4 rounded-xl border transition-all ${
            filter === "ALL"
              ? "bg-violet-500/20 border-violet-500"
              : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
          }`}
        >
          <p className="text-slate-500 text-sm">Total</p>
          <p className="text-2xl font-bold text-white">{users.length}</p>
        </button>
        <button
          onClick={() => setFilter("PENDING")}
          className={`p-4 rounded-xl border transition-all ${
            filter === "PENDING"
              ? "bg-amber-500/20 border-amber-500"
              : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
          }`}
        >
          <p className="text-slate-500 text-sm">Pending Review</p>
          <p className="text-2xl font-bold text-amber-400">{pendingCount}</p>
        </button>
        <button
          onClick={() => setFilter("ACCEPT")}
          className={`p-4 rounded-xl border transition-all ${
            filter === "ACCEPT"
              ? "bg-emerald-500/20 border-emerald-500"
              : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
          }`}
        >
          <p className="text-slate-500 text-sm">Approved</p>
          <p className="text-2xl font-bold text-emerald-400">{approvedCount}</p>
        </button>
        <button
          onClick={() => setFilter("REJECT")}
          className={`p-4 rounded-xl border transition-all ${
            filter === "REJECT"
              ? "bg-red-500/20 border-red-500"
              : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
          }`}
        >
          <p className="text-slate-500 text-sm">Rejected</p>
          <p className="text-2xl font-bold text-red-400">{rejectedCount}</p>
        </button>
      </div>

      

      {/* Pending Alert */}
      {filter === "ALL" && pendingCount > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center gap-4">
          <AlertCircle className="text-amber-400 flex-shrink-0" size={24} />
          <div className="flex-1">
            <p className="text-white font-semibold">
              {pendingCount} application{pendingCount > 1 ? "s" : ""} pending
              review
            </p>
            <p className="text-slate-400 text-sm">
              Review documents and approve or reject technicians
            </p>
          </div>
          <button
            onClick={() => setFilter("PENDING")}
            className="px-4 py-2 bg-amber-500 text-slate-900 rounded-lg font-semibold hover:bg-amber-400 transition-colors"
          >
            Review Now
          </button>
        </div>
      )}


      {/* Search Bar */}
<div className="relative">
  <input
    type="text"
    placeholder="Search technician, skill or status..."
    value={localSearch}
  onChange={(e) => setLocalSearch(e.target.value)}
    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 pl-10 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
  />
  <Search
    size={18}
    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
  />
</div>

      {/* Technicians Grid (Card View for Pending) */}
      {filter === "PENDING" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredUsers.map((tech) => (
            <div
              key={tech.userId}
              className="bg-slate-900/50 backdrop-blur-xl border border-amber-500/30 rounded-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-b border-amber-500/20">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl">
                      {tech.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white">
                        {tech.name}
                      </h4>
                      <p className="text-slate-400">@{tech.username}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded text-xs font-bold">
                          PENDING REVIEW
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="p-6 space-y-4">
                {/* Contact */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Mail size={16} />
                    <span className="text-sm truncate">
                      {tech.email || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Phone size={16} />
                    <span className="text-sm">{tech.mobile || "N/A"}</span>
                  </div>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-violet-500/20 text-violet-400 rounded-lg text-sm font-medium">
                    {tech.technician?.skill || "General"}
                  </span>
                  <span className="px-3 py-1 bg-slate-700 text-slate-300 rounded-lg text-sm">
                    {tech.technician?.experience || 0} yrs exp
                  </span>
                  {tech.technician?.emergencyAvailable && (
                    <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-lg text-sm flex items-center gap-1">
                      <Zap size={12} />
                      Emergency
                    </span>
                  )}
                </div>

                {/* Documents Summary */}
                <div className="p-4 bg-slate-800/50 rounded-xl">
                  <p className="text-slate-400 text-xs font-medium mb-3">
                    DOCUMENTS SUBMITTED
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {tech.technician?.aadharDoc && (
                      <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs flex items-center gap-1">
                        <CheckCircle2 size={12} />
                        Aadhar
                      </span>
                    )}
                    {tech.technician?.panDoc && (
                      <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs flex items-center gap-1">
                        <CheckCircle2 size={12} />
                        PAN
                      </span>
                    )}
                    {tech.technician?.bankPassbookDoc && (
                      <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs flex items-center gap-1">
                        <CheckCircle2 size={12} />
                        Bank
                      </span>
                    )}
                    {tech.technician?.experienceCertDoc && (
                      <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs flex items-center gap-1">
                        <CheckCircle2 size={12} />
                        Exp Cert
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => openDetail(tech)}
                    className="flex-1 px-4 py-3 bg-slate-700 text-white rounded-xl font-semibold hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye size={18} />
                    View Details
                  </button>
                  <button
                    onClick={() => onStatusUpdate(tech.userId, "APPROVE")}
                    className="flex-1 px-4 py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={18} />
                    Approve
                  </button>
                  <button
                    onClick={() => onStatusUpdate(tech.userId, "REJECT")}
                    className="px-4 py-3 bg-red-500/20 text-red-400 rounded-xl font-semibold hover:bg-red-500/30 transition-colors"
                  >
                    <XCircle size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredUsers.length === 0 && (
            <div className="col-span-full text-center py-16">
              <CheckCircle2
                size={48}
                className="text-emerald-500 mx-auto mb-4"
              />
              <p className="text-white font-semibold text-lg">All Caught Up!</p>
              <p className="text-slate-500">
                No pending applications to review
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Table View for Other Filters */
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden">
          {/* <div className="overflow-x-auto"> */}
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="w-full">
              {/* <thead className="bg-slate-800/50"> */}
              <thead className="bg-slate-900 sticky top-0 z-10">
                <tr>
                  <th className="text-left p-4 text-slate-400 font-semibold text-sm">
                    Technician
                  </th>
                  <th className="text-left p-4 text-slate-400 font-semibold text-sm">
                    Contact
                  </th>
                  <th className="text-left p-4 text-slate-400 font-semibold text-sm">
                    Skill
                  </th>
                  <th className="text-left p-4 text-slate-400 font-semibold text-sm">
                    Experience
                  </th>
                  <th className="text-left p-4 text-slate-400 font-semibold text-sm">
                    Status
                  </th>
                  <th className="text-left p-4 text-slate-400 font-semibold text-sm">
                    Actions
                  </th>
                  <th className="text-left p-4 text-slate-400 font-semibold text-sm">
  Active/Inactive
</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((tech) => (
                  <tr
                    key={tech.userId}
                    className="border-t border-slate-800 hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center text-white font-bold">
                          {tech.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white font-semibold">
                            {tech.name}
                          </p>
                          <p className="text-slate-500 text-sm">
                            @{tech.username}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-white text-sm">
                        {tech.email || "N/A"}
                      </p>
                      <p className="text-slate-500 text-sm">
                        {tech.mobile || "N/A"}
                      </p>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-violet-500/20 text-violet-400 rounded-lg text-sm font-medium">
                        {tech.technician?.skill || "General"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-white">
                        {tech.technician?.experience || 0} years
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          tech.technician?.status === "ACCEPT"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : tech.technician?.status === "PENDING"
                              ? "bg-amber-500/20 text-amber-400"
                              : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {tech.technician?.status || "PENDING"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openDetail(tech)}
                          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} className="text-slate-400" />
                        </button>
                        {tech.technician?.status === "PENDING" && (
                          <>
                            <button
                              onClick={() =>
                                onStatusUpdate(tech.userId, "APPROVE")
                              }
                              className="p-2 hover:bg-emerald-500/20 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <CheckCircle2
                                size={16}
                                className="text-emerald-400"
                              />
                            </button>
                            <button
                              onClick={() =>
                                onStatusUpdate(tech.userId, "REJECT")
                              }
                              className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <XCircle size={16} className="text-red-400" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>


<td className="p-4 text-center">
  <div className="flex justify-center">
    <button
      // onClick={() => handleToggleActive(tech.userId)}
       onClick={() => handleToggleActive(tech.userId)}
       disabled={tech.technician?.status === "REJECT"}
      // className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 transform hover:scale-105 ${
      //   activeMap[tech.userId] ?? true
      //     ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 hover:shadow-lg"
      //     : "bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:shadow-lg"
      // }`}
      className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 transform hover:scale-105 ${
  tech.technician?.status === "REJECT"
    ? "bg-red-500/20 text-red-400 cursor-not-allowed opacity-60"
    : activeMap[tech.userId] ?? true
    ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 hover:shadow-lg"
    : "bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:shadow-lg"
}`}
    >
      {activeMap[tech.userId] ?? true ? "Active" : "Inactive"}
    </button>
  </div>
</td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      No technicians found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedTech && (
        <TechnicianDetailModal
          tech={selectedTech}
          onClose={() => setShowDetailModal(false)}
          onApprove={() => {
            onStatusUpdate(selectedTech.userId, "APPROVE");
            setShowDetailModal(false);
          }}
          onReject={() => {
            onStatusUpdate(selectedTech.userId, "REJECT");
            setShowDetailModal(false);
          }}
        />
      )}
    </div>
  );
};

// ==================== TECHNICIAN DETAIL MODAL ====================
const TechnicianDetailModal = ({
  tech,
  onClose,
  onApprove,
  onReject,
}: {
  tech: User;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
}) => {
  const t = tech.technician;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl my-8 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl">
              {tech.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{tech.name}</h2>
              <p className="text-slate-400">@{tech.username}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span
              className={`px-4 py-2 rounded-xl text-sm font-bold ${
                t?.status === "ACCEPT"
                  ? "bg-emerald-500/20 text-emerald-400"
                  : t?.status === "PENDING"
                    ? "bg-amber-500/20 text-amber-400"
                    : "bg-red-500/20 text-red-400"
              }`}
            >
              {t?.status || "PENDING"}
            </span>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-xl transition-colors"
            >
              <X size={24} className="text-slate-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Contact & Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 rounded-2xl p-5">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <Mail size={18} className="text-violet-400" />
                Contact Information
              </h3>
              <div className="space-y-3">
                <InfoRow label="Email" value={tech.email} />
                <InfoRow label="Phone" value={tech.mobile} />
                <InfoRow label="Address" value={tech.address} />
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-2xl p-5">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <Award size={18} className="text-emerald-400" />
                Skills & Experience
              </h3>
              <div className="space-y-3">
                <InfoRow label="Primary Skill" value={t?.skill} />
                <InfoRow
                  label="Experience"
                  value={t?.experience ? `${t.experience} years` : "N/A"}
                />
                <InfoRow label="Category" value={t?.techCategory} />
                <InfoRow label="Availability" value={t?.timeDuration} />
                <InfoRow
                  label="Emergency Service"
                  value={t?.emergencyAvailable ? "Yes" : "No"}
                  highlight={t?.emergencyAvailable}
                />
              </div>
            </div>
          </div>

          {/* Identity Documents */}
          <div className="bg-slate-800/50 rounded-2xl p-5">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <CreditCard size={18} className="text-amber-400" />
              Identity Documents
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-slate-400 text-sm mb-2">Aadhar Card</p>
                <p className="text-white font-mono text-lg mb-3">
                  {t?.aadharCardNo || "Not provided"}
                </p>
                {t?.aadharDoc && (
                  <DocumentPreview url={t.aadharDoc} label="Aadhar Document" />
                )}
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-2">PAN Card</p>
                <p className="text-white font-mono text-lg mb-3">
                  {t?.panCardNo || "Not provided"}
                </p>
                {t?.panDoc && (
                  <DocumentPreview url={t.panDoc} label="PAN Document" />
                )}
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div className="bg-slate-800/50 rounded-2xl p-5">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <Building2 size={18} className="text-blue-400" />
              Bank Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <InfoRow label="Bank Name" value={t?.bankName} />
              <InfoRow label="IFSC Code" value={t?.ifscNo} />
              <InfoRow label="Branch" value={t?.branchName} />
            </div>
            {t?.bankPassbookDoc && (
              <DocumentPreview
                url={t.bankPassbookDoc}
                label="Bank Passbook / Cancelled Cheque"
              />
            )}
          </div>

          {/* Experience Certificate */}
          {t?.experienceCertDoc && (
            <div className="bg-slate-800/50 rounded-2xl p-5">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <FileText size={18} className="text-violet-400" />
                Experience Certificate
              </h3>
              <DocumentPreview
                url={t.experienceCertDoc}
                label="Experience Certificate"
              />
            </div>
          )}
        </div>

        {/* Actions */}
        {t?.status === "PENDING" && (
          <div className="p-6 border-t border-slate-800 flex gap-4">
            <button
              onClick={onReject}
              className="flex-1 px-6 py-4 bg-red-500/20 text-red-400 rounded-xl font-bold hover:bg-red-500/30 transition-colors flex items-center justify-center gap-2"
            >
              <XCircle size={20} />
              Reject Application
            </button>
            <button
              onClick={onApprove}
              className="flex-[2] px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={20} />
              Approve Technician
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper Components
const InfoRow = ({
  label,
  value,
  highlight,
}: {
  label: string;
  value?: string | number;
  highlight?: boolean;
}) => (
  <div className="flex justify-between items-center">
    <span className="text-slate-400 text-sm">{label}</span>
    <span
      className={`font-medium ${highlight ? "text-emerald-400" : "text-white"}`}
    >
      {value || "N/A"}
    </span>
  </div>
);

const DocumentPreview = ({ url, label }: { url: string; label: string }) => {
  const isPDF = url.toLowerCase().endsWith(".pdf");

  return (
    <div className="bg-slate-700/50 rounded-xl p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-slate-600 rounded-lg flex items-center justify-center">
          {isPDF ? (
            <FileText size={24} className="text-red-400" />
          ) : (
            <img
              src={url}
              alt={label}
              className="w-12 h-12 object-cover rounded-lg"
            />
          )}
        </div>
        <div>
          <p className="text-white font-medium">{label}</p>
          <p className="text-slate-400 text-xs">
            {isPDF ? "PDF Document" : "Image"}
          </p>
        </div>
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 bg-violet-500/20 text-violet-400 rounded-lg font-medium hover:bg-violet-500/30 transition-colors flex items-center gap-2"
      >
        <ExternalLink size={16} />
        View
      </a>
    </div>
  );
};

// ==================== CLIENTS TAB ====================
const ClientsTab = ({
  users,
  searchQuery,
}: {
  users: User[];
  searchQuery: string;
}) => {
  const [selectedClient, setSelectedClient] = useState<User | null>(null);
  const [showClientModal, setShowClientModal] = useState(false);

  const [localSearch, setLocalSearch] = useState("");

  // const filteredUsers = users.filter(
  //   (u) =>
  //     u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     u.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  // );

const filteredUsers = users.filter((u) => {
  const searchText = (localSearch || "").toLowerCase(); // ✅ FIX

  const matchesSearch =
    u.name?.toLowerCase().includes(searchText) ||
    u.email?.toLowerCase().includes(searchText) ||
    u.mobile?.toLowerCase().includes(searchText) ||
    u.address?.toLowerCase().includes(searchText);

  return matchesSearch;
});

  const openClientDetail = (client: User) => {
    setSelectedClient(client);
    setShowClientModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <p className="text-slate-500 text-sm">Total Clients</p>
          <p className="text-2xl font-bold text-white">{users.length}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <p className="text-slate-500 text-sm">Active This Month</p>
          <p className="text-2xl font-bold text-emerald-400">{users.length}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <p className="text-slate-500 text-sm">New This Week</p>
          <p className="text-2xl font-bold text-violet-400">
            {Math.min(users.length, 3)}
          </p>
        </div>
      </div>

<div className="relative">
  <input
    type="text"
    placeholder="Search client, email, phone or address..."
    value={localSearch} // ✅ MUST BE THIS
    onChange={(e) => setLocalSearch(e.target.value)} // ✅ MUST BE THIS
    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 pl-10 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
  />
  <Search
    size={18}
    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
  />
</div>

      {/* Clients Table */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden">
        {/* <div className="overflow-x-auto"> */}
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          <table className="w-full">
            {/* <thead className="bg-slate-800/50"> */}
            <thead className="bg-slate-900 sticky top-0 z-10">
              <tr>
                <th className="text-left p-4 text-slate-400 font-semibold text-sm">
                  Client
                </th>
                <th className="text-left p-4 text-slate-400 font-semibold text-sm">
                  Email
                </th>
                <th className="text-left p-4 text-slate-400 font-semibold text-sm">
                  Phone
                </th>
                <th className="text-left p-4 text-slate-400 font-semibold text-sm">
                  Address
                </th>
                <th className="text-left p-4 text-slate-400 font-semibold text-sm">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((client) => (
                <tr
                  key={client.userId}
                  className="border-t border-slate-800 hover:bg-slate-800/30 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold">
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-semibold">
                          {client.name}
                        </p>
                        <p className="text-slate-500 text-sm">
                          @{client.username}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-white">{client.email || "N/A"}</td>
                  <td className="p-4 text-white">{client.mobile || "N/A"}</td>
                  <td className="p-4 text-slate-400 max-w-xs truncate">
                    {client.address || "N/A"}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => openClientDetail(client)}
                      className="p-2 hover:bg-slate-800 rounded-lg"
                    >
                      <Eye size={16} className="text-slate-400" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    No clients found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Client Detail Modal */}
      {showClientModal && selectedClient && (
        <ClientDetailModal
          client={selectedClient}
          onClose={() => setShowClientModal(false)}
        />
      )}
    </div>
  );
};



// ==================== CLIENT DETAIL MODAL ====================
const ClientDetailModal = ({
  client,
  onClose,
}: {
  client: User;
  onClose: () => void;
}) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
              {client.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {client.name}
              </h2>
              <p className="text-slate-400">@{client.username}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X size={22} className="text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-slate-800/50 rounded-xl p-4 space-y-3">
            <InfoRow label="Full Name" value={client.name} />
            <InfoRow label="Username" value={client.username} />
            <InfoRow label="Email" value={client.email} />
            <InfoRow label="Phone" value={client.mobile} />
            <InfoRow label="Address" value={client.address} />
            <InfoRow label="Role" value={client.roleName} />
          </div>
        </div>
      </div>
    </div>
  );
};


// ==================== BOOKINGS TAB ====================
const BookingsTab = ({
  bookings,
  technicians,
  onRefresh,
  searchQuery,
}: {
  bookings: Booking[];
  technicians: User[];
  onRefresh: () => void;
  searchQuery: string;
}) => {
  const [filter, setFilter] = useState<
    "ALL" | "NEW" | "PENDING" | "IN_PROGRESS" | "COMPLETED"
  >("ALL");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [localSearch, setLocalSearch] = useState("");


  const [showViewModal, setShowViewModal] = useState(false);
  const [viewBooking, setViewBooking] = useState<Booking | null>(null);

  // Work Status mapping based on backend:
  // 0 = Rejected (technician rejected) or Unassigned awaiting action
  // 1 = Pending/Accepted (technician accepted, work in progress)
  // 3 = Completed
  const WORK_STATUS: Record<
    number,
    { label: string; color: string; bg: string }
  > = {
    0: { label: "Unassigned", color: "text-red-400", bg: "bg-red-500/20" },
    1: { label: "Accepted", color: "text-amber-400", bg: "bg-amber-500/20" },
    2: {
      label: "In Progress",
      color: "text-violet-400",
      bg: "bg-violet-500/20",
    },
    3: {
      label: "Completed",
      color: "text-emerald-400",
      bg: "bg-emerald-500/20",
    },
  };

  // const filteredBookings = bookings.filter((b) => {
  //   const matchesSearch =
  //     b.order_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     b.User?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     b.subservice?.name?.toLowerCase().includes(searchQuery.toLowerCase());

  //   if (filter === "ALL") return matchesSearch;
  //   // "NEW" filter now shows all unassigned bookings (technician_allocated: false)
  //   if (filter === "NEW") return matchesSearch && !b.technician_allocated;
  //   if (filter === "PENDING")
  //     return matchesSearch && b.technician_allocated && b.work_status === 1;
  //   if (filter === "IN_PROGRESS") return matchesSearch && b.work_status === 2;
  //   if (filter === "COMPLETED") return matchesSearch && b.work_status === 3;
  //   return matchesSearch;
  // });



  const filteredBookings = bookings
  .filter((b) => {
    // const searchText = searchQuery.toLowerCase();
    const searchText = localSearch.toLowerCase();

    const matchesSearch =
      b.order_id?.toLowerCase().includes(searchText) ||
      b.User?.name?.toLowerCase().includes(searchText) ||
      b.subservice?.name?.toLowerCase().includes(searchText) ||
      b.service?.name?.toLowerCase().includes(searchText); // ✅ added service search

    if (filter === "ALL") return matchesSearch;
    if (filter === "NEW") return matchesSearch && !b.technician_allocated;
    if (filter === "PENDING")
      return matchesSearch && b.technician_allocated && b.work_status === 1;
    if (filter === "IN_PROGRESS")
      return matchesSearch && b.work_status === 2;
    if (filter === "COMPLETED")
      return matchesSearch && b.work_status === 3;

    return matchesSearch;
  })
  .slice(0, 15); // ✅ LIMIT TO 15 BOOKINGS

  const stats = {
    total: bookings.length,
    // Unassigned bookings that need technician assignment
    new: bookings.filter((b) => !b.technician_allocated).length,
    // Assigned and accepted by technician
    pending: bookings.filter(
      (b) => b.technician_allocated && b.work_status === 1,
    ).length,
    inProgress: bookings.filter((b) => b.work_status === 2).length,
    completed: bookings.filter((b) => b.work_status === 3).length,
  };

  // Assign technician using existing Swagger API: POST /api/service-on-booking/accept/:order_id
  // Admin can assign a technician by calling the accept API with the target technician's ID
  const handleAssignTechnician = async (technicianId: number) => {
    if (!selectedBooking) return;

    setAssigning(true);
    try {
      const token = sessionStorage.getItem("accessToken");
      // Use the accept API with opinion=1 (Accept) to assign the technician
      const res = await fetch(
        `${API_BASE}/api/service-on-booking/accept/${selectedBooking.order_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            technician_id: technicianId,
            opinion: 1, // 1 = Accept (assigns and accepts the job)
          }),
        },
      );

      if (res.ok) {
        setShowAssignModal(false);
        setSelectedBooking(null);
        onRefresh();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to assign technician");
      }
    } catch (error) {
      console.error("Error assigning technician:", error);
      alert("Failed to assign technician");
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { id: "ALL", label: "Total", count: stats.total, color: "violet" },
          { id: "NEW", label: "Unassigned", count: stats.new, color: "red" },
          {
            id: "PENDING",
            label: "Assigned",
            count: stats.pending,
            color: "amber",
          },
          {
            id: "IN_PROGRESS",
            label: "In Progress",
            count: stats.inProgress,
            color: "violet",
          },
          {
            id: "COMPLETED",
            label: "Completed",
            count: stats.completed,
            color: "emerald",
          },
        ].map((stat) => (
          <button
            key={stat.id}
            onClick={() => setFilter(stat.id as any)}
            className={`p-4 rounded-xl border transition-all ${
              filter === stat.id
                ? `bg-${stat.color}-500/20 border-${stat.color}-500`
                : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
            }`}
          >
            <p className="text-slate-500 text-sm">{stat.label}</p>
            <p
              className={`text-2xl font-bold ${filter === stat.id ? `text-${stat.color}-400` : "text-white"}`}
            >
              {stat.count}
            </p>
          </button>
        ))}
      </div>

      {/* Unassigned Bookings Alert */}
      {stats.new > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-4">
          <AlertCircle className="text-red-400 flex-shrink-0" size={24} />
          <div className="flex-1">
            <p className="text-white font-semibold">
              {stats.new} booking{stats.new > 1 ? "s" : ""} need technician
              assignment
            </p>
            <p className="text-slate-400 text-sm">
              These bookings are either new or were rejected by technicians
            </p>
          </div>
          <button
            onClick={() => setFilter("NEW")}
            className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-400 transition-colors"
          >
            View Unassigned
          </button>
        </div>
      )}

      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
  <input
    type="text"
    placeholder="Search by Order ID (BD177...), Customer, Service (Switch Work)..."
    value={localSearch}
   onChange={(e) => setLocalSearch(e.target.value)}
    className="w-full bg-transparent text-white placeholder:text-slate-500 outline-none"
  />
</div>

      {/* Bookings Table */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h3 className="text-xl font-bold text-white">All Bookings</h3>
        </div>
        {/* <div className="overflow-x-auto"> */}
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          <table className="w-full">
            {/* <thead className="bg-slate-800/50"> */}
            <thead className="bg-slate-900 sticky top-0 z-20">
              <tr>
                <th className="text-left p-4 text-slate-400 font-semibold text-sm">
                  Order ID
                </th>
                <th className="text-left p-4 text-slate-400 font-semibold text-sm">
                  Customer
                </th>
                <th className="text-left p-4 text-slate-400 font-semibold text-sm">
                  Service
                </th>
                <th className="text-left p-4 text-slate-400 font-semibold text-sm">
                  Date & Time
                </th>
                <th className="text-left p-4 text-slate-400 font-semibold text-sm">
                  Amount
                </th>
                <th className="text-left p-4 text-slate-400 font-semibold text-sm">
                  Status
                </th>
                <th className="text-left p-4 text-slate-400 font-semibold text-sm">
                  Technician
                </th>
                <th className="text-left p-4 text-slate-400 font-semibold text-sm">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => {
                const status =
                  WORK_STATUS[booking.work_status] || WORK_STATUS[0];
                return (
                  <tr
                    key={booking.id}
                    className="border-t border-slate-800 hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="p-4">
                      <span className="text-violet-400 font-mono font-bold">
                        {booking.order_id}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="text-white font-semibold">
                        {booking.User?.name || "N/A"}
                      </p>
                      <p className="text-slate-500 text-sm">
                        {booking.User?.mobile || ""}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="text-white">
                        {booking.subservice?.name || booking.subservice_code}
                      </p>
                      <p className="text-slate-500 text-sm">
                        {booking.service?.name || booking.service_code}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="text-white">
                        {new Date(booking.date).toLocaleDateString()}
                      </p>
                      <p className="text-slate-500 text-sm">
                        {booking.time_slot}
                      </p>
                    </td>
                    <td className="p-4">
                      <span className="text-emerald-400 font-bold">
                        ₹{booking.total_price}
                      </span>
                    </td>
                    <td className="p-4">
                      {booking.technician_allocated ? (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${status.bg} ${status.color}`}
                        >
                          {status.label}
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400">
                          Unassigned
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      {booking.technician_allocated && booking.technician ? (
                        <p className="text-white font-medium">
                          {booking.technician.name || "Assigned"}
                        </p>
                      ) : (
                        <span className="text-red-400 text-sm font-medium">
                          Needs Assignment
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {/* Show Assign button for any unassigned booking */}
                        {!booking.technician_allocated && (
                          <button
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowAssignModal(true);
                            }}
                            className="px-3 py-1.5 bg-violet-500 text-white rounded-lg text-sm font-semibold hover:bg-violet-400 transition-colors"
                          >
                            Assign
                          </button>
                        )}
                        {/* <button className="p-2 hover:bg-slate-800 rounded-lg">
                          <Eye size={16} className="text-slate-400" />
                        </button> */}

                        <button
  onClick={() => {
    setViewBooking(booking);
    setShowViewModal(true);
  }}
  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
>
  <Eye size={16} className="text-slate-400" />
</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    No bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Technician Modal */}
      {showAssignModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 w-full max-w-lg mx-4 animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-bold text-white mb-2">
              Assign Technician
            </h3>
            <p className="text-slate-400 mb-2">
              Booking:{" "}
              <span className="text-violet-400 font-mono">
                {selectedBooking.order_id}
              </span>
            </p>
            <p className="text-slate-500 text-sm mb-6">
              Service:{" "}
              <span className="text-emerald-400">
                {selectedBooking.service?.name || selectedBooking.service_code}
              </span>
            </p>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {(() => {
                // Filter technicians by the booking's service category
                // Use smart category matching function (supports both codes and names)
                const serviceName = selectedBooking.service?.name || "";
                const serviceCode =
                  selectedBooking.service_code ||
                  selectedBooking.service?.service_code ||
                  "";

                const matchingTechnicians = technicians.filter((tech) => {
                  const techCategory = tech.technician?.techCategory || "";
                  // Use smart matching that handles codes (A10002) and names (Electrical/Electrician)
                  return categoryMatchesService(
                    techCategory,
                    serviceName,
                    serviceCode,
                  );
                });

                // If no matching technicians, show ALL available technicians
                const displayTechnicians =
                  matchingTechnicians.length > 0
                    ? matchingTechnicians
                    : technicians;

                if (displayTechnicians.length === 0) {
                  return (
                    <div className="text-center py-8">
                      <p className="text-slate-500 mb-2">
                        No approved technicians available
                      </p>
                      <p className="text-slate-600 text-sm">
                        Please approve technicians in the Technicians tab first
                      </p>
                    </div>
                  );
                }

                return displayTechnicians.map((tech) => {
                  const techCategory = tech.technician?.techCategory || "";
                  const isMatch = categoryMatchesService(
                    techCategory,
                    serviceName,
                    serviceCode,
                  );

                  return (
                    <button
                      key={tech.userId}
                      onClick={() => handleAssignTechnician(tech.userId)}
                      disabled={assigning}
                      className={`w-full p-4 hover:bg-slate-800 border rounded-xl flex items-center gap-4 transition-colors disabled:opacity-50 ${
                        isMatch
                          ? "bg-emerald-500/10 border-emerald-500/30"
                          : "bg-slate-800/50 border-slate-700"
                      }`}
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center text-white font-bold">
                        {tech.name.charAt(0)}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <p className="text-white font-semibold">
                            {tech.name}
                          </p>
                          {isMatch && (
                            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded">
                              Best Match
                            </span>
                          )}
                        </div>
                        <p className="text-slate-500 text-sm">
                          {tech.technician?.techCategory || "General"} •{" "}
                          {tech.technician?.experience || 0} yrs exp
                        </p>
                      </div>
                      {tech.technician?.rating && (
                        <div className="flex items-center gap-1 text-amber-400">
                          <Star size={14} className="fill-amber-400" />
                          <span className="text-sm font-bold">
                            {tech.technician.rating.avg_rating}
                          </span>
                        </div>
                      )}
                    </button>
                  );
                });
              })()}
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedBooking(null);
                }}
                className="flex-1 py-3 border border-slate-700 rounded-xl text-white font-semibold hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}






      {/* View Booking Modal */}
{showViewModal && viewBooking && (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl mx-4 animate-in zoom-in-95 duration-200">

      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-800">
        <h3 className="text-xl font-bold text-white">
          Booking Details
        </h3>

        <button
          onClick={() => {
            setShowViewModal(false);
            setViewBooking(null);
          }}
          className="text-slate-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <div className="p-6 space-y-6">

        {/* Order Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-slate-500 text-sm">Order ID</p>
            <p className="text-violet-400 font-mono font-bold">
              {viewBooking.order_id}
            </p>
          </div>

          <div>
            <p className="text-slate-500 text-sm">Status</p>
            <p className="text-white">
              {WORK_STATUS[viewBooking.work_status]?.label || "Unassigned"}
            </p>
          </div>
        </div>

        {/* Customer */}
        <div className="bg-slate-800/50 rounded-xl p-4">
          <p className="text-slate-400 text-sm mb-2">Customer</p>
          <p className="text-white font-semibold">
            {viewBooking.User?.name}
          </p>
          <p className="text-slate-500 text-sm">
            {viewBooking.User?.mobile}
          </p>
        </div>

        {/* ✅ Service (with Quantity) */}
        <div className="bg-slate-800/50 rounded-xl p-4">
          <div className="flex items-start justify-between gap-3">

            {/* Left: Service Info */}
            <div>
              <p className="text-slate-400 text-sm mb-2">Service</p>

              <p className="text-white">
                {viewBooking.subservice?.name || viewBooking.subservice_code}
              </p>

              <p className="text-slate-500 text-sm">
                {viewBooking.service?.name || viewBooking.service_code}
              </p>
            </div>

            {/* Right: Quantity */}
            <div className="bg-violet-500/20 border border-violet-500/40 text-violet-300 px-3 py-1 rounded-lg text-xs font-bold">
              Qty: {viewBooking.quantity ?? 1}
            </div>

          </div>
        </div>

        {/* Schedule */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 rounded-xl p-4">
            <p className="text-slate-400 text-sm">Date</p>
            <p className="text-white">
              {new Date(viewBooking.date).toLocaleDateString()}
            </p>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-4">
            <p className="text-slate-400 text-sm">Time Slot</p>
            <p className="text-white">{viewBooking.time_slot}</p>
          </div>
        </div>

        {/* Technician */}
        <div className="bg-slate-800/50 rounded-xl p-4">
          <p className="text-slate-400 text-sm mb-2">Technician</p>

          {viewBooking.technician ? (
            <p className="text-white font-semibold">
              {viewBooking.technician.name}
            </p>
          ) : (
            <p className="text-red-400">Not Assigned</p>
          )}
        </div>

        {/* Price */}
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex justify-between items-center">
          <p className="text-slate-400">Total Price</p>
          <p className="text-emerald-400 text-xl font-bold">
            ₹{viewBooking.total_price}
          </p>
        </div>

      </div>

      {/* Footer */}
      <div className="p-6 border-t border-slate-800 flex justify-end">
        <button
          onClick={() => {
            setShowViewModal(false);
            setViewBooking(null);
          }}
          className="px-6 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-700"
        >
          Close
        </button>
      </div>

    </div>
  </div>
)}
    </div>
  );
};

// ==================== SETTINGS TAB ====================
// const SettingsTab = () => {
//   const [showPasswordModal, setShowPasswordModal] = useState(false);
//   const [step, setStep] = useState(1);
//   const [cpLoading, setCpLoading] = useState(false);

//   const [cpData, setCpData] = useState({
//     current_password: "",
//     otp: "",
//     token: "",
//     new_password: "",
//     confirm_password: "",
//   });

//   const [showCP, setShowCP] = useState({
//     current: false,
//     new: false,
//     confirm: false,
//   });

//   const currentRef = useRef<HTMLInputElement>(null);
//   const newRef = useRef<HTMLInputElement>(null);
//   const confirmRef = useRef<HTMLInputElement>(null);

//   const user = JSON.parse(sessionStorage.getItem("user") || "{}");

//   // ================= EMERGENCY STATE =================
//   const [emergencyRules, setEmergencyRules] = useState<any[]>([]);
//   const [showEmergencyModal, setShowEmergencyModal] = useState(false);
//   const [editingRule, setEditingRule] = useState<any>(null);
//   const [emergencyLoading, setEmergencyLoading] = useState(false);

//   const [emergencyForm, setEmergencyForm] = useState({
//     urgency_level: "",
//     label: "",
//     percentage_markup: "",
//     multiplier: "",
//     is_active: true,
//   });

//   // ================= FETCH RULES =================
//   const fetchEmergencyRules = async () => {
//     try {
//       const res = await fetch(`${API_BASE}/api/emergency-pricing`);
//       const data = await res.json();
//       setEmergencyRules(data || []);
//     } catch {
//       console.error("Fetch failed");
//     }
//   };

//   useEffect(() => {
//     fetchEmergencyRules();
//   }, []);

//   // ================= PASSWORD APIs =================
//   const handleRequestOtp = async () => {
//     if (!cpData.current_password) return alert("Enter current password");

//     setCpLoading(true);

//     try {
//       const res = await fetch(`${API_BASE}/api/change-password/request-otp`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ username: user.username, current_password: cpData.current_password }),
//       });

//       const data = await res.json();
//       setCpLoading(false);

//       if (!res.ok) return alert(data.message);

//       alert("OTP sent");
//       setStep(2);
//     } catch {
//       setCpLoading(false);
//       alert("Error");
//     }
//   };

//   const handleVerifyOtp = async () => {
//     if (!cpData.otp) return alert("Enter OTP");

//     setCpLoading(true);

//     try {
//       const res = await fetch(`${API_BASE}/api/change-password/verify-otp`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ username: user.username, otp: cpData.otp }),
//       });

//       const data = await res.json();
//       setCpLoading(false);

//       if (!res.ok) return alert(data.message);

//       setCpData(prev => ({ ...prev, token: data.token }));
//       setStep(3);
//     } catch {
//       setCpLoading(false);
//       alert("Verification failed");
//     }
//   };

//   const handleChangePassword = async () => {
//     if (cpData.new_password !== cpData.confirm_password)
//       return alert("Passwords mismatch");

//     setCpLoading(true);

//     try {
//       const res = await fetch(`${API_BASE}/api/change-password`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           username: user.username,
//           token: cpData.token,
//           new_password: cpData.new_password,
//           confirm_password: cpData.confirm_password,
//         }),
//       });

//       const data = await res.json();
//       setCpLoading(false);

//       if (!res.ok) return alert(data.message);

//       alert("Password updated");

//       setShowPasswordModal(false);
//       setStep(1);
//       setCpData({
//         current_password: "",
//         otp: "",
//         token: "",
//         new_password: "",
//         confirm_password: "",
//       });
//     } catch {
//       setCpLoading(false);
//       alert("Error");
//     }
//   };

//   // ================= EMERGENCY CRUD =================
// const handleSaveEmergency = async () => {
//   if (!emergencyForm.urgency_level || !emergencyForm.label) {
//     return alert("Fill required fields");
//   }

//   setEmergencyLoading(true);

//   try {
//     const url = editingRule
//       ? `${API_BASE}/api/emergency-pricing/${editingRule.id}`
//       : `${API_BASE}/api/emergency-pricing`;

//     const method = editingRule ? "PUT" : "POST";

//     const payload = {
//       urgency_level: emergencyForm.urgency_level,
//       label: emergencyForm.label,

//       // ✅ FIXED VALUES
//       percentage_markup: 40,
//       multiplier: 1.4,
//       is_active: true,
//     };

//     const res = await fetch(url, {
//       method,
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });

//     const data = await res.json();
//     setEmergencyLoading(false);

//     if (!res.ok) return alert(data.message);

//     alert(editingRule ? "Updated" : "Created");

//     setShowEmergencyModal(false);
//     setEditingRule(null);

//     setEmergencyForm({
//       urgency_level: "",
//       label: "",
//     });

//     fetchEmergencyRules();
//   } catch {
//     setEmergencyLoading(false);
//     alert("Error saving");
//   }
// };

//   const handleDeleteEmergency = async (id: number) => {
//     if (!confirm("Delete rule?")) return;

//     await fetch(`${API_BASE}/api/emergency-pricing/${id}`, {
//       method: "DELETE",
//     });

//     fetchEmergencyRules();
//   };

//   const handleEditEmergency = (rule: any) => {
//     setEditingRule(rule);
//     setEmergencyForm(rule);
//     setShowEmergencyModal(true);
//   };

//   // ================= UI =================

//   return (
//   <div className="space-y-6">

//       {/* SETTINGS */}
//       <div className="bg-slate-900 border rounded-2xl p-6">
//         <h3 className="text-white text-xl mb-4 font-bold">Settings</h3>

//         <button
//           onClick={() => setShowPasswordModal(true)}
//           className="bg-indigo-600 px-4 py-2 rounded text-white"
//         >
//           Change Password
//         </button>
//       </div>

//       {/* EMERGENCY RULES */}
//       <div className="bg-slate-900 border rounded-2xl p-6">
//         <div className="flex justify-between mb-4">
//           <h3 className="text-white text-xl font-bold">
//             Emergency Pricing
//           </h3>

//           <button
//             onClick={() => {
//               setEditingRule(null);
//               setShowEmergencyModal(true);
//             }}
//             className="bg-indigo-600 px-4 py-2 text-white rounded"
//           >
//             + Add
//           </button>
//         </div>

//         {emergencyRules.map(rule => (
//           <div key={rule.id} className="bg-slate-800 p-4 rounded mb-2 flex justify-between">
//             <div>
//               <p className="text-white">{rule.label}</p>
//               <p className="text-slate-400 text-sm">
//                 {rule.percentage_markup}% | x{rule.multiplier}
//               </p>
//             </div>

//             <div className="flex gap-2">
//               <button onClick={() => handleEditEmergency(rule)} className="bg-yellow-500 px-3 py-1 rounded text-white">Edit</button>
//               <button onClick={() => handleDeleteEmergency(rule.id)} className="bg-red-500 px-3 py-1 rounded text-white">Delete</button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* EMERGENCY MODAL */}
// {showEmergencyModal && (
//   <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
//     <div className="bg-slate-900 p-6 rounded-xl w-full max-w-md relative">

//       {/* ❌ CLOSE */}
//       <button
//         onClick={() => {
//           setShowEmergencyModal(false);
//           setEditingRule(null);
//         }}
//         className="absolute top-4 right-4 text-slate-400 hover:text-white"
//       >
//         <X size={20} />
//       </button>

//       <h3 className="text-white mb-4 font-bold text-lg">
//         {editingRule ? "Edit Rule" : "Add Rule"}
//       </h3>

//       <div className="space-y-4">

//         {/* URGENCY LEVEL */}
//         <input
//           placeholder="Urgency Level (e.g. super_emergency)"
//           className="w-full p-3 bg-slate-800 text-white rounded"
//           value={emergencyForm.urgency_level}
//           onChange={(e) =>
//             setEmergencyForm(prev => ({
//               ...prev,
//               urgency_level: e.target.value
//             }))
//           }
//         />

//         {/* LABEL */}
//         <input
//           placeholder="Label (e.g. Super Emergency 30–45 mins)"
//           className="w-full p-3 bg-slate-800 text-white rounded"
//           value={emergencyForm.label}
//           onChange={(e) =>
//             setEmergencyForm(prev => ({
//               ...prev,
//               label: e.target.value
//             }))
//           }
//         />

//         {/* ACTION BUTTONS */}
//         <div className="flex gap-3 pt-2">
//           <button
//             onClick={handleSaveEmergency}
//             className="flex-1 bg-green-600 py-2 rounded text-white"
//           >
//             {emergencyLoading ? "Saving..." : "Save"}
//           </button>

//           <button
//             onClick={() => {
//               setShowEmergencyModal(false);
//               setEditingRule(null);
//             }}
//             className="flex-1 bg-slate-700 py-2 rounded text-white"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   </div>
// )}

//       {/* PASSWORD MODAL (UNCHANGED LOGIC) */}
//  {showPasswordModal && (
//   <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
    
//     <div className="bg-slate-900 p-8 rounded-xl w-full max-w-lg relative shadow-xl">

//       {/* CLOSE BUTTON */}
//       <button
//         onClick={() => setShowPasswordModal(false)}
//         className="absolute top-5 right-5 text-slate-400 hover:text-white transition"
//       >
//         <X size={22} />
//       </button>

//       {/* TITLE */}
//       <h2 className="text-white text-xl font-semibold mb-6">
//         Change Password
//       </h2>

//       {/* STEP 1 */}
//       {step === 1 && (
//         <>
//           <div className="relative mb-4">
//             <input
//               ref={currentRef}
//               type={showCP.current ? "text" : "password"}
//               placeholder="Current Password"
//               value={cpData.current_password}
//               onChange={(e) =>
//                 setCpData((prev) => ({
//                   ...prev,
//                   current_password: e.target.value,
//                 }))
//               }
//               className="w-full p-3 bg-slate-800 text-white rounded pr-10"
//             />

//             <button
//               type="button"
//               onClick={() => {
//                 setShowCP((prev) => ({ ...prev, current: !prev.current }));
//                 setTimeout(() => currentRef.current?.focus(), 0);
//               }}
//               className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
//             >
//               {showCP.current ? <Eye size={18} /> : <EyeOff size={18} />}
//             </button>
//           </div>

//           <button
//             onClick={handleRequestOtp}
//             className="w-full bg-indigo-600 py-3 rounded text-white hover:bg-indigo-500 transition"
//           >
//             Send OTP
//           </button>
//         </>
//       )}

//       {/* STEP 2 */}
//       {step === 2 && (
//         <>
//           <input
//             placeholder="Enter OTP"
//             value={cpData.otp}
//             onChange={(e) =>
//               setCpData((prev) => ({ ...prev, otp: e.target.value }))
//             }
//             className="w-full p-3 bg-slate-800 text-white rounded mb-4"
//           />

//           <button
//             onClick={handleVerifyOtp}
//             className="w-full bg-indigo-600 py-3 rounded text-white hover:bg-indigo-500 transition"
//           >
//             Verify OTP
//           </button>
//         </>
//       )}

//       {/* STEP 3 */}
//       {step === 3 && (
//         <>
//           <div className="relative mb-4">
//             <input
//               ref={newRef}
//               type={showCP.new ? "text" : "password"}
//               placeholder="New Password"
//               value={cpData.new_password}
//               onChange={(e) =>
//                 setCpData((prev) => ({
//                   ...prev,
//                   new_password: e.target.value,
//                 }))
//               }
//               className="w-full p-3 bg-slate-800 text-white rounded pr-10"
//             />

//             <button
//               type="button"
//               onClick={() => {
//                 setShowCP((prev) => ({ ...prev, new: !prev.new }));
//                 setTimeout(() => newRef.current?.focus(), 0);
//               }}
//               className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
//             >
//               {showCP.new ? <Eye size={18} /> : <EyeOff size={18} />}
//             </button>
//           </div>

//           <div className="relative mb-4">
//             <input
//               ref={confirmRef}
//               type={showCP.confirm ? "text" : "password"}
//               placeholder="Confirm Password"
//               value={cpData.confirm_password}
//               onChange={(e) =>
//                 setCpData((prev) => ({
//                   ...prev,
//                   confirm_password: e.target.value,
//                 }))
//               }
//               className="w-full p-3 bg-slate-800 text-white rounded pr-10"
//             />

//             <button
//               type="button"
//               onClick={() => {
//                 setShowCP((prev) => ({ ...prev, confirm: !prev.confirm }));
//                 setTimeout(() => confirmRef.current?.focus(), 0);
//               }}
//               className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
//             >
//               {showCP.confirm ? <Eye size={18} /> : <EyeOff size={18} />}
//             </button>
//           </div>

//           <button
//             onClick={handleChangePassword}
//             className="w-full bg-green-600 py-3 rounded text-white hover:bg-green-500 transition"
//           >
//             Change Password
//           </button>
//         </>
//       )}
//     </div>
//   </div>
// )}

//     </div>
//   );
// };




// ==================== SETTINGS TAB ====================
const SettingsTab = () => {

  const user = JSON.parse(sessionStorage.getItem("user") || "{}");

  // ================= ADMIN PROFILE =================
  const [profile, setProfile] = useState<any>(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    profileImage: null as File | null,
  });

  // ================= PASSWORD STATES =================
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [step, setStep] = useState(1);
  const [cpLoading, setCpLoading] = useState(false);

  const [cpData, setCpData] = useState({
    current_password: "",
    otp: "",
    token: "",
    new_password: "",
    confirm_password: "",
  });

  const [showCP, setShowCP] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const currentRef = useRef<HTMLInputElement>(null);
  const newRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);

  // ================= EMERGENCY STATE =================
  const [emergencyRules, setEmergencyRules] = useState<any[]>([]);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [editingRule, setEditingRule] = useState<any>(null);
  const [emergencyLoading, setEmergencyLoading] = useState(false);

  const [emergencyForm, setEmergencyForm] = useState({
    urgency_level: "",
    label: "",
  });

  // ================= FETCH ADMIN PROFILE =================
  const fetchAdminProfile = async () => {
    try {

      const res = await fetch(`${API_BASE}/api/auth/users/${user.id}`);
      const data = await res.json();

      if (!res.ok) return;

      const u = data.user;

      setProfile(u);

      setProfileForm({
        name: u.name || "",
        email: u.email || "",
        mobile: u.mobile || "",
        address: u.address || "",
        profileImage: null,
      });

    } catch {
      console.error("Profile fetch failed");
    }
  };

  // ================= UPDATE ADMIN PROFILE =================
  const handleUpdateProfile = async () => {

    const formData = new FormData();

    formData.append("userId", user.id);
    formData.append("name", profileForm.name);
    formData.append("email", profileForm.email);
    formData.append("mobile", profileForm.mobile);
    formData.append("address", profileForm.address);

    if (profileForm.profileImage) {
      formData.append("profileImage", profileForm.profileImage);
    }

    setProfileLoading(true);

    try {

      const res = await fetch(`${API_BASE}/api/auth/admin/profile`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();

      setProfileLoading(false);

      if (!res.ok) return alert(data.message);

      alert("Profile updated");

      sessionStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          name: profileForm.name,
          email: profileForm.email,
          mobile: profileForm.mobile,
          address: profileForm.address,
        })
      );

      setEditingProfile(false);
      fetchAdminProfile();

    } catch {
      setProfileLoading(false);
      alert("Update failed");
    }
  };





  const handleCancelEdit = () => {
  if (!profile) return;

  setProfileForm({
    name: profile.name || "",
    email: profile.email || "",
    mobile: profile.mobile || "",
    address: profile.address || "",
    profileImage: null,
  });

  setEditingProfile(false);
};

  // ================= FETCH EMERGENCY RULES =================
  const fetchEmergencyRules = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/emergency-pricing`);
      const data = await res.json();
      setEmergencyRules(data || []);
    } catch {
      console.error("Fetch failed");
    }
  };

  useEffect(() => {
    fetchEmergencyRules();
    fetchAdminProfile();
  }, []);

  // ================= PASSWORD APIs =================
  const handleRequestOtp = async () => {

    if (!cpData.current_password) return alert("Enter current password");

    setCpLoading(true);

    try {

      const res = await fetch(`${API_BASE}/api/change-password/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user.username,
          current_password: cpData.current_password,
        }),
      });

      const data = await res.json();
      setCpLoading(false);

      if (!res.ok) return alert(data.message);

      alert("OTP sent");
      setStep(2);

    } catch {
      setCpLoading(false);
      alert("Error");
    }
  };

  const handleVerifyOtp = async () => {

    if (!cpData.otp) return alert("Enter OTP");

    setCpLoading(true);

    try {

      const res = await fetch(`${API_BASE}/api/change-password/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user.username,
          otp: cpData.otp,
        }),
      });

      const data = await res.json();
      setCpLoading(false);

      if (!res.ok) return alert(data.message);

      setCpData(prev => ({ ...prev, token: data.token }));
      setStep(3);

    } catch {
      setCpLoading(false);
      alert("Verification failed");
    }
  };

  const handleChangePassword = async () => {

    if (cpData.new_password !== cpData.confirm_password)
      return alert("Passwords mismatch");

    setCpLoading(true);

    try {

      const res = await fetch(`${API_BASE}/api/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user.username,
          token: cpData.token,
          new_password: cpData.new_password,
          confirm_password: cpData.confirm_password,
        }),
      });

      const data = await res.json();
      setCpLoading(false);

      if (!res.ok) return alert(data.message);

      alert("Password updated");

      setShowPasswordModal(false);
      setStep(1);

      setCpData({
        current_password: "",
        otp: "",
        token: "",
        new_password: "",
        confirm_password: "",
      });

    } catch {
      setCpLoading(false);
      alert("Error");
    }
  };

  // ================= EMERGENCY CRUD =================
  const handleSaveEmergency = async () => {

    if (!emergencyForm.urgency_level || !emergencyForm.label)
      return alert("Fill required fields");

    setEmergencyLoading(true);

    try {

      const url = editingRule
        ? `${API_BASE}/api/emergency-pricing/${editingRule.id}`
        : `${API_BASE}/api/emergency-pricing`;

      const method = editingRule ? "PUT" : "POST";

      const payload = {
        urgency_level: emergencyForm.urgency_level,
        label: emergencyForm.label,
        percentage_markup: 40,
        multiplier: 1.4,
        is_active: true,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setEmergencyLoading(false);

      if (!res.ok) return alert(data.message);

      alert(editingRule ? "Updated" : "Created");

      setShowEmergencyModal(false);
      setEditingRule(null);

      setEmergencyForm({
        urgency_level: "",
        label: "",
      });

      fetchEmergencyRules();

    } catch {
      setEmergencyLoading(false);
      alert("Error saving");
    }
  };

  const handleDeleteEmergency = async (id: number) => {
    if (!confirm("Delete rule?")) return;

    await fetch(`${API_BASE}/api/emergency-pricing/${id}`, {
      method: "DELETE",
    });

    fetchEmergencyRules();
  };

  const handleEditEmergency = (rule: any) => {
    setEditingRule(rule);
    setEmergencyForm(rule);
    setShowEmergencyModal(true);
  };

  // ================= UI =================
  return (

    <div className="space-y-6">

      {/* ================= ADMIN PROFILE ================= */}
      <div className="bg-slate-900 border rounded-2xl p-6">

        <div className="flex justify-between items-center mb-6">

          <h3 className="text-white text-xl font-bold">
            Admin Profile
          </h3>

        {!editingProfile ? (

  <button
    onClick={() => setEditingProfile(true)}
    className="bg-indigo-600 px-4 py-2 rounded text-white"
  >
    Edit
  </button>

) : (

  <div className="flex gap-3">

    <button
      onClick={handleUpdateProfile}
      className="bg-green-600 px-4 py-2 rounded text-white"
    >
      {profileLoading ? "Updating..." : "Save"}
    </button>

    <button
      onClick={handleCancelEdit}
      className="bg-gray-600 px-4 py-2 rounded text-white"
    >
      Cancel
    </button>

  </div>

)}

        </div>

        {profile && (

          <div className="grid md:grid-cols-2 gap-6">

            {/* PROFILE IMAGE */}
            <div className="flex flex-col items-center">

              <img
                src={
                  profileForm.profileImage
                    ? URL.createObjectURL(profileForm.profileImage)
                    : profile.profileImage
                }
                className="w-28 h-28 rounded-full object-cover mb-3 border"
              />

              {editingProfile && (
                <input
                  type="file"
                  onChange={(e) =>
                    setProfileForm(prev => ({
                      ...prev,
                      profileImage: e.target.files?.[0] || null,
                    }))
                  }
                  className="text-white"
                />
              )}

            </div>

            {/* PROFILE FIELDS */}
            <div className="space-y-4">

              <input
                disabled={!editingProfile}
                value={profileForm.name}
                onChange={(e) =>
                  setProfileForm(prev => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                className="w-full p-3 bg-slate-800 text-white rounded"
                placeholder="Name"
              />

              <input
                disabled={!editingProfile}
                value={profileForm.email}
                onChange={(e) =>
                  setProfileForm(prev => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                className="w-full p-3 bg-slate-800 text-white rounded"
                placeholder="Email"
              />

              <input
                disabled={!editingProfile}
                value={profileForm.mobile}
                onChange={(e) =>
                  setProfileForm(prev => ({
                    ...prev,
                    mobile: e.target.value,
                  }))
                }
                className="w-full p-3 bg-slate-800 text-white rounded"
                placeholder="Mobile"
              />

              <textarea
                disabled={!editingProfile}
                value={profileForm.address}
                onChange={(e) =>
                  setProfileForm(prev => ({
                    ...prev,
                    address: e.target.value,
                  }))
                }
                className="w-full p-3 bg-slate-800 text-white rounded"
                placeholder="Address"
              />

            </div>

          </div>
        )}

      </div>

      {/* SETTINGS */}
      <div className="bg-slate-900 border rounded-2xl p-6">
        <h3 className="text-white text-xl mb-4 font-bold">
          Settings
        </h3>

        <button
          onClick={() => setShowPasswordModal(true)}
          className="bg-indigo-600 px-4 py-2 rounded text-white"
        >
          Change Password
        </button>
      </div>

      {/* EMERGENCY PRICING */}
      <div className="bg-slate-900 border rounded-2xl p-6">

        <div className="flex justify-between mb-4">

          <h3 className="text-white text-xl font-bold">
            Emergency Pricing
          </h3>

          <button
            onClick={() => {
              setEditingRule(null);
              setShowEmergencyModal(true);
            }}
            className="bg-indigo-600 px-4 py-2 text-white rounded"
          >
            + Add
          </button>

        </div>

        {emergencyRules.map(rule => (

          <div
            key={rule.id}
            className="bg-slate-800 p-4 rounded mb-2 flex justify-between"
          >

            <div>
              <p className="text-white">{rule.label}</p>
              <p className="text-slate-400 text-sm">
                {rule.percentage_markup}% | x{rule.multiplier}
              </p>
            </div>

            <div className="flex gap-2">

              <button
                onClick={() => handleEditEmergency(rule)}
                className="bg-yellow-500 px-3 py-1 rounded text-white"
              >
                Edit
              </button>

              <button
                onClick={() => handleDeleteEmergency(rule.id)}
                className="bg-red-500 px-3 py-1 rounded text-white"
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>



      {/* ================= PASSWORD MODAL ================= */}
{showPasswordModal && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <div className="bg-slate-900 p-6 rounded-2xl w-full max-w-md">

      <h3 className="text-white text-lg font-bold mb-4">
        Change Password
      </h3>

      {/* STEP 1 */}
      {step === 1 && (
        <>
          <input
            type={showCP.current ? "text" : "password"}
            placeholder="Current Password"
            value={cpData.current_password}
            onChange={(e) =>
              setCpData({ ...cpData, current_password: e.target.value })
            }
            className="w-full p-3 mb-3 bg-slate-800 text-white rounded"
          />

          <button
            onClick={handleRequestOtp}
            className="w-full bg-indigo-600 p-3 rounded text-white"
          >
            {cpLoading ? "Sending..." : "Send OTP"}
          </button>
        </>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <>
          <input
            placeholder="Enter OTP"
            value={cpData.otp}
            onChange={(e) =>
              setCpData({ ...cpData, otp: e.target.value })
            }
            className="w-full p-3 mb-3 bg-slate-800 text-white rounded"
          />

          <button
            onClick={handleVerifyOtp}
            className="w-full bg-indigo-600 p-3 rounded text-white"
          >
            {cpLoading ? "Verifying..." : "Verify OTP"}
          </button>
        </>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <>
          <input
            type={showCP.new ? "text" : "password"}
            placeholder="New Password"
            value={cpData.new_password}
            onChange={(e) =>
              setCpData({ ...cpData, new_password: e.target.value })
            }
            className="w-full p-3 mb-3 bg-slate-800 text-white rounded"
          />

          <input
            type={showCP.confirm ? "text" : "password"}
            placeholder="Confirm Password"
            value={cpData.confirm_password}
            onChange={(e) =>
              setCpData({ ...cpData, confirm_password: e.target.value })
            }
            className="w-full p-3 mb-3 bg-slate-800 text-white rounded"
          />

          <button
            onClick={handleChangePassword}
            className="w-full bg-green-600 p-3 rounded text-white"
          >
            {cpLoading ? "Updating..." : "Update Password"}
          </button>
        </>
      )}

      {/* CLOSE BUTTON */}
      <button
        onClick={() => {
          setShowPasswordModal(false);
          setStep(1);
        }}
        className="mt-4 w-full bg-gray-600 p-2 rounded text-white"
      >
        Close
      </button>

    </div>
  </div>
)}

    </div>
  );
};

export default AdminDashboard;
