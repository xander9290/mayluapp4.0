function General() {
  return (
    <div className="row">
      <div className="col-md-3">
        <MediosDePago />
      </div>
      <div className="col-md-4">
        <Tickets />
      </div>
    </div>
  );
}

function Tickets() {
  return (
    <div className="card text-dark">
      <div className="card-header">
        <h4 className="card-title">Tickets</h4>
        <div
          style={{ overflowX: "scroll" }}
          id="menu-tickets"
          className="list-group list-group-horizontal"
        >
          <a
            className="list-group-item list-group-item-action"
            href="#notaCliente"
          >
            Cliente
          </a>
          <a
            className="list-group-item list-group-item-action"
            href="#notaNegocio"
          >
            Negocio
          </a>
          <a
            className="list-group-item list-group-item-action"
            href="#notaResumen"
          >
            Resumen
          </a>
          <a
            className="list-group-item list-group-item-action"
            href="#notaDetallado"
          >
            Detallado
          </a>
        </div>
      </div>
      <div
        data-bs-spy="scroll"
        data-bs-target="#menu-tickets"
        data-bs-offset="0"
        style={{ height: "450px", overflowY: "scroll" }}
        className="card-body py-0"
        tabIndex="0"
      >
        <NotaCliente />
        <NotaNegocio />
      </div>
    </div>
  );
}

function NotaCliente() {
  const { changeNotaClienteSettings } = useContext(SettingsContext);

  const [values, setValues] = useState({
    logoTitle: "",
    logoSubtitle: "",
    infoAddress1: "",
    infoAddress2: "",
    infoAddress3: "",
    infoTel: "",
    infoWapp: "",
    footerMsg1: "",
    footerMsg2: "",
    footerMsg3: "",
  });

  useEffect(() => {
    if (localStorage.getItem("settings")) {
      const parseSettings = JSON.parse(localStorage.getItem("settings"));
      setValues({ ...parseSettings.notaCliente });
    }
  }, []);

  const handleValues = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!confirm("confirmar cambios".toUpperCase())) return;
    changeNotaClienteSettings(values);
  };

  return (
    <form id="notaCliente" onSubmit={handleSubmit}>
      <fieldset>
        <legend>Nota Cliente</legend>
        <div className="mb-2">
          <h6>Logotipo</h6>
          <label>Título de logotipo</label>
          <input
            type="text"
            className="form-control"
            name="logoTitle"
            value={values.logoTitle}
            onChange={handleValues}
            autoComplete="off"
          />
          <label>Subtítulo de logotipo</label>
          <input
            type="text"
            className="form-control"
            name="logoSubtitle"
            value={values.logoSubtitle}
            onChange={handleValues}
            autoComplete="off"
          />
        </div>
        <div className="mb-2">
          <h6>Dirección y Contacto</h6>
          <label>Dirección 1</label>
          <input
            type="text"
            className="form-control"
            name="infoAddress1"
            value={values.infoAddress1}
            onChange={handleValues}
            autoComplete="off"
          />
          <label>Dirección 2</label>
          <input
            type="text"
            className="form-control"
            name="infoAddress2"
            value={values.infoAddress2}
            onChange={handleValues}
            autoComplete="off"
          />
          <label>Dirección 3</label>
          <input
            type="text"
            className="form-control"
            name="infoAddress3"
            value={values.infoAddress3}
            onChange={handleValues}
            autoComplete="off"
          />
          <label>Teléfono(s)</label>
          <input
            type="text"
            className="form-control"
            name="infoTel"
            value={values.infoTel}
            onChange={handleValues}
            autoComplete="off"
          />
          <label>WhatsApp</label>
          <input
            type="text"
            className="form-control"
            name="infoWapp"
            value={values.infoWapp}
            onChange={handleValues}
            autoComplete="off"
          />
        </div>
        <div className="mb-2">
          <h6>Pie de Nota</h6>
          <label>Leyenda 1</label>
          <input
            type="text"
            className="form-control"
            name="footerMsg1"
            value={values.footerMsg1}
            onChange={handleValues}
            autoComplete="off"
          />
          <label>Leyenda 2</label>
          <input
            type="text"
            className="form-control"
            name="footerMsg2"
            value={values.footerMsg2}
            onChange={handleValues}
            autoComplete="off"
          />
          <label>Leyenda 3</label>
          <input
            type="text"
            className="form-control"
            name="footerMsg3"
            value={values.footerMsg3}
            onChange={handleValues}
            autoComplete="off"
          />
        </div>
      </fieldset>
      <button type="submit" className="btn btn-primary btn-sm mb-3">
        Guardar
      </button>
    </form>
  );
}

