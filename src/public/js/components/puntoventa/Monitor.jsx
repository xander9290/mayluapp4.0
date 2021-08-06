function Monitor(props) {
  const {
    cuentas,
    cajas,
    productos: ps,
    otrosMedios: md,
    respaldodb,
  } = useContext(AppContext);

  const respaldar = () => {
    respaldodb((res) => {
      if (res.res) {
        alert("La base de datos se ha respaldado con éxito".toUpperCase());
      } else {
        alert("!ERROR! error al respaldar la base de datos".toUpperCase());
      }
    });
  };

  const [fecha, setFecha] = useState({
    fecha1: fechaActual(Date.now()),
    fecha2: fechaActual(Date.now()),
  });

  // SERVIVICIOS
  const [servicios, setServicios] = useState({
    comedor: { total: 0, ctas: [] },
    pll: { total: 0, ctas: [] },
    domicilio: { total: 0, ctas: [] },
  });
  const [descuentos, setDescuentos] = useState([]);
  const [cancelados, setCancelados] = useState([]);
  const [porPagar, setPorPagar] = useState(0);
  const [productosCancelados, setProductosCancelados] = useState([]);
  // CAJA
  const [caja, setCaja] = useState({
    gastos: { total: 0, qty: [] },
    depositos: { total: 0, qty: [] },
  });
  // TARJETAS
  const [tarjetas, setTarjetas] = useState({ total: 0, qty: [] });
  //otros medios de pago
  const [otroMedio, setOtroMedio] = useState({ total: 0, qty: [], list: [] });
  // PRODUCTOS
  const [productosDetallado, setProductosDetallados] = useState({
    items: [],
    miscelaneos: [],
  });

  const [abrirResumenModal, setAbrirResumenModal] = useState(false);
  const [abrirDetallados, setAbrirDetallados] = useState(false);

  useEffect(() => {
    if (cuentas.length > 0) {
      procesarCuentas(cuentas);
    }
  }, [cuentas]);

  useEffect(() => {
    if (cajas.length > 0) {
      const cajaActual = cajas.filter(
        (caja) => caja.fecha === fechaActual(Date.now())
      );
      procesarCaja(cajaActual);
    }
  }, [cajas]);

  const handleValues = (e) => {
    setFecha({ ...fecha, [e.target.name]: e.target.value });
  };

  // TRIGGER BUSQUEDA
  const handleSubmitFecha = (e) => {
    e.preventDefault();
    getAllCuentas(fecha.fecha1, fecha.fecha2)
      .then((data) => {
        procesarDetallado(data);
      })
      .catch((err) => console.log(err));

    const cjs = cajas.filter((caja) => {
      return caja.fecha >= fecha.fecha1 && caja.fecha <= fecha.fecha2;
    });
    procesarCaja(cjs);
  };

  const procesarDetallado = (data) => {
    // const result = data.filter((cuenta) => {
    //   return cuenta.fecha >= fecha.fecha1 && cuenta.fecha <= fecha.fecha2;
    // });
    if (data.length > 0) {
      procesarCuentas(data);
    } else {
      alert("no se encontraron datos".toUpperCase());
      procesarCuentas([]);
      setCaja({
        gastos: { total: 0, qty: [] },
        depositos: { total: 0, qty: [] },
      });
      setTarjetas({ total: 0, qty: [] });
    }
  };

  const procesarCuentas = (ctas) => {
    const cuentasContables = ctas.filter(
      (cuenta) => cuenta.estado !== "cancelado"
    );
    const cuentasCanceladas = ctas.filter(
      (cuenta) => cuenta.estado === "cancelado"
    );
    procesarServicios(cuentasContables, cuentasCanceladas);
    procesarTarjetas(cuentasContables);
    procesarOtrosMedios(cuentasContables);
    procesarProductos(cuentasContables);
  };

  // PRODUCTOS
  const procesarProductos = (ctas) => {
    const _items = [];
    let itemsCancelados = [];
    const list = [];

    // se vacian los productos vendidos
    ctas.map((cuenta) => {
      cuenta.items.map((item) => {
        _items.push(item);
      });
    });
    // se obtienen los productos contables
    const itemsContables = _items.filter((item) => item.contable === true);
    // se obtienen los productos cancelados
    itemsCancelados = itemsContables.filter((item) => item.cancelado === true);
    setProductosCancelados(itemsCancelados);
    // se filtran los productos cancelados
    const itemsVisibles = itemsContables.filter(
      (item) => item.cancelado === false
    );
    ps.map((producto) => {
      const contables = itemsVisibles.filter(
        (item) => item.producto_id === producto.id
      );
      if (contables.length > 0) {
        let cant = 0;
        let importe = 0;
        contables.map((contable) => {
          cant += contable.cant;
          importe += contable.importe;
        });
        const newItem = {
          cant,
          importe,
          name: contables[0].name,
        };
        list.push(newItem);
      }
    });
    // se ordenan los productos por orden alfabético
    const listSort = list.sort((a, b) => {
      if (a.cant > b.cant) return -1;
    });
    // se obtienen los poruductos en miscelaneo
    const miscelaneos = _items.filter(
      (item) => item.producto_id === "miscelaneo" && item.cancelado === false
    );
    setProductosDetallados({
      ...productosDetallado,
      items: listSort,
      miscelaneos,
    });
  };

  const procesarServicios = (ctas, ctasC) => {
    const ctasCanceladas = [];
    let ctasPorPagar = 0;
    const ctasDscto = [];
    // cuentas por Abiertas Por Pagar
    ctas
      .filter((cuenta) => {
        return cuenta.estado === "abierto" || cuenta.estado === "pendiente";
      })
      .map((cuenta) => {
        ctasPorPagar += cuenta.total;
      });
    // COMEDOR
    const cuentasComedor = ctas.filter(
      (cuenta) => cuenta.servicio === "comedor"
    );
    const cuentasCanceladasComedor = ctasC.filter(
      (cuenta) => cuenta.servicio === "comedor" && cuenta.estado === "cancelado"
    );
    const cuentasDescuentoComedor = ctas.filter(
      (cuenta) => cuenta.servicio === "comedor" && cuenta.dscto > 0
    );
    let totalComedor = 0;
    cuentasComedor.map((cuenta) => {
      totalComedor += cuenta.total;
    });
    cuentasCanceladasComedor.map((item) => {
      ctasCanceladas.push(item);
    });
    cuentasDescuentoComedor.map((item) => {
      ctasDscto.push(item);
    });
    const comedor = {
      total: totalComedor,
      ctas: cuentasComedor,
    };
    // PARA LLEVAR
    const cuentasPll = ctas.filter((cuenta) => cuenta.servicio === "pll");
    const cuentasCanceladasPll = ctasC.filter(
      (cuenta) => cuenta.servicio === "pll" && cuenta.estado === "cancelado"
    );
    const cuentasDescuentoPll = ctas.filter(
      (cuenta) => cuenta.servicio === "pll" && cuenta.dscto > 0
    );
    let totalPll = 0;
    cuentasPll.map((cuenta) => {
      totalPll += cuenta.total;
    });
    cuentasCanceladasPll.map((item) => {
      ctasCanceladas.push(item);
    });
    cuentasDescuentoPll.map((item) => {
      ctasDscto.push(item);
    });
    const pll = {
      total: totalPll,
      ctas: cuentasPll,
    };
    // DOMICILIO
    const cuentasDomicilio = ctas.filter(
      (cuenta) => cuenta.servicio === "domicilio"
    );
    const cuentasCanceladasDomicilio = ctasC.filter(
      (cuenta) =>
        cuenta.servicio === "domicilio" && cuenta.estado === "cancelado"
    );
    const cuentasDescuentoDomicilio = ctas.filter(
      (cuenta) => cuenta.servicio === "domicilio" && cuenta.dscto > 0
    );
    let totalDomicilio = 0;
    cuentasDomicilio.map((cuenta) => {
      totalDomicilio += cuenta.total;
    });
    cuentasCanceladasDomicilio.map((item) => {
      ctasCanceladas.push(item);
    });
    cuentasDescuentoDomicilio.map((item) => {
      ctasDscto.push(item);
    });
    const domicilio = {
      total: totalDomicilio,
      ctas: cuentasDomicilio,
    };
    setServicios({
      ...servicios,
      comedor,
      pll,
      domicilio,
    });
    setPorPagar(ctasPorPagar);
    setCancelados(ctasCanceladas);
    setDescuentos(ctasDscto);
  };

  const procesarCaja = (cajas) => {
    const _gastos = cajas.filter((caja) => caja.tipo === "gasto");
    const _depositos = cajas.filter((caja) => caja.tipo === "deposito");
    let totalGastos = 0;
    let totalDepositos = 0;
    _gastos.map((caja) => {
      totalGastos += caja.importe;
    });
    _depositos.map((caja) => {
      totalDepositos += caja.importe;
    });
    const gastos = {
      total: totalGastos,
      qty: _gastos,
    };
    const depositos = {
      total: totalDepositos,
      qty: _depositos,
    };
    setCaja({
      ...caja,
      gastos,
      depositos,
    });
  };

  const procesarTarjetas = (ctas) => {
    const cuentasTarjetas = ctas.filter((cuenta) => cuenta.tarjeta > 0);
    let totalTarjetas = 0;
    cuentasTarjetas.map((cuenta) => {
      totalTarjetas += cuenta.tarjeta;
    });
    const tarjetas = {
      total: totalTarjetas,
      qty: cuentasTarjetas,
    };
    setTarjetas(tarjetas);
  };

  const procesarOtrosMedios = (ctas) => {
    const cuentasOtros = ctas.filter((cuenta) => {
      if (cuenta.otro_medio) {
        return cuenta.otro_medio[1] > 0;
      }
    });
    let totalOtros = 0,
      listaMedios = [],
      list = [];
    cuentasOtros.map((cuenta) => {
      totalOtros += cuenta.otro_medio[1];
      listaMedios.push({
        name: cuenta.otro_medio[0],
        importe: cuenta.otro_medio[1],
      });
    });
    md.map((medios) => {
      const mds = listaMedios.filter((item) => item.name === medios.name);
      if (mds.length > 0) {
        let total = 0;
        mds.map((items) => {
          total += items.importe;
        });
        const newListaMedios = {
          name: mds[0].name,
          total,
          qty: mds.length,
        };
        list.push(newListaMedios);
      }
    });
    const otrosMedios = {
      total: totalOtros,
      qty: cuentasOtros,
      list,
    };
    setOtroMedio(otrosMedios);
  };
  return (
    <div className="col-md-12">
      <div className="card bg-dark">
        <div className="card-header p-2 text-center">
          <h4 className="card-title text-light">
            Monitor de Ventas
            <button
              onClick={props.onHide}
              type="button"
              className="btn btn-danger mx-2"
            >
              CERRAR
            </button>
          </h4>
          <form className="ms-3 mb-2" onSubmit={handleSubmitFecha}>
            <div className="row">
              <div className="col-5 px-0 me-1">
                <input
                  className="form-control form-control-lg"
                  type="date"
                  name="fecha1"
                  max={fechaActual(Date.now())}
                  value={fecha.fecha1}
                  onChange={handleValues}
                  required
                />
              </div>
              <div className="col-5 px-0">
                <input
                  className="form-control form-control-lg"
                  type="date"
                  max={fechaActual(Date.now())}
                  name="fecha2"
                  value={fecha.fecha2}
                  onChange={handleValues}
                  required
                />
              </div>
              <div className="col-1 px-0">
                <button className="btn btn-primary btn-lg" type="submit">
                  <i className="bi bi-arrow-repeat"></i>
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className="card-body p-1 text-center">
          <button
            onClick={() => setAbrirResumenModal(true)}
            className="btn btn-primary me-2"
            type="button"
          >
            Imprimir Resumen
          </button>
          <button
            onClick={() => setAbrirDetallados(true)}
            className="btn btn-primary me-2"
            type="button"
          >
            Imprimir Detallado
          </button>
          <button
            onClick={() => respaldar()}
            className="btn btn-warning"
            type="button"
          >
            Respaldo
          </button>
        </div>
        <div className="card-footer p-2">
          <ul className="list-group">
            <li className="list-group-item text-uppercase h5">
              <span className="fw-bold">comedor: </span>
              <span>${servicios.comedor.total}</span>
              <span className="badge bg-primary ms-1">
                {servicios.comedor.ctas.length}
              </span>
            </li>
            <li className="list-group-item text-uppercase h5">
              <span className="fw-bold">para llevar: </span>
              <span>${servicios.pll.total}</span>
              <span className="badge bg-primary ms-1">
                {servicios.pll.ctas.length}
              </span>
            </li>
            <li className="list-group-item text-uppercase h5">
              <span className="fw-bold">domicilio: </span>
              <span>${servicios.domicilio.total}</span>
              <span className="badge bg-primary ms-1">
                {servicios.domicilio.ctas.length}
              </span>
            </li>
            <li className="list-group-item text-uppercase bg-warning h5">
              <span className="fw-bold">venta total: </span>
              <span>
                $
                {servicios.comedor.total +
                  servicios.pll.total +
                  servicios.domicilio.total}
              </span>
            </li>
            <h5 className="text-uppercase text-center text-light">
              movientos en caja y ordenes por pagar
            </h5>
            <li className="list-group-item text-uppercase h5 d-flex justify-content-between">
              <div>
                <span className="fw-bold">retiros: </span>
                <span>-${caja.gastos.total}</span>
                <span className="badge bg-primary ms-1">
                  {caja.gastos.qty.length}
                </span>
              </div>
              <div>
                <span className="fw-bold">depósitos: </span>
                <span>+${caja.depositos.total}</span>
                <span className="badge bg-primary ms-1">
                  {caja.depositos.qty.length}
                </span>
              </div>
            </li>
            <li className="list-group-item text-uppercase h5">
              <div>
                <span className="fw-bold">Por pagar: </span>
                <span>${porPagar}</span>
              </div>
            </li>
            <h5 className="text-uppercase text-center text-light">
              pagos con tarjeta y otros medios
            </h5>
            <li className="list-group-item text-uppercase h5 d-flex justify-content-between">
              <div>
                <span className="fw-bold">tarjetas: </span>
                <span>${tarjetas.total}</span>
                <span className="badge bg-primary ms-1">
                  {tarjetas.qty.length}
                </span>
              </div>
              <div>
                <span className="fw-bold">otros: </span>
                <span>${otroMedio.total}</span>
                <span className="badge bg-primary ms-1">
                  {otroMedio.qty.length}
                </span>
              </div>
            </li>
            <li className="list-group-item text-uppercase bg-info h5">
              <span className="fw-bold">total efectivo: </span>
              <span>
                $
                {servicios.comedor.total +
                  servicios.pll.total +
                  servicios.domicilio.total +
                  caja.depositos.total -
                  caja.gastos.total -
                  tarjetas.total -
                  otroMedio.total -
                  porPagar}
              </span>
            </li>
          </ul>
        </div>
      </div>
      <ResumenModal
        show={abrirResumenModal}
        onHide={() => setAbrirResumenModal(false)}
        servicios={servicios}
        cancelados={cancelados}
        productosCancelados={productosCancelados}
        descuentos={descuentos}
        caja={caja}
        tarjetas={tarjetas}
        otroMedio={otroMedio}
      />
      <DetalladoModal
        show={abrirDetallados}
        onHide={() => setAbrirDetallados(false)}
        fecha={fecha}
        productos={productosDetallado}
      />
    </div>
  );
}

const getAllCuentas = async (fecha1, fecha2) => {
  const res = await fetch(`/cuentas/fecha1/${fecha1}/fecha2/${fecha2}`);
  if (!res.ok) {
    const { url, status, statusText } = res;
    throw Error(`${status} ${statusText} ${url}`);
  }
  const data = await res.json();
  return data;
};
