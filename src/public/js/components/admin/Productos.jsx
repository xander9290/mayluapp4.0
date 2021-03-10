const initProducto = {
  name: "",
  price: 0,
  subcategoria_id: "",
  area_nota: "",
  contable: true,
  createdAt: "",
  createdBy: "",
  lastEdit: "",
  id: null,
};

function Productos() {
  const {
    categorias,
    subcategorias,
    productos,
    crearProducto,
    editarProducto,
    delProducto,
    setSearchResults,
    fetchProductos,
  } = useContext(AppContext);

  const [producto, setProducto] = useState(initProducto);
  const [indx, setIndx] = useState("");
  const [error, setError] = useState(null);
  const [searchMessage, setSearchMessage] = useState(null);
  const [search, setSearch] = useState({ entry: "" });

  //   useEffect(() => {
  //     if (search.entry === "") {
  //       fetchProductos();
  //     } else {
  //       searching();
  //     }
  //   }, [search]);

  const handleValues = (e) => {
    setProducto({ ...producto, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleContable = () => {
    setProducto({ ...producto, contable: !producto.contable });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (producto.id) {
      const newProd = {
        ...producto,
        lastEdit: fechaISO(),
      };
      editarProducto(producto.id, newProd);
      cancelar();
    } else {
      if (verifyExiste(productos, producto.name)) {
        setError("No disponible. ¡Valor duplicado!");
        return;
      }
      const newProd = {
        ...producto,
        createdAt: fechaISO(),
        createdBy: operadorSession,
      };
      crearProducto(newProd);
      cancelar();
    }
  };

  const handleSearch = (e) => {
    setSearch({ ...search, [e.target.name]: e.target.value });
    setSearchMessage(null);
  };

  const selectProducto = (id) => {
    const prod = productos.find((producto) => producto.id === id);
    if (prod) {
      setProducto(prod);
    }
  };

  const handleSubmitSearch = (e) => {
    e.preventDefault();
    searching();
  };

  const searching = () => {
    const subcat = subcategorias.find(
      (subcategoria) => subcategoria.name.trim() === search.entry.trim()
    );
    if (subcat) {
      const productResultBySubcat = productos.filter(
        (producto) => producto.subcategoria_id === subcat.id
      );
      productResultBySubcat.length === 0
        ? setSearchMessage("Sin resultados")
        : setSearchResults(productResultBySubcat);
    } else {
      const productsResult = productos.filter(
        (producto) =>
          producto.name.toLowerCase().includes(search.entry.toLowerCase()) ||
          producto.codigo === parseInt(search.entry)
      );
      productsResult.length === 0
        ? setSearchMessage("Sin resultados")
        : setSearchResults(productsResult);

      if (productsResult.length === 1) {
        const id = productsResult[0].id;
        setIndx(id);
      }
    }
  };

  const selectITem = (idx) => {
    setIndx(idx);
  };

  const cancelar = () => {
    setProducto(initProducto);
    setSearch({ entry: "" });
    setIndx("");
    setError(null);
  };

  return (
    <Fragment>
      <div className="col-md-3">
        <form className="card text-dark" onSubmit={handleSubmit}>
          <div className="card-header">
            <h5 className="card-title">
              Productos{" "}
              <span className="badge bg-primary">{productos.length}</span>
              {producto.id && <small>{" <Edición>"}</small>}
            </h5>
          </div>
          <div style={{ height: "470px" }} className="card-body">
            <div className="mb-3">
              <label className="form-label">Nuevo producto</label>
              <input
                className="form-control form-control-lg"
                type="text"
                name="name"
                value={producto.name}
                onChange={handleValues}
                placeholder="Descripción"
                autoComplete="off"
                required
              />
              {error && (
                <small className="text-danger fw-bolder">{error}</small>
              )}
            </div>
            <label className="form-label">Precio</label>
            <div className="input-group mb-3">
              <span className="input-group-text">$</span>
              <input
                className="form-control form-control-lg"
                type="number"
                name="price"
                min="0"
                value={producto.price}
                onChange={handleValues}
                autoComplete="off"
                required
              />
              <span className="input-group-text">.00</span>
            </div>
            <div className="mb-2">
              <label className="form-label">Subcategoría</label>
              <select
                className="form-select form-select-lg text-uppercase"
                name="subcategoria_id"
                value={producto.subcategoria_id}
                onChange={handleValues}
                required
              >
                <option> </option>
                {subcategorias.map((subcategoria) => (
                  <option key={subcategoria.id} value={subcategoria.id}>
                    {subcategoria.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-1">
              <label className="form-label">Area de nota</label>
              <select
                className="form-select form-select-lg text-uppercase"
                name="area_nota"
                value={producto.area_nota}
                onChange={handleValues}
              >
                <option> </option>
                <option value="area1">area 1</option>
                <option value="area2">area 2</option>
                <option value="area3">area 3</option>
                <option value="area4">area 4</option>
              </select>
            </div>
            <div className="mb-2 form-check">
              <input
                className="form-check-input"
                type="checkbox"
                checked={producto.contable}
                onChange={handleContable}
              />
              <label className="form-check-label">Contable</label>
            </div>
            <div className="mb-2">
              {producto.id ? (
                <button
                  title="EDITAR"
                  className="btn btn-primary"
                  type="submit"
                >
                  <i className="bi bi-pencil me-2"></i>
                  Editar
                </button>
              ) : (
                <button
                  title="AGREGAR"
                  className="btn btn-primary"
                  type="submit"
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Agregar
                </button>
              )}
              <button
                onClick={cancelar}
                title="CANCELAR"
                className="btn btn-warning ms-2"
                type="reset"
              >
                <i className="bi bi-x-circle me-2"></i>
                Cancelar
              </button>
            </div>
          </div>
          <div className="card-footer p-2">
            <p className="p-0 m-0">
              <span className="fw-bolder">Creación: </span>
              <span>
                {producto.createdAt && formatoFecha(producto.createdAt)}
              </span>
            </p>
            <p className="p-0 m-0">
              <span className="fw-bolder">Creado por: </span>
              <span>{producto.createdBy}</span>
            </p>
            <p className="p-0 m-0">
              <span className="fw-bolder">Última edición: </span>
              <span>
                {producto.lastEdit && formatoFecha(producto.lastEdit)}
              </span>
            </p>
          </div>
        </form>
      </div>
      <div className="col-md-9">
        <div className="card text-dark">
          <div className="card-header d-flex justify-content-between align-items-center">
            <form onSubmit={handleSubmitSearch}>
              <div className="row">
                <div className="col-md-8 px-0">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    name="entry"
                    value={search.entry}
                    onChange={handleSearch}
                    autoComplete="off"
                    required
                    placeholder="Buscar..."
                  />
                </div>
                <div className="col-1 px-0">
                  <button
                    title="BUSCAR"
                    className="btn btn-primary btn-lg"
                    type="submit"
                  >
                    <i className="bi bi-search"></i>
                  </button>
                </div>
              </div>
            </form>
            <button
              onClick={() => {
                cancelar(), fetchProductos();
              }}
              type="button"
              className="btn btn-primary btn-lg"
            >
              <i className="bi bi-arrow-repeat me-2"></i>
              Actualizar
            </button>
          </div>
          <div
            style={{ height: "526px", overflowY: "scroll" }}
            className="card-body p-2"
          >
            {searchMessage && (
              <small className="text-danger fw-bolder">{searchMessage}</small>
            )}
            <table className="table table-bordered">
              <thead>
                <tr className="text-center text-uppercase">
                  <th scope="col">
                    <i className="bi bi-trash"></i>
                  </th>
                  <th scope="col">
                    <i className="bi bi-pencil"></i>
                  </th>
                  <th scope="col">Descripción</th>
                  <th scope="col">precio</th>
                  <th scope="col">ubicación</th>
                  <th scope="col">area</th>
                  <th scope="col">contable</th>
                  <th scope="col">código</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto) => (
                  <ProductoItem
                    key={producto.id}
                    indx={indx}
                    producto={producto}
                    categorias={categorias}
                    subcategorias={subcategorias}
                    delProducto={delProducto}
                    selectProducto={selectProducto}
                    selectITem={selectITem}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

const ProductoItem = ({
  indx,
  producto,
  categorias,
  subcategorias,
  delProducto,
  selectProducto,
  selectITem,
}) => {
  const [subcategoria, setSubcategoria] = useState({
    name: "",
    fondo: "",
    categoria: "",
  });

  useEffect(() => {
    getSubcategoria();
    return () => {};
  }, [categorias, producto]);

  const getSubcategoria = () => {
    const subcat = subcategorias.find(
      (subcategoria) => subcategoria.id === producto.subcategoria_id
    );
    if (subcat) {
      const cat = categorias.find(
        (categoria) => categoria.id === subcat.categoria_id
      );
      setSubcategoria({
        name: subcat.name,
        fondo: cat.fondo,
        categoria: cat.name,
      });
    }
  };

  return (
    <tr
      style={{ cursor: "default" }}
      onClick={() => selectITem(producto.id)}
      className={`text-uppercase ${producto.id === indx ? "bg-info" : ""}`}
    >
      <th scope="row" className="text-center">
        <button
          onClick={() => delProducto(producto.id)}
          title="ELIMINAR"
          type="button"
          className="btn btn-danger btn-sm"
        >
          <i className="bi bi-trash"></i>
        </button>
      </th>
      <th scope="row" className="text-center">
        <button
          onClick={() => selectProducto(producto.id)}
          title="EDITAR"
          type="button"
          className="btn btn-primary btn-sm"
        >
          <i className="bi bi-pencil"></i>
        </button>
      </th>
      <td>{producto.name}</td>
      <td className="text-center">${producto.price}</td>
      <td
        style={{ backgroundColor: subcategoria.fondo }}
        className="text-center"
      >
        {subcategoria.name}
        <small>
          {" "}
          {"<"}
          {subcategoria.categoria}
          {">"}
        </small>
      </td>
      <td className="text-center">{producto.area_nota}</td>
      <td className="text-center">
        <input
          type="checkbox"
          checked={producto.contable ? true : false}
          readOnly
        />
      </td>
      <td className="text-center">{producto.codigo}</td>
    </tr>
  );
};
