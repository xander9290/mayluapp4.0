function Cerradas() {
  const {
    cuentas,
    setCuentas,
    setCuenta,
    initialCuenta,
    selectCuenta,
    setIdx,
    idx,
  } = useContext(AppContext);

  const [cuentasCerradas, setCuentasCerradas] = useState([]);
  const [dateSearch, setDateSearch] = useState({
    fecha: fechaActual(Date.now()),
  });

  const handleFecha = (e) => {
    setDateSearch({ ...dateSearch, [e.target.name]: e.target.value });
    setCuentasCerradas([]);
  };

  const handleSubmitSear = (e) => {
    e.preventDefault();
    getCuentas(dateSearch.fecha)
      .then((data) => {
        if (data.length > 0) {
          //getCeuntasCerradas(data);
          setCuentas(data);
        } else {
          alert("no se encontraron cuentas".toUpperCase());
          setCuentas([]);
          setDateSearch({ fecha: fechaActual(Date.now()) });
        }
      })
      .catch((err) => console.log(err));
  };

  const getCuentas = async (d) => {
    const res = await fetch("/cuentas/historial/" + d);
    if (!res.ok) {
      const { url, status, statusText } = res;
      throw Error(`${status} ${statusText} ${url}`);
    }
    const data = await res.json();
    return data;
  };

  useEffect(() => {
    if (cuentas.length > 0) {
      getCeuntasCerradas(cuentas);
    }
  }, [cuentas]);

  const getCeuntasCerradas = (c) => {
    const ctaCerradas = c.filter(
      (cuenta) => cuenta.estado === "cerrado" || cuenta.estado === "cancelado"
    );
    setCuentasCerradas(ctaCerradas);
  };

  const resetIdx = () => {
    setIdx("");
    setCuenta(initialCuenta);
  };

  return (
    <Fragment>
      <div className="row">
        <div className="col-md-3 px-0">
          <form onSubmit={handleSubmitSear}>
            <div className="input-group">
              <input
                className="form-control"
                type="date"
                name="fecha"
                max={fechaActual(Date.now())}
                value={dateSearch.fecha}
                onChange={handleFecha}
                required
              />
              <span className="input-group-text p-0">
                <button
                  title="BUSCAR"
                  className="btn btn-primary"
                  type="submit"
                >
                  <i className="bi bi-search"></i>
                </button>
              </span>
            </div>
          </form>
        </div>
      </div>
      <div
        style={{ height: "600px", overflowY: "scroll", overflowX: "hidden" }}
        onClick={resetIdx}
        className="row"
      >
        {cuentasCerradas.map((cta) => (
          <CuentasCardCerradas
            key={cta.id}
            selectCuenta={selectCuenta}
            idx={idx}
            cta={cta}
          />
        ))}
      </div>
    </Fragment>
  );
}

const CuentasCardCerradas = ({ cta, selectCuenta, idx }) => {
  const [cancelaciones, setCancelaciones] = useState(false);
  useEffect(() => {
    if (cta.id) {
      checkCancelaciones();
    }
  }, [cta]);
  const checkCancelaciones = () => {
    let cls = false;
    cta.items.map((item) => {
      if (item.cancelado) {
        cls = true;
      }
    });
    setCancelaciones(cls);
  };
  return (
    <div key={cta.id} className="col-md-3 px-1 mb-2">
      <div
        onClick={(e) => {
          e.stopPropagation(), selectCuenta(cta.id);
        }}
        className={`card ${
          cta.estado === "cancelado" ? "bg-danger" : "bg-dark"
        } text-light`}
        role="button"
      >
        <div className="card-header">
          <h5 className="card-title text-uppercase d-flex justify-content-between">
            <span>{cta.servicio}</span>
            <span className="fw-bold">Orden: {cta.orden}</span>
          </h5>
        </div>
        <div
          className={`card-body p-2 text-center text-uppercase ${
            cta.id === idx ? "bg-primary" : ""
          }
  `}
        >
          <ul className="list-group text-dark">
            <li className="list-group-item text-nowrap border-0">
              {cta.servicio === "domicilio" || cta.servicio === "pll" ? (
                <Fragment>
                  <span className="fw-bold">cliente: </span>
                  {cta.torreta}
                </Fragment>
              ) : (
                <Fragment>
                  <span className="fw-bold">mesa: </span>
                  {cta.torreta}
                  <span className="fw-bold"> personas: </span>
                  {cta.personas}
                </Fragment>
              )}
            </li>
            <li className="list-group-item border-0">
              <span className="fw-bold">apertura: </span>
              {formatoFecha(cta.createdAt)[1]}
            </li>
            <li className="list-group-item border-0">
              <span className="fw-bold">Tiempo: </span>
              {cta.time}
            </li>
            <li className="list-group-item border-0">
              <span className="fw-bold">oper: </span>
              {cta.createdBy}
              <span className="fw-bold"> folio: </span>
              {cta.folio}
            </li>
          </ul>
        </div>
        <div
          className={`card-footer d-flex justify-content-between p-2 ${
            cancelaciones ? "border-2 border-danger" : ""
          }`}
        >
          {cta.impreso && <i className="bi bi-printer h4"></i>}
          <h4 className="text-uppercase">total: ${cta.total}</h4>
        </div>
      </div>
    </div>
  );
};
