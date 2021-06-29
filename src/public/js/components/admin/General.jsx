function General() {
  return (
    <div className="col-md-3">
      <MediosDePago />
    </div>
  );
}

function MediosDePago() {
  const { otrosMedios, createMedio, delMedio } = useContext(AppContext);

  const [values, setValues] = useState({ name: "" });
  const [error, setError] = useState(null);

  const handleValues = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newMedio = {
      name: values.name,
    };
    createMedio(newMedio, (res) => {
      if (res === "success") {
        cancelar();
      } else {
        setError(res);
      }
    });
  };

  const cancelar = () => {
    setValues({ name: "" });
    setError(null);
  };

  return (
    <form className="card text-dark" onSubmit={handleSubmit}>
      <div className="card-header">
        <h5 className="card-title">Medios de Pago</h5>
        <div className="row">
          <div className="col-md-6 px-1">
            <input
              className="form-control form-control-sm"
              type="text"
              name="name"
              value={values.name}
              onChange={handleValues}
              placeholder="Nuevo"
              autoComplete="off"
              required
            />
          </div>
          <div className="col-md-4 px-1">
            <button
              title="AGREGAR"
              className="btn btn-primary btn-sm"
              type="submit"
            >
              <i className="bi bi-plus-circle"></i>
            </button>
            <button
              onClick={cancelar}
              title="CANCELAR"
              className="btn btn-warning btn-sm ms-2"
              type="reset"
            >
              <i className="bi bi-x-circle"></i>
            </button>
          </div>
        </div>
        {error && <small className="text-danger fw-bold">{error}</small>}
      </div>
      <div
        style={{ height: "200px", overflowY: "scroll" }}
        className="card-body"
      >
        <ul className="list-group text-dark">
          {otrosMedios.map((medio) => (
            <li
              key={medio.id}
              style={{ cursor: "default" }}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span className="text-uppercase">{medio.name}</span>
              <div>
                <button
                  onClick={() => delMedio(medio.id)}
                  title="ELIMINAR"
                  type="button"
                  className="btn btn-danger"
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </form>
  );
}
