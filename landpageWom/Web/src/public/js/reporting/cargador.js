"use stric";

document.getElementById("containerLoader").classList.remove("hidden");

function proceso() {
  let txtproceso = document.querySelector("#txtproceso").value;
  const tts = document.querySelectorAll(".tts");
  const bidireccional = document.querySelectorAll(".bidireccional");
  const enBlanco = document.querySelectorAll(".enBlanco");
  const exepcion = document.querySelectorAll(".exepcion");
  const exepcion1 = document.querySelectorAll(".exepcion1");
  const select = document.getElementById("txtflujo_proceso");
  const option = document.createElement("option");

  switch (txtproceso) {
    case "TTS":
      tts.forEach((element) => {
        element.classList.remove("d-none");
      });
      exepcion.forEach((element) => {
        element.classList.add("d-none");
      });

      document.querySelector("#txtusuario_infobip").value = '';
      document.querySelector("#txtseguimiento").value = ''
      document.querySelector("#txtfecha_fin_seguimiento").value = ''
      select.length = 0;
      option.value = "";
      option.text = "Elige una opción";
      select.appendChild(option);

      break;

    case "BIDIRECCIONAL":
      bidireccional.forEach((element) => {
        element.classList.remove("d-none");
      });
      exepcion1.forEach((element) => {
        element.classList.add("d-none");
      });

      document.querySelector("#txtusuario_infobip").value = ''
      document.querySelector("#txtseguimiento").value = ''
      document.querySelector("#txtfecha_fin_seguimiento").value = ''
      select.length = 0;
      option.value = "";
      option.text = "Elige una opción";
      select.appendChild(option);

      break;

    case "":
      enBlanco.forEach((element) => {
        element.classList.add("d-none");
      });

      break;
  }
}

function seguimiento() {
  let txtseguimiento = document.querySelector("#txtseguimiento").value;
  const seguimiento = document.querySelectorAll(".seguimiento");
  const enBlanco = document.querySelectorAll(".enBlanco");
  const exepcion1 = document.querySelectorAll(".exepcion1");

  switch (txtseguimiento) {
    case "Si":
      seguimiento.forEach((element) => {
        element.classList.remove("d-none");
      });
      exepcion1.forEach((element) => {
        element.classList.remove("d-none");
      });

      break;

    case "No":
      seguimiento.forEach((element) => {
        element.classList.add("d-none");
      });
      exepcion1.forEach((element) => {
        element.classList.remove("d-none");
      });

      break;

    case "":
      enBlanco.forEach((element) => {
        element.classList.add("d-none");
      });

      break;
  }
}

function alert(icon, title, mensaje) {
  Swal.fire({
    position: "center",
    icon: icon,
    title: title,
    html: mensaje,
    backdrop: true,
    allowOutsideClick: false,
  });
}

let btnRegistrarEXC = document.querySelector("#btnRegistrarEXC");
let inpFileEXC = document.querySelector("#inpFileEXC");

// -----------------------------------

