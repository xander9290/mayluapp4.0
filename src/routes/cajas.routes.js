const { Router } = require("express");
const router = Router();
const { getConnection } = require("../database");
const { v4 } = require("uuid");

router.post("/cajas", (req, res) => {
  const cajas = getConnection().get("cajas").value();

  const newCaja = {
    ...req.body,
    folio: cajas.length + 1,
    id: v4(),
  };
  getConnection().get("cajas").push(newCaja).write();
  res.json(newCaja);
});

router.get("/cajas", (req, res) => {
  const cajas = getConnection().get("cajas").value();
  res.json(cajas);
});

router.delete("/cajas/:id", (req, res) => {
  const { id } = req.params;
  getConnection().get("cajas").remove({ id }).write();
  res.json({ success: true });
});
module.exports = router;
