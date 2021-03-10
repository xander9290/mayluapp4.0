// Requirements
const lowdb = require("lowdb");
const FileAsync = require("lowdb/adapters/FileAsync");

let db;

async function createConnection() {
  const adapter = new FileAsync("maylu.json");
  db = await lowdb(adapter);
  db.defaults({
    areas: [],
    categorias: [],
    subcategorias: [],
    productos: [],
    clientes: [],
    operadores: [],
    cuentas: [],
    logs: [],
    cajas: [],
  }).write();
}

const getConnection = () => db;

module.exports = {
    createConnection,
    getConnection
}
