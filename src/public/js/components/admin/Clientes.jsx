const initialCliente = {
  name: "",
  tel: "",
  calle: "",
  cruces: "",
  colonia: "",
  obs: "",
  codigo: null,
  createdAt: "",
  createdBy: "",
  lastEdit: "",
  id: null,
};

function Clientes() {
  const {
    clientes,
    crearCliente,
    editarCliente,
    delCliente,
    setSearchResultsClientes,
    fetchClientes,
  } = useContext(AppContext);

  const [cliente, setCliente] = useState(initialCliente);
  const [indx, setIndx] = useState("");
  const [error, setError] = useState(null);
  const [searchMessage, setSearchMessage] = useState(null);
  const [search, setSearch] = useState({ entry: "" });

  const handleValues = (e) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cliente.id) {
      const newCliente = {
        ...cliente,
        lastEdit: fechaISO(),
        address: {
          calle: cliente.calle,
          cruces: cliente.cruces,
          colonia: cliente.colonia,
          obs: cliente.obs,
        },
      };
      editarCliente(cliente.id, newCliente);
      cancelar();
    } else {
      const newCliente = {
        ...cliente,
        address: {
          calle: cliente.calle,
          cruces: cliente.cruces,
          colonia: cliente.colonia,
          obs: cliente.obs,
        },
        createdAt: fechaISO(),
        createdBy: operadorSession,
      };
      crearCliente(newCliente, (data) => {});
      cancelar();
    }
  };

  const selectCliente = (id) => {
    const clt = clientes.find((cliente) => cliente.id === id);
    if (clt) {
      const newcliente = {
        name: clt.name,
        tel: clt.tel,
        calle: clt.address.calle,
        cruces: clt.address.cruces,
        colonia: clt.address.colonia,
        obs: clt.address.obs,
        codigo: clt.codigo,
        createdAt: clt.createdAt,
        createdBy: clt.createdBy,
        lastEdit: clt.lastEdit,
        id: clt.id,
      };
      setCliente(newcliente);
    }
  };

  const handleSearch = (e) => {
    setSearch({ ...search, [e.target.name]: e.target.value });
    setSearchMessage(null);
  };

  const handleSubmitSearch = (e) => {
    e.preventDefault();
    const clientesResult = clientes.filter(
      (cliente) =>
        cliente.name.toLowerCase().includes(search.entry.toLowerCase()) ||
        cliente.tel.toLowerCase().includes(search.entry.toLowerCase()) ||
        cliente.codigo === parseInt(search.entry)
    );
    clientesResult.length === 0
      ? setSearchMessage("Sin resultados")
      : setSearchResultsClientes(clientesResult);

    if (clientesResult.length === 1) {
      const id = clientesResult[0].id;
      setIndx(id);
    }
  };

  const selectITem = (idx) => {
    setIndx(idx);
  };

  const cancelar = () => {
    setCliente(initialCliente);
    setIndx("");
    setError(null);
  };

  return (
    <Fragment>
      <div className="col-md-4">
        <form className="card text-dark" onSubmit={handleSubmit}>
          <div className="card-header">
            <h5 className="card-title">
              Clientes{" "}
              <span className="badge bg-primary">{clientes.length}</span>
              {cliente.id && "<Modo Edición>"}
            </h5>
          </div>
          <div style={{ height: "420px" }} className="card-body">
            <div className="mb-3">
              <label className="form-label">Contacto</label>
              <input
                className="form-control mb-1"
                type="text"
                name="name"
                value={cliente.name}
                onChange={handleValues}
                autoComplete="off"
                required
                placeholder="Nombre"
              />
              <input
                className="form-control"
                type="text"
                name="tel"
                value={cliente.tel}
                onChange={handleValues}
                autoComplete="off"
                required
                placeholder="Teléfono"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Dirección</label>
              <input
                className="form-control mb-1"
                type="text"
                name="calle"
                value={cliente.calle}
                onChange={handleValues}
                autoComplete="off"
                required
                placeholder="Calle"
              />
              <input
                className="form-control mb-1"
                type="text"
                name="cruces"
                value={cliente.cruces}
                onChange={handleValues}
                autoComplete="off"
                required
                placeholder="Cruces"
              />
              <input
                className="form-control mb-1"
                type="text"
                name="colonia"
                value={cliente.colonia}
                onChange={handleValues}
                autoComplete="off"
                placeholder="Colonia"
              />
              <textarea
                className="form-control"
                name="obs"
                value={cliente.obs}
                onChange={handleValues}
                rows="2"
                placeholder="Observaciones"
              ></textarea>
            </div>
            <div className="mb-3">
              {cliente.id ? (
                <button
                  title="EDITAR"
                  className="btn btn-primary"
                  type="submit"
                >
                  <i className="bi bi-pencil me-2"></i>
                  Editar
                </button>
              ) : (
                <button
                  title="AGREGAR"
                  className="btn btn-primary"
                  type="submit"
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Agregar
                </button>
              )}
              <button
                onClick={cancelar}
                title="CANCELAR"
                className="btn btn-warning ms-2"
                type="reset"
              >
                <i className="bi bi-x-circle me-2"></i>
                Cancelar
              </button>
            </div>
          </div>
          <div className="card-footer p-2">
            <p className="p-0 m-0">
              <span className="fw-bolder">Creación: </span>
              <span>
                {cliente.createdAt && formatoFecha(cliente.createdAt)}
              </span>
            </p>
            <p className="p-0 m-0">
              <span className="fw-bolder">Creado por: </span>
              <span>{cliente.createdBy}</span>
            </p>
            <p className="p-0 m-0">
              <span className="fw-bolder">Última edición: </span>
              <span>{cliente.lastEdit && formatoFecha(cliente.lastEdit)}</span>
            </p>
          </div>
        </form>
      </div>
      <div className="col-md-8">
        <div className="card text-dark">
          <div className="card-header d-flex justify-content-between align-items-center">
            <form onSubmit={handleSubmitSearch}>
              <div className="row">
                <div className="col-md-8 px-0">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    name="entry"
                    value={search.entry}
                    onChange={handleSearch}
                    autoComplete="off"
                    required
                    placeholder="Buscar..."
                  />
                </div>
                <div className="col-1 px-0">
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
            <button
              onClick={() => {
                setIndx(""), fetchClientes();
              }}
              type="button"
              className="btn btn-primary btn-lg"
            >
              <i className="bi bi-arrow-repeat me-2"></i>
              Actualizar
            </button>
          </div>
          <div
            style={{ height: "526px", overflowY: "scroll" }}
            className="card-body"
          >
            {searchMessage && (
              <small className="text-danger fw-bolder">{searchMessage}</small>
            )}
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
                  <th scope="col">Teléfono</th>
                  <th scope="col">calle</th>
                  <th scope="col">código</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((cliente) => (
                  <ClienteItem
                    key={cliente.id}
                    indx={indx}
                    cliente={cliente}
                    delCliente={delCliente}
                    selectITem={selectITem}
                    selectCliente={selectCliente}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <div className="card-footer"></div>
        </div>
      </div>
    </Fragment>
  );
}

const ClienteItem = ({
  cliente,
  indx,
  selectITem,
  delCliente,
  selectCliente,
}) => {
  return (
    <tr
      style={{ cursor: "default" }}
      onClick={() => selectITem(cliente.id)}
      className={`text-uppercase ${cliente.id === indx ? "bg-info" : ""}`}
    >
      <th scope="row" className="text-center">
        <button
          onClick={() => delCliente(cliente.id)}
          title="ELIMINAR"
          type="button"
          className="btn btn-danger btn-sm"
        >
          <i className="bi bi-trash"></i>
        </button>
      </th>
      <th scope="row" className="text-center">
        <button
          onClick={() => selectCliente(cliente.id)}
          title="EDITAR"
          type="button"
          className="btn btn-primary btn-sm"
        >
          <i className="bi bi-pencil"></i>
        </button>
      </th>
      <td>{cliente.name}</td>
      <td>{cliente.tel}</td>
      <td>{cliente.address.calle}</td>
      <td className="text-center">{cliente.codigo}</td>
    </tr>
  );
};
