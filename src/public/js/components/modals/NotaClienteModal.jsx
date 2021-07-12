function NotaClienteModal(props) {
  const { cuenta } = props;
  const { settings } = useContext(SettingsContext);

  const setVista = () => {
    props.onHide();
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
                  width: 50%;
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
                    font-size: 17px;
                }
                table tbody tr {
                    padding: 0;
                }
                td:first-child, td:last-child {
                    text-align: center
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
    return true;
  };

  const [areas, setAreas] = useState([]);

  useEffect(() => {
    if (cuenta.id) {
      ordenarItems();
    }
  }, [cuenta]);

  const ordenarItems = () => {
    const items = [];
    const getItems = cuenta.items.filter((items) => items.cancelado === false);
    getItems.map((item) => {
      items.push(item);
    });

    const a1 = items.filter((item) => item.area_nota === "area1");
    const a2 = items.filter((item) => item.area_nota === "area2");
    const a3 = items.filter((item) => item.area_nota === "area3");
    const a4 = items.filter((item) => item.area_nota === "area4");

    // setArea1([...a1]);
    // setArea2([...a2]);
    // setArea3([...a3]);
    setAreas([...a1, ...a2, ...a3, ...a4]);
  };

  return (
    <Modal
      onHide={props.onHide}
      show={props.show}
      onShow={setVista}
      backdrop="static"
      keyboard="true"
    >
      <div id="comandaVista">
        <div
          style={{
            display: settings.notaCliente.logoTitle === "" ? "none" : "block",
          }}
          id="logoContainer"
        >
          <div id="logo">
            <h3 id="logoNameTitle">{settings.notaCliente.logoTitle}</h3>
            <h5 id="logoSubName">{settings.notaCliente.logoSubtitle}</h5>
          </div>
        </div>
        <div id="infoEmpresa">
          <p
            style={{
              display:
                settings.notaCliente.infoAddress1 === "" ? "none" : "block",
            }}
          >
            {settings.notaCliente.infoAddress1}
          </p>
          <p
            style={{
              display:
                settings.notaCliente.infoAddress2 === "" ? "none" : "block",
            }}
          >
            {settings.notaCliente.infoAddress2}
          </p>
          <p
            style={{
              display:
                settings.notaCliente.infoAddress3 === "" ? "none" : "block",
            }}
          >
            {settings.notaCliente.infoAddress3}
          </p>
          <p
            id="tel"
            style={{
              display: settings.notaCliente.infoTel === "" ? "none" : "block",
            }}
          >
            tel: {settings.notaCliente.infoTel}
          </p>
          <p
            id="wsap"
            style={{
              display: settings.notaCliente.infoWapp === "" ? "none" : "block",
            }}
          >
            whatsapp: {settings.notaCliente.infoWapp}
          </p>
        </div>
        <div id="infoCuenta">
          <strong>
            {" "}
            <p>
              orden: {cuenta.orden} {cuenta.servicio}
            </p>
            <p>
              {cuenta.servicio === "comedor" ? "mesa: " : "cliente: "}{" "}
              {cuenta.torreta}
            </p>
          </strong>
          <p>
            oper: {cuenta.createdBy} {formatoFecha(cuenta.createdAt)[0]}
          </p>
        </div>
        {cuenta.servicio === "comedor" ? null : !cuenta.cliente.id ? null : (
          <div style={{ paddingLeft: "10px" }} id="clienteInfo">
            <hr></hr>
            <p>{cuenta.cliente.address.calle}</p>
            <p>{cuenta.cliente.address.cruces}</p>
            <p>{cuenta.cliente.address.colonia}</p>
            <small>
              <p>tel: {cuenta.cliente.tel}</p>
              {cuenta.cliente.address.obs && (
                <p>obs: {cuenta.cliente.address.obs}</p>
              )}
            </small>
          </div>
        )}
        <hr></hr>
        <div id="itemsInfo">
          <table>
            <thead>
              <tr>
                <th>cant</th>
                <th>desc</th>
                <th>importe</th>
              </tr>
            </thead>
            <tbody>
              {areas.map((item, i) => (
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
                  <td valign="top">${item.importe}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <hr></hr>
        </div>
        <div id="totalInfo">
          <small>
            <ul>
              <li style={{ display: cuenta.dscto > 0 ? "block" : "none" }}>
                subtotal: ${cuenta.importe}
              </li>
              <li style={{ display: cuenta.dscto > 0 ? "block" : "none" }}>
                descuento: -${cuenta.dscto}
              </li>
              <li>
                <h1>total: ${cuenta.total}</h1>
              </li>
              <li style={{ display: cuenta.efectivo > 0 ? "block" : "none" }}>
                efectivo: ${cuenta.efectivo}
              </li>
              <li style={{ display: cuenta.tarjeta > 0 ? "block" : "none" }}>
                Pago con tarjeta +{cuenta.comision && cuenta.comision[0]}%: $
                {cuenta.comision && cuenta.comision[2]}
              </li>
              <li
                style={{ display: cuenta.otro_medio[1] > 0 ? "block" : "none" }}
              >
                {cuenta.otro_medio[0]}: ${cuenta.otro_medio[1]}
              </li>
              <li style={{ display: cuenta.cambio > 0 ? "block" : "none" }}>
                cambio: ${cuenta.cambio}
              </li>
            </ul>
            {numeroALetras(cuenta.total, {
              plural: "PESOS 00/100",
              singular: "PESO 00/100",
            })}
          </small>
          <hr></hr>
          <div id="footer">
            <p
              style={{
                display:
                  settings.notaCliente.footerMsg1 === "" ? "none" : "block",
              }}
            >
              {settings.notaCliente.footerMsg1}
            </p>
            <small
              style={{
                display:
                  settings.notaCliente.footerMsg2 === "" ? "none" : "block",
              }}
            >
              <p>{settings.notaCliente.footerMsg2}</p>
            </small>
            <small
              style={{
                display:
                  settings.notaCliente.footerMsg3 === "" ? "none" : "block",
              }}
            >
              <p>{settings.notaCliente.footerMsg3}</p>
            </small>
          </div>
        </div>
      </div>
    </Modal>
  );
}
