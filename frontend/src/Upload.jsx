import axios from "axios";
import { socket } from "./socket";
import { useEffect, useState } from "react";

export default function Upload() {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("IDLE");
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    socket.on("progress", (data) => setProgress(data.progress));
    socket.on("status", (data) => setStatus(data.status));

    return () => {
      socket.off("progress");
      socket.off("status");
    };
  }, []);

  const uploadFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);   // ✅ store file name
    setProgress(0);
    setStatus("UPLOADING");

    const form = new FormData();
    form.append("file", file);

    await axios.post("http://localhost:5000/upload", form);
  };

  return (
    <div style={{ width: 320, padding: 20 }}>
      <h3>File Upload</h3>

      <input type="file" onChange={uploadFile} />

      {fileName && <p>File: {fileName}</p>}

      <div style={{ border: "1px solid #ccc", height: 12 }}>
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background: "green",
          }}
        />
      </div>

      <p>Status: <b>{status}</b></p>
    </div>
  );
}
