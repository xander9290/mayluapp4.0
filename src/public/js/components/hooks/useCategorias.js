const initialCategoria = {
  name: "",
  fondo: "#FFFFFF",
  createdAt: null,
  createdBy: null,
  lastEdit: null,
};
function useCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [categoria, setCategoria] = useState(initialCategoria);

  useEffect(() => {
    getCategorias()
      .then((data) => {
        setCategorias(data);
      })
      .catch((err) => console.log(err));
  }, []);

  const createCategoria = (newCat) => {
    newCategoria(newCat)
      .then((data) => {
        setCategorias([data.doc, ...categorias]);
      })
      .catch((err) => console.log(err));
  };

  const editarCategoria = (id, newCate) => {
    editCategoria(id, newCate)
      .then((data) => {
        const idx = categorias.findIndex((categoria) => categoria.id === id);
        let list = categorias;
        list[idx] = data;
        setCategorias([...list]);
      })
      .catch((err) => console.log(err));
  };

  const delCategoria = (id) => {
    if (!window.confirm("Confirmar Acción")) return;
    deleteCategoria(id)
      .then((data) => {
        if (data) {
          const changedValues = categorias.filter(
            (categoria) => categoria.id !== id
          );
          setCategorias(changedValues);
        }
      })
      .catch((err) => console.log(err));
  };

  const selectCategoria = (id) => {
    const cat = categorias.find((categoria) => categoria.id === id);
    if (cat) {
      setCategoria(cat);
    }
  };

  return {
    initialCategoria,
    categorias,
    categoria,
    setCategoria,
    createCategoria,
    editarCategoria,
    delCategoria,
    selectCategoria,
  };
}

const deleteCategoria = async (id) => {
  const res = await fetch("/categorias/" + id, {
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

const editCategoria = async (id, newCat) => {
  const res = await fetch("/categorias/" + id, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(newCat),
  });
  if (!res.ok) {
    const { url, status, statusText } = res;
    throw Error(`${status} ${statusText} ${url}`);
  }
  const data = await res.json();

  return data;
};

const newCategoria = async (newCat) => {
  const res = await fetch("/categorias", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(newCat),
  });
  if (!res.ok) {
    const { url, status, statusText } = res;
    throw Error(`${status} ${statusText} ${url}`);
  }
  const data = await res.json();

  return data;
};

const getCategorias = async () => {
  const res = await fetch("/categorias");
  if (!res.ok) {
    const { url, status, statusText } = res;
    throw Error(`${status} ${statusText} ${url}`);
  }
  const data = await res.json();
  return data;
};
