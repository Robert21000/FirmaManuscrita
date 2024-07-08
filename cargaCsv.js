$(document).ready(function(){


    //***********************CONFIGURACIÓN DE LA TABLA******************************* */
    var tabla =  $('#tablaFirmas').DataTable(
        {
            language: {
              "decimal":        "",
              "emptyTable":     "No hay datos disponibles",
              "info":           "Mostrando _START_ a _END_ de _TOTAL_ registros",
              "infoEmpty":      "Mostrando 0 a 0 de 0 registros",
              "infoFiltered":   "(filtrado de _MAX_ total registros)",
              "infoPostFix":    "",
              "thousands":      ",",
              "lengthMenu":     "Mostrar _MENU_ registros",
              "loadingRecords": "Cargando...",
              "processing":     "Procesando...",
              "search":         "Buscar...",
              "zeroRecords":    "No se encontraron registros coincidentes",
              "paginate": {
                "next":       "Siguiente",
                "previous":   "Anterior",
                "pagingType": "simple_numbers",
              },
              
              "aria": {
                "sortAscending":  ": activar para ordenar la columna ascendente",
                "sortDescending": ": activar para ordenar la columna descendente"
              }
            },
            "lengthMenu": [
                [3, 5, 10],
                ['3', '5', '10']
            ], // Opciones de longitud de página personalizadas
            "pageLength": 3 // Número predeterminado de filas por página
          },
          
    );



    $('#btnSubirCsv').click(function() {

        var archivo = $('#fileInput').prop('files')[0];
        if (!archivo) {
            alert('Por favor, seleccione un archivo CSV.');
            return;
        }
        var lector = new FileReader();
        var progressBar = $('<div class="progress" style="margin-top: 20px;"><div class="progress-bar progress-bar-striped bg-success" role="progressbar" style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0%</div></div>');
        $('#progresfirma').append(progressBar);
        lector.onload = function(e) {
            var contenido = e.target.result;
            var lineas = contenido.split(/\r\n|\n/);
        
            lineas.shift();
            
            listaRespuestas=[];
            lineas.forEach(function(linea) {
                var campos = linea.split(',');
                var firmaVerdadera = campos[0];
                var firmaVerificar = campos[1];
                var settings = {
                    "url": "http://18.118.135.233:3000/api/firmaCsv",
                    "method": "POST",
                    "timeout": 10000,
                    "headers": {
                        "Content-Type": "application/json"
                    },
                    "data": JSON.stringify({
                        "document": firmaVerdadera,
                        "queryDocument": firmaVerificar
                    }),
                    xhr: function() {
                        var xhr = new window.XMLHttpRequest();
                        // Establece el listener de progreso
                        xhr.upload.addEventListener("progress", function(evt) {
                            if (evt.lengthComputable) {
                                var percentComplete = evt.loaded / evt.total;
                                // Actualizamos la barra de progreso
                                progressBar.find('.progress-bar').css('width', percentComplete * 100 + '%').attr('aria-valuenow', percentComplete * 100).text('progreso..');
                            }
                        }, false);
                        return xhr;
                    }
                };
                $.ajax(settings).done(function (response) {
                    if(response.message!=undefined){
                        $("#filaReporte").append('<p style="color:red">'+response.message+'</p>');
                    }
                    listaRespuestas.push(response.similitud)
                    if (listaRespuestas.length === lineas.length) {
                       
                        for(let i=0;i<listaRespuestas.length;i++){ 
                            
                            // Agrega la fila a la tabla
                            tabla.row.add(['<img src="' + firmaVerdadera+ '" alt="Imagen" style="width:150px;height:150px" >','<img src="' + firmaVerificar+ '" alt="Imagen" style="width:150px;height:150px" >',listaRespuestas[i]]).draw(false);
                        }
                        $("#filaReporte").attr("style","display:block;background-color:#d7dadb");
                    }
                });

            });
        };
        lector.readAsText(archivo);
    });

    // Función para descargar una imagen desde una URL y convertirla a Base64
  


})