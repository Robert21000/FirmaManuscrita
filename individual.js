$(document).ready(function(){

    var base64Img1="";
    var base64Img2=""; 
    // Subir la imágen de una firma y que se pueda visualizar en la página
    $("#btnSubir1").click(function(){

        var archivo = $('#imagen1')[0].files[0];

        if (archivo) {
            var lector = new FileReader();

            lector.onload = function(e) {
                base64Img1 = e.target.result;
                $('#firma1').attr('src', base64Img1);
            };
            lector.readAsDataURL(archivo);
        } else {
            alert("No se ha seleccionado ningún archivo.");
        }
    });

// Subir la imágen de la firma a verificar
    $("#btnSubir2").click(function(){

        var archivo = $('#imagen2')[0].files[0];

        if (archivo) {
            var lector = new FileReader();

            lector.onload = function(e) {
                base64Img2 = e.target.result;
                $('#firma2').attr('src', base64Img2);
                
            };

            lector.readAsDataURL(archivo);
        } else {
            alert("No se ha seleccionado ningún archivo.");
        }
    });


//*************************************INICIO COMPARAR FIRMA INDIVIDUAL************************************************/
    $("#btnComparar").click(function(){

        if (!base64Img1 || !base64Img2) {
            alert("Debe subir ambas imágenes antes de comparar.");
        } else {    
        var progressBar = $('<div class="progress" style="margin-top: 20px;"><div class="progress-bar progress-bar-striped bg-success" role="progressbar" style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0%</div></div>');
        $('#progresfirma').append(progressBar);

        var settings = {
            "url": "http://18.118.135.233:3000/api/firma",
            "method": "POST",
            "timeout": 10000,
            "headers": {
                "Content-Type": "application/json",
            },
            "data": JSON.stringify({
                "document": base64Img1,
                "queryDocument": base64Img2
            }),
            xhr: function() {
                var xhr = new window.XMLHttpRequest();
                // Establece el listener de progreso
                xhr.upload.addEventListener("progress", function(evt) {
                    if (evt.lengthComputable) {
                        var percentComplete = evt.loaded / evt.total;
                        // Actualizamos la barra de progreso
                        progressBar.find('.progress-bar').css('width', percentComplete * 100 + '%').attr('aria-valuenow', percentComplete * 100).text(percentComplete * 100 + '%');
                    }
                }, false);
                return xhr;
            }
        };
        

        $.ajax(settings).done(function (response) {
            console.log(response);
            if(response.message==undefined){

                    if(response.query.length>0&&response.reference.length>0){
                        var bloqueFirmaReferencia=$('<div class="image-container"><img  src="'+response.reference[0].image+'" style="height:300px;width: 300px;"><div class="rectangle2"></div><div class="image-title">Firma de referencia</div></div>');
                        $('#firmaReferencia').append(bloqueFirmaReferencia);
                        for(i=0;i<response.query.length;i++){
                            var similitud=0;
                            if(response.query[i].similarities.length>0){
                                similitud=response.query[i].similarities[0]*100;
                            }
                            var bloqueFirma=$('<div class="image-container"><img  src="'+response.query[i].image+'" style="height:200px;width: 200px;margin-top: 10px;margin-left: 10px;"><div class="rectangle"></div><div class="image-title">Similitud: '+similitud+'%</div></div>');
                            $('#firmaReconocida').append(bloqueFirma);
                        }
                    }else{
                        var bloqueFirmaReferencia=$('<div class="image-container"><img  src="'+base64Img1+'" style="height:300px;width: 300px;"><div class="rectangle2"></div><div class="image-title">Firma de referencia</div></div>');
                        $('#firmaReferencia').append(bloqueFirmaReferencia);
                        var mensaje=$('<div style="color:red"><p>No se encontraron coincidencias</p></div>');
                        $('#firmaReconocida').append(mensaje);
                    }
             
            }else{
                console.log(response);
                $("#firmaReconocida").append('<p style="color:red">'+response.message+'</p>')
                return;
            }
            
        });
        }
    })
//****************************************FIN COMPARAR FIRMA INDIVIDUAL*********************************************/


})