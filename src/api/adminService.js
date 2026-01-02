import api from "./api";

// Get Users
export const getAllUsers = async (search = "", role = "", department = "") => {
  const res = await api.get(`/users?search=${search}&role=${role}&department=${department}`);
  return res.data;
};

// Create User
export const createUser = async (user) => {
  const res = await api.post("/users", user);
  return res.data;
};

// Delete User
export const deleteUser = async (id) => {
  return await api.delete(`/users/${id}`);
};

// Update Role / Department
export const updateUser = async (id, data) => {
  return await api.put(`/users/${id}`, data);
};

// Toggle Active / Deactivate
export const toggleUser = async (id) => {
  return await api.patch(`/users/${id}/toggle`);
};

// Upload CSV
export const uploadUsersCSV = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return await api.post(`/users/upload-csv`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
export const getUserLogs = async (userId) => {
  const res = await api.get(`/users/${userId}/logs`);
  return res.data;
};
export const resetUserPassword = async (userId, newPassword) => {
  const res = await api.patch(`/users/${userId}/reset-password`, {
    NewPassword: newPassword,
  });
  return res.data;
};