function NotaNegocio() {
  const { changeNotaNegocioSettings } = useContext(SettingsContext);

  const [checkNegocioAreas, setCheckNegocioAreas] = useState({
    area1: true,
    area2: true,
    area3: true,
    area4: true,
  });

  const [checkNegocioTotal, setCheckNegocioTotal] = useState({
    subtotal: true,
    descuento: true,
    total: true,
    efectivo: true,
    tarjeta: true,
    cambio: true,
  });

  useEffect(() => {
    if (localStorage.getItem("settings")) {
      const parseSettings = JSON.parse(localStorage.getItem("settings"));
      setCheckNegocioAreas({ ...parseSettings.notaNegocio.areasVisibles });
      setCheckNegocioTotal({ ...parseSettings.notaNegocio.totalInfo });
    }
  }, []);

  const handleCheckNegocioAreas = (e) => {
    setCheckNegocioAreas({
      ...checkNegocioAreas,
      [e.target.name]: e.target.checked,
    });
  };

  const handleCheckNegocioTotal = (e) => {
    setCheckNegocioTotal({
      ...checkNegocioTotal,
      [e.target.name]: e.target.checked,
    });
  };

  const handleSubmitNegocio = (e) => {
    e.preventDefault();
    if (!confirm("confirmar cambios".toUpperCase())) return;
    const newSettings = {
      areasVisibles: checkNegocioAreas,
      totalInfo: checkNegocioTotal,
    };
    changeNotaNegocioSettings(newSettings);
  };
  return (
    <form id="notaNegocio" onSubmit={handleSubmitNegocio}>
      <fieldset>
        <legend>Nota Negocio</legend>
        <div className="mb-2">
          <h6>Áreas Visibles</h6>
          <div className="form-check form-check-inline form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              name="area1"
              checked={checkNegocioAreas.area1}
              onChange={handleCheckNegocioAreas}
            />
            <label>Area 1</label>
          </div>
          <div className="form-check form-check-inline form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              name="area2"
              checked={checkNegocioAreas.area2}
              onChange={handleCheckNegocioAreas}
            />
            <label>Area 2</label>
          </div>
          <div className="form-check form-check-inline form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              name="area3"
              checked={checkNegocioAreas.area3}
              onChange={handleCheckNegocioAreas}
            />
            <label>Area 3</label>
          </div>
          <div className="form-check form-check-inline form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              name="area4"
              checked={checkNegocioAreas.area4}
              onChange={handleCheckNegocioAreas}
            />
            <label>Area 4</label>
          </div>
        </div>
        <div className="mb-2">
          <h6>Información Totales</h6>
          <div className="form-check form-check-inline form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              name="subtotal"
              checked={checkNegocioTotal.subtotal}
              onChange={handleCheckNegocioTotal}
            />
            <label>Subtotal</label>
          </div>
          <div className="form-check form-check-inline form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              name="descuento"
              checked={checkNegocioTotal.descuento}
              onChange={handleCheckNegocioTotal}
            />
            <label>Descuento</label>
          </div>
          <div className="form-check form-check-inline form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              name="total"
              checked={checkNegocioTotal.total}
              onChange={handleCheckNegocioTotal}
            />
            <label>Total</label>
          </div>
          <div className="form-check form-check-inline form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              name="efectivo"
              checked={checkNegocioTotal.efectivo}
              onChange={handleCheckNegocioTotal}
            />
            <label>Efectivo</label>
          </div>
          <div className="form-check form-check-inline form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              name="tarjeta"
              checked={checkNegocioTotal.tarjeta}
              onChange={handleCheckNegocioTotal}
            />
            <label>Tarjeta</label>
          </div>
          <div className="form-check form-check-inline form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              name="cambio"
              checked={checkNegocioTotal.cambio}
              onChange={handleCheckNegocioTotal}
            />
            <label>Cambio</label>
          </div>
        </div>
      </fieldset>
      <button className="btn btn-primary btn-sm mb-3" type="submit">
        Guardar
      </button>
    </form>
  );
}

