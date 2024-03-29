function PuntoVenta() {
  const {
    cuenta,
    setCuenta,
    setIdx,
    initialCuenta,
    sellarCuenta,
    editarCuenta,
    commit,
    otrosMedios,
  } = useContext(AppContext);
  const [abrirComedorModal, setAbrirComedorModal] = useState(false);
  const [abrirParallevarModal, setAbrirParallevarModal] = useState(false);
  const [abrirDomicilioModal, setAbrirDomicilioModal] = useState(false);
  const [abrirCapturaModal, setAbrirCapturaModal] = useState(false);
  const [abrirVistaCuenta, setAbrirVistaCuenta] = useState(false);
  const [abrirNotaLocalModal, setAbrirNotaLocalModal] = useState(false);
  const [abrirNotaClienteModal, setAbrirNotaClienteModal] = useState(false);
  const [abrirCambioDomicilioModal, setAbrirCambioDomicilioModal] =
    useState(false);
  const [abrirPagarCuentaModal, setAbrirPagarCuentaModal] = useState(false);
  const [abrirMonitorModal, setAbrirMonitorModal] = useState(false);
  const [abrirInfoModal, setAbrirInfoModal] = useState(false);
  const [abrirDescuentoModal, setAbrirDescuentoModal] = useState(false);
  const [medios, setMedios] = useState([]);

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

  useEffect(() => {
    setMedios(otrosMedios);
  }, [otrosMedios]);

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

  const openPagar = () => {
    if (cuenta.id) {
      if (!cuenta.impreso) {
        alert(
          "es necesario tener la impresión del negocio para continuar".toUpperCase()
        );
        return;
      }
      canalizarPagoServicio();
    } else {
      alert("selecciona una cuenta para continuar".toUpperCase());
    }
  };

  const canalizarPagoServicio = () => {
    if (cuenta.servicio === "domicilio") {
      if (cuenta.estado !== "pendiente") {
        setAbrirCambioDomicilioModal(true);
        //cambiar estado a pendiente
      } else {
        setAbrirPagarCuentaModal(true);
      }
    } else {
      setAbrirPagarCuentaModal(true);
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
      let motivoCancelado = prompt(
        "especifíca motivo de la cancelación".toUpperCase()
      );
      if (!motivoCancelado) motivoCancelado = "sin especificar";
      const newCta = {
        ...cuenta,
        estado: "cancelado",
        motivoCancelado,
        closedAt: fechaISO(),
        time: timeAgo(new Date(cuenta.createdAt)),
      };
      editarCuenta(cuenta.id, newCta, (res) => {
        commit("Ha cancelado la orden " + cuenta.orden, operadorSession);
      });
    } else {
      alert("selecciona una cuenta para continuar".toUpperCase());
    }
  };

  const openEditarCliente = () => {
    if (!cuenta.id) {
      alert("selecciona o abre una cuenta para continuar".toUpperCase());
      return;
    }
    if (cuenta.impreso) {
      alert("no se puede modificar; cuenta impresa".toUpperCase());
      return;
    }
    if (cuenta.servicio !== "domicilio") {
      alert("no disponible para este servicio".toUpperCase());
      return;
    }
    setAbrirDomicilioModal(true);
  };

  const openEditarTorreta = () => {
    if (!cuenta.id) {
      alert("selecciona o abre una cuenta para continuar".toUpperCase());
      return;
    }
    if (cuenta.impreso) {
      alert("no se puede modificar; cuenta impresa".toUpperCase());
      return;
    }
    if (cuenta.servicio === "domicilio") {
      alert("no disponible para este servicio".toUpperCase());
      return;
    }
    if (cuenta.servicio === "comedor") setAbrirComedorModal(true);
    if (cuenta.servicio === "pll") setAbrirParallevarModal(true);
  };

  const openInfoDomicilio = () => {
    if (cuenta.cliente.tel === "") {
      alert("no hay información para mostrar".toUpperCase());
      return;
    }
    if (cuenta.id) {
      setAbrirInfoModal(true);
    } else {
      alert("selecciona una cuenta para continuar".toUpperCase());
    }
  };

  const openDescuento = () => {
    if (cuenta.id) {
      if (cuenta.impreso) {
        alert("la cuenta ya se encuentra impresa".toUpperCase());
        return;
      }
      setAbrirDescuentoModal(true);
    } else {
      alert("selecciona una cuenta para continuar".toUpperCase());
    }
  };

  const setObservaciones = () => {
    if (!cuenta.id) {
      alert("selecciona una cuenta para continuar".toUpperCase());
      return;
    }
    let obs = prompt("Escribe una observación para esta orden:");
    if (obs === null) return;
    if (cuenta.observaciones) obs = cuenta.observaciones + " " + obs;
    const newCta = {
      ...cuenta,
      observaciones: obs,
    };
    editarCuenta(cuenta.id, newCta, (res) => {
      console.log(res);
    });
  };

  const cambiarRepartidor = () => {
    if (cuenta.repartidor === "") {
      alert("No tiene repartidor asignado aún".toUpperCase());
      return;
    } else {
      setAbrirCambioDomicilioModal(true);
    }
  };

  return (
    <div
      style={{ height: "628px", overflow: "hidden" }}
      className="d-flex aling-items-start logotipo"
      tabIndex="0"
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
          </ul>
        </div>
        <button
          onClick={openPagar}
          disabled={cuenta.estado === "cerrado" ? true : false}
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
            opciones
          </button>
          <ul className="dropdown-menu dropdown-menu-light">
            <li className="text-center">
              <a
                onClick={(e) => {
                  e.preventDefault(), abrirCajon();
                }}
                className="dropdown-item text-uppercase h5 py-3"
                href="#"
              >
                abrir cajón
              </a>
            </li>
            <li className="text-center">
              <a
                onClick={(e) => {
                  e.preventDefault(), openInfoDomicilio();
                }}
                className="dropdown-item text-uppercase h5 py-3"
                href="#"
              >
                Info domicilio
              </a>
            </li>
            <li className="text-center">
              <a
                onClick={(e) => {
                  e.preventDefault(), openEditarCliente();
                }}
                className="dropdown-item text-uppercase h5 py-3"
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
                className="dropdown-item text-uppercase h5 py-3"
                href="#"
              >
                editar torreta
              </a>
            </li>
            <li className="text-center">
              <a
                onClick={(e) => {
                  e.preventDefault(), cambiarRepartidor();
                }}
                className="dropdown-item text-uppercase h5 py-3"
                href="#"
              >
                cambiar Repartidor
              </a>
            </li>
            <li className="text-center">
              <a
                onClick={(e) => {
                  e.preventDefault(), setObservaciones();
                }}
                className="dropdown-item text-uppercase h5 py-3"
                href="#"
              >
                Observaciones
              </a>
            </li>
            <li className="text-center">
              <a
                onClick={(e) => {
                  e.preventDefault(), openDescuento();
                }}
                className="dropdown-item text-uppercase h5 py-3"
                href="#"
              >
                Aplicar Descuento
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
      <CambioDomicilioModal
        show={abrirCambioDomicilioModal}
        onHide={() => setAbrirCambioDomicilioModal(false)}
      />
      <PagarCuentaModal
        show={abrirPagarCuentaModal}
        onHide={() => setAbrirPagarCuentaModal(false)}
        medios={medios}
      />
      <MonitorModal
        show={abrirMonitorModal}
        onHide={() => setAbrirMonitorModal(false)}
      />
      <InfoModal
        show={abrirInfoModal}
        onHide={() => setAbrirInfoModal(false)}
      />
      <DescuendoModal
        show={abrirDescuentoModal}
        onHide={() => setAbrirDescuentoModal(false)}
      />
    </div>
  );
}
