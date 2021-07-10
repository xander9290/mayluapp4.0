const initialSettings = {
  notaNegocio: {
    areasVisibles: {
      area1: true,
      area2: true,
      area3: true,
      area4: true,
    },
    totalInfo: {
      subtotal: true,
      descuento: true,
      total: true,
      efectivo: true,
      tarjeta: true,
      cambio: true,
    },
  },
  notaCliente: {
    logoTitle: "",
    logoSubtitle: "",
    infoAddress1: "",
    infoAddress2: "",
    infoAddress3: "",
    infoTel: "",
    infoWapp: "",
    footerMsg1: "",
    footerMsg2: "",
    footerMsg3: "",
  },
  resumenVenta: {
    resumenServicios: true,
    ventaTotal: true,
    movimientosCaja: true,
    pagosTarjeta: true,
    otrosMedios: true,
    totalEfectivo: true,
    descuentoCuentas: true,
    canceladoCuentas: true,
    canceladoProductos: true,
  },
};
function useTickets() {
  const [settings, setSettings] = useState(initialSettings);

  useEffect(() => {
    cargarSettings();
  }, []);

  const cargarSettings = () => {
    if (localStorage.getItem("settings")) {
      const parseSettings = JSON.parse(localStorage.getItem("settings"));
      setSettings({ ...parseSettings });
    } else {
      localStorage.setItem("settings", JSON.stringify(initialSettings));
    }
  };

  const changeSettings = (newSettings) => {
    const parseSettings = JSON.parse(localStorage.getItem("settings"));
    const newData = {
      ...parseSettings,
      ...newSettings,
    };
    localStorage.setItem("settings", JSON.stringify(newData));
    setSettings({ ...newData });
  };

  return { settings, changeSettings };
}
