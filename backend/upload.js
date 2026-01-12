import express from "express";
import multer from "multer";
import { redis } from "./redis.js";
import { producer } from "./kafka.js";

const router = express.Router();

/* ✅ Multer config – UNIQUE stored file */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.post("/", upload.single("file"), async (req, res) => {
  const fileId = Date.now().toString();
  const fileName = req.file.originalname;
  const storedName = req.file.filename;

  // 🔹 Upload started
  req.io.emit("status", { fileId, status: "UPLOADING" });
  req.io.emit("progress", { fileId, progress: 10 });

  await redis.set(fileId, "UPLOADING");

  await producer.send({
    topic: "file-events",
    messages: [
      {
        value: JSON.stringify({
          fileId,
          fileName,
          storedName,
          status: "UPLOADING",
          time: new Date().toISOString(),
        }),
      },
    ],
  });

  // 🔹 Upload completed
  setTimeout(async () => {
    req.io.emit("progress", { fileId, progress: 100 });
    req.io.emit("status", { fileId, status: "PROCESSING" });

    await redis.set(fileId, "PROCESSING");

    await producer.send({
      topic: "file-events",
      messages: [
        {
          value: JSON.stringify({
            fileId,
            fileName,
            storedName,
            status: "UPLOAD_COMPLETED",
            time: new Date().toISOString(),
          }),
        },
      ],
    });

    // 🔹 Processing done
    setTimeout(async () => {
      req.io.emit("status", { fileId, status: "DONE" });

      await redis.set(fileId, "DONE");

      await producer.send({
        topic: "file-events",
        messages: [
          {
            value: JSON.stringify({
              fileId,
              fileName,
              storedName,
              status: "DONE",
              time: new Date().toISOString(),
            }),
          },
        ],
      });
    }, 1500);
  }, 2000);

  res.json({ fileId, fileName });
});

export default router;
