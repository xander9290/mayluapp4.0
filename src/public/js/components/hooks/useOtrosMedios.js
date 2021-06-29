const initialMedio = {
  id: "",
  name: "",
  createdAt: fechaISO(),
};

function useOtrosMedios() {
  const [otrosMedios, setOtrosMedios] = useState([]);
  const [medio, setMedio] = useState(initialMedio);

  useEffect(() => {
    cargarOtrosMedios();
  }, []);

  const cargarOtrosMedios = () => {
    if (localStorage.getItem("otrosMedios")) {
      const parseOtrosMedios = JSON.parse(localStorage.getItem("otrosMedios"));
      setOtrosMedios([...parseOtrosMedios]);
    } else {
      localStorage.setItem("otrosMedios", JSON.stringify([]));
    }
  };

  const createMedio = (newMedio, res) => {
    const listMedios = JSON.parse(localStorage.getItem("otrosMedios"));
    if (verifyExiste(listMedios, newMedio.name)) {
      res("ERROR: registro duplicado");
      return;
    }
    newMedio.id = fechaISO();
    newMedio.createdAt = fechaISO();
    const setNewMedio = JSON.stringify([...listMedios, newMedio]);
    localStorage.setItem("otrosMedios", setNewMedio);
    cargarOtrosMedios();
    res("success");
  };

  const delMedio = (id) => {
    if (!confirm("Confirmar Acción")) return;
    const newMediosList = otrosMedios.filter((medio) => medio.id !== id);
    setOtrosMedios([...newMediosList]);
    localStorage.setItem("otrosMedios", JSON.stringify([...newMediosList]));
  };

  return { otrosMedios, createMedio, delMedio };
}
