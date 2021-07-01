function ComandaModal(props) {
  const { cuenta, editarCuenta, setComanda } = useContext(AppContext);

  const [itemsAnexos, setItemsAnexos] = useState([]);
  // areas
  const [area1, setArea1] = useState([]);
  const [area2, setArea2] = useState([]);
  const [area3, setArea3] = useState([]);

  useEffect(() => {
    if (cuenta.id) {
      filtrarItemsImpresos();
    }
  }, [cuenta]);

  useEffect(() => {
    if (itemsAnexos.length > 0) {
      procesarAreas();
    }
  }, [itemsAnexos]);

  const setVista = () => {
    const printContents = document.getElementById("comandaVista").innerHTML,
      w = window.open("", "PRINT", "height=600,width=700");

    w.document.write(
      `
              <style>
                  * {
                      text-transform: uppercase;
                      font-family: Ticketing;
                  }
                  h1,h2,h3,h4,h5,h6,p {
                      margin: 0;
                      padding: 0;
                  }
                  #logoContainer {
                      background-color: black;
                      color: white;
                      border-radius: 6px;
                      text-align: center;
                      width: 42%;
                      margin: 0 auto;
                      padding: 8px;
                  }
                  #logoNameTitle {
                      font-size: 42px;
                  }
                  #logoSubName {
                      font-size: 25px;
                  }
                  #logo {
                      border: 3px dashed white;
                      border-radius: 6px;
                      padding: 6px;
                  }
                  #infoEmpresa {
                      text-align: center;
                  }
                  #infoCuenta {
                      text-align: center;
                  }
                  strong {
                      font-size: 20px;
                      font-weight: bold;
                  }
                  table {
                      width: 100%;
                  }
                  table tbody tr td {
                      font-size: 19px;
                  }
                  table tbody tr {
                      padding: 0;
                  }
                  td:first-child, td:last-child {
                      text-align: left
                  }
                  #totalInfo {
                     padding-right: 40px;
                  }
                  ul {
                      text-align: right;
                  }
                  ul li {
                      text-decoration: none;
                      display: block;
                      margin-bottom: 1px;
                      margin: 0px;
                      padding: 0px;
                    }
                  #footer {
                      text-align: center;
                  }
              </style>
            `
    );
    w.document.write(printContents);
    w.document.close();
    w.focus();
    w.print();
    w.close();
    props.onHide();
    return true;
  };

  const filtrarItemsImpresos = () => {
    const items = [];
    const itemsNoImpresos = cuenta.items.filter(
      (item) => item.impreso === false && item.contable === true
    );
    itemsNoImpresos.map((item) => {
      items.push(item);
    });
    setItemsAnexos(items);
  };

  const procesarAreas = () => {
    const a1 = itemsAnexos.filter((item) => item.area_nota === "area1");
    const a2 = itemsAnexos.filter((item) => item.area_nota === "area2");
    const a3 = itemsAnexos.filter((item) => item.area_nota === "area3");

    setArea1([...a1]);
    setArea2([...a2]);
    setArea3([...a3]);
  };

  const handleShow = () => {
    filtrarItemsImpresos();
    setVista();
  };

  const handleExited = () => {
    const oldItems = cuenta.items;
    const newItems = [];
    oldItems.map((item) => {
      item.impreso = true;
      newItems.push(item);
    });
    const newCta = {
      ...cuenta,
      items: newItems,
    };
    editarCuenta(cuenta.id, newCta, (res) => {
      console.log("cuenta editada en comanda modal: " + res);
    });
  };

  return (
    <Modal
      onHide={props.onHide}
      show={props.show}
      onShow={handleShow}
      onExited={handleExited}
      backdrop="static"
      keyboard="true"
    >
      <div id="comandaVista">
        <div id="infoCuenta">
          <strong>
            {" "}
            <p>
              orden: {cuenta.orden} {cuenta.servicio}
            </p>
            <p>cliente: {cuenta.torreta}</p>
          </strong>
          <p>
            oper: {cuenta.createdBy} {formatoFecha(Date.now())[0]}
          </p>
          <h2>**COMANDA**</h2>
        </div>
        <hr></hr>
        <div id="itemsInfo">
          <table>
            <thead>
              <tr>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {area1.length === 0 ? null : (
                <tr>
                  <td colSpan="2">
                    <h4 style={{ textAlign: "center" }}>-----AREA 1-----</h4>
                  </td>
                </tr>
              )}
              {area1.map((item, i) => (
                <tr
                  style={{
                    display: item.cancelado ? "none" : "",
                  }}
                  key={i}
                >
                  <td valign="top">{item.cant}</td>
                  <td>
                    <p>{item.name}</p>
                    <small>
                      {item.modificadores.map((m, i) => (
                        <p key={i}>
                          {">>"}
                          {m.name} {m.price > 0 ? "$" + m.price : ""}
                        </p>
                      ))}
                    </small>
                  </td>
                </tr>
              ))}
              {area2.length === 0 ? null : (
                <tr>
                  <td colSpan="2">
                    <h4 style={{ textAlign: "center" }}>-----AREA 2-----</h4>
                  </td>
                </tr>
              )}
              {area2.map((item, i) => (
                <tr
                  style={{
                    display: item.cancelado ? "none" : "",
                  }}
                  key={i}
                >
                  <td valign="top">{item.cant}</td>
                  <td>
                    <p>{item.name}</p>
                    <small>
                      {item.modificadores.map((m, i) => (
                        <p key={i}>
                          {">>"}
                          {m.name} {m.price > 0 ? "$" + m.price : ""}
                        </p>
                      ))}
                    </small>
                  </td>
                </tr>
              ))}
              {area3.length === 0 ? null : (
                <tr>
                  <td colSpan="2">
                    <h4 style={{ textAlign: "center" }}>-----AREA 3-----</h4>
                  </td>
                </tr>
              )}
              {area3.map((item, i) => (
                <tr
                  style={{
                    display: item.cancelado ? "none" : "",
                  }}
                  key={i}
                >
                  <td valign="top">{item.cant}</td>
                  <td>
                    <p>{item.name}</p>
                    <small>
                      {item.modificadores.map((m, i) => (
                        <p key={i}>
                          {">>"}
                          {m.name} {m.price > 0 ? "$" + m.price : ""}
                        </p>
                      ))}
                    </small>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <hr></hr>
        </div>
        {/* <div id="totalInfo">
          <small>
            <ul>
              <li style={{ display: cuenta.dscto > 0 ? "block" : "none" }}>
                subtotal: ${cuenta.importe}.00
              </li>
              <li style={{ display: cuenta.dscto > 0 ? "block" : "none" }}>
                descuento: -${cuenta.dscto}.00
              </li>
              <li>
                <h2>total: ${cuenta.total}.00</h2>
              </li>
              <li style={{ display: cuenta.efectivo > 0 ? "block" : "none" }}>
                efectivo: ${cuenta.efectivo}.00
              </li>
              <li style={{ display: cuenta.tarjeta > 0 ? "block" : "none" }}>
                tarjeta: ${cuenta.tarjeta}.00
              </li>
              <li style={{ display: cuenta.cambio > 0 ? "block" : "none" }}>
                cambio: ${cuenta.cambio}.00
              </li>
            </ul>
            {numeroALetras(cuenta.total, {
              plural: "PESOS 00/100",
              singular: "PESO 00/100",
            })}
          </small>
          <hr></hr>
        </div> */}
      </div>
    </Modal>
  );
}
