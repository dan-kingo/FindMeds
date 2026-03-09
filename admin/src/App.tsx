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
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Pharmacies from "./pages/Pharmacies";
import Orders from "./pages/Orders";
import Medicines from "./pages/Medicines";
import Notifications from "./pages/Notifications";
import Analytics from "./pages/Analytics";

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
                        <Route path="/users" element={<Users />} />
                        <Route path="/pharmacies" element={<Pharmacies />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/medicines" element={<Medicines />} />
                        <Route
                          path="/notifications"
                          element={<Notifications />}
                        />
                        <Route path="/analytics" element={<Analytics />} />
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
