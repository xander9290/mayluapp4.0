const { Router } = require("express");
const router = Router();
const { getConnection } = require("../database");
const { v4 } = require("uuid");

router.post("/subcategorias", (req, res) => {
  const newSubcategoria = {
    ...req.body,
    id: v4(),
  };
  getConnection().get("subcategorias").push(newSubcategoria).write();
  res.json(newSubcategoria);
});

router.get("/subcategorias", (req, res) => {
  const subcategorias = getConnection()
    .get("subcategorias")
    .sortBy("categoria_id")
    .value();
  res.json(subcategorias);
});

router.put("/subcategorias/:id", async (req, res) => {
  const { id } = req.params;
  const result = await getConnection()
    .get("subcategorias")
    .find({ id })
    .assign(req.body)
    .write();
  res.json(result);
});

router.delete("/subcategorias/:id",(req,res)=>{
    const { id } = req.params;
    getConnection().get("subcategorias").remove({ id }).write();
    res.json({ success: true });
});

module.exports = router;
