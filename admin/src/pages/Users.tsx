import { useEffect, useState } from "react";
import { Search, User, Phone, Mail, Calendar } from "lucide-react";
import { adminAPI } from "../services/api";
import toast from "react-hot-toast";

interface User {
  _id: string;
  name: string;
  phone: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
  location?: string;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await adminAPI.getUsers();
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.includes(searchTerm) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-cyan-200/70 bg-gradient-to-r from-cyan-50 to-sky-100 p-6 shadow-soft">
        <h1 className="text-2xl font-bold text-slate-900">Users Management</h1>
        <p className="text-slate-600">
          Search and monitor patient accounts and account activity.
        </p>
      </div>

      {/* Search */}
      <div className="card">
        <div className="card-body">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cyan-500" />
            <input
              type="text"
              placeholder="Search users by name, phone, or email..."
              className="input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="card">
        <div className="card-header bg-cyan-50/80">
          <h3 className="text-lg font-semibold text-slate-900">
            All Users ({filteredUsers.length})
          </h3>
        </div>
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-cyan-50/60">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Role
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-cyan-50/40 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-900">
                            {user.name || "N/A"}
                          </div>
                          {user.location && (
                            <div className="text-sm text-slate-500">
                              {user.location}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-slate-900">
                          <Phone className="h-4 w-4 mr-2 text-slate-400" />
                          {user.phone}
                        </div>
                        {user.email && (
                          <div className="flex items-center text-sm text-slate-500">
                            <Mail className="h-4 w-4 mr-2 text-slate-400" />
                            {user.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`badge ${
                          user.role === "pharmacy"
                            ? "badge-primary"
                            : "badge-gray"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-slate-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <User className="h-12 w-12 mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            No users found
          </h3>
          <p className="text-slate-600">Try adjusting your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Users;
