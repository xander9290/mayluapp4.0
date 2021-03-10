function Monitor(props) {
  const { cuentas, cajas, productos: ps } = useContext(AppContext);

  const [fecha, setFecha] = useState({
    fecha1: fechaActual(Date.now()),
    fecha2: fechaActual(Date.now()),
  });

  // SERVIVICIOS
  const [servicios, setServicios] = useState({
    comedor: { total: 0, ctas: [], cancelados: [] },
    pll: { total: 0, ctas: [], cancelados: [] },
    domicilio: { total: 0, ctas: [], cancelados: [] },
  });
  // CAJA
  const [caja, setCaja] = useState({
    gastos: { total: 0, qty: [] },
    depositos: { total: 0, qty: [] },
  });
  // TARJETAS
  const [tarjetas, setTarjetas] = useState({ total: 0, qty: [] });
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
    getAllCuentas()
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
    const result = data.filter((cuenta) => {
      return cuenta.fecha >= fecha.fecha1 && cuenta.fecha <= fecha.fecha2;
    });
    if (result.length > 0) {
      procesarCuentas(result);
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
    procesarProductos(cuentasContables);
  };

  // PRODUCTOS
  const procesarProductos = (ctas) => {
    const _items = [];
    const list = [];

    // se vacian los productos vendidos
    ctas.map((cuenta) => {
      cuenta.items.map((item) => {
        _items.push(item);
      });
    });
    // se obtienen los productos contables
    const itemsContables = _items.filter((item) => item.contable === true);
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
    // COMEDOR
    const cuentasComedor = ctas.filter(
      (cuenta) => cuenta.servicio === "comedor"
    );
    const cuentasCanceladasComedor = ctasC.filter(
      (cuenta) => cuenta.servicio === "comedor" && cuenta.estado === "cancelado"
    );
    let totalComedor = 0;
    cuentasComedor.map((cuenta) => {
      totalComedor += cuenta.total;
    });
    const comedor = {
      total: totalComedor,
      ctas: cuentasComedor,
      cancelados: cuentasCanceladasComedor,
    };
    // PARA LLEVAR
    const cuentasPll = ctas.filter((cuenta) => cuenta.servicio === "pll");
    const cuentasCanceladasPll = ctasC.filter(
      (cuenta) => cuenta.servicio === "pll" && cuenta.estado === "cancelado"
    );
    let totalPll = 0;
    cuentasPll.map((cuenta) => {
      totalPll += cuenta.total;
    });
    const pll = {
      total: totalPll,
      ctas: cuentasPll,
      cancelados: cuentasCanceladasPll,
    };
    // DOMICILIO
    const cuentasDomicilio = ctas.filter(
      (cuenta) => cuenta.servicio === "domicilio"
    );
    const cuentasCanceladasDomicilio = ctasC.filter(
      (cuenta) =>
        cuenta.servicio === "domicilio" && cuenta.estado === "cancelado"
    );
    let totalDomicilio = 0;
    cuentasDomicilio.map((cuenta) => {
      totalDomicilio += cuenta.total;
    });
    const domicilio = {
      total: totalDomicilio,
      ctas: cuentasDomicilio,
      cancelados: cuentasCanceladasDomicilio,
    };

    setServicios({
      ...servicios,
      comedor,
      pll,
      domicilio,
    });
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
      totalTarjetas += cuenta.total;
    });
    const tarjetas = {
      total: totalTarjetas,
      qty: cuentasTarjetas,
    };
    setTarjetas(tarjetas);
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
            className="btn btn-primary"
            type="button"
          >
            Imprimir Detallado
          </button>
        </div>
        <div className="card-footer p-2">
          <ul className="list-group">
            <li className="list-group-item text-uppercase h5">
              <span className="fw-bold">comedor: </span>
              <span>${servicios.comedor.total}.00</span>
              <span className="badge bg-primary ms-1">
                {servicios.comedor.ctas.length}
              </span>
            </li>
            <li className="list-group-item text-uppercase h5">
              <span className="fw-bold">para llevar: </span>
              <span>${servicios.pll.total}.00</span>
              <span className="badge bg-primary ms-1">
                {servicios.pll.ctas.length}
              </span>
            </li>
            <li className="list-group-item text-uppercase h5">
              <span className="fw-bold">domicilio: </span>
              <span>${servicios.domicilio.total}.00</span>
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
                .00
              </span>
            </li>
            <h5 className="text-uppercase text-center text-light">
              movientos en caja
            </h5>
            <li className="list-group-item text-uppercase h5">
              <span className="fw-bold">retiros: </span>
              <span>-${caja.gastos.total}.00</span>
              <span className="badge bg-primary ms-1">
                {caja.gastos.qty.length}
              </span>
            </li>
            <li className="list-group-item text-uppercase h5">
              <span className="fw-bold">depósitos: </span>
              <span>+${caja.depositos.total}.00</span>
              <span className="badge bg-primary ms-1">
                {caja.depositos.qty.length}
              </span>
            </li>
            <h5 className="text-uppercase text-center text-light">
              pagos con tarjeta
            </h5>
            <li className="list-group-item text-uppercase h5">
              <span className="fw-bold">tarjetas: </span>
              <span>${tarjetas.total}.00</span>
              <span className="badge bg-primary ms-1">
                {tarjetas.qty.length}
              </span>
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
                  tarjetas.total}
                .00
              </span>
            </li>
          </ul>
        </div>
      </div>
      <ResumenModal
        show={abrirResumenModal}
        onHide={() => setAbrirResumenModal(false)}
        servicios={servicios}
        caja={caja}
        tarjetas={tarjetas}
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

const getAllCuentas = async () => {
  const res = await fetch("/cuentas");
  if (!res.ok) {
    const { url, status, statusText } = res;
    throw Error(`${status} ${statusText} ${url}`);
  }
  const data = await res.json();
  return data;
};
