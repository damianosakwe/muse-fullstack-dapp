import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Artwork routes placeholder" });
});

router.get("/:id", (req, res) => {
  res.json({ message: "Get artwork by ID" });
});

router.post("/", (req, res) => {
  res.json({ message: "Create artwork" });
});

router.put("/:id", (req, res) => {
  res.json({ message: "Update artwork" });
});

router.delete("/:id", (req, res) => {
  res.json({ message: "Delete artwork" });
});

export default router;
