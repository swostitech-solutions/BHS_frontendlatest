// import { BrowserRouter } from "react-router-dom";
// import Navbar from "./src/components/Navbar";
// import AppRoutes from "./src/routes/AppRoutes";

// const App = () => {
//   return (
//     <BrowserRouter>
//       <Navbar />
//       <AppRoutes />
//     </BrowserRouter>
//   );
// };

// export default App;







// import { BrowserRouter } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import AppRoutes from "./routes/AppRoutes";

// const App = () => {
//   return (
//     <BrowserRouter>
//       <Navbar />
//       <AppRoutes />
//     </BrowserRouter>
//   );
// };

// export default App;




import { BrowserRouter as Router, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";

function Layout() {
  const location = useLocation();

  // hide navbar for admin and technician
  const hideNavbar =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/tech");

  return (
    <>
      {!hideNavbar && <Navbar />}
      <AppRoutes />
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
