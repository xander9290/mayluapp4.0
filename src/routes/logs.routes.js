const { Router } = require("express");
const router = Router();
const { getConnection } = require("../database");
const { v4 } = require("uuid");

router.post("/logs", (req, res) => {
  const newLog = {
    ...req.body,
    id: v4(),
  };
  getConnection().get("logs").push(newLog).write();
  res.json(newLog);
});

router.get("/logs", (req, res) => {
  const logs = getConnection().get("logs").value();
  res.json(logs);
});

router.delete("/logs/:id", (req, res) => {
  const { id } = req.params;
  getConnection().get("logs").remove({ id }).write();
  res.json({ success: true });
});

module.exports = router;
