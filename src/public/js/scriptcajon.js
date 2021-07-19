const puerto = "8080",
    nombreImpresora = "maylu_printer";

const abrirCajon = async () => {
    const respuesta = await fetch(`http://localhost:${puerto}/?impresora=${nombreImpresora}`);
    const respuestaDecodificada = await respuesta.json();
    if (respuesta.status === 200) {
        console.log("Cajón abierto");
    } else {
        console.log("Error abriendo: " + respuestaDecodificada);
    }
};

