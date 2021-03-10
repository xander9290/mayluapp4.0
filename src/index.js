// Requirements
const app = require("./app");
const { createConnection } = require("./database");

// Port
app.set("port", 3100);

createConnection();
app.listen(app.get("port"));
console.log(
  ">Servidor iniciado en puerto: ",
  app.get("port"),
  "\n>Ya puedes iniciar la aplicación."
);
