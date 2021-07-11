const SettingsContext = createContext();

function SettingsProvider({ children }) {
  const { settings, changeNotaNegocioSettings, changeNotaClienteSettings } =
    useTickets();

  const data = {
    settings,
    changeNotaNegocioSettings,
    changeNotaClienteSettings,
  };

  return (
    <SettingsContext.Provider value={data}>{children}</SettingsContext.Provider>
  );
}
