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







import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
