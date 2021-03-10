const { Router } = require("express");
const bcrypt = require("bcrypt");
const router = Router();
const { getConnection } = require("../database");
const { v4 } = require("uuid");

router.post("/operadores", async (req, res) => {
  const { pswd } = req.body;
  const saltos = await bcrypt.genSalt(5);
  const newPswd = await bcrypt.hash(pswd, saltos);
  const newOperador = {
    ...req.body,
    pswd: newPswd,
    id: v4(),
  };
  getConnection().get("operadores").push(newOperador).write();
  res.json(newOperador);
});

router.post("/operadores/login", async (req, res) => {
  const { name, pswd } = req.body;
  let response = false;
  const operador = await getConnection()
    .get("operadores")
    .find({ name })
    .value();
  if (operador) {
    const getPswd = operador.pswd;
    const match = await bcrypt.compare(pswd, getPswd);
    if (match) {
      response = true;
    }
  }
  res.json({ response, operador });
});

router.get("/operadores", (req, res) => {
  const operadores = getConnection().get("operadores").sortBy("id").value();
  res.json(operadores);
});

router.put("/operadores/:id", async (req, res) => {
  const { id } = req.params;
  const { pswd } = req.body;
  const saltos = await bcrypt.genSalt(5);
  const newPswd = await bcrypt.hash(pswd, saltos);
  const newOperador = {
    ...req.body,
    pswd: newPswd,
  };
  const result = await getConnection()
    .get("operadores")
    .find({ id })
    .assign(newOperador)
    .write();
  res.json(result);
});

router.delete("/operadores/:id", (req, res) => {
  const { id } = req.params;
  getConnection().get("operadores").remove({ id }).write();
  res.json({ success: true });
});

module.exports = router;
