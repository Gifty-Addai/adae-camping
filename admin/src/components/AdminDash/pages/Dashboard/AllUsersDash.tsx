import React, { useEffect, useState } from "react";
import { Page } from "@/components/ui/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Shield, UserCheck, Trash2, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { getRequest, putRequest, deleteRequest } from "@/lib/api-Request/api-requests";
import { User } from "@/core/interfaces";
import { toast } from "react-toastify";
import { Spinner } from "@/components/ui/loader/_spinner";

const AllUsersDash: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getRequest<User[]>("/api/user");
      if (data) {
        setUsers(data);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load users from backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleRole = async (id: string, currentRole: "user" | "admin", name: string) => {
    const nextRole = currentRole === "admin" ? "user" : "admin";
    const toastId = toast.loading(`Updating ${name}'s role...`);
    try {
      const updatedUser = await putRequest<User>(`/api/user/${id}`, { role: nextRole });
      if (updatedUser) {
        setUsers((prev) =>
          prev.map((user) => (user._id === id ? { ...user, role: updatedUser.role } : user))
        );
        toast.update(toastId, {
          render: `Successfully updated ${name} to ${nextRole}!`,
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (err: any) {
      toast.update(toastId, {
        render: err.message || "Failed to update user role.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete the user: "${name}"?`)) {
      return;
    }

    const toastId = toast.loading(`Deleting ${name}...`);
    try {
      await deleteRequest(`/api/user/${id}`);
      setUsers((prev) => prev.filter((user) => user._id !== id));
      toast.update(toastId, {
        render: `${name} has been deleted successfully.`,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err: any) {
      toast.update(toastId, {
        render: err.message || "Failed to delete user.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone?.includes(searchTerm) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Page
      pageTitle="User Management"
      renderBody={() => (
        <div className="bg-[#2a2a2a] min-h-screen rounded-lg p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-100">All Users</h2>
              <p className="text-sm text-gray-400">Manage real accounts from Akoben backend</p>
            </div>
            <Link to="/admin/users/new">
              <Button className="bg-[#8b7355] hover:bg-[#6d5a44] text-white flex items-center gap-2">
                <Plus className="w-4 h-4" /> Create User
              </Button>
            </Link>
          </div>

          <Card className="bg-[#2a2a2a] border border-[#3d3d3d] text-gray-100">
            <CardHeader className="pb-4">
              <CardTitle className="text-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <span>Account List ({filteredUsers.length})</span>
                <div className="w-full sm:w-80">
                  <Input
                    placeholder="Search by name, email or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-[#353535] border-[#4d4d4d] text-gray-200 focus:border-[#8b7355] h-9"
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-16">
                  <Spinner size="xl" />
                </div>
              ) : (
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#3d3d3d] text-gray-400 text-sm font-semibold">
                        <th className="py-3 px-4">Name</th>
                        <th className="py-3 px-4">Email</th>
                        <th className="py-3 px-4">Phone</th>
                        <th className="py-3 px-4">Role</th>
                        <th className="py-3 px-4">Joined Date</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr
                          key={user._id}
                          className="border-b border-[#3d3d3d] hover:bg-[#353535] transition-colors text-sm text-gray-300"
                        >
                          <td className="py-3.5 px-4 font-semibold text-gray-100">
                            {user.name}
                          </td>
                          <td className="py-3.5 px-4 text-gray-400">{user.email}</td>
                          <td className="py-3.5 px-4">{user.phone}</td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                user.role === "admin"
                                  ? "bg-amber-900/50 text-amber-300 border border-amber-800"
                                  : "bg-blue-900/50 text-blue-300 border border-blue-800"
                              }`}
                            >
                              {user.role === "admin" ? (
                                <Shield className="w-3 h-3" />
                              ) : (
                                <UserCheck className="w-3 h-3" />
                              )}
                              {user.role}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleRole(user._id, user.role, user.name)}
                              className="bg-transparent border-[#4d4d4d] text-gray-300 hover:bg-[#4d4d4d]"
                            >
                              Toggle Role
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteUser(user._id, user.name)}
                              className="bg-red-900/40 hover:bg-red-900 text-red-200 border border-red-900/60"
                            >
                              <Trash2 className="w-3.5 h-3.5 mr-1 inline-block" />
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {filteredUsers.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-gray-500">
                            No accounts found in the backend system.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    />
  );
};

export default AllUsersDash;
