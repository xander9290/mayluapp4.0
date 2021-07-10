const SettingsContext = createContext();

function SettingsProvider({ children }) {
  const { settings, changeSettings } = useTickets();

  const data = {
    settings,
    changeSettings,
  };

  return (
    <SettingsContext.Provider value={data}>{children}</SettingsContext.Provider>
  );
}
