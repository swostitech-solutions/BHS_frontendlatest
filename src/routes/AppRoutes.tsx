import { Routes, Route } from "react-router-dom";
import  LoginPage   from  "../components/pages/auth/LoginPage";
import SignupPage from "../components/pages/auth/SignupPage";
import HomePage from "../components/pages/client/HomePage";
import UserDashboard from "../components/pages/client/UserDashboard";
import AdminDashboard from "../components/pages/admin/AdminDashboard";
import TechDashboard from "../components/pages/tech/TechDashboard";
import PendingApprovalPage from "../components/pages/tech/PendingApprovalPage";
import ProfileView from "../components/pages/client/ProfileView";
import ServiceDetail from "../components/pages/client/ServiceDetail";
import Checkout from "../components/pages/client/Checkout";
import CartPage from "../components/pages/client/CartPage";
import ChangePassword from "../components/pages/client/ChangePassword";
import PaymentSuccess from "../components/pages/client/PaymentSuccess";
import PaymentFailed from "../components/pages/client/PaymentFailed";

const AppRoutes = ({ currentUser, setCurrentUser }: any) => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="/login" element={<LoginPage onLogin={setCurrentUser} />} />
      <Route
        path="/signup"
        element={<SignupPage onSignup={setCurrentUser} />}
      />

      <Route path="/subservice/:id" element={<ServiceDetail />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/checkout/:id" element={<Checkout />} />
      <Route path="/bookings" element={<UserDashboard />} />
      <Route path="/profile" element={<ProfileView />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="/payment-failed" element={<PaymentFailed />} />

      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/tech" element={<TechDashboard />} />
      <Route path="/tech/pending" element={<PendingApprovalPage user={currentUser} />} />

    </Routes>
  );
};

export default AppRoutes;
