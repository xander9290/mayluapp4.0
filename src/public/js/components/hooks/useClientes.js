function useClientes() {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = () => {
    getClientes()
      .then((data) => {
        setClientes(data);
      })
      .catch((err) => console.log(err));
  };

  const crearCliente = (newCliente, cb) => {
    createCliente(newCliente)
      .then((data) => {
        setClientes([data, ...clientes]);
        cb(data);
      })
      .catch((err) => console.log(err));
  };

  const editarCliente = (id, newCliente) => {
    editCliente(id, newCliente)
      .then((data) => {
        const idx = clientes.findIndex((cliente) => cliente.id === id);
        let list = clientes;
        list[idx] = data;
        setClientes([...list]);
      })
      .catch((err) => console.log(err));
  };

  const delCliente = (id) => {
    if (!window.confirm("Confirmar Acción")) return;
    deleteCliente(id)
      .then((data) => {
        if (data) {
          const changedValues = clientes.filter((cliente) => cliente.id !== id);
          setClientes(changedValues);
        }
      })
      .catch((err) => console.log(err));
  };

  const setSearchResultsClientes = (results) => {
    setClientes(results);
  };

  return {
    clientes,
    crearCliente,
    editarCliente,
    delCliente,
    setSearchResultsClientes,
    fetchClientes,
  };
}

const deleteCliente = async (id) => {
  const res = await fetch("/clientes/" + id, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
    },
  });
  if (!res.ok) {
    const { url, status, statusText } = res;
    throw Error(`${status} ${statusText} ${url}`);
  }
  const data = await res.json();

  return data;
};

const editCliente = async (id, newCliente) => {
  const res = await fetch("/clientes/" + id, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(newCliente),
  });
  if (!res.ok) {
    const { url, status, statusText } = res;
    throw Error(`${status} ${statusText} ${url}`);
  }
  const data = await res.json();

  return data;
};

const createCliente = async (newCliente) => {
  const res = await fetch("/clientes", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(newCliente),
  });
  if (!res.ok) {
    const { url, status, statusText } = res;
    throw Error(`${status} ${statusText} ${url}`);
  }
  const data = await res.json();

  return data;
};

const getClientes = async () => {
  const res = await fetch("/clientes");
  if (!res.ok) {
    const { url, status, statusText } = res;
    throw Error(`${status} ${statusText} ${url}`);
  }
  const data = await res.json();
  return data;
};
