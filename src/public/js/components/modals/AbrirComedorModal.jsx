const initialComedor = {
  torreta: "",
  personas: 1,
  servicio: "comedor",
};

const initialCliente = {
  name: "",
  tel: "",
  address: {
    calle: "",
    cruces: "",
    colonia: "",
    obs: "",
  },
  codigo: null,
  id: null,
};

function AbrirComedorModal(props) {
  const { clientes, cuentas, cuenta, createCuenta, editarCuenta } = useContext(
    AppContext
  );

  const [comedor, setComedor] = useState(initialComedor);
  const [cliente, setCliente] = useState(initialCliente);
  const [error, setError] = useState(null);

  const mesaInputRef = useRef();
  const telInputRef = useRef();

  const handleValues = (e) => {
    setComedor({ ...comedor, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleValuesCliente = (e) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
    setError(null);
  };

  const findCliente = (e) => {
    e.preventDefault();
    const cte = clientes.find(
      (cte) =>
        cte.tel.trim() === cliente.tel.trim() ||
        cte.codigo === parseInt(cliente.tel)
    );
    if (cte) {
      setCliente({
        name: cte.name,
        tel: cte.tel,
        address: {
          calle: cte.calle,
          cruces: cte.cruces,
          colonia: cte.colonia,
          obs: cte.obs,
        },
        codigo: cte.codigo,
        id: cte.id,
      });
    } else {
      setCliente(initialCliente);
      telInputRef.current.focus();
      setError("cliente no encontrado");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let existe = false;
    const cuentasAbiertas = cuentas.filter(
      (cuenta) => cuenta.estado === "abierto"
    );
    cuentasAbiertas.map((cuenta) => {
      if (cuenta.torreta.trim() === comedor.torreta.trim()) {
        existe = true;
      }
    });
    if (existe) {
      setError("mesa no disponible");
      mesaInputRef.current.focus();
    } else {
      if (cuenta.id) {
        const newCta = {
          ...cuenta,
          ...comedor,
          cliente,
        };
        editarCuenta(cuenta.id, newCta);
        props.onHide();
      } else {
        const newCta = {
          ...cuenta,
          ...comedor,
          cliente,
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
    }
  };

  const handleShow = (e) => {
    mesaInputRef.current.focus();
    if (cuenta.id) {
      setComedor({ ...comedor, torreta: cuenta.torreta });
    }
  };
  const handleExited = (e) => {
    setCliente(initialCliente);
    setComedor(initialComedor);
  };

  return (
    <Modal
      onHide={props.onHide}
      show={props.show}
      size="sm"
      backdrop="static"
      keyboard={false}
      onShow={handleShow}
      onExited={handleExited}
    >
      <div className="card text-dark">
        <div className="card-header">
          <h5 className="card-title">Abrir Cuenta en Comedor</h5>
        </div>
        <div className="card-body">
          <ul className="nav nav-tabs mb-1" role="tablist">
            <li className="nav-item" role="cuentaComedor">
              <button
                className="nav-link active"
                data-bs-toggle="tab"
                data-bs-target="#torreta"
                aria-selected="true"
                type="button"
              >
                Torreta
              </button>
            </li>
            <li className="nav-item" role="cuentaComedor">
              <button
                className="nav-link"
                data-bs-toggle="tab"
                data-bs-target="#cliente"
                aria-selected="false"
                type="button"
              >
                Cliente
              </button>
            </li>
          </ul>
          <div className="tab-content">
            <div className="tab-pane fade show active" id="torreta">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    name="torreta"
                    value={comedor.torreta}
                    onChange={handleValues}
                    ref={mesaInputRef}
                    autoComplete="off"
                    required
                    placeholder="Mesa"
                  />
                  <small className="form-text text-danger fw-bolder">
                    {error}
                  </small>
                </div>
                <div className="mb-3">
                  <input
                    className="form-control form-control-lg"
                    type="number"
                    name="personas"
                    value={comedor.personas}
                    onChange={handleValues}
                    min="1"
                    autoComplete="off"
                    required
                    placeholder="Personas"
                  />
                </div>
                <div className="mb-3">
                  {cuenta.id ? (
                    <button type="submit" className="btn btn-primary btn-lg">
                      <i className="bi bi-pencil me-2"></i>
                      Editar
                    </button>
                  ) : (
                    <button type="submit" className="btn btn-primary btn-lg">
                      <i className="bi bi-file-plus me-2"></i>
                      Abrir
                    </button>
                  )}
                  <button
                    onClick={props.onHide}
                    type="reset"
                    className="btn btn-danger btn-lg ms-2"
                  >
                    <i className="bi bi-x-square me-2"></i>
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
            <div className="tab-pane fade" id="cliente">
              <form onSubmit={findCliente}>
                <div className="row mb-3 px-3">
                  <div className="col-md-8 px-0">
                    <input
                      className="form-control form-control-lg"
                      type="text"
                      name="tel"
                      ref={telInputRef}
                      value={cliente.tel}
                      onChange={handleValuesCliente}
                      autoComplete="off"
                      placeholder="Buscar..."
                      required
                    />
                    <small className="form-text">Sólo teléfono</small>
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
                </div>
                <div className="mb-3">
                  <input
                    className="form-control form-control-lg"
                    type="name"
                    value={cliente.name}
                    onChange={handleValuesCliente}
                    autoComplete="off"
                    placeholder="Nombre"
                    readOnly
                  />
                  <small className="form-text text-danger fw-bolder text-uppercase">
                    {error}
                  </small>
                </div>
                <div className="mb-3">
                  <input
                    className="form-control form-control-lg"
                    type="calle"
                    value={cliente.address.calle}
                    onChange={handleValuesCliente}
                    autoComplete="off"
                    placeholder="Calle"
                    readOnly
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
