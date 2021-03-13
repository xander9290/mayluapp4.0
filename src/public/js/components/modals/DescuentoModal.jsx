function DescuendoModal(props) {
  const { cuenta, editarCuenta } = useContext(AppContext);

  const inputRef = useRef();
  const [dscto, setDscto] = useState({
    dscto: 0,
  });

  const handleValues = (e) => {
    setDscto({ ...dscto, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const importe = cuenta.importe;
    const _dscto = parseInt(dscto.dscto);
    const total = Math.round((importe * _dscto) / 100);
    const totalDscto = importe - total;
    const newCta = {
      ...cuenta,
      dscto: total,
      total: totalDscto,
    };
    editarCuenta(cuenta.id, newCta, (res) => {
      if (res) {
        props.onHide();
      }
    });
  };

  const handleShow = () => {
    inputRef.current.focus();
  };

  const handleExited = () => {
    reset();
  };

  const reset = () => {
    setDscto({ dscto: 0 });
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
      centered
    >
      <form onSubmit={handleSubmit} className="card text-light bg-dark">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="card-title">Descuento a cuenta</h5>
          <button
            onClick={props.onHide}
            type="button"
            className="btn btn-danger text-uppercase"
          >
            <i className="bi bi-x"></i>
          </button>
        </div>
        <div className="card-body p-2">
          <label className="label-form">Porcentaje %</label>
          <div className="input-group input-group-lg mb-2">
            <input
              className="form-control form-control-lg"
              type="number"
              name="dscto"
              min="0"
              ref={inputRef}
              value={dscto.dscto}
              onChange={handleValues}
              autoComplete="off"
              required
            />
            <span className="input-group-text">%</span>
          </div>
          <button type="submit" className="btn btn-primary btn-lg me-2">
            Aceptar
          </button>
          <button
            onClick={reset}
            type="reset"
            className="btn btn-warning btn-lg"
          >
            Limpiar
          </button>
        </div>
      </form>
    </Modal>
  );
}
