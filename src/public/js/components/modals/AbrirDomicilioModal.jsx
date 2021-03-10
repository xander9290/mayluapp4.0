const initCliente = {
  name: "",
  tel: "",
  calle: "",
  cruces: "",
  colonia: "",
  obs: "",
  id: null,
  codigo: null,
};
const initDisable = {
  btnEdit: true,
  btnAcept: true,
  form: "none",
};
function AbrirDomicilioModal(props) {
  const {
    cuenta,
    createCuenta,
    editarCuenta,
    clientes,
    crearCliente,
    editarCliente,
  } = useContext(AppContext);

  const [cliente, setCliente] = useState(initCliente);
  const [searchcliente, setSearchcliente] = useState({ entry: "" });
  const [foundclientes, setFoundclientes] = useState([]);
  const [error, setError] = useState(null);
  const [disable, setDisable] = useState(initDisable);

  const inputNameRef = useRef();
  const inputSearchRef = useRef();

  const handleValues = (e) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  const handleValueSearch = (e) => {
    setSearchcliente({ ...searchcliente, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmitSearch = (e) => {
    e.preventDefault();
    const res = clientes.filter(
      (cliente) =>
        cliente.tel.trim() === searchcliente.entry.trim() ||
        cliente.name.toUpperCase() === searchcliente.entry.toUpperCase() ||
        cliente.codigo === parseInt(searchcliente.entry)
    );
    if (res.length > 0) {
      setFoundclientes(res);
    } else {
      setError("cliente no encontrado");
    }
  };

  const selectFoundClinte = (id) => {
    const cte = clientes.find((cliente) => cliente.id === id);
    if (cte) {
      const formatCliente = {
        ...cte,
        calle: cte.address.calle,
        cruces: cte.address.cruces,
        colonia: cte.address.colonia,
        obs: cte.address.obs,
      };
      setCliente(formatCliente);
      setDisable({ ...disable, btnAcept: false, btnEdit: false });
    }
  };

  const clearSearch = () => {
    setFoundclientes([]);
    setSearchcliente({ entry: "" });
    setCliente(initCliente);
    setDisable(initDisable);
    inputSearchRef.current.focus();
  };

  const handleNuevo = () => {
    setDisable({ ...disable, form: "auto" });
    setCliente({ ...cliente, tel: searchcliente.entry });
    inputNameRef.current.focus();
  };

  const handleEditar = () => {
    setDisable({ ...disable, form: "auto", btnAcept: true });
    inputNameRef.current.focus();
  };

  const handleSubmitNuevo = (e) => {
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
      setDisable({ ...disable, btnAcept: false, form: "none" });
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
      crearCliente(newCliente, (cliente) => {
        const newCliente = {
          name: cliente.name,
          tel: cliente.tel,
          calle: cliente.address.calle,
          cruces: cliente.address.cruces,
          colonia: cliente.address.colonia,
          obs: cliente.address.obs,
          id: cliente.id,
          codigo: cliente.codigo,
        };
        setCliente(newCliente);
      });
      setDisable({ ...disable, btnAcept: false, form: "none" });
    }
  };

  const handleAceptar = () => {
    if (cuenta.id) {
      const newCta = {
        ...cuenta,
        items: cuenta.items,
        servicio: "domicilio",
        torreta: cliente.name,
        cliente: {
          name: cliente.name,
          tel: cliente.tel,
          address: {
            calle: cliente.calle,
            cruces: cliente.cruces,
            colonia: cliente.colonia,
            obs: cliente.obs,
          },
          id: cliente.id,
          codigo: cliente.codigo,
        },
        createdAt: fechaISO(),
      };
      editarCuenta(cuenta.id, newCta);
      props.onHide();
    } else {
      const newCta = {
        ...cuenta,
        servicio: "domicilio",
        torreta: cliente.name,
        cliente: {
          name: cliente.name,
          tel: cliente.tel,
          address: {
            calle: cliente.calle,
            cruces: cliente.cruces,
            colonia: cliente.colonia,
            obs: cliente.obs,
          },
          id: cliente.id,
          codigo: cliente.codigo,
        },
        createdAt: fechaISO(),
      };
      createCuenta(newCta, (res) => {
        if (res) {
          props.onHide();
          setTimeout(() => {
            props.openCaptura();
          }, 500);
        }
      });
    }
  };

  const handleShow = () => {
    inputSearchRef.current.focus();
  };

  const handleExited = () => {
    setCliente(initCliente);
    setFoundclientes([]);
    setSearchcliente({ entry: "" });
    setDisable(initDisable);
    setDisable(initDisable);
  };

  return (
    <Modal
      onHide={props.onHide}
      show={props.show}
      size="lg"
      backdrop="static"
      keyboard={false}
      onShow={handleShow}
      onExited={handleExited}
      dialogClassName="modal-domicilio"
    >
      <div className="container-fluid pt-2">
        <ul className="nav nav-pills mb-2" role="tablist">
          <li className="nav-item">
            <button
              className="nav-link active text-uppercase h6 py-3 border"
              type="button"
              data-bs-toggle="pill"
              data-bs-target="#formulario"
              role="tab"
              aria-selected="true"
            >
              formulario
            </button>
          </li>
          <li className="nav-item">
            <button
              className="nav-link text-uppercase h6 py-3 border ms-1"
              type="button"
              data-bs-toggle="pill"
              data-bs-target="#historial"
              role="tab"
              aria-selected="false"
            >
              historial
            </button>
          </li>
        </ul>
        <div className="tab-content">
          <div
            className="tab-pane fade show active"
            id="formulario"
            role="tabpanel"
          >
            <div className="row">
              {/* FORMULARIO DE CONTACTO */}
              <div className="col-md-7">
                <form onSubmit={handleSubmitNuevo} className="card text-dark">
                  <div className="card-header p-2">
                    <button
                      onClick={handleNuevo}
                      type="button"
                      className="btn btn-warning btn-lg text-uppercase fw-bold me-1"
                    >
                      nuevo
                    </button>
                    <button
                      type="button"
                      onClick={handleEditar}
                      disabled={disable.btnEdit}
                      className="btn btn-warning btn-lg text-uppercase fw-bold me-1"
                    >
                      editar
                    </button>
                    <button
                      type="button"
                      onClick={handleAceptar}
                      disabled={disable.btnAcept}
                      className="btn btn-success btn-lg text-uppercase fw-bold me-1"
                    >
                      aceptar
                    </button>
                    <button
                      onClick={props.onHide}
                      type="button"
                      className="btn btn-danger btn-lg text-uppercase fw-bold me-1"
                    >
                      cancelar
                    </button>
                  </div>
                  <div
                    style={{ pointerEvents: disable.form }}
                    className="card-body p-2"
                  >
                    <div className="mb-3">
                      <label className="form-label">Contacto</label>
                      <input
                        className="form-control form-control-lg mb-1"
                        type="text"
                        name="name"
                        ref={inputNameRef}
                        value={cliente.name}
                        onChange={handleValues}
                        autoComplete="off"
                        required
                        placeholder="Nombre"
                      />
                      <input
                        className="form-control form-control-lg mb-1"
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
                        className="form-control form-control-lg mb-1"
                        type="text"
                        name="calle"
                        value={cliente.calle}
                        onChange={handleValues}
                        autoComplete="off"
                        required
                        placeholder="Calle"
                      />
                      <input
                        className="form-control form-control-lg mb-1"
                        type="text"
                        name="cruces"
                        value={cliente.cruces}
                        onChange={handleValues}
                        autoComplete="off"
                        required
                        placeholder="Cruces"
                      />
                      <input
                        className="form-control form-control-lg mb-1"
                        type="text"
                        name="colonia"
                        value={cliente.colonia}
                        onChange={handleValues}
                        autoComplete="off"
                        required
                        placeholder="Colonia"
                      />
                      <textarea
                        className="form-control form-control-lg"
                        name="obs"
                        value={cliente.obs}
                        onChange={handleValues}
                        rows="2"
                        placeholder="Observaciones"
                      ></textarea>
                    </div>
                    <div className="mb-0">
                      <button
                        title="AGREGAR"
                        className="btn btn-primary btn-lg"
                        type="submit"
                      >
                        <i className="bi bi-save me-2"></i>
                        GUARDAR
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              {/* TARJETA DE BÚSQUEDA */}
              <div className="col-md-5">
                <div className="card text-dark">
                  <div className="card-header">
                    <form onSubmit={handleSubmitSearch}>
                      <div className="row">
                        <div className="col-md-7 px-0">
                          <input
                            className="form-control form-control-lg"
                            type="text"
                            name="entry"
                            ref={inputSearchRef}
                            value={searchcliente.entry}
                            onChange={handleValueSearch}
                            autoComplete="off"
                            required
                            placeholder="Buscar"
                          />
                        </div>
                        <div className="col-md-1 px-0">
                          <button
                            title="BUSCAR"
                            className="btn btn-primary btn-lg"
                            type="submit"
                          >
                            <i className="bi bi-search"></i>
                          </button>
                        </div>
                        <div className="col-md-1">
                          <button
                            onClick={clearSearch}
                            title="CANCELAR"
                            className="btn btn-warning btn-lg ms-3"
                            type="reset"
                          >
                            <i className="bi bi-x-circle"></i>
                          </button>
                        </div>
                      </div>
                      <small className="form-text fw-bold text-danger text-uppercase">
                        {error}
                      </small>
                    </form>
                  </div>
                  <div
                    style={{ height: "170px", overflowY: "scroll" }}
                    className="card-body p-2"
                  >
                    <ul className="list-group">
                      {foundclientes.map((cliente) => (
                        <button
                          key={cliente.id}
                          onClick={() => selectFoundClinte(cliente.id)}
                          type="button"
                          className="list-group-item list-group-item-action d-flex justify-content-between align-conten-center mb-2"
                        >
                          <span className="h4">{cliente.name}</span>
                          <span className="h5">#{cliente.codigo}</span>
                        </button>
                      ))}
                    </ul>
                  </div>
                  <div
                    style={{ height: "260px" }}
                    className="card-footer"
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div className="tab-pane fade" id="historial" role="tabpanel">
            <Historial cliente={cliente} />
          </div>
        </div>
      </div>
    </Modal>
  );
}

function Historial({ cliente }) {
  const [historial, setHistorial] = useState([]);
  const [cuenta, setCuenta] = useState({});

  useEffect(() => {
    if (cliente.id) {
      getHistorial(cliente.id)
        .then((data) => {
          setHistorial(data.reverse());
        })
        .catch((err) => console.log(err));
    } else {
      setHistorial([]);
    }
  }, [cliente]);

  const selectCuenta = (id) => {
    const cta = historial.find((cuenta) => cuenta.id === id);
    if (cta) {
      setCuenta(cta);
    }
  };

  return (
    <div className="row">
      <div className="col-md-4">
        <div className="card text-dark">
          <div className="card-header">
            <h5 className="card-title">
              Historial de pedidos{" "}
              <span className="badge bg-primary">{historial.length}</span>
            </h5>
          </div>
          <div
            style={{ height: "400px", overflowY: "scroll" }}
            className="card-body p-2"
          >
            <ul className="list-group">
              {historial.map((cuenta) => (
                <button
                  key={cuenta.id}
                  onClick={() => selectCuenta(cuenta.id)}
                  type="button"
                  className={`list-group-item list-group-item-action d-flex justify-content-between align-conten-center ${
                    cuenta.estado === "cancelado" ? "boder-2 border-danger" : ""
                  }`}
                >
                  <span className="h5">
                    {formatoFecha(cuenta.createdAt)[0]}
                  </span>
                </button>
              ))}
              {historial.length === 0 ? (
                <li className="list-group-item">
                  <h4 className="text-danger text-uppercase text-center">
                    sin historial
                  </h4>
                </li>
              ) : null}
            </ul>
          </div>
          <div className="card-footer"></div>
        </div>
      </div>
      <div className="col-md-8">
        <div className="card text-dark">
          <div className="card-header p-1">
            <ul className="list-group list-group-horizontal text-uppercase">
              <li className="list-group-item p-1">
                <span className="fw-bold">orden: </span>
                {cuenta.orden}
              </li>
              <li className="list-group-item p-1">
                <span className="fw-bold">apertura: </span>
                {cuenta.createdAt && formatoFecha(cuenta.createdAt)[1]}
              </li>
              <li className="list-group-item p-1">
                <span className="fw-bold">cierre: </span>
                {cuenta.closedAt && formatoFecha(cuenta.closedAt)[1]}
              </li>
              <li className="list-group-item p-1">
                <span className="fw-bold">operador: </span>
                {cuenta.createdBy}
              </li>
            </ul>
          </div>
          <div
            style={{ height: "400px", overflow: "scroll" }}
            className="card-body p-2"
          >
            <table className="table table-bordered">
              <thead>
                <tr className="text-uppercase text-center">
                  <th scope="col">cant</th>
                  <th scope="col">desc</th>
                  <th scope="col">importe</th>
                </tr>
              </thead>
              <tbody>
                {cuenta.items &&
                  cuenta.items.map((item, i) => (
                    <tr
                      key={i}
                      style={{ cursor: "default" }}
                      key={i}
                      className="fw-bold text-uppercase"
                    >
                      <td className="text-center fs-5">{item.cant}</td>
                      <td>
                        <p className="p-0 m-0 text-nowrap fs-5">{item.name}</p>
                        {item.modificadores.map((mod, i) => (
                          <small key={i}>
                            <p className="p-0 m-0 text-nowrap">
                              {">>"} {mod.name}{" "}
                              {mod.price > 0 ? "$" + mod.price : ""}
                            </p>
                          </small>
                        ))}
                      </td>
                      <td className="text-end fs-5">${item.importe}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="card-footer p-2 d-flex justify-content-end">
            <ul className="list-group list-group-horizontal text-uppercase">
              <li className="list-group-item">
                <h5>importe: ${cuenta.importe}</h5>
              </li>
              <li className="list-group-item">
                <h5>dscto: -${cuenta.dscto}</h5>
              </li>
              <li className="list-group-item">
                <h5>total: ${cuenta.total}</h5>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

const getHistorial = async (clienteId) => {
  const res = await fetch("/cuentas/history/" + clienteId);
  if (!res.ok) {
    const { url, status, statusText } = res;
    throw Error(`${status} ${statusText} ${url}`);
  }
  const data = await res.json();
  return data;
};
