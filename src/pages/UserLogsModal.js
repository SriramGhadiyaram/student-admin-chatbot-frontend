import { useEffect, useState } from "react";
import { getUserLogs } from "../api/adminService";

export default function UserLogsModal({ userId, onClose }) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    const data = await getUserLogs(userId);
    setLogs(data);
  };

  return (
    <div style={modal}>
      <div style={box}>
        <h2>User Activity Logs</h2>

        <div style={listBox}>
          {logs.map((log) => (
            <div style={item}>
              <p><b>{log.Action}</b></p>
              <small>{new Date(log.Timestamp).toLocaleString()}</small>
            </div>
          ))}
        </div>

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

const modal = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const box = {
  background: "white",
  padding: 25,
  borderRadius: 10,
  width: 500
};

const listBox = {
  maxHeight: 300,
  overflowY: "auto",
  marginTop: 10
};

const item = {
  background: "#f5f5f5",
  padding: 10,
  borderRadius: 6,
  marginBottom: 8
};
