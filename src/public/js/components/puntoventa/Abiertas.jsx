function Abiertas() {
  const { cuentas, setCuenta, initialCuenta, selectCuenta, setIdx, idx } =
    useContext(AppContext);

  const [cuentasAbiertas, setCuentasAbiertas] = useState([]);

  useEffect(() => {
    if (cuentas.length > 0) {
      const ctaAbiertas = cuentas.filter(
        (cuenta) => cuenta.estado !== "cerrado"
      );
      setCuentasAbiertas(ctaAbiertas);
    }
  }, [cuentas]);

  const resetIdx = () => {
    setIdx("");
    setCuenta(initialCuenta);
  };

  return (
    <div onClick={resetIdx} className="row">
      {cuentasAbiertas.map((cta) => (
        <CuentasCard
          key={cta.id}
          selectCuenta={selectCuenta}
          idx={idx}
          cta={cta}
        />
      ))}
    </div>
  );
}

const CuentasCard = ({ cta, selectCuenta, idx }) => {
  const [timestate, setTimestate] = useState("00:00");
  const [cancelaciones, setCancelaciones] = useState(false);

  const isMounted = useRef(true);
  useEffect(() => {
    setInterval(() => {
      if (isMounted.current) {
        checkTime();
      }
    }, 1000);

    return () => {
      isMounted.current = false;
    };
  }, []);

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

  const checkTime = () => {
    const diff = timeAgo(new Date(cta.createdAt));
    setTimestate(diff);
  };

  return (
    <div key={cta.id} className="col-md-3 mb-2 px-1">
      <div
        onClick={(e) => {
          e.stopPropagation(), selectCuenta(cta.id);
        }}
        className={`card text-dark ${
          cta.estado === "pendiente" ? "bg-warning" : ""
        }`}
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
          }`}
        >
          <ul className="list-group">
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
              {timestate}
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
