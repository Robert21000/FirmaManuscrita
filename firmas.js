$(document).ready(function(){

/***************************************INICIO FIRMA EXHAUSTIVA **************************************************/
    var imageList = [];
    const nombres=[]; 
    
    $("#btnComparar2").click(function(){

        var files = $('#imagen3')[0].files;
        var archivoReferencia=$('#imagen4')[0].files[0];
        if (files.length === 0 || !archivoReferencia) {
            alert("Debe subir al menos un archivo y el archivo de referencia antes de comparar.");
        } else {
        var base64Ref;
        var lector = new FileReader();
            lector.onload = function(e) {
                base64Ref= e.target.result;
            };
        lector.readAsDataURL(archivoReferencia);


        
        for(var i = 0; i < files.length; i++) {
            var reader = new FileReader();
            nombres.push(files[i].name)
            reader.onload = function(event){
                var base64 = event.target.result;
                
                imageList.push(base64);
                if(imageList.length === files.length) {

                    enviarImagenes(imageList,base64Ref);
                }
            };
            reader.readAsDataURL(files[i]);
        }
    }
    })


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

    var listaCsv=[];
    var medianaCsv=""
    var mediaCsv=""
    var desviacionCsv=""
    function enviarImagenes(imageList,base64Ref) {
        var progressBar = $('<div class="progress" style="margin-top: 20px;"><div class="progress-bar progress-bar-striped bg-success" role="progressbar" style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0%</div></div>');
        $('#progresfirma').append(progressBar);
        var settings = {
            "url": "http://18.118.135.233:3000/api/firmaExhaustiva",
            "method": "POST",
            "timeout": 10000,
            "headers": {
                "Content-Type": "application/json",
            },
            "data": JSON.stringify({images:imageList,
                imgref:base64Ref
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
        }

        $.ajax(settings).done(function (response) {
            
            if(response.message!=undefined){
                $("#filaReporte").append('<p style="color:red">'+response.message+'</p>')
                return;
            }
            //** Se guardan los datos para el reporte csv */
            listaCsv=response.listaS;
            medianaCsv=response.mediana
            mediaCsv=response.media
            desviacionCsv=response.desviacion
            //******************************************* */

            for(let i=0;i<response.listaS.length;i++){ 
                var fila = [response.listaS[i]];
                tabla.row.add([nombres[i],'<img src="' + imageList[i]+ '" alt="Imagen" style="width:150px;height:150px" >',fila]).draw(false);
            }
            

            $("#filaReporte").attr("style","display:block;background-color:white");
            $("#btnReporte").attr("style","display:block; width:150px");
            $("#btnReporte2").attr("style","display:block; width:150px");

                var contenido="";
                contenido+="<tr>"
                // Agrega la fila a la tabla
                contenido+='<td>'+response.media+'</td>'
                contenido+='<td>'+response.mediana+'</td>';
                contenido+='<td>'+response.desviacion+'</td>';
                contenido+="</tr>"
            
            $("#bodyResultados").append(contenido)
            $("#resultados").attr("style","display:block;background-color:white");

            


            //*******************Se crea array de colores dinamicos para las graficas******************** */
            var dynamicColors = []; 

            for (var i = 0; i < response.listaS.length; i++) {
                var dynamicColor = 'rgba(' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ', 0.2)';
                dynamicColors.push(dynamicColor);
            }
            //************************************************************ */

            /*******************CONFIGURACION DE LAS GRÁFICAS ******************** */
            var data = {
                labels: nombres,
                datasets: [{
                    label: 'Firmas',
                    data: response.listaS,
                    backgroundColor: dynamicColors,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }]
            };
    
            var options = {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            };
            //************************************************************************** */


            var ctx = document.getElementById('myChart').getContext('2d');
            var ctx2 = document.getElementById('myChart2').getContext('2d');
    
            //*************GRÁFICA DE BARRAS**************** */
            var myChart = new Chart(ctx, {
                type: 'bar',
                data: data,
                options: options
            });

            //******************GRÁFICA DE LÍNEAS************************ */
            var myChart = new Chart(ctx2, {
                type: 'line',
                data: data,
                options: options
            });    
        })
    }



    /**********************REPORTE EN FORMATO PDF ************************* */
    $("#btnReporte").click(function(){
       
        var filaReporte = document.getElementById('tablaFirmas');
        var graficas= document.getElementById('graficas');

        Promise.all([
            html2canvas(filaReporte),
            html2canvas(graficas)
        ]).then(function(canvases) {
            var img1 = canvases[0].toDataURL("image/png");
            var img2 = canvases[1].toDataURL("image/png");
            
            var doc = new jsPDF();
            doc.addImage(img1, 'JPEG', 20, 20);
            doc.addPage();
            doc.addImage(img2, 'JPEG', 20, 20);
            doc.save('Reporte_Firmas.pdf');
        });

    })

    //**********************REPORTE EN FORMATO CSV***************************** */
    $("#btnReporte2").click(function(){
        var contenido="Media,Mediana,Desviación Estándar\n"
        contenido+=mediaCsv+","+medianaCsv+","+desviacionCsv+"\n"
        contenido+=",,\n"
        contenido+="Nombre,Similiitud,\n"
        for(let i=0;i<listaCsv.length;i++){
            contenido+=nombres[i]+","+listaCsv[i]+",\n"
        }
        var blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' });
        var enlace = document.createElement('a');
        enlace.href = window.URL.createObjectURL(blob);
        enlace.download = 'datos.csv';
        enlace.style.display = 'none';
        document.body.appendChild(enlace);
        enlace.click();
        document.body.removeChild(enlace);

    })



   
});