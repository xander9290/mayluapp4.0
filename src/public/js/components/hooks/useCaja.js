function useCaja() {
  const [cajas, setCajas] = useState([]);

  useEffect(() => {
    getCajas()
      .then((data) => {
        setCajas(data.reverse());
      })
      .catch((err) => console.log(err));
  }, []);

  const createCaja = (newCj, cb) => {
    newCaja(newCj)
      .then((data) => {
        setCajas([data, ...cajas]);
        cb(data);
      })
      .catch((err) => console.log(err));
  };

  const delCaja = (id) => {
    if (!window.confirm("Confirmar Acción")) return;
    deleteCaja(id)
      .then((data) => {
        if (data) {
          const changedValues = cajas.filter((caja) => caja.id !== id);
          setCajas(changedValues);
        }
      })
      .catch((err) => console.log(err));
  };

  return { cajas, createCaja, delCaja };
}

const deleteCaja = async (id) => {
  const res = await fetch("/cajas/" + id, {
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

const newCaja = async (newCaja) => {
  const res = await fetch("/cajas", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(newCaja),
  });
  if (!res.ok) {
    const { url, status, statusText } = res;
    throw Error(`${status} ${statusText} ${url}`);
  }
  const data = await res.json();

  return data;
};

const getCajas = async () => {
  const res = await fetch("/cajas");
  if (!res.ok) {
    const { url, status, statusText } = res;
    throw Error(`${status} ${statusText} ${url}`);
  }
  const data = await res.json();
  return data;
};
