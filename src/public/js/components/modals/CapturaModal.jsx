function CapturaModal(props) {
  const { cuenta, categorias, subcategorias, productos, editarCuenta, setIdx } =
    useContext(AppContext);
  // const { cuenta } = props;

  const [obs, setObs] = useState({ obs: "" });
  const [contador, setContador] = useState(1);
  const [dscto, setDscto] = useState({ dscto: 0 });
  // RECURSOS
  const [catBg, setCatBg] = useState("");
  const [subcategoriasbox, setSubcategoriasbox] = useState([]);
  const [productosbox, setProductosbox] = useState([]);
  const [modificadoresbox, setModificadoresbox] = useState([]);
  // CAPTURA
  const [items, setItems] = useState([]);
  const [itemsIdx, setItemsIdx] = useState(0);
  const [total, setTotal] = useState(0);
  const [miscelaneo, setMiscelaneo] = useState({ name: "", price: 0 });

  // CAPTURA DE PRODUCTOS
  const scrollRef = useRef();
  useEffect(() => {
    if (items.length > 0) {
      calcularTotal();
      scrollTop();
      setItemsIdx(!items ? 0 : items.length - 1);
    } else {
      setTotal(0);
      document.title = `MAyLu`;
    }
  }, [items]);

  // useEffect(() => {
  //   setItems([...area1, ...area2, ...area3, ...area4]);
  // }, [area1, area2, area3, area4]);

  const scrollTop = () => {
    try {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    } catch (err) {
      console.log(err);
    }
  };

  const selectItem = (idx) => {
    setItemsIdx(idx);
  };

  const eliminarItem = () => {
    const list = items;
    list.splice(itemsIdx, 1);
    setItems([...list]);
  };

  const capturarProducto = (pdctoId) => {
    const pdcto = productos.find((producto) => producto.id === pdctoId);
    if (pdcto) {
      const cant = parseInt(contador);
      const importe = cant * parseInt(pdcto.price);
      const price = pdcto.price;

      const newItem = {
        cant,
        name: pdcto.name,
        importe,
        price,
        dscto: 0,
        modificadores: [],
        producto_id: pdcto.id,
        contable: pdcto.contable,
        area_nota: pdcto.area_nota,
        createdAt: fechaISO(),
        createdBy: operadorSession,
        cancelado: false,
        impreso: false,
      };

      setItems([...items, newItem]);
      setContador(1);
    }
  };

  // const cleanAreas = () => {
  //   setArea1([]);
  //   setArea2([]);
  //   setArea3([]);
  //   setArea4([]);
  // };

  const calcularTotal = () => {
    let total = 0;
    items.map((item) => {
      total += item.importe;
    });
    setTotal(total);
    document.title = `MAyLu $${total}`;
  };

  const insertarModificador = (mod) => {
    const list = items;
    try {
      list[itemsIdx].modificadores.push(mod);
      if (mod.price > 0) {
        list[itemsIdx].importe = list[itemsIdx].importe + parseInt(mod.price);
      }
    } catch (error) {
      alert("SELECCIONA UN PRODUCTO ANTES PARA CONTINUAR");
    }
    setItems([...list]);
  };

  // OBSERVACIOES
  const handleObs = (e) => {
    setObs({ ...obs, [e.target.name]: e.target.value });
  };

  const handleSubmitObs = (e) => {
    e.preventDefault();
    if (items.length > 0) {
      const list = items;
      list[itemsIdx].modificadores.push({
        name: obs.obs.trim(),
        price: 0,
      });
      setItems([...list]);
      setObs({ obs: "" });
    }
  };

  // DESCUENTO
  const handleDscto = (e) => {
    setDscto({ ...dscto, [e.target.name]: e.target.value });
  };

  // CARGA DE RECURSOS
  const loadSubcategorias = (catId, bg) => {
    setProductosbox([]);
    setModificadoresbox([]);
    const subcats = subcategorias.filter(
      (subcategoria) => subcategoria.categoria_id === catId
    );
    if (subcats.length > 0) {
      setSubcategoriasbox(subcats);
      setCatBg(bg);
    }
  };

  const loadProductos = (subcatId) => {
    const pdctos = productos.filter(
      (producto) => producto.subcategoria_id === subcatId
    );
    if (pdctos.length > 0) {
      setProductosbox(pdctos);
      const subcat = subcategorias.find(
        (subcategoria) => subcategoria.id === subcatId
      );
      setModificadoresbox(subcat.modificadores);
    }
  };

  const handleSubmitDscto = (e) => {
    e.preventDefault();
    if (items.length > 0) {
      const list = items;
      const importe = list[itemsIdx].importe;
      list[itemsIdx].importe = importe - parseInt(dscto.dscto);
      list[itemsIdx].dscto = parseInt(dscto.dscto);
      setItems([...list]);
      setDscto({ dscto: 0 });
    }
  };

  // MISCELANEO
  const handleValuesMiscelaneo = (e) => {
    setMiscelaneo({ ...miscelaneo, [e.target.name]: e.target.value });
  };

  const handleSubmitMiscelaneo = (e) => {
    e.preventDefault();
    const cant = parseInt(contador);
    const importe = cant * parseInt(miscelaneo.price);
    const price = miscelaneo.price;

    const newItem = {
      cant,
      name: miscelaneo.name.trim(),
      importe,
      price,
      dscto: 0,
      modificadores: [],
      producto_id: "miscelaneo",
      area_nota: "area3",
      contable: false,
      createdAt: fechaISO(),
      createdBy: operadorSession,
      cancelado: false,
      impreso: false,
    };
    setItems([...items, newItem]);
    setMiscelaneo({ name: "", price: 0 });
    setContador(1);
  };

  // ACEPTAR CAPTURA
  const aceptar = () => {
    const oldItems = cuenta.items;
    items.map((items) => {
      oldItems.push(items);
    });
    const { importe, totalConDscto } = procesarItems(oldItems, cuenta.dscto);
    const newCta = {
      ...cuenta,
      items: oldItems,
      importe,
      total: totalConDscto,
    };
    // console.log(newCta);
    editarCuenta(cuenta.id, newCta, (res) => {
      if (res) {
        props.onHide();
        setIdx(cuenta.id);
        setTimeout(() => {
          props.openVista();
        }, 500);
      }
    });
  };

  const handleShow = () => {};

  const handleExited = () => {
    setObs({ obs: "" });
    setContador(1);
    setDscto({ dscto: 0 });
    setSubcategoriasbox([]);
    setProductosbox([]);
    setModificadoresbox([]);
    setItems([]);
    setTotal(0);
    // cleanAreas();
    document.title = `MAyLu $00.00`;
  };

  return (
    <Modal
      onHide={props.onHide}
      show={props.show}
      backdrop="static"
      keyboard={false}
      onShow={handleShow}
      onExited={handleExited}
      dialogClassName="modal-captura"
    >
      <Modal.Header className="d-flex flex-row justify-content-start p-1">
        <ul className="list-group list-group-horizontal text-uppercase">
          {/* CUENTA INFO */}
          <li className="list-group-item">
            <span className="fw-bold">orden: </span>
            {cuenta.orden}
          </li>
        </ul>
        <button
          onClick={eliminarItem}
          title="ELIMINAR ITEM"
          type="button"
          className="btn btn-danger btn-lg"
        >
          <i className="bi bi-x-square"></i>
        </button>
        {/* FORMULARIO DE OBSERVACIONES */}
        <form onSubmit={handleSubmitObs} className="ms-3">
          <div
            style={{ width: "270px" }}
            className="input-group input-group-lg"
          >
            <input
              className="form-control"
              type="text"
              name="obs"
              value={obs.obs}
              onChange={handleObs}
              required
              autoComplete="off"
              placeholder="Observaciones"
            />
            <div className="input-group-text p-0">
              <button className="btn btn-primary btn-lg" type="submit">
                <i className="bi bi-plus-square"></i>
              </button>
            </div>
          </div>
        </form>
        {/* CONTADOR */}
        <button
          title="MENOS"
          onClick={() => {
            contador <= 1 ? null : setContador(contador - 1);
          }}
          className="btn btn-warning btn-lg ms-3 fw-bolder"
          type="button"
        >
          <i className="bi bi-dash"></i>
        </button>
        <input
          style={{ width: "70px" }}
          className="form-control form-control-lg text-center fw-bolder"
          type="text"
          value={contador}
          readOnly
        />
        <button
          onClick={() => setContador(contador + 1)}
          className="btn btn-warning btn-lg fw-bolder"
          type="button"
        >
          <i className="bi bi-plus"></i>
        </button>
        {/* FORMULARIO DE DESCUENTO  A PRODUCTO */}
        <form onSubmit={handleSubmitDscto} className="ms-3">
          <div
            style={{ width: "140px" }}
            className="input-group input-group-lg"
          >
            <input
              className="form-control fw-bold text-center"
              type="number"
              name="dscto"
              value={dscto.dscto}
              onChange={handleDscto}
              required
              autoComplete="off"
            />
            <div className="input-group-text p-0">
              <button className="btn btn-primary btn-lg" type="submit">
                -$
              </button>
            </div>
          </div>
        </form>
        {/* BOTON DE ACEPTAR Y CANCELAR  */}
        <button
          onClick={aceptar}
          type="button"
          className="btn btn-success btn-lg ms-4 me-2"
          disabled={items.length > 0 ? false : true}
        >
          Aceptar
        </button>
        <button
          onClick={props.onHide}
          type="button"
          className="btn btn-danger btn-lg"
        >
          Cancelar
        </button>
      </Modal.Header>
      <Modal.Body className="modal-captura-body d-flex flex-row p-0">
        {/* DISPLAY ITEMS */}
        <div style={{ width: "27%" }}>
          <div className="card text-dark">
            <div className="card-body p-0 d-flex flex-column justify-content-between">
              <div
                ref={scrollRef}
                style={{ height: "379px", overflow: "scroll" }}
              >
                <table className="table table-sm table-bordered border-dark">
                  <thead>
                    <tr className="text-uppercase text-center bg-secondary text-light">
                      <th scope="col">cant</th>
                      <th scope="col">desc</th>
                      <th scope="col">importe</th>
                      <th scope="col">precio</th>
                      <th scope="col">dscto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, i) => (
                      <tr
                        style={{ cursor: "default" }}
                        onClick={() => selectItem(i)}
                        key={i}
                        className={`fw-bold text-uppercase ${
                          itemsIdx === i ? "bg-info" : ""
                        }`}
                      >
                        <td className="text-center fs-5">{item.cant}</td>
                        <td>
                          <p className="p-0 m-0 text-nowrap fs-5">
                            {item.name}
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
                        <td className="text-end fs-5">${item.importe}</td>
                        <td className="text-end fs-5">${item.price}</td>
                        <td className="text-end fs-5">-${item.dscto}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <h3 className="text-uppercase text-end me-4">
                Total: ${total > 0 ? total : "0"}
              </h3>
            </div>
            <div style={{ height: "148px" }} className="card-footer">
              <form onSubmit={handleSubmitMiscelaneo}>
                <input
                  className="form-control form-control-lg"
                  type="text"
                  name="name"
                  value={miscelaneo.name}
                  onChange={handleValuesMiscelaneo}
                  autoComplete="off"
                  required
                  placeholder="Miscelaneo"
                />
                <div
                  style={{ width: "200px" }}
                  className="input-group input-group-lg"
                >
                  <span className="input-group-text">$</span>
                  <input
                    className="form-control"
                    type="number"
                    name="price"
                    min="0"
                    value={miscelaneo.price}
                    onChange={handleValuesMiscelaneo}
                    autoComplete="off"
                    required
                  />
                  <span className="input-group-text">.00</span>
                </div>
                <button className="btn btn-primary" type="submit">
                  Agregar
                </button>
                <button
                  onClick={() => {
                    setMiscelaneo({ name: "", price: 0 }), setContador(1);
                  }}
                  className="btn btn-warning ms-2"
                  type="reset"
                >
                  Cancelar
                </button>
              </form>
            </div>
          </div>
        </div>
        {/* CONTENEDOR DE CATEGORIAS */}
        <div
          style={{
            width: "12%",
            overflowY: "auto",
          }}
          className="d-flex flex-column p-1"
        >
          {categorias.map((categoria) => (
            <button
              key={categoria.id}
              onClick={() => loadSubcategorias(categoria.id, categoria.fondo)}
              style={{ backgroundColor: categoria.fondo, height: "70px" }}
              className="btn btn-lg text-uppercase fw-bold mb-2"
            >
              {categoria.name}
            </button>
          ))}
        </div>
        {/* CONTENEDOR DE SUBCATEGORIAS, PRODUCTOS Y MODIFICADORES */}
        <div style={{ width: "61%" }} className="border">
          <div className="card text-dark">
            <div
              style={{
                height: "96px",
                overflowX: "auto",
              }}
              className="card-header p-1"
            >
              <div style={{ whiteSpace: "nowrap" }}>
                {subcategoriasbox.map((subcategoria) => (
                  <button
                    key={subcategoria.id}
                    onClick={() => loadProductos(subcategoria.id)}
                    style={{ backgroundColor: catBg }}
                    className="btn btn-lg text-uppercase fw-bold me-2 myBtn"
                  >
                    {subcategoria.name}
                  </button>
                ))}
              </div>
            </div>
            <div
              style={{
                height: "395px",
                overflowY: "auto",
              }}
              className="card-body p-1"
            >
              <div>
                {productosbox.map((producto) => (
                  <button
                    key={producto.id}
                    onClick={() => capturarProducto(producto.id)}
                    style={{ backgroundColor: catBg }}
                    className="btn btn-lg text-uppercase fw-bold me-2 mb-2 myBtn"
                  >
                    {producto.name}
                  </button>
                ))}
              </div>
            </div>
            <div
              style={{
                height: "100px",
                overflowX: "auto",
              }}
              className="card-footer p-1"
            >
              <div style={{ whiteSpace: "nowrap" }}>
                {modificadoresbox.map((modificador, i) => (
                  <button
                    key={i}
                    onClick={() => insertarModificador(modificador)}
                    style={{ backgroundColor: catBg }}
                    className="btn btn-lg text-uppercase fw-bold me-2 mb-2 myBtn"
                  >
                    {modificador.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
