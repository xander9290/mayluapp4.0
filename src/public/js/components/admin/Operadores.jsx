const initialOperador = {
  name: "",
  pswd: "",
  rol: "",
  createdAt: "",
  createdBy: "",
  lastEdit: "",
  id: null,
};

function Operadores() {
  const { operadores, crearOperador, editarOperador, delOperador } =
    useContext(AppContext);
  const [operador, setOperador] = useState(initialOperador);
  const [idx, setIdx] = useState("");
  const [error, setError] = useState(null);

  const handleValues = (e) => {
    setOperador({ ...operador, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (operador.id) {
      const newOper = {
        ...operador,
        lastEdit: fechaISO(),
      };
      editarOperador(operador.id, newOper);
      cancelar();
    } else {
      const newOper = {
        ...operador,
        createdAt: fechaISO(),
        createdBy: operadorSession,
      };
      if (verifyExiste(operadores, operador.name)) {
        setError("No disponible. ¡Valor Duplicado!");
        return;
      }
      crearOperador(newOper);
      cancelar();
    }
  };

  const selectOperador = (id) => {
    const oper = operadores.find((operador) => operador.id === id);
    if (oper) {
      setOperador(oper);
    }
  };

  const cancelar = () => {
    setOperador(initialOperador);
    setError(null);
  };

  const resetIdx = (e) => {
    e.stopPropagation();
    setIdx("");
  };

  return (
    <div className="card text-dark">
      <div className="card-header" onClick={resetIdx}>
        <h5 className="card-title">
          Operadores{" "}
          <span className="badge bg-primary">{operadores.length}</span>
          {operador.id && "<Modo Edición>"}
        </h5>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-3 px-1">
              <input
                className="form-control"
                type="text"
                name="name"
                value={operador.name}
                onChange={handleValues}
                autoComplete="off"
                required
                placeholder="Nombre"
              />
            </div>
            <div className="col-md-3 px-1">
              <input
                className="form-control"
                type="password"
                name="pswd"
                maxLength="4"
                value={operador.pswd}
                onChange={handleValues}
                autoComplete="off"
                required
                placeholder="Contraseña"
              />
            </div>
            <div className="col-md-3 px-1">
              <select
                className="form-select"
                name="rol"
                value={operador.rol}
                onChange={handleValues}
                required
              >
                <option>Rol</option>
                <option value="master">Master</option>
                <option value="cajero">Cajero</option>
              </select>
            </div>
            <div className="col-md-3 px-1">
              {operador.id ? (
                <button
                  title="EDITAR"
                  className="btn btn-primary"
                  type="submit"
                >
                  <i className="bi bi-pencil"></i>
                </button>
              ) : (
                <button
                  title="AGREGAR"
                  className="btn btn-primary"
                  type="submit"
                >
                  <i className="bi bi-plus-circle"></i>
                </button>
              )}
              <button
                onClick={cancelar}
                title="CANCELAR"
                className="btn btn-warning ms-2"
                type="reset"
              >
                <i className="bi bi-x-circle"></i>
              </button>
            </div>
          </div>
        </form>
      </div>
      <div style={{ height: "300px" }} className="card-body p-2">
        {error && <small className="text-danger fw-bolder">{error}</small>}
        <table className="table table-bordered">
          <thead>
            <tr className="text-center text-uppercase">
              <th scope="col">
                <i className="bi bi-trash"></i>
              </th>
              <th scope="col">
                <i className="bi bi-pencil"></i>
              </th>
              <th scope="col">Nombre</th>
              <th scope="col">Rol</th>
            </tr>
          </thead>
          <tbody>
            {operadores.map((operador) => (
              <OperadorItem
                key={operador.id}
                idx={idx}
                setIdx={setIdx}
                operador={operador}
                selectOperador={selectOperador}
                delOperador={delOperador}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div className="card-footer">
        <p className="p-0 m-0">
          <span className="fw-bolder">Creación: </span>
          <span>{operador.createdAt && formatoFecha(operador.createdAt)}</span>
        </p>
        <p className="p-0 m-0">
          <span className="fw-bolder">Creado por: </span>
          <span>{operador.createdBy}</span>
        </p>
        <p className="p-0 m-0">
          <span className="fw-bolder">Última edición: </span>
          <span>{operador.lastEdit && formatoFecha(operador.lastEdit)}</span>
        </p>
      </div>
    </div>
  );
}

const OperadorItem = ({
  operador,
  idx,
  setIdx,
  selectOperador,
  delOperador,
}) => {
  return (
    <tr
      style={{ cursor: "default" }}
      onClick={() => setIdx(operador.id)}
      className={`text-uppercase ${operador.id === idx ? "bg-info" : ""}`}
    >
      <th scope="row" className="text-center">
        <button
          onClick={() => delOperador(operador.id)}
          title="ELIMINAR"
          type="button"
          className="btn btn-danger btn-sm"
        >
          <i className="bi bi-trash"></i>
        </button>
      </th>
      <th scope="row" className="text-center">
        <button
          onClick={() => selectOperador(operador.id)}
          title="EDITAR"
          type="button"
          className="btn btn-primary btn-sm"
        >
          <i className="bi bi-pencil"></i>
        </button>
      </th>
      <td>{operador.name}</td>
      <td className="text-center">{operador.rol}</td>
    </tr>
  );
};
