const { Router } = require("express");
const router = Router();
const { getConnection } = require("../database");
const { v4 } = require("uuid");

router.post("/clientes", (req, res) => {
  const newCliente = {
    ...req.body,
    codigo: setCodigo(),
    id: v4(),
  };
  getConnection().get("clientes").push(newCliente).write();
  res.json(newCliente);
});

router.get("/clientes", (req, res) => {
  const clientes = getConnection().get("clientes").sortBy("name").value();
  res.json(clientes);
});

router.put("/clientes/:id", async (req, res) => {
  const { id } = req.params;
  const { codigo } = req.body;
  let newCliente = {};
  if (!codigo) {
    newCliente = {
      ...req.body,
      codigo: setCodigo(),
    };
  } else {
    newCliente = req.body;
  }
  const result = await getConnection()
    .get("clientes")
    .find({ id })
    .assign(newCliente)
    .write();
  res.json(result);
});

router.delete("/clientes/:id", (req, res) => {
  const { id } = req.params;
  getConnection().get("clientes").remove({ id }).write();
  res.json({ success: true });
});

const setCodigo = () => {
  let existe = false;
  let newCodigo;
  const productos = getConnection().get("clientes").value();

  do {
    newCodigo = Math.floor(10000 + Math.random() * 90000);
    for (let i = 0; i < productos.length; i++) {
      if (productos[i].codigo === newCodigo) {
        existe = true;
        break;
      }
    }
  } while (existe);
  return newCodigo;
};

module.exports = router;
