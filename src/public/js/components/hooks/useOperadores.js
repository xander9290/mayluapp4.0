function useOperadores() {
  const [operadores, setOperadores] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchOperadores();
    getLogs()
      .then((data) => {
        setLogs(data);
      })
      .catch((err) => console.log(err));
  }, []);

  const fetchOperadores = () => {
    getOperadores()
      .then((data) => {
        setOperadores(data);
      })
      .catch((err) => console.log(err));
  };

  const crearOperador = (newOperador) => {
    createOperador(newOperador)
      .then((data) => {
        setOperadores([data, ...operadores]);
      })
      .catch((err) => console.log(err));
  };

  const editarOperador = (id, newOperador) => {
    editOperadores(id, newOperador)
      .then((data) => {
        const idx = operadores.findIndex((operador) => operador.id === id);
        let list = operadores;
        list[idx] = data;
        setOperadores([...list]);
      })
      .catch((err) => console.log(err));
  };

  const delOperador = (id) => {
    if (!window.confirm("Confirmar Acción")) return;
    deleteOperadores(id)
      .then((data) => {
        if (data) {
          const changedValues = operadores.filter(
            (operador) => operador.id !== id
          );
          setOperadores(changedValues);
        }
      })
      .catch((err) => console.log(err));
  };

  const login = (operadorData, cb) => {
    loginOperador(operadorData)
      .then((data) => {
        cb(data);
      })
      .catch((err) => console.log(err));
  };

  const commit = (commit, operador) => {
    const newLog = {
      createdAt: fechaISO(),
      fecha: fechaActual(Date.now()),
      operador,
      commit,
    };
    log(newLog)
      .then((data) => {
        setLogs([data, ...logs]);
      })
      .catch((err) => console.log(err));
  };

  return {
    operadores,
    crearOperador,
    editarOperador,
    delOperador,
    login,
    commit,
    logs,
  };
}

const log = async (newLog) => {
  const res = await fetch("/logs", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(newLog),
  });
  if (!res.ok) {
    const { url, status, statusText } = res;
    throw Error(`${status} ${statusText} ${url}`);
  }
  const data = await res.json();

  return data;
};

const getLogs = async () => {
  const res = await fetch("/logs");
  if (!res.ok) {
    const { url, status, statusText } = res;
    throw Error(`${status} ${statusText} ${url}`);
  }
  const data = await res.json();
  return data;
};

const loginOperador = async (operadorData) => {
  const res = await fetch("/operadores/login", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(operadorData),
  });
  if (!res.ok) {
    const { url, status, statusText } = res;
    throw Error(`${status} ${statusText} ${url}`);
  }
  const data = await res.json();

  return data;
};

const deleteOperadores = async (id) => {
  const res = await fetch("/operadores/" + id, {
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

const editOperadores = async (id, newOperador) => {
  const res = await fetch("/operadores/" + id, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(newOperador),
  });
  if (!res.ok) {
    const { url, status, statusText } = res;
    throw Error(`${status} ${statusText} ${url}`);
  }
  const data = await res.json();

  return data;
};

const createOperador = async (newOperador) => {
  const res = await fetch("/operadores", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(newOperador),
  });
  if (!res.ok) {
    const { url, status, statusText } = res;
    throw Error(`${status} ${statusText} ${url}`);
  }
  const data = await res.json();

  return data;
};

const getOperadores = async () => {
  const res = await fetch("/operadores");
  if (!res.ok) {
    const { url, status, statusText } = res;
    throw Error(`${status} ${statusText} ${url}`);
  }
  const data = await res.json();
  return data;
};
