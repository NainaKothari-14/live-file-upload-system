// admin.js
import express from "express";
import { es } from "./elastic.js";

const router = express.Router();

router.get("/uploads", async (req, res) => {
  const result = await es.search({
    index: "uploads",
    size: 20,
    sort: [{ time: { order: "desc" } }],
  });

  const uploads = result.hits.hits.map(hit => hit._source);
  res.json(uploads);
});

export default router;
