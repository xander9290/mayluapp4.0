function DetalladoModal(props) {
  const { fecha, productos } = props;
  const { commit } = useContext(AppContext);

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
            table {
                width: 100%;
            }
            table tbody tr td {
                font-size: 17px;
            }
            table tbody tr {
                padding: 0;
            }
            td:first-child, td:last-child {
                text-align: center
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

  const handleShow = () => {
    setImpresion();
  };

  const handleExited = () => {
    commit("ha impreso un detallado de productos", operadorSession);
  };

  let total = 0;
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
          <h2 id="title">DETALLADO DE PRODUCTOS</h2>
          <hr></hr>
          <p>
            {formatoFecha(Date.now())[0]} operador: {operadorSession}
          </p>
          <p>
            de: {fecha.fecha1} a: {fecha.fecha2}
          </p>
          <hr></hr>
          <table>
            <thead>
              <tr>
                <th>cant</th>
                <th>desc</th>
                <th>importe</th>
              </tr>
            </thead>
            <tbody>
              {productos.items.map((p, i) => {
                total += p.importe;
                return (
                  <tr key={i * 2}>
                    <td valign="top">{p.cant}</td>
                    <td>{p.name}</td>
                    <td valign="top">${p.importe}</td>
                  </tr>
                );
              })}
              {productos.miscelaneos.length === 0 ? null : (
                <tr>
                  <td></td>
                  <td>
                    <h4>---Miscelaneos---</h4>
                  </td>
                  <td></td>
                </tr>
              )}
              {productos.miscelaneos.map((m, i) => {
                total += m.importe;
                return (
                  <tr key={i + 3}>
                    <td valign="top">{m.cant}</td>
                    <td>{m.name}</td>
                    <td valign="top">${m.importe}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <hr></hr>
          <h3>Total de venta: ${total}</h3>
        </div>
      </Modal.Body>
    </Modal>
  );
}
