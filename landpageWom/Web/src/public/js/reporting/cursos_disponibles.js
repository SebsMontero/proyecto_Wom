/* Autocompletar */

// Ha sido escalado?

document.addEventListener("DOMContentLoaded", async () => {
    const selectEscalamiento = document.getElementById("txtescalamiento");
    const causalEscalamientoSi = document.getElementById("causalEscalamientoSi");
    const causalEscalamientoNo = document.getElementById("causalEscalamientoNo");

    selectEscalamiento.addEventListener("change", function() {
        console.log('Hola Mundo');
        const txttipo_causal_antiguo = document.getElementById("txttipo_causal_antiguo");
        const txttipo_causal = document.getElementById("txttipo_causal");
    
        if (this.value === "SI") {
            causalEscalamientoSi.style.display = "block";
            causalEscalamientoNo.style.display = "none";
            txttipo_causal_antiguo.setAttribute('required', 'required');
            txttipo_causal.removeAttribute('required');
        } else if (this.value === "NO") {
            causalEscalamientoSi.style.display = "none";
            causalEscalamientoNo.style.display = "block";
            txttipo_causal_antiguo.removeAttribute('required');
            txttipo_causal.setAttribute('required', 'required');
        } else {
            causalEscalamientoSi.style.display = "none";
            causalEscalamientoNo.style.display = "none";
            txttipo_causal_antiguo.removeAttribute('required');
            txttipo_causal.removeAttribute('required');
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

        if (this.value === "venta") {
            transaccionSelect.innerHTML = `
                <option value="">Elige una opción</option>
                <option value="venta">Venta</option>
                <option value="portabilidad">Portabilidad</option>
            `;
        } else if (this.value === "posventa") {
            transaccionSelect.innerHTML = `
                <option value="">Elige una opción</option>
                <option value="cambiopropiedad">Cambio de Propiedad</option>
                <option value="cambiopagador">Cambio de Pagador</option>
                <option value="cambiosimcard">Cambio de Simcard</option>
                <option value="terminacion">Terminación</option>
                <option value="reconexion">Reconexión</option>
                <option value="cambionumeroposventa">Cambio de Numero</option>
            `;
        } else if (this.value === "cambionumero") {
            transaccionSelect.innerHTML = `
                <option value="">Elige una opción</option>
                <option value="cambioplanupgrade">Cambio de Plan Upgrade</option>
                <option value="cambioplandowngrade">Cambio de Plan Downgrade</option>
            `;
        }
    });
});