const $estado = document.querySelector("#estado"),
    $listaDeImpresoras = document.querySelector("#listaDeImpresoras"),
    $btnLimpiarLog = document.querySelector("#btnLimpiarLog"),
    $btnImprimir = document.querySelector("#btnImprimir");


const abrirCajon=async () => {
    let nombreImpresora = "maylu_printer";
    if (!nombreImpresora) return loguear("Selecciona una impresora");
    const conector = new ConectorPlugin()
    conector
        .abrirCajon() 
    const respuestaAlImprimir = await conector.imprimirEn(nombreImpresora);
    if (respuestaAlImprimir === true) {
        console.log("Impreso correctamente");
    } else {
        console.log("Error. La respuesta es: " + respuestaAlImprimir);
    }
};

