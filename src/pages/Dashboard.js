import { useEffect, useState } from "react";
import {
  getAllUsers,
  createUser,
  deleteUser,
  updateUser,
  toggleUser,
  uploadUsersCSV,
  resetUserPassword
} from "../api/adminService";

import UserLogsModal from "./UserLogsModal";

function Dashboard() {
  const role = localStorage.getItem("role");

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search + Filter
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterDept, setFilterDept] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // Add User Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    FullName: "",
    Email: "",
    Role: "Student",
    Department: "",
    Password: "",
  });

  // Edit User
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Logs + Reset Password
  const [logsUserId, setLogsUserId] = useState(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetUserId, setResetUserId] = useState(null);
  const [resetPassword, setResetPassword] = useState("");

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  // ================= ADMIN ONLY LOADS USERS =================
  useEffect(() => {
    if (role === "Admin") loadUsers();
  }, [search, filterRole, filterDept]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers(search, filterRole, filterDept);
      setUsers(data);
    } catch {
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // ================= CRUD =================
  const handleCreateUser = async () => {
    try {
      await createUser(newUser);
      alert("User created successfully");
      setShowAddModal(false);
      loadUsers();
    } catch {
      alert("Failed to create user");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    await deleteUser(id);
    loadUsers();
  };

  const handleToggle = async (id) => {
    await toggleUser(id);
    loadUsers();
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleUpdateUser = async () => {
    await updateUser(selectedUser.UserId, {
      Role: selectedUser.Role,
      Department: selectedUser.Department,
    });

    alert("Updated successfully");
    setShowEditModal(false);
    loadUsers();
  };

  const handleUploadCSV = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    await uploadUsersCSV(file);
    alert("Uploaded successfully");
    loadUsers();
  };

  // Pagination
  const startIndex = (page - 1) * pageSize;
  const paginatedUsers = users.slice(startIndex, startIndex + pageSize);

  // =================================================================
  // ========================== RETURN UI ============================
  // =================================================================
  return (
    <>
      {/* ======================= STUDENT DASHBOARD ======================= */}
      {role === "Student" && (
        <div style={styles.studentWrap}>
          <div style={styles.studentCard}>
            <h1>🎓 Student Dashboard</h1>
            <p>Welcome Student! Your chatbot services & academic tools will appear here.</p>

            <div style={styles.statRow}>
              <div style={styles.statBox}>
                <h2>Profile</h2>
                <p>Connected</p>
              </div>

              <div style={styles.statBox}>
                <h2>Status</h2>
                <p>Active</p>
              </div>

              <div style={styles.statBox}>
                <h2>Chatbot Access</h2>
                <p>Enabled</p>
              </div>
            </div>

            <button style={styles.logoutBtnBig} onClick={logout}>Logout</button>
          </div>
        </div>
      )}

      {/* ======================= FACULTY DASHBOARD ======================= */}
      {role === "Faculty" && (
        <div style={styles.studentWrap}>
          <div style={styles.studentCard}>
            <h1>👨‍🏫 Faculty Dashboard</h1>
            <p>Welcome Faculty! Soon you will view reports, analytics & chatbot tools.</p>

            <div style={styles.statRow}>
              <div style={styles.statBox}>
                <h2>Classes</h2>
                <p>Coming Soon</p>
              </div>

              <div style={styles.statBox}>
                <h2>Reports</h2>
                <p>Coming Soon</p>
              </div>

              <div style={styles.statBox}>
                <h2>Chatbot</h2>
                <p>Enabled</p>
              </div>
            </div>

            <button style={styles.logoutBtnBig} onClick={logout}>Logout</button>
          </div>
        </div>
      )}

      {/* ======================= ADMIN DASHBOARD ======================= */}
      {role === "Admin" && (
        <div style={styles.layout}>
          {/* Sidebar */}
          <div style={styles.sidebar}>
            <h2>Admin Panel</h2>

            <button style={styles.sideBtn} onClick={() => setShowAddModal(true)}>
              ➕ Add User
            </button>

            <label style={styles.csvLabel}>
              📂 Upload CSV
              <input type="file" hidden onChange={handleUploadCSV} />
            </label>

            <button style={styles.logoutBtn} onClick={logout}>
              Logout
            </button>
          </div>

          {/* Main */}
          <div style={styles.content}>
            <h1>Welcome, Admin 👑</h1>

            {/* Filters */}
            <div style={styles.filterBox}>
              <input placeholder="Search by name" style={styles.input} onChange={(e) => setSearch(e.target.value)} />

              <select style={styles.input} onChange={(e) => setFilterRole(e.target.value)}>
                <option value="">Role</option>
                <option>Student</option>
                <option>Faculty</option>
                <option>Admin</option>
              </select>

              <input placeholder="Department" style={styles.input} onChange={(e) => setFilterDept(e.target.value)} />
            </div>

            <div style={styles.card}>
              <h2>User Management</h2>

              {loading ? (
                <p>Loading users...</p>
              ) : (
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Dept</th>
                      <th>Status</th>
                      <th>Last Login</th>
                      <th>Logs</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedUsers.map((u) => (
                      <tr key={u.UserId}>
                        <td>{u.UserId}</td>
                        <td>{u.FullName}</td>
                        <td>{u.Email}</td>
                        <td>{u.Role}</td>
                        <td>{u.Department}</td>

                        <td style={{ color: u.IsActive ? "green" : "red" }}>
                          {u.IsActive ? "Active" : "Inactive"}
                        </td>

                        <td>{u.LastLogin ? new Date(u.LastLogin).toLocaleString() : "Never"}</td>

                        <td>
                          <button style={styles.logsBtn} onClick={() => setLogsUserId(u.UserId)}>
                            View Logs
                          </button>
                        </td>

                        <td>
                          <button style={styles.editBtn} onClick={() => openEditModal(u)}>Edit</button>
                          <button style={styles.toggleBtn} onClick={() => handleToggle(u.UserId)}>Toggle</button>
                          <button style={styles.deleteBtn} onClick={() => handleDelete(u.UserId)}>Delete</button>

                          <button
                            style={styles.resetBtn}
                            onClick={() => {
                              setResetUserId(u.UserId);
                              setShowResetModal(true);
                            }}
                          >
                            Reset Password
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* Pagination */}
              <div style={styles.pagination}>
                <button disabled={page === 1} onClick={() => setPage(page - 1)}>⬅ Prev</button>
                <span style={{ margin: "0 10px" }}>{page}</span>
                <button disabled={startIndex + pageSize >= users.length} onClick={() => setPage(page + 1)}>
                  Next ➡
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========= Modals remain SAME (no change) ========= */}
    </>
  );
}

/* ================= STYLE SECTION ================= */
const styles = {
  layout: { display: "flex", minHeight: "100vh" },
  sidebar: { width: "250px", background: "#1E1E2F", color: "white", padding: "20px" },
  sideBtn: { width: "100%", padding: "10px", background: "#4caf50", color: "white", border: "none", borderRadius: "8px", marginTop: "10px", cursor: "pointer" },
  csvLabel: { display: "block", marginTop: "15px", padding: "10px", background: "#008CFF", borderRadius: "8px", cursor: "pointer", textAlign: "center" },
  logoutBtn: { width: "100%", padding: "10px", background: "red", color: "white", borderRadius: "8px", marginTop: "20px" },
  content: { flex: 1, padding: "30px", background: "#F4F6FF" },
  card: { background: "white", padding: "25px", borderRadius: "20px", boxShadow: "0px 15px 35px rgba(0,0,0,0.1)" },
  table: { width: "100%", marginTop: "20px", borderCollapse: "collapse" },
  pagination: { marginTop: "20px", textAlign: "center" },
  filterBox: { display: "flex", gap: "10px", marginBottom: "15px" },
  input: { padding: "8px", borderRadius: "8px", border: "1px solid gray" },
  logsBtn: { padding: "6px 10px", background: "#6a5acd", color: "white", borderRadius: "6px", border: "none" },
  resetBtn: { marginLeft: "5px", background: "#ff9800", color: "white", padding: "5px" },

  /* Student & Faculty */
  studentWrap: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#eef3ff" },
  studentCard: { background: "white", padding: "40px", borderRadius: "20px", width: "700px", textAlign: "center", boxShadow: "0 15px 30px rgba(0,0,0,0.2)" },
  statRow: { display: "flex", gap: "15px", marginTop: "20px", justifyContent: "center" },
  statBox: { background: "#f4f6ff", padding: "20px", borderRadius: "15px", width: "30%" },
  logoutBtnBig: { marginTop: "25px", padding: "10px 20px", borderRadius: "10px", background: "red", color: "white", border: "none" }
};

export default Dashboard;
