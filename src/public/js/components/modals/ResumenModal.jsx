function ResumenModal(props) {
  const { servicios, caja, tarjetas } = props;
  const { commit } = useContext(AppContext);

  const [descuentos, setDescuentos] = useState([]);
  const [cancelados, setCancelados] = useState([]);

  const setImpresion = () => {
    const printContents = document.getElementById("body").innerHTML,
      w = window.open("", "PRINT", "height=600,width=700");
    w.document.write(`
        <style>
          *{
            text-transform: uppercase;
            font-family: Ticketing;
          }
          p,h1,h2,h3,h4,h5,h6 {
              margin: 0;
              padding: 0;
          }
          #title {
              text-aling: center;
          }
        </style>`);
    w.document.write(printContents);
    w.document.close();
    w.focus();
    w.print();
    w.close();
    props.onHide();
    return true;
  };

  const procesarDescuentos = () => {
    const ctasComedor = servicios.comedor.ctas.filter(
      (cuenta) => cuenta.dscto > 0
    );
    const ctasPll = servicios.pll.ctas.filter((cuenta) => cuenta.dscto > 0);
    const ctasDomicilio = servicios.domicilio.ctas.filter(
      (cuenta) => cuenta.dscto > 0
    );
    setDescuentos([...ctasComedor, ...ctasPll, ...ctasDomicilio]);
  };

  const procesarCancelados = () => {
    setCancelados([
      ...servicios.comedor.cancelados,
      ...servicios.pll.cancelados,
      ...servicios.domicilio.cancelados,
    ]);
  };

  const handleShow = () => {
    procesarDescuentos();
    procesarCancelados();
    setImpresion();
  };

  const handleExited = () => {
    commit("ha impreso un resumen de ventas", operadorSession);
  };

  return (
    <Modal
      onHide={props.onHide}
      show={props.show}
      size="md"
      onShow={handleShow}
      onExited={handleExited}
    >
      <Modal.Body>
        <div id="body">
          <br></br>
          <h1 id="title">RESUMEN DE VENTAS</h1>
          <hr></hr>
          <p>fecha: {formatoFecha(Date.now())[0]}</p>
          <p>operador: {operadorSession}</p>
          <hr></hr>
          <h3>cuentas por servicio</h3>
          <h4>
            -comedor: ${servicios.comedor.total}.00 (
            {servicios.comedor.ctas.length})
          </h4>
          <h4>
            -para llevar: ${servicios.pll.total}.00 ({servicios.pll.ctas.length}
            )
          </h4>
          <h4>
            -domicilio: ${servicios.domicilio.total}.00 (
            {servicios.domicilio.ctas.length})
          </h4>
          <h2>
            venta total: $
            {servicios.comedor.total +
              servicios.pll.total +
              servicios.domicilio.total}
            .00
          </h2>
          <hr></hr>
          <div
            style={{
              display:
                caja.gastos.qty.length > 0 || caja.depositos.qty.length > 0
                  ? "block"
                  : "none",
            }}
          >
            <h3>movimientos en caja</h3>
            {caja.gastos.qty.map((gasto, i) => (
              <div key={i * 2}>
                <h4>
                  -concepto: {gasto.concepto} -${gasto.importe}.00
                </h4>
                <p>-------------------------------------</p>
              </div>
            ))}
            {caja.depositos.qty.map((deposito, i) => (
              <div key={i * 3}>
                <h4>
                  -concepto: {deposito.concepto} +${deposito.importe}.00
                </h4>
                <p>-------------------------------------</p>
              </div>
            ))}
            <hr></hr>
          </div>
          <div
            style={{
              display: tarjetas.qty.length > 0 ? "block" : "none",
            }}
          >
            <h3>pagos con tarjeta</h3>
            {tarjetas.qty.map((cuenta, i) => (
              <div key={i * 4}>
                <h4>
                  -orden: {cuenta.orden} total: ${cuenta.tarjeta}.00
                  <p style={{ margin: "0", padding: "0" }}>
                    <small>{formatoFecha(cuenta.createdAt)[0]}</small>
                  </p>
                </h4>
              </div>
            ))}
            <p>-------------------------------------</p>
            <h4>total de tarjetas: ${tarjetas.total}.00</h4>
            <hr></hr>
          </div>
          <h2>
            efectivo: $
            {servicios.comedor.total +
              servicios.pll.total +
              servicios.domicilio.total +
              caja.depositos.total -
              caja.gastos.total -
              tarjetas.total}
            .00
          </h2>
          <div style={{ display: descuentos.length > 0 ? "block" : "none" }}>
            <hr></hr>
            <h3>ordenes con descuento</h3>
            {descuentos.map((cuenta, i) => (
              <div key={i * 5}>
                <h4>-orden:{cuenta.orden}</h4>
                <h4>importe:${cuenta.importe}.00</h4>
                <h4>dscto:-${cuenta.dscto}</h4>
                <h4>
                  total:$
                  {cuenta.total}
                </h4>
                <h4>{formatoFecha(cuenta.createdAt)[0]}</h4>
                <p>-------------------------------------</p>
              </div>
            ))}
          </div>
          <div style={{ display: cancelados.length > 0 ? "block" : "none" }}>
            <hr></hr>
            <h3>ordenes canceladas</h3>
            {cancelados.map((cuenta, i) => (
              <div key={i * 6}>
                <h4>
                  -orden: {cuenta.orden} total: ${cuenta.total}.00
                  <p style={{ margin: "0", padding: "0" }}>
                    <small>{formatoFecha(cuenta.createdAt)[0]}</small>
                  </p>
                </h4>
              </div>
            ))}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
