const { Router } = require("express");
const router = Router();
const { getConnection } = require("../database");
const { v4 } = require("uuid");

router.post("/productos", (req, res) => {
  const newProducto = {
    ...req.body,
    codigo: setCodigo(),
    id: v4(),
  };
  getConnection().get("productos").push(newProducto).write();
  res.json(newProducto);
});

router.get("/productos", (req, res) => {
  const productos = getConnection()
    .get("productos")
    .sortBy("subcategoria_id")
    .value();
  res.json(productos);
});

router.put("/productos/:id", async (req, res) => {
  const { id } = req.params;
  const { codigo } = req.body;
  let newProducto = {};
  if (!codigo) {
    newProducto = {
      ...req.body,
      codigo: setCodigo(),
    };
  } else {
    newProducto = req.body;
  }
  const result = await getConnection()
    .get("productos")
    .find({ id })
    .assign(newProducto)
    .write();
  res.json(result);
});

router.delete("/productos/:id", (req, res) => {
  const { id } = req.params;
  getConnection().get("productos").remove({ id }).write();
  res.json({ success: true });
});

const setCodigo = () => {
  let existe = false;
  let newCodigo;
  const productos = getConnection().get("productos").value();

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
