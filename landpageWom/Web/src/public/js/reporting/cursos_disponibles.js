/* Autocompletar */
document.addEventListener("DOMContentLoaded", async () => {

    let resultado1 = await postData("/consultacursos");
    // console.log(resultado1);

    const select1 = document.getElementById("txtcursos_disponibles");

    if (resultado1 != undefined) {
        resultado1.forEach((element) => {
            const option = document.createElement('option');
            option.value = element.CUR_CNOMBRE_CURSO;
            option.textContent = element.CUR_CNOMBRE_CURSO;
            select1.appendChild(option);
        });
    } else {
        // console.log('Sin data')
    }
});