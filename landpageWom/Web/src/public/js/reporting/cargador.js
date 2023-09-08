function handleFileUpload(input) {
    const uploadStatus = document.getElementById('uploadStatus');
    const fileName = document.getElementById('fileName');
    const updateTimeFooter = document.getElementById('updateTimeFooter');
  
    if (input.files.length > 0) {
      const uploadedFileName = input.files[0].name;
      uploadStatus.textContent = 'Archivo cargado exitosamente:';
      fileName.textContent = uploadedFileName;
  
      //Actualiza fecha y hora
      const lastUpdate = new Date();
      const formattedDate = lastUpdate.toLocaleString(); 
      updateTimeFooter.textContent = 'Última actualización: ' + formattedDate;
  
    } else {
      uploadStatus.textContent = '';
      fileName.textContent = '';
    }
  }
  