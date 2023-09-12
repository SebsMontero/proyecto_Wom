/* Autocompletar */

// Ha sido escalado?

document.addEventListener("DOMContentLoaded", async () => {
    const selectEscalamiento = document.getElementById("txtescalamiento");

    selectEscalamiento.addEventListener("change", function() {
        const causalSelect = document.getElementById("txtipos_causal");
    
        if (this.value === "SI") {
            causalSelect.innerHTML = `
                <option value="">Elige una opción</option>
                <option value="Caso no ha sido gestionado.">Caso no ha sido gestionado.</option>
                <option value="Llamar Nuevamente.">Llamar Nuevamente.</option>
                <option value="Confirmar Numero de Contacto.">Confirmar Numero de Contacto.</option>
                <option value="Continua la Restricción en Evidente, TT Aprobado.">Continua la Restricción en Evidente, TT Aprobado.</option>
                <option value="Continua la Restricción en Laft, TT Aprobado.">Continua la Restricción en Laft,TT Aprobado.</option>
                <option value="Continua la Restricción por Cupo, TT Aprobado.">Continua la Restricción por Cupo, TT Aprobado.</option>
            `;
        } else if (this.value === "NO") {
            causalSelect.innerHTML = `
                <option value="">Elige una opción</option>
                <option value="Evidente no aprobado">Evidente no aprobado</option>
                <option value="Cambio simCard">Cambio simCard</option>
                <option value="Reposición de simCard desde call center">Reposición de simCard desde call center</option>
                <option value="Corrección de datos cedula o nombres">Corrección de datos cedula o nombres</option>
                <option value="Laft">Laft</option>
            `;
        }
    });

    const selectTipoTransaccion = document.getElementById("txttipo_transaccion");

    selectTipoTransaccion.addEventListener("change", function() {
        const opcionesTransaccion = document.getElementById("opcionesTransaccion");
        const transaccionSelect = opcionesTransaccion.querySelector("select");

        transaccionSelect.innerHTML = "";

        if (this.value === "Venta") {
            transaccionSelect.innerHTML = `
                <option value="">Elige una opción</option>
                <option value="Venta">Venta</option>
                <option value="Portabilidad">Portabilidad</option>
            `;
        } else if (this.value === "Posventa") {
            transaccionSelect.innerHTML = `
                <option value="">Elige una opción</option>
                <option value="Cambio de Propiedad">Cambio de Propiedad</option>
                <option value="Cambio de Pagador">Cambio de Pagador</option>
                <option value="Cambio de Simcard">Cambio de Simcard</option>
                <option value="Terminación">Terminación</option>
                <option value="Reconexión">Reconexión</option>
                <option value="Cambio de Número">Cambio de Número</option>
            `;
        } else if (this.value === "Cambio de numero") {
            transaccionSelect.innerHTML = `
                <option value="">Elige una opción</option>
                <option value="Upgrade">Cambio de Plan Upgrade</option>
                <option value="Downgrade">Cambio de Plan Downgrade</option>
            `;
        }
    });

    
    function validarCasoTT() {
        const casottInput = document.getElementById("txtcasott");
        const casottValue = casottInput.value;
        const casottWarning = document.getElementById("casottWarning");
        const regex = /^(20\d{2})(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])_000(\d{8})$/;

        if (!regex.test(casottValue)) {
            casottInput.classList.add("is-invalid"); // Cambiar estilo del campo
            casottWarning.textContent = "El valor de Caso TT no cumple con las características requeridas (AAAAMMDD_000XXXXXXXX).";
            
            return false;
        } else {
            casottInput.classList.remove("is-invalid"); // Restaurar estilo del campo si es válido
            casottWarning.textContent = "";
            return true;
        }
    }

    document.getElementById("txtcasott").addEventListener("blur", validarCasoTT);
    document.getElementById("formulario_escalamiento").addEventListener("submit", function(event) {
        if (!validarCasoTT()) {
            event.preventDefault(); // Evita que el formulario se envíe si la validación no se cumple
        }
    });

    let casos = await postData("/consultacasos");
    const casottInput = document.getElementById("txtcasott");
    const sugerenciasList = document.getElementById("sugerencias");

    casottInput.addEventListener("input", () => {
        const inputText = casottInput.value;
        const sugerencias = casos.filter(caso => caso.FOR_CCASO_TT.includes(inputText));
        sugerenciasList.innerHTML = "";

        if (inputText.trim() !== "") { 
            sugerenciasList.style.display = sugerencias.length > 0 ? "block" : "none";

            // Crea y agrega nuevas sugerencias
            sugerencias.forEach(sugerencia => {
                const listItem = document.createElement("li");
                listItem.textContent = sugerencia.FOR_CCASO_TT;
                listItem.addEventListener("click", () => {
                    casottInput.value = sugerencia.FOR_CCASO_TT;
                    sugerenciasList.style.display = "none"; 
                    validarCasoTT();
                    llenarForm(sugerencia)
                });
                sugerenciasList.appendChild(listItem);
            });
        } else {
            sugerenciasList.style.display = "none"; // Oculta las sugerencias si no hay texto
            limpiarForm();
        }
    });

    function llenarForm(sugerencia){
        document.getElementById("txtescalamiento").value = "SI";
        document.getElementById("txtescalamiento").disabled = true;
        const causalSelect = document.getElementById("txtipos_causal");
        causalSelect.innerHTML = `
            <option value="">Elige una opción</option>
            <option value="Caso no ha sido gestionado.">Caso no ha sido gestionado.</option>
            <option value="Llamar Nuevamente.">Llamar Nuevamente.</option>
            <option value="Confirmar Numero de Contacto.">Confirmar Numero de Contacto.</option>
            <option value="Continua la Restricción en Evidente, TT Aprobado.">Continua la Restricción en Evidente, TT Aprobado.</option>
            <option value="Continua la Restricción en Laft, TT Aprobado.">Continua la Restricción en Laft,TT Aprobado.</option>
            <option value="Continua la Restricción por Cupo, TT Aprobado.">Continua la Restricción por Cupo, TT Aprobado.</option>
        `;

        document.getElementById("txtsegmento").value = sugerencia.FOR_CSEGMENTO;
        document.getElementById("txtsegmento").disabled = true;
        document.getElementById("txtregional").value = sugerencia.FOR_CREGIONAL;
        document.getElementById("txtregional").disabled = true;

        document.getElementById("txttipo_transaccion").value = sugerencia.FOR_CTIPO_TRANSACCION;
        document.getElementById("txttipo_transaccion").disabled = true;

        var tiposVenta = document.getElementById("txtpos_venta");
        var option = document.createElement("option");
        option.text = sugerencia.FOR_CTRANSACCION;
        option.value = sugerencia.FOR_CTRANSACCION;
        tiposVenta.appendChild(option);
        tiposVenta.value = sugerencia.FOR_CTRANSACCION;
        tiposVenta.disabled = true;
        
        
        document.getElementById("txtnombres").value = sugerencia.FOR_CNOMBRE_CREADOR;
        document.getElementById("txttelefono").value = sugerencia.FOR_CNUMERO_CREADOR;
        document.getElementById("txtcodigo").value = sugerencia.FOR_CCODIGO_CREADOR;
        document.getElementById("txtcanal_ventas").value = sugerencia.FOR_CCANAL_VENTAS_CREADOR;        
    }

    function limpiarForm(){
        document.getElementById("txtescalamiento").value = "";
        document.getElementById("txtescalamiento").disabled = false;
        document.getElementById("txtipos_causal").value = "";

        document.getElementById("txtsegmento").value = "";
        document.getElementById("txtsegmento").disabled = false;
        document.getElementById("txtregional").value = "";
        document.getElementById("txtregional").disabled = false;

        document.getElementById("txttipo_transaccion").value = "";
        document.getElementById("txttipo_transaccion").disabled = false;
        document.getElementById("txtpos_venta").remove(0);
        document.getElementById("txtpos_venta").disabled = false;
        
        document.getElementById("txtnombres").value = "";
        document.getElementById("txttelefono").value = "";
        document.getElementById("txtcodigo").value = "";
        document.getElementById("txtcanal_ventas").value = "";
    }
});