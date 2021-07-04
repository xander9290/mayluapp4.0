const {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
  Fragment,
  memo,
} = React;

const { Modal } = ReactBootstrap;

function App() {
  return (
    <AppProvider>
      <SettingsProvider>
        {operadorSession ? <Interfaz /> : <FormLogin />}
      </SettingsProvider>
    </AppProvider>
  );
}
