function PagarCuentaModal(props) {
  const { sellarCuenta, cuenta, setCuenta, initialCuenta, commit } = useContext(
    AppContext
  );

  const inputEfectivo = useRef();
  const [values, setvalues] = useState({
    efectivo: 0,
    tarjeta: 0,
  });
  const [recibo, setRecibo] = useState(true);
  const [error, setError] = useState(null);
  const [imprimir, setImprimir] = useState(false);
  const [cuentaPagada, setCuentaPagada] = useState(initialCuenta);

  const handleValues = (e) => {
    setvalues({ ...values, [e.target.name]: e.target.value });
    setError(null);
  };

  const onRecibo = () => {
    setRecibo(!recibo);
  };

  const handleShow = () => {
    inputEfectivo.current.focus();
  };

  const handleExited = () => {
    setvalues({ efectivo: 0, tarjeta: 0 });
    setError("");
    setRecibo(true);
  };

  const handleSubmitPago = async (e) => {
    e.preventDefault();
    const cambio =
        parseInt(values.efectivo) - cuenta.total + parseInt(values.tarjeta),
      checkpago = parseInt(values.efectivo) + parseInt(values.tarjeta);

    if (checkpago >= cuenta.total) {
      const newCta = {
        ...cuenta,
        efectivo: parseInt(values.efectivo),
        tarjeta: parseInt(values.tarjeta),
        estado: "cerrado",
        cambio,
        closedAt: fechaISO(),
        time: timeAgo(new Date(cuenta.createdAt)),
      };
      setCuentaPagada(newCta);
      await commit("ha cobrado la orden " + cuenta.orden, operadorSession);
      sellarCuenta(cuenta.id, newCta);
      setCuenta(initialCuenta);
      document.title = "MAyLu";
      setImprimir(recibo);
      props.onHide();
    } else {
      setError("MONTO INCORRECTO");
      inputEfectivo.current.focus();
    }
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
        <div className="card">
          <div className="card-header">
            <h5 className="card-title">Pagar cuenta</h5>
            <h3>
              cambio: $
              <span>
                {parseInt(values.efectivo) -
                  cuenta.total +
                  parseInt(values.tarjeta)}
              </span>
            </h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmitPago}>
              <small className="form-text text-danger">{error}</small>
              <div className="mb-3">
                <label className="form-label">Total a pagar:</label>
                <div className="input-group input-group-lg">
                  <span className="input-group-text">$</span>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    value={cuenta.total}
                    readOnly
                  />
                  <span className="input-group-text">.00</span>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Efectivo:</label>
                <div className="input-group input-group-lg">
                  <span className="input-group-text">$</span>
                  <input
                    type="number"
                    name="efectivo"
                    ref={inputEfectivo}
                    className="form-control form-control-lg"
                    value={values.efectivo}
                    onChange={handleValues}
                    required
                    autoComplete="off"
                  />
                  <span className="input-group-text">.00</span>
                </div>
              </div>
              <div className="mb-3">
                <label>Tarjeta:</label>
                <div className="input-group input-group-lg">
                  <span className="input-group-text">$</span>
                  <input
                    type="number"
                    name="tarjeta"
                    onChange={handleValues}
                    className="form-control form-control-lg"
                    value={values.tarjeta}
                    autoComplete="off"
                  />
                  <span className="input-group-text">.00</span>
                </div>
              </div>
              <div className="form-check">
                <label className="form-check-label">
                  <input
                    type="checkbox"
                    name="recibo"
                    checked={recibo}
                    onChange={onRecibo}
                    className="form-check-input"
                  />
                  Imprimir recibo
                </label>
              </div>
              <div className="mb-3">
                <button type="submit" className="btn btn-success btn-lg">
                  Aceptar
                </button>
                <button
                  onClick={() => props.onHide()}
                  type="reset"
                  className="btn btn-danger btn-lg ms-2"
                >
                  Cancelar
                </button>
              </div>
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
