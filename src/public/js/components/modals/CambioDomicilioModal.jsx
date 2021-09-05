function CambioDomicilioModal(props) {
  const { editarCuenta, cuenta, setCuenta, initialCuenta, operadores } =
    useContext(AppContext);

  const inputEfectivo = useRef();

  const [values, setValues] = useState({
    repartidor: "",
    efectivo: 0,
  });
  const [cambioRepartidor, setCambioRepartidor] = useState(false);
  const [error, setError] = useState(null);
  const [imprimir, setImprimir] = useState(false);
  const [cuentaPagada, setCuentaPagada] = useState(initialCuenta);

  const handleValues = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cuenta.repartidor === "") {
      const cambio = parseInt(values.efectivo) - cuenta.total;
      if (values.efectivo >= cuenta.total) {
        const newCta = {
          ...cuenta,
          efectivo: parseInt(values.efectivo),
          cambio,
          estado: "pendiente",
          repartidor: values.repartidor,
        };
        setCuentaPagada(newCta);
        editarCuenta(cuenta.id, newCta, async (res) => {
          if (res) {
            newCta.cambio > 0 ? await abrirCajon() : null;
            setImprimir(true);
            props.onHide();
          }
        });
      } else {
        setError("MONTO INCORRECTO");
        inputEfectivo.current.focus();
      }
    } else {
      const newCta = {
        ...cuenta,
        repartidor: values.repartidor,
      };
      editarCuenta(cuenta.id, newCta, async (res) => {
        if (res) {
          props.onHide();
        }
      });
    }
  };

  const checkIfCambiarRepartidor = () => {
    if (cuenta.repartidor !== "") {
      setValues({
        repartidor: cuenta.repartidor,
        efectivo: cuenta.efectivo,
      });
      setCambioRepartidor(true);
    }
  };

  const handleShow = () => {
    inputEfectivo.current.focus();
    checkIfCambiarRepartidor();
  };
  const handleExited = () => {
    setValues({
      repartidor: "",
      efectivo: 0,
    });
  };

  return (
    <Modal
      onHide={props.onHide}
      show={props.show}
      backdrop="static"
      keyboard={false}
      onShow={handleShow}
      onExited={handleExited}
      size="sm"
    >
      <Modal.Body>
        <div className="card bg-warning">
          <div className="card-header">
            <h5 className="card-title">
              {cambioRepartidor ? "Cambio de Repartidor" : "Asignar Repartidor"}
            </h5>
            <h2>
              CAMBIO: $<span>{parseInt(values.efectivo) - cuenta.total}</span>
            </h2>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Total a pagar:</label>
                <div className="input-group input-group-lg">
                  <span className="input-group-text">$</span>
                  <input
                    type="text"
                    className="form-control form-control-lg fw-bold"
                    value={cuenta.total}
                    readOnly
                  />
                  <span className="input-group-text">.00</span>
                </div>
              </div>
              <div className="mb-2">
                <label className="form-label">Efectivo:</label>
                <div className="input-group input-group-lg">
                  <span className="input-group-text">$</span>
                  <input
                    type="number"
                    name="efectivo"
                    ref={inputEfectivo}
                    className="form-control form-control-lg fw-bold"
                    value={values.efectivo}
                    onChange={handleValues}
                    required
                    autoComplete="off"
                    readOnly={cambioRepartidor}
                  />
                  <span className="input-group-text">.00</span>
                </div>
              </div>
              <div className="mb-2">
                <select
                  className="form-select form-select-lg"
                  name="repartidor"
                  value={values.repartidor}
                  onChange={handleValues}
                  required
                >
                  <option value="">Repartidor</option>
                  {operadores.map((operador, i) => (
                    <option
                      className="fw-bold h4 text-uppercase"
                      key={i}
                      value={operador.name}
                    >
                      {operador.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                {cambioRepartidor ? (
                  <button type="submit" className="btn btn-primary btn-lg">
                    Aceptar
                  </button>
                ) : (
                  <button type="submit" className="btn btn-secondary btn-lg">
                    Imprimir
                  </button>
                )}
                <button
                  onClick={() => props.onHide()}
                  type="reset"
                  className="btn btn-danger btn-lg ms-2"
                >
                  Cancelar
                </button>
              </div>
              <small className="form-text text-danger fw-bold bg-white">
                {error}
              </small>
            </form>
          </div>
        </div>
      </Modal.Body>
      <NotaClienteModal
        show={imprimir}
        onHide={() => setImprimir(false)}
        cuenta={cuentaPagada}
      />
    </Modal>
  );
}
