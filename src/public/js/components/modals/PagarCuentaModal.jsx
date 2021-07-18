function PagarCuentaModal(props) {
  const { sellarCuenta, cuenta, setCuenta, initialCuenta, commit } =
    useContext(AppContext);

  const inputEfectivo = useRef();
  const inputTarjeta = useRef();

  const [values, setvalues] = useState({
    efectivo: 0,
    tarjeta: 0,
    otros: 0,
    medioName: "",
  });
  const [comision, setComision] = useState({
    porcentaje: 0,
    importe: 0,
    total: 0,
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
    setvalues({ efectivo: 0, tarjeta: 0, otros: 0, medioName: "" });
    setComision({ porcentaje: 0, importe: 0 });
    setError("");
    setRecibo(true);
  };

  const establecerComision = (e) => {
    e.stopPropagation();
    const comisionPorcentaje = prompt(
      "Establece el porcentaje de la comisión %".toUpperCase()
    );
    if (!comisionPorcentaje) return;
    const calcularComision = Math.round(
      (cuenta.total * parseInt(comisionPorcentaje)) / 100
    );
    setComision({
      porcentaje: comisionPorcentaje,
      importe: calcularComision,
      total: calcularComision,
    });
    inputTarjeta.current.focus();
  };

  const handleSubmitPago = async (e) => {
    e.preventDefault();
    const cambio =
        parseInt(values.efectivo) -
        cuenta.total +
        parseInt(values.tarjeta) +
        parseInt(values.otros),
      checkpago =
        parseInt(values.efectivo) +
        parseInt(values.tarjeta) +
        parseInt(values.otros);

    const medios = [values.medioName, parseInt(values.otros)];

    if (values.otros > 0 && values.medioName === "") {
      setError("no ha especificado medio de pago".toUpperCase());
      return;
    }
    if (values.tarjeta > cuenta.total) {
      setError(
        "la cantidad en tarjeta no debe superar al total de la orden".toUpperCase()
      );
      return;
    }
    if (values.otros > cuenta.total) {
      setError(
        "la cantidad en este medio no debe superar al total de la orden".toUpperCase()
      );
      return;
    }
    if (checkpago >= cuenta.total) {
      const newCta = {
        ...cuenta,
        efectivo: parseInt(values.efectivo),
        tarjeta: parseInt(values.tarjeta),
        comision: [
          parseInt(comision.porcentaje),
          parseInt(comision.importe),
          parseInt(comision.total) + cuenta.total,
        ],
        otro_medio: medios,
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
      if (values.efectivo > 0) {
        await abrirCajon();
      }
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
            <h2>
              CAMBIO: $
              <span>
                {parseInt(values.efectivo) -
                  cuenta.total +
                  parseInt(values.tarjeta) +
                  parseInt(values.otros)}
              </span>
            </h2>
            <small className="form-text text-danger fw-bold">{error}</small>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmitPago}>
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
                <label>
                  Tarjeta:{" "}
                  <span className="fw-bold h5">
                    ${cuenta.total} + {comision.porcentaje}% = $
                    {comision.importe + cuenta.total}
                  </span>
                </label>
                <div className="input-group input-group-lg">
                  <span className="input-group-text">$</span>
                  <input
                    type="number"
                    name="tarjeta"
                    onChange={handleValues}
                    className="form-control form-control-lg"
                    value={values.tarjeta}
                    ref={inputTarjeta}
                    autoComplete="off"
                  />
                  <span className="input-group-text">
                    <button
                      onClick={establecerComision}
                      type="button"
                      className="btn btn-warning"
                    >
                      %
                    </button>
                  </span>
                </div>
              </div>
              <div className="mb-3">
                <select
                  name="medioName"
                  className="form-select form-select-lg text-uppercase"
                  value={values.medioName}
                  onChange={handleValues}
                >
                  <option>Otros Medios</option>
                  {props.medios.map((medio) => (
                    <option key={medio.id} value={medio.name}>
                      {medio.name}
                    </option>
                  ))}
                </select>
                <div className="input-group input-group-lg">
                  <span className="input-group-text">$</span>
                  <input
                    type="number"
                    name="otros"
                    onChange={handleValues}
                    className="form-control form-control-lg"
                    value={values.otros}
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
