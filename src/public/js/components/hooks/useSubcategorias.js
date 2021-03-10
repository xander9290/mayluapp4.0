function useSubcategorias() {
  const [subcategorias, setSubcategorias] = useState([]);

  useEffect(() => {
    getSubategorias()
      .then((data) => {
        setSubcategorias(data);
      })
      .catch((err) => console.log(err));
  }, []);

  const createSubcategoria = (newSubcat) => {
    newSubcategoria(newSubcat)
      .then((data) => {
        setSubcategorias([data, ...subcategorias]);
      })
      .catch((err) => console.log(err));
  };

  const editarSubcategoria = (id, newSubcat) => {
    editSubcategoria(id, newSubcat)
      .then((data) => {
        const idx = subcategorias.findIndex(
          (subcategoria) => subcategoria.id === id
        );
        let list = subcategorias;
        list[idx] = data;
        setSubcategorias([...list]);
      })
      .catch((err) => console.log(err));
  };

  const delSubcategora = (id) => {
    if (!window.confirm("Confirmar Acción")) return;
    deleteSubcategoria(id)
      .then((data) => {
        if (data) {
          const changedValues = subcategorias.filter(
            (subcategoria) => subcategoria.id !== id
          );
          setSubcategorias(changedValues);
        }
      })
      .catch((err) => console.log(err));
  };

  return {
    subcategorias,
    createSubcategoria,
    editarSubcategoria,
    delSubcategora,
  };
}

const deleteSubcategoria = async (id) => {
  const res = await fetch("/subcategorias/" + id, {
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

const editSubcategoria = async (id, newSubcat) => {
  const res = await fetch("/subcategorias/" + id, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(newSubcat),
  });
  if (!res.ok) {
    const { url, status, statusText } = res;
    throw Error(`${status} ${statusText} ${url}`);
  }
  const data = await res.json();

  return data;
};

const newSubcategoria = async (newSubcat) => {
  const res = await fetch("/subcategorias", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(newSubcat),
  });
  if (!res.ok) {
    const { url, status, statusText } = res;
    throw Error(`${status} ${statusText} ${url}`);
  }
  const data = await res.json();

  return data;
};

const getSubategorias = async () => {
  const res = await fetch("/subcategorias");
  if (!res.ok) {
    const { url, status, statusText } = res;
    throw Error(`${status} ${statusText} ${url}`);
  }
  const data = await res.json();
  return data;
};
