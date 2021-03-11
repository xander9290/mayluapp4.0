function InfoModal(props) {
  const { cuenta } = useContext(AppContext);

  const handleShow = () => {};
  const handleExited = () => {};

  return (
    <Modal
      onHide={props.onHide}
      show={props.show}
      keyboard={false}
      onShow={handleShow}
      onExited={handleExited}
      size="md"
    >
      <Modal.Header className="d-flex justify-content-between align-items-center">
        <h5>Información del cliente</h5>
        <button onClick={props.onHide} type="button" className="btn btn-danger">
          Cerrar
        </button>
      </Modal.Header>
      <Modal.Body className="p-2">
        <ul className="list-group text-uppercase">
          <li className="list-group-item h5">
            <span className="fw-bold">Nombre: </span>
            <span>{cuenta.cliente.name}</span>
          </li>
          <li className="list-group-item h5">
            <span className="fw-bold">Teléfono: </span>
            <span>{cuenta.cliente.tel}</span>
          </li>
          <li className="list-group-item h5">
            <span className="fw-bold">Calle: </span>
            <span>{cuenta.cliente.address.calle}</span>
          </li>
          <li className="list-group-item h5">
            <span className="fw-bold">Cruces: </span>
            <span>{cuenta.cliente.address.cruces}</span>
          </li>
          <li className="list-group-item h5">
            <span className="fw-bold">Colonia: </span>
            <span>{cuenta.cliente.address.colonia}</span>
          </li>
          <li className="list-group-item h5">
            <span className="fw-bold">Obs: </span>
            <span>{cuenta.cliente.address.obs}</span>
          </li>
        </ul>
      </Modal.Body>
    </Modal>
  );
}
