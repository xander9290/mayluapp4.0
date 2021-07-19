const { Router } = require("express");
const router = Router();
const { getConnection } = require("../database");
const { v4 } = require("uuid");
const fs = require("fs");
const path = require("path");

router.get("/respaldodb", (req, res) => {
  const pathToFile = path.join(__dirname, "../../maylu.json");
  const pathToNewDestination = path.join(
    __dirname,
    `../../backup/maylu-${fechaActual(Date.now())}.json`
  );
  try {
    fs.copyFileSync(pathToFile, pathToNewDestination);
    res.json({ res: true });
  } catch (error) {
    res.json({ res: false, error });
  }
});

router.post("/cuentas", (req, res) => {
  const cuentas = getConnection().get("cuentas").value();
  const currentDate = fechaActual(Date.now());
  const lastFolio = cuentas[cuentas.length - 1];
  let folio = 0;
  let orden = 0;
  if (!lastFolio) {
    folio = 1;
    orden = 1;
  } else {
    const oldDate = lastFolio.fecha;
    if (oldDate === currentDate) {
      folio = lastFolio.folio + 1;
      orden = lastFolio.orden + 1;
    } else {
      orden = 1;
      folio = lastFolio.folio + 1;
    }
  }
  const newCuenta = {
    ...req.body,
    folio,
    orden,
    id: v4(),
  };
  getConnection().get("cuentas").push(newCuenta).write();
  res.json(newCuenta);
});

router.get("/cuentas/fecha1/:gte/fecha2/:lte", (req, res) => {
  const { gte, lte } = req.params;
  const cuentas = getConnection()
    .get("cuentas")
    .filter((cuenta) => cuenta.fecha >= gte && cuenta.fecha <= lte)
    .value();
  res.json(cuentas);
});

router.get("/cuentas/:id", (req, res) => {
  const { id } = req.params;
  const cuenta = getConnection().get("cuentas").find({ id }).value();
  res.json(cuenta);
});

router.get("/cuentas/actuales/:fecha", (req, res) => {
  const { fecha } = req.params;
  const cuentas = getConnection()
    .get("cuentas")
    .sortBy("orden")
    .filter({ fecha })
    .value();
  res.json(cuentas);
});

router.get("/cuentas/historial/:fecha", (req, res) => {
  const { fecha } = req.params;
  const cuentas = getConnection()
    .get("cuentas")
    .sortBy("orden")
    .filter({ fecha })
    .value();
  res.json(cuentas);
});

router.get("/cuentas/history/:clienteId", (req, res) => {
  const { clienteId } = req.params;
  const cuentas = getConnection().get("cuentas").sortBy("orden").value();
  const history = cuentas.filter((cuenta) => cuenta.cliente.id === clienteId);
  res.json(history);
});

router.get("/cuentas/cerrado/:fecha", (req, res) => {
  const { fecha } = req.params;
  const cuentas = getConnection()
    .get("cuentas")
    .sortBy("orden")
    .filter({ fecha })
    .value();
  res.json(cuentas);
});

router.put("/cuentas/:id", async (req, res) => {
  const { id } = req.params;
  const result = await getConnection()
    .get("cuentas")
    .find({ id })
    .assign(req.body)
    .write();
  res.json(result);
});

const fechaActual = (d) => {
  const date = new Date(d);
  const ano = date.getFullYear();
  const mes = date.getMonth() + 1;
  const dia = date.getDate();

  return `${ano}-${mes < 10 ? "0" + mes : mes}-${dia < 10 ? "0" + dia : dia}`;
};

module.exports = router;
