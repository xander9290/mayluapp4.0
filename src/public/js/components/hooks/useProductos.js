function useProductos() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = () => {
    getProductos()
      .then((data) => {
        setProductos(data);
      })
      .catch((err) => console.log(err));
  };

  const crearProducto = (newProd) => {
    newProducto(newProd)
      .then((data) => {
        setProductos([data, ...productos]);
      })
      .catch((err) => console.log(err));
  };

  const editarProducto = (id, newProd) => {
    editProducto(id, newProd)
      .then((data) => {
        const idx = productos.findIndex((producto) => producto.id === id);
        let list = productos;
        list[idx] = data;
        setProductos([...list]);
      })
      .catch((err) => console.log(err));
  };

  const delProducto = (id) => {
    if (!window.confirm("Confirmar Acción")) return;
    deleteProducto(id)
      .then((data) => {
        if (data) {
          const changedValues = productos.filter(
            (producto) => producto.id !== id
          );
          setProductos(changedValues);
        }
      })
      .catch((err) => console.log(err));
  };

  const setSearchResults = (results) => {
    setProductos(results);
  };

  return {
    productos,
    crearProducto,
    editarProducto,
    delProducto,
    setSearchResults,
    fetchProductos,
  };
}

const deleteProducto = async (id) => {
  const res = await fetch("/productos/" + id, {
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

const editProducto = async (id, newProd) => {
  const res = await fetch("/productos/" + id, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(newProd),
  });
  if (!res.ok) {
    const { url, status, statusText } = res;
    throw Error(`${status} ${statusText} ${url}`);
  }
  const data = await res.json();

  return data;
};

const newProducto = async (newProd) => {
  const res = await fetch("/productos", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(newProd),
  });
  if (!res.ok) {
    const { url, status, statusText } = res;
    throw Error(`${status} ${statusText} ${url}`);
  }
  const data = await res.json();

  return data;
};

const getProductos = async () => {
  const res = await fetch("/productos");
  if (!res.ok) {
    const { url, status, statusText } = res;
    throw Error(`${status} ${statusText} ${url}`);
  }
  const data = await res.json();
  return data;
};
