import { useEffect, useState } from "react";
import {
  Download,
  TrendingUp,
  Users,
  Building2,
  ShoppingCart,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { adminAPI } from "../services/api";
import toast from "react-hot-toast";

interface AnalyticsData {
  totalUsers: number;
  totalPharmacies: number;
  totalOrders: number;
  mostRequestedMedicines: Array<{
    name: string;
    totalOrdered: number;
  }>;
}

const Analytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await adminAPI.getAnalytics();
        setAnalytics(response.data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
        toast.error("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const handleExportExcel = async () => {
    try {
      const response = await adminAPI.exportExcel();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "analytics.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Excel report downloaded");
    } catch (error) {
      toast.error("Failed to export Excel");
    }
  };

  const handleExportPDF = async () => {
    try {
      const response = await adminAPI.exportPDF();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "analytics.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("PDF report downloaded");
    } catch (error) {
      toast.error("Failed to export PDF");
    }
  };

  const chartData =
    analytics?.mostRequestedMedicines?.slice(0, 5).map((item) => ({
      name: item.name,
      value: item.totalOrdered,
    })) || [];

  const pieData = [
    { name: "Users", value: analytics?.totalUsers || 0, color: "#7c3aed" },
    {
      name: "Pharmacies",
      value: analytics?.totalPharmacies || 0,
      color: "#0d9488",
    },
    { name: "Orders", value: analytics?.totalOrders || 0, color: "#ea580c" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 rounded-3xl border border-violet-200/70 bg-gradient-to-r from-violet-50 to-purple-100 p-6 shadow-soft">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Analytics & Reports
          </h1>
          <p className="text-slate-600">
            Deeper trends, medicine demand, and operations performance metrics.
          </p>
        </div>
        <div className="flex space-x-2">
          <button onClick={handleExportExcel} className="btn-secondary">
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </button>
          <button onClick={handleExportPDF} className="btn-primary">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Total Users
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {analytics?.totalUsers || 0}
                </p>
                <p className="text-xs text-success-600">+12% from last month</p>
              </div>
              <div className="p-3 rounded-2xl bg-violet-100">
                <Users className="h-6 w-6 text-violet-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Total Pharmacies
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {analytics?.totalPharmacies || 0}
                </p>
                <p className="text-xs text-success-600">+8% from last month</p>
              </div>
              <div className="p-3 rounded-2xl bg-teal-100">
                <Building2 className="h-6 w-6 text-teal-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {analytics?.totalOrders || 0}
                </p>
                <p className="text-xs text-success-600">+25% from last month</p>
              </div>
              <div className="p-3 rounded-2xl bg-orange-100">
                <ShoppingCart className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header bg-violet-50/70">
            <h3 className="text-lg font-semibold text-slate-900">
              Most Requested Medicines
            </h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#7c3aed" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header bg-purple-50/70">
            <h3 className="text-lg font-semibold text-slate-900">
              Platform Overview
            </h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="card">
        <div className="card-header bg-violet-50/70">
          <h3 className="text-lg font-semibold text-slate-900">
            Detailed Medicine Analytics
          </h3>
        </div>
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-violet-50/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Medicine Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Total Orders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Trend
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {analytics?.mostRequestedMedicines?.map((medicine, index) => (
                  <tr
                    key={index}
                    className="hover:bg-violet-50/40 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center w-8 h-8 bg-violet-100 rounded-full">
                        <span className="text-sm font-medium text-primary-600">
                          {index + 1}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">
                        {medicine.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">
                        {medicine.totalOrdered}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-success-600">
                        <TrendingUp className="h-4 w-4 mr-1" />+
                        {Math.floor(Math.random() * 20 + 5)}%
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
