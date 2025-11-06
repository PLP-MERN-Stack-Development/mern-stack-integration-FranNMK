import express from "express";
const router = express.Router();

// Temporary test route
router.get("/", (req, res) => {
  res.send("User routes working!");
});

export default router;
