import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Eye, EyeOff, Pill, AlertCircle } from "lucide-react";

const Login: React.FC = () => {
  const { login, token } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(formData.email, formData.password);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Login failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch animate-pop-in">
        <div className="hidden md:flex rounded-3xl bg-slate-900 text-white p-10 flex-col justify-between shadow-soft">
          <div>
            <div className="h-14 w-14 rounded-2xl bg-primary-500/20 text-primary-300 grid place-items-center">
              <Pill className="h-7 w-7" />
            </div>
            <h2 className="mt-6 text-3xl font-bold font-heading">
              FindMeds Pharmacy Hub
            </h2>
            <p className="mt-4 text-slate-300 text-sm leading-relaxed">
              Review orders, manage medicine flow, and keep pharmacy operations
              running smoothly from one dashboard.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-4 text-sm text-slate-300">
            Use pharmacy credentials only. All account actions are audited.
          </div>
        </div>

        <div className="max-w-md md:max-w-none w-full space-y-8 md:self-center">
          <div className="text-center md:text-left">
            <div className="mx-auto md:mx-0 h-16 w-16 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Pill className="h-8 w-8 text-white" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-slate-900 font-heading">
              Pharmacy Login
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Sign in to manage your FindMeds pharmacy
            </p>
          </div>

          <div className="card">
            <div className="card-body">
              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-xl flex items-start">
                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Login Failed</p>
                      <p className="text-sm">{error}</p>
                    </div>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="input"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      className="input pr-10"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-slate-600">
                  Don&apos;t have a pharmacy account?{" "}
                  <Link
                    to="/register"
                    className="font-semibold text-primary-600 hover:text-primary-500"
                  >
                    Register here
                  </Link>
                </p>
              </div>
            </div>
          </div>

          <div className="text-center md:text-left">
            <p className="text-xs text-slate-500">
              FindMeds Pharmacy Dashboard - Secure Access Only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
