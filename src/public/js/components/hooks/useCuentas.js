const initialCuenta = {
  folio: 1,
  orden: 1,
  torreta: "",
  personas: 1,
  servicio: "",
  cliente: {
    name: "",
    tel: "",
    address: {
      calle: "",
      cruces: "",
      colonia: "",
      obs: "",
    },
    id: null,
  },
  estado: "abierto",
  motivoCancelado: "",
  impreso: false,
  items: [],
  importe: 0,
  dscto: 0,
  total: 0,
  efectivo: 0,
  tarjeta: 0,
  comision: [0, 0, 0] /*porcentaje-importe-total*/,
  otro_medio: [null, 0],
  cambio: 0,
  createdAt: null,
  createdBy: operadorSession,
  closedAt: null,
  time: "",
  fecha: fechaActual(Date.now()),
  id: null,
};

function useCuentas() {
  const [cuentas, setCuentas] = useState([]);
  const [cuenta, setCuenta] = useState(initialCuenta);
  const [idx, setIdx] = useState("");

  useEffect(() => {
    fetchCuentas();
  }, []);

  const selectCuenta = (id) => {
    setIdx(id);
    const cta = cuentas.find((cuenta) => cuenta.id === id);
    if (cta) {
      setCuenta(cta);
    }
  };
  const fetchCuentas = () => {
    getCuentas()
      .then((data) => {
        setCuentas(data);
      })
      .catch((err) => console.error(err));
  };

  const createCuenta = (newCta, res) => {
    newCuenta(newCta)
      .then((data) => {
        setCuentas([...cuentas, data]);
        setCuenta(data);
        res(true);
      })
      .catch((err) => console.log(err));
  };

  const editarCuenta = (id, newCta, cb) => {
    editCuenta(id, newCta)
      .then((data) => {
        const idx = cuentas.findIndex((cuenta) => cuenta.id === id);
        let list = cuentas;
        list[idx] = data;
        setCuentas([...list]);
        setCuenta(data);
        cb(true);
      })
      .catch((err) => console.log(err));
  };

  const sellarCuenta = (id, newCta) => {
    editCuenta(id, newCta)
      .then((data) => {
        const idx = cuentas.findIndex((cuenta) => cuenta.id === id);
        let list = cuentas;
        list[idx] = data;
        setCuentas([...list]);
        setCuenta(initialCuenta);
      })
      .catch((err) => console.log(err));
  };

  return {
    initialCuenta,
    cuentas,
    cuenta,
    selectCuenta,
    setIdx,
    idx,
    setCuentas,
    setCuenta,
    fetchCuentas,
    createCuenta,
    editarCuenta,
    sellarCuenta,
  };
}

const editCuenta = async (id, newCta) => {
  const res = await fetch("/cuentas/" + id, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(newCta),
  });
  if (!res.ok) {
    const { url, status, statusText } = res;
    throw Error(`${status} ${statusText} ${url}`);
  }
  const data = await res.json();

  return data;
};

const newCuenta = async (newCuenta) => {
  const res = await fetch("/cuentas", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(newCuenta),
  });
  if (!res.ok) {
    const { url, status, statusText } = res;
    throw Error(`${status} ${statusText} ${url}`);
  }
  const data = await res.json();

  return data;
};

const getCuentas = async () => {
  const res = await fetch("/cuentas/actuales/" + fechaActual(Date.now()));
  if (!res.ok) {
    const { url, status, statusText } = res;
    throw Error(`${status} ${statusText} ${url}`);
  }
  const data = await res.json();
  return data;
};
