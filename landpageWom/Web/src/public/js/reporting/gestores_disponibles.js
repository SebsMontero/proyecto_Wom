/* Autocompletar */
async function cargarGesrotes(id) {

    let resultado = await postData("/consultaGestores");
    // console.log(resultado);

    de = '#txtgestor_' + id;
    op = de + ' option';
    // console.log(de)

    const select = document.querySelectorAll(op);

    if (resultado != undefined) {
        resultado.forEach((element, index) => {
            if (index < select.length) {
                select[index].value = element.USU_CUSUARIO;
                select[index].textContent = element.USU_CUSUARIO;
            } else {
                const option = document.createElement('option');
                option.value = element.USU_CUSUARIO;
                option.textContent = element.USU_CUSUARIO;
                document.querySelector(de).appendChild(option);
            }
        });
    } else {
        console.log('Sin data')
    }
};