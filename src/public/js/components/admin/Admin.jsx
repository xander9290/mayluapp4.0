function Admin() {
  return (
    <div
      style={{ height: "628px", overflow: "hidden" }}
      className="d-flex aling-items-start"
    >
      <nav
        className="nav flex-column nav-pills px-2 py-2 bg-dark"
        role="tablist"
        aria-orientation="vertical"
      >
        <button
          type="button"
          className="nav-link border border-light text-light text-uppercase h6"
          data-bs-toggle="pill"
          data-bs-target="#categorias"
          aria-selected="false"
        >
          categorías
        </button>
        <button
          type="button"
          className="nav-link border border-light text-light text-uppercase h6"
          data-bs-toggle="pill"
          data-bs-target="#productos"
          aria-selected="false"
        >
          productos
        </button>
        <button
          type="button"
          className="nav-link border border-light text-light text-uppercase h6"
          data-bs-toggle="pill"
          data-bs-target="#clientes"
          aria-selected="false"
        >
          clientes
        </button>
        <button
          type="button"
          className="nav-link border border-light text-light text-uppercase h6"
          data-bs-toggle="pill"
          data-bs-target="#operadores"
          aria-selected="false"
        >
          operadores
        </button>
        <button
          type="button"
          className="nav-link border border-light text-light text-uppercase h6"
          data-bs-toggle="pill"
          data-bs-target="#general"
          aria-selected="false"
        >
          general
        </button>
      </nav>
      <div
        style={{ width: "100%", backgroundColor: "#4b4b4b" }}
        className="tab-content text-light logotipo"
      >
        <div className="tab-pane p-1" id="categorias">
          <div className="row">
            <div className="col-md-4">
              <Categorias />
            </div>
            <Subcategorias />
          </div>
        </div>
        <div className="tab-pane p-1" id="productos">
          <div className="row">
            <Productos />
          </div>
        </div>
        <div className="tab-pane p-1" id="clientes">
          <div className="row">
            <Clientes />
          </div>
        </div>
        <div className="tab-pane p-1" id="operadores">
          <div className="row">
            <div className="col-md-5">
              <Operadores />
            </div>
            <div className="col-md-7">
              <Logs />
            </div>
          </div>
        </div>
        <div className="tab-pane p-1" id="general">
          <General />
        </div>
      </div>
    </div>
  );
}
