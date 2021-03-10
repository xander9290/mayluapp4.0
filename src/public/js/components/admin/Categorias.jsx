const Categorias = () => {
  const {
    initialCategoria,
    categorias,
    categoria,
    setCategoria,
    createCategoria,
    selectCategoria,
    editarCategoria,
    delCategoria,
  } = useContext(AppContext);

  const [error, setError] = useState(null);
  const [idx, setIdx] = useState(null);

  const handleValues = (e) => {
    setCategoria({ ...categoria, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (categoria.id) {
      const newCategoria = {
        ...categoria,
        lastEdit: fechaISO(),
      };
      editarCategoria(categoria.id, newCategoria);
      cancelar();
    } else {
      if (verifyExiste(categorias, categoria.name)) {
        setError("Nombre no disponible");
      } else {
        const newCategoria = {
          ...categoria,
          createdAt: fechaISO(),
          createdBy: operadorSession,
        };
        createCategoria(newCategoria);
        cancelar();
      }
    }
  };

  const selectItem = (idx) => {
    setIdx(idx);
  };

  const cancelar = () => {
    setCategoria(initialCategoria);
    setError(null);
    setIdx(null);
  };

  return (
    <div className="card text-dark">
      <div className="card-header">
        <h5 className="card-title text-dark">
          Categorías{" "}
          <span className="badge bg-primary">{categorias.length}</span>{" "}
          {categoria.id && "<Modo Edición>"}
        </h5>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-5 px-1">
              <input
                className="form-control"
                type="text"
                name="name"
                value={categoria.name}
                onChange={handleValues}
                autoComplete="off"
                required
                placeholder="nueva categoría"
              />
            </div>
            <div className="col-md-2 px-1">
              <input
                className="form-control form-control-color"
                type="color"
                name="fondo"
                value={categoria.fondo}
                onChange={handleValues}
                required
              />
            </div>
            <div className="col-md-1 px-1">
              {categoria.id ? (
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
            </div>
            <div className="col-md-1">
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
        {error && <small className="text-danger fw-bold">{error}</small>}
      </div>
      <div
        style={{ height: "380px", overflowY: "scroll" }}
        className="card-body p-2"
      >
        <ul className="list-group text-dark">
          {categorias.map((categoria) => (
            <li
              key={categoria.id}
              onClick={() => selectItem(categoria.id)}
              style={{ backgroundColor: categoria.fondo }}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span
                className={`fw-bold text-uppercase ${
                  idx === categoria.id ? "text-decoration-underline" : ""
                }`}
                role="button"
              >
                {categoria.name}
              </span>
              <div>
                <button
                  onClick={() => delCategoria(categoria.id)}
                  title="ELIMINAR"
                  type="button"
                  className="btn btn-danger"
                >
                  <i className="bi bi-trash"></i>
                </button>
                <button
                  onClick={() => selectCategoria(categoria.id)}
                  title="EDITAR"
                  type="button"
                  className="btn btn-primary ms-1"
                >
                  <i className="bi bi-pencil"></i>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="card-footer p-2">
        <p className="p-0 m-0">
          <span className="fw-bolder">Creación: </span>
          <span>
            {categoria.createdAt && formatoFecha(categoria.createdAt)}
          </span>
        </p>
        <p className="p-0 m-0">
          <span className="fw-bolder">Creado por: </span>
          <span>{categoria.createdBy}</span>
        </p>
        <p className="p-0 m-0">
          <span className="fw-bolder">Última edición: </span>
          <span>{categoria.lastEdit && formatoFecha(categoria.lastEdit)}</span>
        </p>
      </div>
    </div>
  );
};
