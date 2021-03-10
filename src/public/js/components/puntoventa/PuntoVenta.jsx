function PuntoVenta() {
  const {
    cuenta,
    setCuenta,
    setIdx,
    initialCuenta,
    sellarCuenta,
    editarCuenta,
    commit,
  } = useContext(AppContext);
  const [abrirComedorModal, setAbrirComedorModal] = useState(false);
  const [abrirParallevarModal, setAbrirParallevarModal] = useState(false);
  const [abrirDomicilioModal, setAbrirDomicilioModal] = useState(false);
  const [abrirCapturaModal, setAbrirCapturaModal] = useState(false);
  const [abrirVistaCuenta, setAbrirVistaCuenta] = useState(false);
  const [abrirNotaLocalModal, setAbrirNotaLocalModal] = useState(false);
  const [abrirNotaClienteModal, setAbrirNotaClienteModal] = useState(false);
  const [abrirComandaModal, setAbrirComandaModal] = useState(false);
  const [abrirPagarCuentaModal, setAbrirPagarCuentaModal] = useState(false);
  const [abrirMonitorModal, setAbrirMonitorModal] = useState(false);

  useEffect(() => {
    if (cuenta.id) {
      if (cuenta.items.length === 0) return;
      if (cuenta.impreso) return;
      if (cuenta.estado !== "abierto") return;
      setTimeout(() => {
        setAbrirVistaCuenta(true);
      }, 200);
    }
  }, [cuenta]);

  const openCapturaModal = () => {
    if (cuenta.id) {
      setAbrirCapturaModal(true);
    } else {
      alert("Selecciona una cuenta para continuar".toUpperCase());
    }
  };

  const openVista = () => {
    if (cuenta.id) {
      setAbrirVistaCuenta(true);
    } else {
      alert("Selecciona una cuenta para continuar".toUpperCase());
    }
  };

  const openNotalLocal = () => {
    if (cuenta.id) {
      setAbrirNotaLocalModal(true);
    } else {
      alert("selecciona una cuenta para continuar".toUpperCase());
    }
  };

  const openNotaCliente = () => {
    if (cuenta.id) {
      setAbrirNotaClienteModal(true);
    } else {
      alert("selecciona una cuenta para continuar".toUpperCase());
    }
  };

  const openComanda = () => {
    if (cuenta.id) {
      const checkItems = cuenta.items.filter((item) => item.impreso === false);
      if (checkItems.length === 0) {
        alert("no hay productos anexados".toUpperCase());
        return;
      }
      setAbrirComandaModal(true);
    } else {
      alert("selecciona una cuenta para continuar".toUpperCase());
    }
  };

  const openPagar = () => {
    if (cuenta.id) {
      if (!cuenta.impreso) {
        alert(
          "es necesario tener la impresión del negocio para continuar".toUpperCase()
        );
        return;
      }
      setAbrirPagarCuentaModal(true);
    } else {
      alert("selecciona una cuenta para continuar".toUpperCase());
    }
  };

  const reabrir = () => {
    if (!window.confirm("confirmar acción".toUpperCase())) return;
    const newCta = {
      ...cuenta,
      estado: "abierto",
      impreso: false,
      time: "",
    };
    editarCuenta(cuenta.id, newCta, (res) => {
      commit("Ha reabierto la orden " + cuenta.orden, operadorSession);
    });
  };

  const cancelar = () => {
    if (cuenta.id) {
      if (cuenta.impreso === false) {
        alert("imprimir primero la cuenta".toUpperCase());
        return;
      }
      if (!window.confirm("confirmar acción".toUpperCase())) return;
      const newCta = {
        ...cuenta,
        estado: "cancelado",
        closedAt: fechaISO(),
        time: timeAgo(new Date(cuenta.createdAt)),
      };
      sellarCuenta(cuenta.id, newCta);
      commit("Ha cancelado la orden " + cuenta.orden, operadorSession);
    } else {
      alert("selecciona una cuenta para continuar".toUpperCase());
    }
  };

  const openEditarCliente = () => {
    if (!cuenta.id) {
      alert("selecciona una cuenta para continuar".toUpperCase());
      return;
    }
    if (cuenta.impreso) return;
    if (cuenta.servicio !== "domicilio") {
      alert("no disponible para este servicio".toUpperCase());
      return;
    }
    setAbrirDomicilioModal(true);
  };

  const openEditarTorreta = () => {
    if (!cuenta.id) {
      alert("selecciona una cuenta para continuar".toUpperCase());
      return;
    }
    if (cuenta.impreso) return;
    if (cuenta.servicio === "domicilio") {
      alert("no disponible para este servicio".toUpperCase());
      return;
    }
    if (cuenta.servicio === "comedor") setAbrirComedorModal(true);
    if (cuenta.servicio === "pll") setAbrirParallevarModal(true);
  };

  return (
    <div
      style={{ height: "628px", overflow: "hidden" }}
      className="d-flex aling-items-start logotipo"
    >
      <nav
        style={{ width: "11%" }}
        className="nav flex-column nav-pills p-2 bg-dark"
        role="tablist"
        aria-orientation="vertical"
      >
        <button
          type="button"
          className="nav-link border border-light text-light text-uppercase h6"
          data-bs-toggle="pill"
          data-bs-target="#abiertas"
          aria-selected="true"
        >
          cuentas abiertas
        </button>
        <button
          type="button"
          className="nav-link border border-light text-light text-uppercase h6"
          data-bs-toggle="pill"
          data-bs-target="#cerradas"
          aria-selected="false"
        >
          cuentas cerradas
        </button>
        <button
          type="button"
          className="nav-link border border-light text-light text-uppercase h6 py-3"
          data-bs-toggle="pill"
          data-bs-target="#caja"
          aria-selected="false"
        >
          caja
        </button>
        <button
          onClick={() => setAbrirMonitorModal(true)}
          type="button"
          className="nav-link border border-light text-light text-uppercase h6"
          data-bs-toggle="pill"
          data-bs-target="#"
          aria-selected="false"
        >
          monitor de ventas
        </button>
      </nav>
      <div style={{ width: "78%" }} className="tab-content">
        <div
          onClick={(e) => {
            e.stopPropagation(), setCuenta(initialCuenta), setIdx("");
          }}
          style={{ height: "628px", overflowY: "scroll", overflowX: "hidden" }}
          className="tab-pane show active px-3 p-1"
          id="abiertas"
        >
          <Abiertas />
        </div>
        <div
          onClick={(e) => {
            e.stopPropagation(), setCuenta(initialCuenta), setIdx("");
          }}
          className="tab-pane px-3 p-1"
          id="cerradas"
        >
          <Cerradas />
        </div>
        <div className="tab-pane p-1" id="caja">
          <Caja />
        </div>
      </div>
      <aside
        style={{ width: "11%" }}
        className="d-flex flex-column justify-content-start p-1 bg-dark"
      >
        <div className="btn-group dropstart mb-2">
          <button
            type="button"
            className="btn btn-warning btn-lg fw-bold text-uppercase dropdown-toggle py-3"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            abrir
          </button>
          <ul className="dropdown-menu dropdown-menu-dark">
            <li className="text-center">
              <a
                onClick={(e) => {
                  e.preventDefault(),
                    setIdx(""),
                    setCuenta(initialCuenta),
                    setAbrirComedorModal(true);
                }}
                className="dropdown-item text-uppercase h4 py-4"
                href="#"
              >
                comedor
              </a>
            </li>
            <li className="text-center">
              <a
                onClick={(e) => {
                  e.preventDefault(),
                    setIdx(""),
                    setCuenta(initialCuenta),
                    setAbrirParallevarModal(true);
                }}
                className="dropdown-item text-uppercase h4 py-4"
                href="#"
              >
                para llevar
              </a>
            </li>
            <li className="text-center">
              <a
                onClick={(e) => {
                  e.preventDefault(),
                    setIdx(""),
                    setCuenta(initialCuenta),
                    setAbrirDomicilioModal(true);
                }}
                className="dropdown-item text-uppercase h4 py-4"
                href="#"
              >
                domicilio
              </a>
            </li>
          </ul>
        </div>
        <button
          type="button"
          disabled={cuenta.impreso ? true : false}
          onClick={openCapturaModal}
          className="btn btn-warning btn-lg fw-bold text-uppercase py-3 mb-2"
        >
          capturar
        </button>
        <button
          onClick={openVista}
          type="button"
          className="btn btn-warning btn-lg fw-bold text-uppercase py-3 mb-2"
        >
          vista
        </button>
        <div className="btn-group dropstart mb-2">
          <button
            type="button"
            className="btn btn-warning btn-lg fw-bold text-uppercase dropdown-toggle py-3"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            imprimir
          </button>
          <ul className="dropdown-menu dropdown-menu-dark">
            <li className="text-center">
              <a
                onClick={(e) => {
                  e.preventDefault(), openNotalLocal();
                }}
                className="dropdown-item text-uppercase h4 py-4"
                href="#"
              >
                *negocio
              </a>
            </li>
            <li className="text-center">
              <a
                onClick={(e) => {
                  e.preventDefault(), openNotaCliente();
                }}
                className="dropdown-item text-uppercase h4 py-4"
                href="#"
              >
                cliente
              </a>
            </li>
            <li className="text-center">
              <a
                onClick={(e) => {
                  e.preventDefault(), openComanda();
                }}
                className="dropdown-item text-uppercase h4 py-4"
                href="#"
              >
                comanda
              </a>
            </li>
          </ul>
        </div>
        <button
          onClick={openPagar}
          type="button"
          className="btn btn-warning btn-lg fw-bold text-uppercase py-3 mb-2"
        >
          pagar
        </button>
        <button
          onClick={reabrir}
          disabled={
            cuenta.estado === "abierto" && !cuenta.impreso ? true : false
          }
          type="button"
          className="btn btn-warning btn-lg fw-bold text-uppercase py-3 mb-2"
        >
          reabrir
        </button>
        <div className="btn-group dropstart mb-2">
          <button
            type="button"
            className="btn btn-warning btn-lg fw-bold text-uppercase dropdown-toggle py-3"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            acciones
          </button>
          <ul className="dropdown-menu dropdown-menu-dark">
            <li className="text-center">
              <a
                onClick={(e) => {
                  e.preventDefault(), openEditarCliente();
                }}
                className="dropdown-item text-uppercase h4 py-4"
                href="#"
              >
                cambiar cliente
              </a>
            </li>
            <li className="text-center">
              <a
                onClick={(e) => {
                  e.preventDefault(), openEditarTorreta();
                }}
                className="dropdown-item text-uppercase h4 py-4"
                href="#"
              >
                editar torreta
              </a>
            </li>
          </ul>
        </div>
        <button
          onClick={cancelar}
          disabled={cuenta.estado !== "abierto" ? true : false}
          type="button"
          className="btn btn-warning btn-lg fw-bold text-uppercase py-3 mb-2"
        >
          cancelar
        </button>
      </aside>
      <AbrirComedorModal
        show={abrirComedorModal}
        onHide={() => setAbrirComedorModal(false)}
        openCaptura={() => setAbrirCapturaModal(true)}
      />
      <AbrirParallevarModal
        show={abrirParallevarModal}
        onHide={() => setAbrirParallevarModal(false)}
        openCaptura={() => setAbrirCapturaModal(true)}
      />
      <AbrirDomicilioModal
        show={abrirDomicilioModal}
        onHide={() => setAbrirDomicilioModal(false)}
        openCaptura={() => setAbrirCapturaModal(true)}
      />
      <CapturaModal
        show={abrirCapturaModal}
        onHide={() => setAbrirCapturaModal(false)}
        cuenta={cuenta}
        openVista={() => setAbrirVistaCuenta(true)}
      />
      <VistaCuenta
        show={abrirVistaCuenta}
        onHide={() => setAbrirVistaCuenta(false)}
        openCaptura={() => setAbrirCapturaModal(true)}
        openComanda={openComanda}
        openNotaLocal={openNotalLocal}
      />
      <NotalLocalModal
        show={abrirNotaLocalModal}
        onHide={() => setAbrirNotaLocalModal(false)}
      />
      <NotaClienteModal
        show={abrirNotaClienteModal}
        onHide={() => setAbrirNotaClienteModal(false)}
        cuenta={cuenta}
      />
      <ComandaModal
        show={abrirComandaModal}
        onHide={() => setAbrirComandaModal(false)}
        closeVista={() => setAbrirVistaCuenta(false)}
      />
      <PagarCuentaModal
        show={abrirPagarCuentaModal}
        onHide={() => setAbrirPagarCuentaModal(false)}
      />
      <MonitorModal
        show={abrirMonitorModal}
        onHide={() => setAbrirMonitorModal(false)}
      />
    </div>
  );
}
