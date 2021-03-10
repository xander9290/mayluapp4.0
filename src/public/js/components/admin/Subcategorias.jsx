const Subcategorias = () => {
  const {
    categorias,
    subcategorias,
    createSubcategoria,
    editarSubcategoria,
    delSubcategora,
  } = useContext(AppContext);
  const [subcategoria, setSubcategoria] = useState({
    name: "",
    categoria_id: "",
    modificadores: [],
  });
  const [modificadores, setModificadores] = useState([]);
  const [modificador, setModificador] = useState({
    name: "",
    price: 0,
    idx: null,
  });
  const [idx, setIdx] = useState(null);
  const [error, setError] = useState(null);
  const [errorm, setErrorm] = useState(null);

  const handleValues = (e) => {
    setSubcategoria({ ...subcategoria, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (subcategoria.id) {
      const newSubcat = {
        ...subcategoria,
        modificadores,
        lastEdit: fechaISO(),
      };
      editarSubcategoria(subcategoria.id, newSubcat);
      cancelar();
    } else {
      if (verifyExiste(subcategorias, subcategoria.name)) {
        setError("Nombre no disponible");
      } else {
        const newSubcat = {
          ...subcategoria,
          createdAt: fechaISO(),
          createdBy: operadorSession,
          lastEdit: "",
        };
        createSubcategoria(newSubcat);
        cancelar();
      }
    }
  };

  const selectModificador = (idx) => {
    const mod = modificadores.find((modificador) => modificador.idx === idx);
    if (mod) {
      setModificador(mod);
    } else {
      setErrorm("No encontrado");
    }
  };

  const handleModificador = (e) => {
    setModificador({ ...modificador, [e.target.name]: e.target.value });
    setErrorm(null);
  };

  const handleSubmitModificador = (e) => {
    e.preventDefault();
    if (subcategoria.name === "") {
      setErrorm("Selecciona una categoría");
      return;
    }
    if (modificador.idx) {
      const list = modificadores;
      list[modificador.idx] = modificador;
      setModificadores([...list]);
      cancelarM();
    } else {
      if (verifyExiste(modificadores, modificador.name)) {
        setErrorm("No disponible, ¡Valor Duplicado!");
      } else {
        const newMod = {
          ...modificador,
          idx: modificadores.length,
        };
        setModificadores([...modificadores, newMod]);
        cancelarM();
      }
    }
  };

  const deleteModificador = (idx) => {
    if (!window.confirm("Confirmar Acción")) return;
    const newList = [];
    const changedValues = modificadores.filter(
      (modificador) => modificador.idx !== idx
    );
    changedValues.map((m, i) => {
      newList.push({ name: m.name, price: m.price, idx: i });
    });
    setModificadores(newList);
    cancelarM();
  };

  const selectSubcategoria = (id) => {
    const subcat = subcategorias.find((subcategoria) => subcategoria.id === id);
    if (subcat) {
      setSubcategoria(subcat);
      const listMod = [];
      subcat.modificadores.map((m, i) => {
        listMod.push({ name: m.name, price: m.price, idx: i });
      });
      setModificadores(listMod);
      setIdx(null);
      setErrorm(null);
    }
  };

  const cancelar = () => {
    setSubcategoria({
      name: "",
      categoria_id: "",
      modificadores: [],
    });
    setModificadores([]);
    cancelarM();
    setError(null);
  };

  const cancelarM = () => {
    setModificador({ name: "", price: 0, idx: null });
    setErrorm(null);
  };

  return (
    <Fragment>
      <div className="col-md-4">
        <div className="card text-dark">
          <div className="card-header">
            <h5 className="card-title">
              Subcategorías{" "}
              <span className="badge bg-primary">{subcategorias.length}</span>
              {subcategoria.id && "<Modo Edición>"}
            </h5>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-4 px-1">
                  <input
                    className="form-control"
                    type="text"
                    name="name"
                    value={subcategoria.name}
                    onChange={handleValues}
                    autoComplete="off"
                    required
                    placeholder="Nombre"
                  />
                </div>
                <div className="col-md-4 px-1">
                  <select
                    className="form-select text-uppercase"
                    name="categoria_id"
                    value={subcategoria.categoria_id}
                    onChange={handleValues}
                  >
                    <option>Categoría</option>
                    {categorias.map((categoria) => (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-2">
                  {subcategoria.id ? (
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
                <div className="col-md-2">
                  <button
                    onClick={cancelar}
                    title="CANCELAR"
                    className="btn btn-warning"
                    type="reset"
                  >
                    <i className="bi bi-x-circle"></i>
                  </button>
                </div>
              </div>
            </form>
            {error && <small className="text-danger fw-bolder">{error}</small>}
          </div>
          <div
            style={{ height: "380px", overflowY: "scroll" }}
            className="card-body p-2"
          >
            <ul className="list-group">
              {subcategorias.map((subcategoria) => (
                <SubcategoriasItem
                  key={subcategoria.id}
                  subcategoria={subcategoria}
                  categorias={categorias}
                  selectSubcategoria={selectSubcategoria}
                  delSubcategora={delSubcategora}
                />
              ))}
            </ul>
          </div>
          <div className="card-footer p-2">
            <p className="p-0 m-0">
              <span className="fw-bolder">Creación: </span>
              <span>
                {subcategoria.createdAt && formatoFecha(subcategoria.createdAt)}
              </span>
            </p>
            <p className="p-0 m-0">
              <span className="fw-bolder">Creado por: </span>
              <span>{subcategoria.createdBy}</span>
            </p>
            <p className="p-0 m-0">
              <span className="fw-bolder">Última edición: </span>
              <span>
                {subcategoria.lastEdit && formatoFecha(subcategoria.lastEdit)}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card text-dark">
          <div className="card-header">
            <h5 className="card-title">
              Modificadores{" "}
              <span className="badge bg-primary">{modificadores.length}</span>
              {modificador.idx !== null ? "<Modo Edición>" : ""}
            </h5>
            <h6>({subcategoria.name})</h6>
            <form onSubmit={handleSubmitModificador}>
              <div className="row">
                <div className="col-md-4 px-1">
                  <input
                    className="form-control"
                    type="text"
                    name="name"
                    value={modificador.name}
                    onChange={handleModificador}
                    autoComplete="off"
                    required
                    placeholder="Descrupción"
                  />
                </div>
                <div className="col-md-4 px-1">
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      className="form-control"
                      type="number"
                      name="price"
                      min="0"
                      value={modificador.price}
                      onChange={handleModificador}
                      autoComplete="off"
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  {modificador.idx !== null ? (
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
                <div className="col-md-2">
                  <button
                    onClick={cancelarM}
                    title="CANCELAR"
                    className="btn btn-warning"
                    type="reset"
                  >
                    <i className="bi bi-x-circle"></i>
                  </button>
                </div>
              </div>
            </form>
            {errorm && (
              <small className="text-danger fw-bolder">{errorm}</small>
            )}
          </div>
          <div
            style={{ height: "380px", overflowY: "scroll" }}
            className="card-body p-2"
          >
            <table className="table table-striped table-bordered">
              <thead>
                <tr className="text-center">
                  <th scope="col">
                    <i className="bi bi-trash"></i>
                  </th>
                  <th scope="col">
                    <i className="bi bi-pencil"></i>
                  </th>
                  <th scope="col">Descripción</th>
                  <th scope="col">Precio</th>
                </tr>
              </thead>
              <tbody>
                {modificadores.map((modificador, i) => (
                  <ModificadoresItem
                    key={i}
                    modificador={modificador}
                    idx={idx}
                    setIdx={setIdx}
                    index={i}
                    selectModificador={selectModificador}
                    deleteModificador={deleteModificador}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

const ModificadoresItem = ({
  modificador,
  idx,
  setIdx,
  index,
  selectModificador,
  deleteModificador,
}) => {
  return (
    <tr
      style={{ cursor: "default" }}
      onClick={() => setIdx(index)}
      className={`text-uppercase ${idx === index ? "bg-info" : ""}`}
    >
      <td>
        <button
          onClick={() => deleteModificador(index)}
          title="ELIMINAR"
          type="button"
          className="btn btn-danger btn-sm"
        >
          <i className="bi bi-trash"></i>
        </button>
      </td>
      <td>
        <button
          onClick={() => selectModificador(index)}
          title="EDITAR"
          type="button"
          className="btn btn-primary btn-sm ms-1"
        >
          <i className="bi bi-pencil"></i>
        </button>
      </td>
      <td>{modificador.name}</td>
      <td className="text-end">${modificador.price}</td>
    </tr>
  );
};

const SubcategoriasItem = ({
  subcategoria,
  categorias,
  selectSubcategoria,
  delSubcategora,
}) => {
  const [categoria, setCategoria] = useState({ name: "", fondo: "" });

  useEffect(() => {
    const cat = categorias.find(
      (categoria) => categoria.id === subcategoria.categoria_id
    );
    if (cat) {
      setCategoria(cat);
    }
  }, [categorias, subcategoria]);

  return (
    <li
      style={{ backgroundColor: categoria.fondo, cursor: "default" }}
      className="list-group-item text-uppercase d-flex justify-content-between aling-items-center"
    >
      <div>
        <p className="p-0 m-0 fw-bolder">{subcategoria.name}</p>
        <small className="m-0">{categoria.name}</small>
      </div>
      <div>
        <button
          onClick={() => delSubcategora(subcategoria.id)}
          title="ELIMINAR"
          type="button"
          className="btn btn-danger"
        >
          <i className="bi bi-trash"></i>
        </button>
        <button
          onClick={() => selectSubcategoria(subcategoria.id)}
          title="EDITAR"
          type="button"
          className="btn btn-primary ms-1"
        >
          <i className="bi bi-pencil"></i>
        </button>
      </div>
    </li>
  );
};
