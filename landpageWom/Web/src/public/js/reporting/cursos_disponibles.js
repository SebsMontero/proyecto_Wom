/* Autocompletar */

// Ha sido escalado?

document.addEventListener("DOMContentLoaded", async () => {
    const selectEscalamiento = document.getElementById("txtescalamiento");

    selectEscalamiento.addEventListener("change", function() {
        const causalEscalamiento = document.getElementById("causalEscalamiento");
        const causalSelect = causalEscalamiento.querySelector("select");
    
        if (this.value === "SI") {
            causalSelect.innerHTML = `
                <option value="">Elige una opción</option>
                <option value="Caso no ha sido escalado.">Caso no ha sido escalado.</option>
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

    let resultado1 = await postData("/consultacursos");
    const selectCursos = document.getElementById("txtcursos_disponibles");

    if (resultado1 != undefined) {
        resultado1.forEach((element) => {
            const option = document.createElement('option');
            option.value = element.CUR_CNOMBRE_CURSO;
            option.textContent = element.CUR_CNOMBRE_CURSO;
            selectCursos.appendChild(option);
        });
    } else {
        // Sin datos
    }

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
        } else {
            casottInput.classList.remove("is-invalid"); // Restaurar estilo del campo si es válido
            casottWarning.textContent = "";
        }
    }

    document.getElementById("txtcasott").addEventListener("blur", validarCasoTT);
});