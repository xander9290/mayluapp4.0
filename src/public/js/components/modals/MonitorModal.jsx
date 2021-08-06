function MonitorModal(props) {
  const [showMonitor, setShowMonitor] = useState(false);

  const inputPswdRef = useRef();

  const handleShow = () => {
    inputPswdRef.current.focus();
  };
  const handleExited = () => {
    setShowMonitor(false);
  };

  return (
    <Modal
      onHide={props.onHide}
      show={props.show}
      backdrop="static"
      keyboard={false}
      onShow={handleShow}
      onExited={handleExited}
      size="md"
      centered
    >
      <div className="row bg-dark">
        {showMonitor ? (
          <Monitor onHide={props.onHide} />
        ) : (
          <FormConfirm
            onHide={props.onHide}
            inputPswdRef={inputPswdRef}
            setShowMonitor={setShowMonitor}
          />
        )}
      </div>
    </Modal>
  );
}

const FormConfirm = ({ onHide, inputPswdRef, setShowMonitor }) => {
  const { login, commit } = useContext(AppContext);

  const [values, setValues] = useState({
    name: operadorSession,
    pswd: "",
  });

  const handleValues = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmitLogin = (e) => {
    e.preventDefault();
    login(values, (res) => {
      if (res.response) {
        setShowMonitor(true);
        setValues({
          ...values,
          pswd: "",
        });
        commit("ha hecho una consulta al monitor de ventas", operadorSession);
      } else {
        alert("acceso denegado".toUpperCase());
      }
    });
  };

  useEffect(() => {
    return () => {};
  }, []);

  const cerrar = () => {
    setValues({
      ...values,
      pswd: "",
    });
    onHide();
  };

  return (
    <div className="col-md-8 offset-md-2">
      <form onSubmit={handleSubmitLogin}>
        <div className="mb-2">
          <label className="form-label text-light">AUTORIZACIÓN</label>
          <input
            className="form-control form-control-lg"
            type="password"
            name="pswd"
            maxLength="4"
            ref={inputPswdRef}
            value={values.pswd}
            onChange={handleValues}
            placeholder="Contraseña"
            required
            autoComplete="off"
          />
        </div>
        <button type="submit" className="btn btn-primary me-2">
          Aceptar
        </button>
        <button onClick={cerrar} type="reset" className="btn btn-danger">
          Cerrar
        </button>
      </form>
    </div>
  );
};
