function VistaCuenta(props) {
  const { editarCuenta, cuenta } = useContext(AppContext);

  const [itemsIdx, setItemsIdx] = useState(null);
  const selectItem = (idx) => {
    setItemsIdx(idx);
  };

  const cancelarItem = (idx) => {
    if (!window.confirm("Confrimar Acción")) return;
    const list = cuenta.items;
    const cant = list[idx].cant;
    if (cant > 1) {
      const _cant = window.prompt(
        "CANTIDAD A CANCELAR DE " + cant + " " + list[idx].name.toUpperCase(),
        cant
      );
      if (_cant === null) return;
      const nvaCant = list[idx].cant - parseInt(_cant);
      list[idx].cant = nvaCant;
      const price = list[idx].price;
      const nvoImporte = price * nvaCant;
      list[idx].importe = nvoImporte;
      let motivo = prompt("motivo de la cancelación".toUpperCase());
      if (motivo === null) motivo = "sin especificar";
      if (cant !== parseInt(_cant)) {
        const productoCancelado = {
          ...list[idx],
          motivo,
          cancelado: true,
          cant: parseInt(_cant),
          orden: cuenta.orden,
          hora: fechaISO(),
        };
        list.push(productoCancelado);
      }
      list[idx].motivo = motivo;
      list[idx].hora = fechaISO();
      if (nvaCant === 0) {
        list[idx].cancelado = true;
        list[idx].cant = parseInt(cant);
        list[idx].motivo = motivo;
        list[idx].hora = fechaISO();
      }
      const { importe, totalConDscto } = procesarItems(list, cuenta.dscto);
      const newCta = {
        ...cuenta,
        items: list,
        importe,
        total: totalConDscto,
      };
      editarCuenta(cuenta.id, newCta, (res) => {
        console.log(res);
      });
    } else {
      let motivo = prompt("motivo de la cancelación".toUpperCase());
      if (motivo === null) motivo = "sin especificar";
      list[idx].motivo = motivo;
      list[idx].cancelado = true;
      const { importe, totalConDscto } = procesarItems(list, cuenta.dscto);
      const newCta = {
        ...cuenta,
        items: list,
        importe,
        total: totalConDscto,
      };
      editarCuenta(cuenta.id, newCta, (res) => {});
    }
  };

  const descontarProducto = (idx) => {
    const entry = window.prompt("Importe en porcentaje %", 0);
    if (entry === null) return;
    const list = cuenta.items;
    const _dscto = parseInt(entry);
    const precio = list[idx].price;
    const total = Math.round((precio * _dscto) / 100);
    const _totalDscto = precio - total;
    list[idx].importe = _totalDscto;
    list[idx].dscto = total;
    const { importe, totalConDscto } = procesarItems(list, 0);
    const newCta = {
      ...cuenta,
      items: list,
      importe,
      dscto: 0,
      total: totalConDscto,
    };
    editarCuenta(cuenta.id, newCta, (res) => {});
  };

  const capturar = () => {
    props.onHide();
    setTimeout(() => {
      props.openCaptura();
    }, 200);
  };

  const imprimirLocal = () => {
    props.openNotaLocal();
    props.onHide();
  };

  const handleShow = () => {};

  const handleExited = () => {
    setItemsIdx(null);
  };

  return (
    <Modal
      onHide={props.onHide}
      show={props.show}
      backdrop="static"
      keyboard={false}
      onShow={handleShow}
      onExited={handleExited}
      dialogClassName="modal-vista"
    >
      <div className="card text-dark">
        <div className="card-header">
          <h5 className="card-title">
            Detalle de la Orden {cuenta.orden} {cuenta.servicio}
          </h5>
          <ul className="list-group list-group-horizontal text-uppercase">
            <li className="list-group-item">
              <span className="fw-bolder">torreta: </span>
              {cuenta.torreta}
            </li>
            <li className="list-group-item">
              <span className="fw-bolder">folio: </span>
              {cuenta.folio}
            </li>
            <li className="list-group-item px-1">
              <span className="fw-bolder">apertura: </span>
              {formatoFecha(cuenta.createdAt)[1]}
            </li>
            {cuenta.closedAt && (
              <li className="list-group-item px-1">
                <span className="fw-bolder">cierre: </span>
                {formatoFecha(cuenta.closedAt)[1]}
              </li>
            )}
            <li className="list-group-item">
              <span className="fw-bolder">operador: </span>
              {cuenta.createdBy}
            </li>
            <li className="list-group-item border-0">
              <button onClick={props.onHide} className="btn btn-danger">
                CERRAR
              </button>
            </li>
          </ul>
        </div>
        <div
          style={{ height: "465px", overflow: "scroll", whiteSpace: "nowrap" }}
          className="card-body p-1"
        >
          <table className="table table-bordered border-dark">
            <thead>
              <tr className="text-uppercase text-center bg-secondary text-light">
                <th scope="col">
                  {cuenta.estado !== "abierto" ? null : (
                    <i className="bi bi-x-circle"></i>
                  )}
                </th>
                <th scope="col">
                  <i className="bi bi-printer"></i>
                </th>
                <th scope="col">-%</th>
                <th scope="col">cant</th>
                <th scope="col">descripción</th>
                <th scope="col">importe</th>
                <th scope="col">precio</th>
                <th scope="col">dscto</th>
                <th scope="col">operador</th>
                <th scope="col">captura</th>
              </tr>
            </thead>
            <tbody>
              {cuenta.id &&
                cuenta.items.map((item, i) => (
                  <tr
                    style={{ cursor: "default" }}
                    onClick={() => selectItem(i)}
                    key={i}
                    className={`fw-bold text-uppercase ${
                      itemsIdx === i ? "bg-info" : ""
                    } ${item.cancelado ? "bg-danger" : ""} `}
                  >
                    <th scope="row" className="text-center">
                      <button
                        disabled={
                          item.cancelado
                            ? true
                            : false || cuenta.impreso
                            ? true
                            : false
                        }
                        onClick={() => cancelarItem(i)}
                        title="CANCELAR"
                        type="button"
                        className="btn btn-danger btn-sm"
                      >
                        <i className="bi bi-x-circle"></i>
                      </button>
                    </th>
                    <th scope="row" className="text-center">
                      {item.impreso && <i className="bi bi-check-square"></i>}
                    </th>
                    <th scope="row" className="text-center">
                      {item.cancelado ? null : (
                        <button
                          disabled={cuenta.impreso ? true : false}
                          onClick={() => descontarProducto(i)}
                          title="DESCONTAR"
                          type="button"
                          className="btn btn-primary btn-sm"
                        >
                          -%
                        </button>
                      )}
                    </th>
                    <td className="text-center fs-5">{item.cant}</td>
                    <td>
                      <p className="p-0 m-0 text-nowrap fs-5">
                        {item.name} {item.cancelado ? "(X)" : ""}
                      </p>
                      {item.modificadores.map((mod, i) => (
                        <small key={i}>
                          <p className="p-0 m-0 text-nowrap">
                            {">>"} {mod.name}{" "}
                            {mod.price > 0 ? "$" + mod.price : ""}
                          </p>
                        </small>
                      ))}
                    </td>
                    <td
                      className={`text-end fs-5 ${
                        item.dscto > 0 ? "bg-warning" : ""
                      }`}
                    >
                      ${item.importe}
                    </td>
                    <td
                      className={`text-end fs-5 ${
                        item.dscto > 0 ? "bg-warning" : ""
                      }`}
                    >
                      ${item.price}
                    </td>
                    <td
                      className={`text-end fs-5 ${
                        item.dscto > 0 ? "bg-warning" : ""
                      }`}
                    >
                      -${item.dscto}
                    </td>
                    <td className="text-end fs-5">{item.createdBy}</td>
                    <td className="text-end fs-5">
                      {formatoFecha(item.createdAt)[1]}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="card-footer p-2 d-flex justify-content-end">
          {cuenta.estado !== "abierto" ? null : (
            <button
              onClick={props.openComanda}
              type="button"
              className="btn btn-warning me-3 text-uppercase fw-bold"
            >
              comanda
            </button>
          )}
          {cuenta.estado !== "abierto" ? null : (
            <button
              onClick={capturar}
              disabled={cuenta.impreso ? true : false}
              type="button"
              className="btn btn-warning me-3 text-uppercase fw-bold"
            >
              capturar
            </button>
          )}
          <button
            onClick={imprimirLocal}
            type="button"
            className="btn btn-warning me-3 text-uppercase fw-bold"
          >
            *imprimir
          </button>
          <ul className="list-group list-group-horizontal text-uppercase me-3">
            <li className="list-group-item">
              <h5>importe: ${cuenta.importe}</h5>
            </li>
            <li className="list-group-item">
              <h5>dscto: -%{cuenta.dscto}</h5>
            </li>
            <li className="list-group-item">
              <h5>total: ${cuenta.total}</h5>
            </li>
          </ul>
        </div>
      </div>
    </Modal>
  );
}
