function Interfaz() {
  useEffect(() => {
    window.addEventListener("beforeunload", function (e) {
      e.preventDefault();
      e.returnValue = "";
    });
    document.addEventListener("contextmenu", (e) => e.preventDefault());

    return () => {
      window.removeEventListener("beforeunload", function (e) {
        e.preventDefault();
        e.returnValue = "";
      });
      document.removeEventListener("contextmenu", (e) => e.preventDefault());
    };
  }, []);
  return (
    <div className="container-fluid p-1">
      <TopNav />
      <main
        style={{
          height: "628px",
          overflow: "hidden",
          backgroundColor: "#4b4b4b",
        }}
        className="tab-content"
      >
        <div className="tab-pane fade show active" id="puntoventa">
          <PuntoVenta />
        </div>
        <div className="tab-pane fade" id="admin">
          <Admin />
        </div>
      </main>
    </div>
  );
}
