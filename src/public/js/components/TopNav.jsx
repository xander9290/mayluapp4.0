function TopNav() {
  return (
    <nav className="navbar navbar-dark bg-dark border-bottom border-1">
      <div className="nav nav-tabs px-2 border-0" role="tablist">
        <button
          type="button"
          className="nav-link bg-success text-uppercase text-light h6"
          data-bs-toggle="tab"
          data-bs-target="#puntoventa"
          aria-selected="false"
        >
          punto de venta
        </button>
        <button
          type="button"
          className="nav-link bg-success text-uppercase text-light h6 ms-1"
          data-bs-toggle="tab"
          data-bs-target="#admin"
          aria-selected="false"
        >
          administración
        </button>
      </div>
      <OperadorInfo />
    </nav>
  );
}

function OperadorInfo() {
  const { commit } = useContext(AppContext);

  const [clock, setClock] = useState("00:00 -.-.");
  const [abierto, setAbierto] = useState(true);

  const isMounted = useRef(true);

  useEffect(() => {
    if (isMounted.current) {
      setInterval(() => {
        const [string] = myClock();
        setClock(string);
        if (string >= "2:00 p.m." && string <= "9:30 p.m.") {
          setAbierto(true);
        } else {
          setAbierto(false);
        }
      }, 1000);
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  const logOut = () => {
    sessionStorage.clear();
    commit("ha cerrado sesión", operadorSession);
    window.location.href = window.location.href;
  };

  return (
    <ul className="list-group list-group-horizontal me-2">
      <li className="list-group-item text-uppercase">{operadorSession}</li>
      <li className="list-group-item">
        <h5 className="p-0 m-0">{clock}</h5>
      </li>
      <li
        onClick={logOut}
        className="list-group-item text-danger text-uppercase"
        role="button"
      >
        <small>Salir</small>
      </li>
    </ul>
  );
}
