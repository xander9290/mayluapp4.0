const initialCaja = {
  tipo: "",
  concepto: "",
  importe: 0,
};

function Caja() {
  const { cajas, createCaja, delCaja } = useContext(AppContext);

  const [caja, setCaja] = useState(initialCaja);
  const [abrirCajaModal, setAbrirCajaModal] = useState(false);
  const [items, setItems] = useState("");

  useEffect(() => {
    if (caja.id) {
      setAbrirCajaModal(true);
    }
  }, [caja]);

  const handleValues = (e) => {
    setCaja({ ...caja, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCaja = {
      ...caja,
      importe: parseInt(caja.importe),
      createdAt: fechaISO(),
      fecha: fechaActual(Date.now()),
      createdBy: operadorSession,
    };
    createCaja(newCaja, (res) => {
      setCaja(res);
    });
    cancelar();
  };

  const cancelar = (e) => {
    setCaja(initialCaja);
  };

  return (
    <div className="row">
      <div className="col-md-4">
        <form className="card text-dark" onSubmit={handleSubmit}>
          <div className="card-header">
            <h5 className="card-title text-uppercase">gastos y depósitos</h5>
          </div>
          <div className="card-body">
            <div className="mb-2">
              <label className="form-label">Tipo:</label>
              <select
                className="form-select form-select-lg"
                name="tipo"
                value={caja.tipo}
                onChange={handleValues}
              >
                <option> </option>
                <option value="gasto">Gasto</option>
                <option value="deposito">Depósito</option>
              </select>
            </div>
            <div className="mb-2">
              <label className="form-label">Concepto:</label>
              <input
                className="form-control form-control-lg"
                type="text"
                name="concepto"
                value={caja.concepto}
                onChange={handleValues}
                required
                autoComplete="off"
              />
            </div>
            <label className="form-label">Importe:</label>
            <div className="input-group input-group-lg mb-2">
              <span className="input-group-text">$</span>
              <input
                className="form-control form-control-lg"
                type="number"
                name="importe"
                min="0"
                value={caja.importe}
                onChange={handleValues}
                autoComplete="off"
                required
              />
              <span className="input-group-text">.00</span>
            </div>
            <div className="mb-2">
              <button
                title="AGREGAR"
                className="btn btn-primary btn-lg me-2"
                type="submit"
              >
                <i className="bi bi-plus-circle me-2"></i>
                Agregar
              </button>
              <button
                onClick={cancelar}
                title="CANCELAR"
                className="btn btn-warning btn-lg"
                type="reset"
              >
                <i className="bi bi-x-circle me-2"></i>
                Cancelar
              </button>
            </div>
          </div>
        </form>
      </div>
      <div className="col-md-8">
        <div className="card text-dark">
          <div className="card-header">
            <h5 className="card-title text-uppercase">movientos</h5>
          </div>
          <div
            style={{
              height: "550px",
              overflowY: "scroll",
              overflowX: "scroll",
            }}
            className="card-body p-1"
          >
            <table className="table table-bordered border-dark">
              <thead>
                <tr className="text-center text-uppercase bg-secondary text-light">
                  <th scope="col">
                    <i className="bi bi-trash"></i>
                  </th>
                  <th scope="col">Concepto</th>
                  <th scope="col">Tipo</th>
                  <th scope="col">importe</th>
                  <th scope="col">fecha</th>
                  <th scope="col">folio</th>
                  <th scope="col">operador</th>
                </tr>
              </thead>
              <tbody>
                {cajas.map((caja) => (
                  <tr
                    style={{ cursor: "default" }}
                    onClick={() => setItems(caja.id)}
                    key={caja.id}
                    className={`text-uppercase ${
                      items === caja.id ? "bg-info" : ""
                    }`}
                  >
                    <th scope="row" className="text-center">
                      <button
                        onClick={() => delCaja(caja.id)}
                        title="ELIMINAR"
                        type="button"
                        className="btn btn-danger btn-sm"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </th>
                    <th className="text-nowrap">{caja.concepto}</th>
                    <th>{caja.tipo}</th>
                    <th className="text-end">${caja.importe}</th>
                    <th className="text-nowrap">
                      {caja.createdAt && formatoFecha(caja.createdAt)[0]}
                    </th>
                    <th className="text-center">{caja.folio && caja.folio}</th>
                    <th>{caja.createdBy}</th>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <CajaModal
        show={abrirCajaModal}
        onHide={() => setAbrirCajaModal(false)}
        setCaja={setCaja}
        caja={caja}
      />
    </div>
  );
}
