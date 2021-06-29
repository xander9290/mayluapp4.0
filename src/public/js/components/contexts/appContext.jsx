const AppContext = createContext();

function AppProvider({ children }) {
  const {
    initialCategoria,
    categorias,
    categoria,
    setCategoria,
    createCategoria,
    selectCategoria,
    editarCategoria,
    delCategoria,
  } = useCategorias();
  const {
    subcategorias,
    createSubcategoria,
    editarSubcategoria,
    delSubcategora,
  } = useSubcategorias();
  const {
    productos,
    crearProducto,
    editarProducto,
    delProducto,
    setSearchResults,
    fetchProductos,
  } = useProductos();
  const {
    clientes,
    crearCliente,
    editarCliente,
    delCliente,
    setSearchResultsClientes,
    fetchClientes,
  } = useClientes();
  const {
    operadores,
    crearOperador,
    editarOperador,
    delOperador,
    login,
    commit,
    logs,
  } = useOperadores();

  const {
    initialCuenta,
    cuentas,
    cuenta,
    selectCuenta,
    setIdx,
    idx,
    setCuentas,
    setCuenta,
    createCuenta,
    editarCuenta,
    sellarCuenta,
  } = useCuentas();

  const { cajas, createCaja, delCaja } = useCaja();
  const { otrosMedios, createMedio, delMedio } = useOtrosMedios();

  const data = {
    // Categorias
    initialCategoria,
    categorias,
    categoria,
    setCategoria,
    createCategoria,
    selectCategoria,
    editarCategoria,
    delCategoria,
    // SUBCATEGORIAS
    subcategorias,
    createSubcategoria,
    editarSubcategoria,
    delSubcategora,
    // PRODUCTOS
    productos,
    crearProducto,
    editarProducto,
    delProducto,
    setSearchResults,
    fetchProductos,
    // CLIENTES
    clientes,
    crearCliente,
    editarCliente,
    delCliente,
    setSearchResultsClientes,
    fetchClientes,
    // OPERADORES
    operadores,
    crearOperador,
    editarOperador,
    delOperador,
    login,
    commit,
    logs,
    // CUENTAS
    initialCuenta,
    setCuentas,
    cuentas,
    cuenta,
    selectCuenta,
    setIdx,
    idx,
    setCuenta,
    createCuenta,
    editarCuenta,
    sellarCuenta,
    // CAJAS
    cajas,
    createCaja,
    delCaja,
    // OTROS MEDIOS
    otrosMedios,
    createMedio,
    delMedio,
  };
  return <AppContext.Provider value={data}>{children}</AppContext.Provider>;
}
