function FormLogin() {
  const { operadores, login, commit } = useContext(AppContext);

  const [operador, setOperador] = useState({
    name: "",
    pswd: "",
    rol: "",
  });
  const [error, setError] = useState(null);
  const [idx, setIdx] = useState("");

  const pswdRef = useRef();

  const handleValue = (e) => {
    setOperador({ ...operador, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(operador, (res) => {
      if (res.response) {
        sessionStorage.setItem("operador", res.operador.name);
        sessionStorage.setItem("operadorRol", res.operador.rol);
        commit("ha iniciado sesión", operador.name);
        // window.location.href = window.location.href;
        window.location.reload();
      } else {
        setError("acceso denegado");
      }
    });
  };

  const selectOperador = (id) => {
    const oper = operadores.find((operador) => operador.id === id);
    if (oper) {
      setOperador({ ...operador, name: oper.name, pswd: "" });
      setError(null);
      pswdRef.current.focus();
    }
  };

  const resetIdx = (e) => {
    e.stopPropagation();
    setIdx("");
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3 offset-4 mt-5">
          <form className="card" onSubmit={handleSubmit}>
            <div className="card-header" onClick={resetIdx}>
              <h5 className="card-title">Entrada</h5>
            </div>
            <div className="card-body p-2">
              <label className="form-label">Operador</label>
              <ul
                style={{
                  height: "150px",
                  overflowY: "scroll",
                  cursor: "pointer",
                }}
                className="list-group"
              >
                {operadores.map((operador) => (
                  <li
                    key={operador.id}
                    onClick={() => setIdx(operador.id)}
                    onDoubleClick={() => selectOperador(operador.id)}
                    className={`list-group-item text-uppercase fw-bold ${
                      operador.id === idx ? "bg-info" : ""
                    }`}
                  >
                    {operador.name}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-footer">
              <div className="mb-2">
                <input
                  className="form-control form-control-lg"
                  type="text"
                  name="name"
                  value={operador.name}
                  onChange={handleValue}
                  autoComplete="off"
                  required
                  placeholder="Operador"
                />
              </div>
              <div className="mb-2">
                <input
                  className="form-control form-control-lg"
                  type="password"
                  name="pswd"
                  ref={pswdRef}
                  value={operador.pswd}
                  onChange={handleValue}
                  maxLength="4"
                  autoComplete="off"
                  required
                  placeholder="Contraseña"
                />
              </div>
              <div className="mb-2 d-grid">
                <button type="submit" className="btn btn-primary btn-lg">
                  ENTRAR
                </button>
              </div>
            </div>
            <div className="mb-2 text-center">
              <label className="form-label fw-bolder text-danger text-uppercase">
                {error}
              </label>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
