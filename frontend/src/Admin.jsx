import { useEffect, useState } from "react";
import axios from "axios";

export default function Admin() {
  const [uploads, setUploads] = useState([]);

  useEffect(() => {
    const fetchUploads = async () => {
      const res = await axios.get("http://localhost:5000/uploads");
      setUploads(res.data);
    };
    fetchUploads();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h3>Upload History</h3>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>File Name</th>
            <th>File ID</th>
            <th>Status</th>
            <th>Time</th>
            <th>View</th>
          </tr>
        </thead>

        <tbody>
          {uploads.map((u, i) => (
            <tr key={i}>
              <td>{u.fileName}</td>
              <td>{u.fileId}</td>
              <td>{u.status}</td>
              <td>{new Date(u.time).toLocaleString()}</td>
              <td>
                <a
                  href={`http://localhost:5000/files/${u.storedName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
