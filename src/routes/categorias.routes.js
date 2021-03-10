const { Router } = require("express");
const router = Router();
const { getConnection } = require("../database");
const { v4 } = require("uuid");

router.post("/categorias", (req, res) => {
  const newCategoria = {
    ...req.body,
    id: v4(),
  };
  getConnection().get("categorias").push(newCategoria).write();
  res.json({ success: true, doc: newCategoria });
});

router.get("/categorias", (req, res) => {
  const categorias = getConnection().get("categorias").sortBy("name").value();
  res.json(categorias);
});

router.put("/categorias/:id", async (req, res) => {
  const { id } = req.params;
  const result = await getConnection()
    .get("categorias")
    .find({ id })
    .assign(req.body)
    .write();
  res.json(result);
});

router.delete("/categorias/:id", (req, res) => {
  const { id } = req.params;
  getConnection().get("categorias").remove({ id }).write();
  res.json({ success: true });
});

module.exports = router;
