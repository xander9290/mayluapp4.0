function Logs() {
  const { operadores, logs } = useContext(AppContext);
  const [fechaBusqueda, setFechaBusqueda] = useState({
    fecha: fechaActual(Date.now()),
    operador: "",
    criterio: "todo",
  });
  const [result, setResult] = useState([]);
  const [error, setError] = useState(null);

  const handleValues = (e) => {
    setFechaBusqueda({ ...fechaBusqueda, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      fechaBusqueda.operador === "todos" &&
      fechaBusqueda.criterio === "todo"
    ) {
      setResult(logs);
    } else {
      if (fechaBusqueda.criterio === "bydate") {
        const res = logs.filter(
          (log) =>
            log.fecha === fechaBusqueda.fecha &&
            log.operador === fechaBusqueda.operador
        );
        if (res.length > 0) {
          setResult(res);
        } else {
          setResult([]);
          setError("sin resultados");
        }
      } else {
        const res = logs.filter(
          (log) => log.operador === fechaBusqueda.operador
        );
        if (res.length > 0) {
          setResult(res);
        } else {
          setResult([]);
          setError("sin resultados");
        }
      }
    }
  };

  return (
    <div className="card text-dark">
      <div className="card-header">
        <h5 className="card-title">
          Actividad de Operadores{" "}
          <span className="badge bg-primary"> {result.length} logs</span>
        </h5>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-5 px-1">
              <input
                className="form-control form-control-lg"
                type="date"
                name="fecha"
                value={fechaBusqueda.fecha}
                max={fechaActual(Date.now())}
                onChange={handleValues}
              />
            </div>
            <div className="col-md-3 px-1">
              <select
                className="form-select form-select-lg"
                name="operador"
                value={fechaBusqueda.operador}
                onChange={handleValues}
              >
                <option>Operadores</option>
                <option value="todos" defaultValue>
                  todos
                </option>
                {operadores.map((operador) => (
                  <option key={operador.id} value={operador.name}>
                    {operador.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3 px-1">
              <select
                className="form-select form-select-lg"
                name="criterio"
                onChange={handleValues}
                value={fechaBusqueda.criterio}
              >
                <option value="todo" defaultValue>
                  todo
                </option>
                <option value="bydate">por fecha</option>
              </select>
            </div>
            <div className="col-md-1 px-1">
              <button
                title="BUSCAR"
                className="btn btn-primary btn-lg"
                type="submit"
              >
                <i className="bi bi-search"></i>
              </button>
            </div>
          </div>
        </form>
      </div>
      <div
        style={{ height: "490px", overflowY: "scroll" }}
        className="card-body p-2"
      >
        <table className="table table-bordered">
          <thead>
            <tr className="text-center text-uppercase">
              <th scope="col">operador</th>
              <th scope="col">commit</th>
              <th scope="col">fecha</th>
            </tr>
          </thead>
          <tbody>
            {result.map((result, i) => (
              <tr key={i}>
                <td>{result.operador}</td>
                <td>{result.commit}</td>
                <td>{formatoFecha(result.createdAt)[0]}</td>
              </tr>
            ))}
            {error && (
              <tr>
                <td colSpan="3">
                  <div className="alert alert-danger text-uppercase fw-bolder text-center">
                    {error}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