btnRegistrarEXC.addEventListener("click", async () => {
  document.getElementById("containerLoader").classList.remove("hidden");
  document.getElementById("textLoader").innerHTML = `Ejecutando solicitud`;
  document.getElementById("btnRegistrarEXC").disabled = true;
  document.getElementById("btnRegistrarEXC").classList.add("hidden");

  let txtproceso = document.querySelector("#txtproceso").value;
  let txtusuario_infobip = document.querySelector("#txtusuario_infobip").value;
  let txtflujo_proceso = document.querySelector("#txtflujo_proceso").value;
  let txtseguimiento = document.querySelector("#txtseguimiento").value;
  let txtfecha_fin_seguimiento = document.querySelector("#txtfecha_fin_seguimiento").value;

  let select = document.getElementById("txtusuario_infobip");
  let opcionSeleccionada = select.options[select.selectedIndex];
  let textoSeleccionado = opcionSeleccionada.text;

  let resultado = await postData("/consultaEjecucion");
  if (resultado.length == 0) {
    if (txtproceso == 'TTS') {
      if (txtusuario_infobip == '' || txtflujo_proceso == '') {
        document.getElementById("containerLoader").classList.add("hidden");
        let mensaje = "Por favor diligencie todos los campos.";
        alert('warning', "!Campos Vacios!", mensaje);
        document.getElementById("btnRegistrarEXC").disabled = false;
        document.getElementById("btnRegistrarEXC").classList.remove("hidden");
      } else {
        let enviar = true;
        if (enviar) {
          const formData = new FormData();
          formData.append("proceso", txtproceso);
          formData.append("usuarioInfobip", textoSeleccionado);
          formData.append("flujo", txtflujo_proceso);
          formData.append("File", inpFileEXC.files[0]);
          fetch("/cargarexceltts", {
            method: "POST",
            body: formData,
          })
            .then((res) => res.json())
            .then((res) => {
              if (res.result == 1) {
                document.getElementById("containerLoader").classList.add("hidden");
                let mensaje = `Base <strong>cargada</strong> correctamente.`;
                alert('success', "!Congratulations!", mensaje);
                inpFileEXC.value = "";
                document.getElementById("btnRegistrarEXC").disabled = false;
                document.getElementById("btnRegistrarEXC").classList.remove("hidden");
                document.querySelector("#txtusuario_infobip").value = ''
              } else if (res.result == 2) {
                document.getElementById("containerLoader").classList.add("hidden");
                let mensaje = `Cargue la <strong>Base</strong> en el formato correcto.`;
                alert('warning', "!Formato Errado!", mensaje);
                inpFileEXC.value = "";
                document.getElementById("btnRegistrarEXC").disabled = false;
                document.getElementById("btnRegistrarEXC").classList.remove("hidden");
              } else if (res.result == 3) {
                document.getElementById("containerLoader").classList.add("hidden");
                let mensaje = `Seleccione la <strong>Base</strong> a cargar.`;
                alert('warning', "!Sin Adjunto!", mensaje);
                inpFileEXC.value = "";
                document.getElementById("btnRegistrarEXC").disabled = false;
                document.getElementById("btnRegistrarEXC").classList.remove("hidden");
              } else if (res.result == 4) {
                document.getElementById("containerLoader").classList.add("hidden");
                let mensaje = `La <strong>Base Cargada</strong> no es la correcta.`;
                alert('warning', "!Base Errada!", mensaje);
                inpFileEXC.value = "";
                document.getElementById("btnRegistrarEXC").disabled = false;
                document.getElementById("btnRegistrarEXC").classList.remove("hidden");
              } else if (res.result == 0) {
                document.getElementById("containerLoader").classList.add("hidden");
                let mensaje = `Algo salio mal - <strong>Validar con RPA.</strong></br><center><strong></center>`;
                alert('error', "!Ups!", mensaje);
                inpFileEXC.value = "";
                document.getElementById("btnRegistrarEXC").disabled = false;
                document.getElementById("btnRegistrarEXC").classList.remove("hidden");
                document.querySelector("#txtusuario_infobip").value = '';
              }
            });
        }
      }
    } else if (txtproceso == 'BIDIRECCIONAL') {
      if (txtusuario_infobip == '' || txtflujo_proceso == '' || txtseguimiento == '') {
        document.getElementById("containerLoader").classList.add("hidden");
        let mensaje = "Por favor diligencie todos los campos.";
        alert('warning', "!Campos Vacios!", mensaje);
        document.getElementById("btnRegistrarEXC").disabled = false;
        document.getElementById("btnRegistrarEXC").classList.remove("hidden");
      } else if (txtseguimiento == 'Si' && txtfecha_fin_seguimiento == '') {
        document.getElementById("containerLoader").classList.add("hidden");
        let mensaje = "Por favor diligencie todos los campos.";
        alert('warning', "!Campos Vacios!", mensaje)
        document.getElementById("btnRegistrarEXC").disabled = false;
        document.getElementById("btnRegistrarEXC").classList.remove("hidden");
      } else {
        let enviar = true;
        if (enviar) {
          const formData = new FormData();
          formData.append("proceso", txtproceso);
          formData.append("usuarioInfobip", textoSeleccionado);
          formData.append("flujo", txtflujo_proceso);
          formData.append("seguimiento", txtseguimiento);
          formData.append("fechaSeguimiento", txtfecha_fin_seguimiento);
          formData.append("File", inpFileEXC.files[0]);
          fetch("/cargarexcelbidireccional", {
            method: "POST",
            body: formData,
          })
            .then((res) => res.json())
            .then((res) => {
              if (res.result == 1) {
                document.getElementById("containerLoader").classList.add("hidden");
                let mensaje = `Base <strong>cargada</strong> correctamente`;
                alert('success', "!Congratulations!", mensaje);
                inpFileEXC.value = "";
                document.getElementById("btnRegistrarEXC").disabled = false;
                document.getElementById("btnRegistrarEXC").classList.remove("hidden");
                document.querySelector("#txtusuario_infobip").value = '';
                document.querySelector("#txtseguimiento").value = '';
                document.querySelector("#txtfecha_fin_seguimiento").value = '';
              } else if (res.result == 2) {
                document.getElementById("containerLoader").classList.add("hidden");
                let mensaje = `Cargue la <strong>Base</strong> en el formato correcto.`;
                alert('warning', "!Formato Errado!", mensaje);
                inpFileEXC.value = "";
                document.getElementById("btnRegistrarEXC").disabled = false;
                document.getElementById("btnRegistrarEXC").classList.remove("hidden");
              } else if (res.result == 3) {
                document.getElementById("containerLoader").classList.add("hidden");
                let mensaje = `Seleccione la <strong>Base</strong> a cargar.`;
                alert('warning', "!Sin Adjunto!", mensaje);
                inpFileEXC.value = "";
                document.getElementById("btnRegistrarEXC").disabled = false;
                document.getElementById("btnRegistrarEXC").classList.remove("hidden");
              } else if (res.result == 4) {
                document.getElementById("containerLoader").classList.add("hidden");
                let mensaje = `La <strong>Base Cargada</strong> no es la correcta.`;
                alert('warning', "!Base Errada!", mensaje);
                inpFileEXC.value = "";
                document.getElementById("btnRegistrarEXC").disabled = false;
                document.getElementById("btnRegistrarEXC").classList.remove("hidden");
              } else if (res.result == 0) {
                document.getElementById("containerLoader").classList.add("hidden");
                let mensaje = `Algo salio mal - <strong>Validar con RPA.</strong></br><center><strong></center>`;
                alert('error', "!Ups!", mensaje);
                inpFileEXC.value = "";
                document.getElementById("btnRegistrarEXC").disabled = false;
                document.getElementById("btnRegistrarEXC").classList.remove("hidden");
                document.querySelector("#txtusuario_infobip").value = '';
                document.querySelector("#txtseguimiento").value = '';
                document.querySelector("#txtfecha_fin_seguimiento").value = '';
              }
            });
        }
      }
    }
  } else {
    document.getElementById("containerLoader").classList.add("hidden");
    let mensaje = "Hay procesos en ejecución, espere que terminen los procesos actuales o valide con RPA.";
    alert('error', "!En ejecución!", mensaje);
    document.getElementById("btnRegistrarEXC").disabled = false;
    document.getElementById("btnRegistrarEXC").classList.remove("hidden");
  }
});