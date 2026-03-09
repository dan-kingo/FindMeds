import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "react-hot-toast";
import AuthProvider from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Medicines from "./pages/Medicines";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import SalesReport from "./pages/SalesReport";
import PendingApproval from "./pages/PendingApproval";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-transparent">
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "#0f172a",
                  color: "#f8fafc",
                  border: "1px solid #334155",
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: "#1eb885",
                    secondary: "#f8fafc",
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: "#e11d48",
                    secondary: "#f8fafc",
                  },
                },
              }}
            />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/pending-approval" element={<PendingApproval />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Routes>
                        <Route
                          path="/"
                          element={<Navigate to="/dashboard" replace />}
                        />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/medicines" element={<Medicines />} />
                        <Route path="/sales-report" element={<SalesReport />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/profile" element={<Profile />} />
                      </Routes>
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
