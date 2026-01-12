import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import uploadRouter from "./upload.js";
import { es } from "./elastic.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

/* ✅ FIX __dirname for ES modules (Windows safe) */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

/* Inject socket into routes */
app.use((req, res, next) => {
  req.io = io;
  next();
});

/* ✅ Serve uploaded files */
app.use("/files", express.static(path.join(__dirname, "uploads")));

/* Routes */
app.use("/upload", uploadRouter);

/* Fetch upload history */
app.get("/uploads", async (req, res) => {
  const result = await es.search({
    index: "uploads",
    size: 100,
    sort: [{ time: "desc" }],
  });

  const latest = {};
  for (const hit of result.hits.hits) {
    const doc = hit._source;
    if (!latest[doc.fileId]) {
      latest[doc.fileId] = doc;
    }
  }

  res.json(Object.values(latest));
});

server.listen(5000, () => {
  console.log("✅ Backend running on http://localhost:5000");
  console.log("📁 Files served from:", path.join(__dirname, "uploads"));
});