function NotaResumen() {
  const handleSubmitResumen = () => {};
  return (
    <form id="notaResumen" onSubmit={handleSubmitResumen}>
      <fieldset>
        <legend>Resumen</legend>
        <div className="mb-2">
          <h6>Áreas Visibles</h6>
          <div className="form-check form-check-inline form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              name="area1"
              checked={checkNegocioAreas.area1}
              onChange={handleCheckNegocioAreas}
            />
            <label>Area 1</label>
          </div>
          <div className="form-check form-check-inline form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              name="area2"
              checked={checkNegocioAreas.area2}
              onChange={handleCheckNegocioAreas}
            />
            <label>Area 2</label>
          </div>
          <div className="form-check form-check-inline form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              name="area3"
              checked={checkNegocioAreas.area3}
              onChange={handleCheckNegocioAreas}
            />
            <label>Area 3</label>
          </div>
          <div className="form-check form-check-inline form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              name="area4"
              checked={checkNegocioAreas.area4}
              onChange={handleCheckNegocioAreas}
            />
            <label>Area 4</label>
          </div>
        </div>
        <div className="mb-2">
          <h6>Información Totales</h6>
          <div className="form-check form-check-inline form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              name="subtotal"
              checked={checkNegocioTotal.subtotal}
              onChange={handleCheckNegocioTotal}
            />
            <label>Subtotal</label>
          </div>
          <div className="form-check form-check-inline form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              name="descuento"
              checked={checkNegocioTotal.descuento}
              onChange={handleCheckNegocioTotal}
            />
            <label>Descuento</label>
          </div>
          <div className="form-check form-check-inline form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              name="total"
              checked={checkNegocioTotal.total}
              onChange={handleCheckNegocioTotal}
            />
            <label>Total</label>
          </div>
          <div className="form-check form-check-inline form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              name="efectivo"
              checked={checkNegocioTotal.efectivo}
              onChange={handleCheckNegocioTotal}
            />
            <label>Efectivo</label>
          </div>
          <div className="form-check form-check-inline form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              name="tarjeta"
              checked={checkNegocioTotal.tarjeta}
              onChange={handleCheckNegocioTotal}
            />
            <label>Tarjeta</label>
          </div>
          <div className="form-check form-check-inline form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              name="cambio"
              checked={checkNegocioTotal.cambio}
              onChange={handleCheckNegocioTotal}
            />
            <label>Cambio</label>
          </div>
        </div>
      </fieldset>
      <button className="btn btn-primary btn-sm mb-3" type="submit">
        Guardar
      </button>
    </form>
  );
}

function MediosDePago() {
  const { otrosMedios, createMedio, delMedio } = useContext(AppContext);

  const [values, setValues] = useState({ name: "" });
  const [error, setError] = useState(null);

  const handleValues = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newMedio = {
      name: values.name,
    };
    createMedio(newMedio, (res) => {
      if (res === "success") {
        cancelar();
      } else {
        setError(res);
      }
    });
  };

  const cancelar = () => {
    setValues({ name: "" });
    setError(null);
  };

  return (
    <form className="card text-dark" onSubmit={handleSubmit}>
      <div className="card-header">
        <h5 className="card-title">Medios de Pago</h5>
        <div className="row">
          <div className="col-md-6 px-1">
            <input
              className="form-control form-control-sm"
              type="text"
              name="name"
              value={values.name}
              onChange={handleValues}
              placeholder="Nuevo"
              autoComplete="off"
              required
            />
          </div>
          <div className="col-md-4 px-1">
            <button
              title="AGREGAR"
              className="btn btn-primary btn-sm"
              type="submit"
            >
              <i className="bi bi-plus-circle"></i>
            </button>
            <button
              onClick={cancelar}
              title="CANCELAR"
              className="btn btn-warning btn-sm ms-2"
              type="reset"
            >
              <i className="bi bi-x-circle"></i>
            </button>
          </div>
        </div>
        {error && <small className="text-danger fw-bold">{error}</small>}
      </div>
      <div
        style={{ height: "200px", overflowY: "scroll" }}
        className="card-body"
      >
        <ul className="list-group text-dark">
          {otrosMedios.map((medio) => (
            <li
              key={medio.id}
              style={{ cursor: "default" }}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span className="text-uppercase">{medio.name}</span>
              <div>
                <button
                  onClick={() => delMedio(medio.id)}
                  title="ELIMINAR"
                  type="button"
                  className="btn btn-danger"
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </form>
  );
}
