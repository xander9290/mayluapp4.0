// Requirements
const app = require("./app");
const open = require("open");
const { createConnection } = require("./database");

// Port
app.set("port", 3100);

createConnection();
app.listen(app.get("port"));
console.log(
  ">Servidor iniciado en puerto: ",
  app.get("port"),
  "\n>Iniciando aplicación..."
);
(async () => {
  await open(`http://localhost:${app.get("port")}`);
})();
