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
    <AppProvider>{operadorSession ? <Interfaz /> : <FormLogin />}</AppProvider>
  );
}
