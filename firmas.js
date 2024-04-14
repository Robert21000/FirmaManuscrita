$(document).ready(function(){

    var base64Img1="";
    var base64Img2=""; 
    $("#btnSubir1").click(function(){

        var archivo = $('#imagen1')[0].files[0];

        if (archivo) {
            var lector = new FileReader();

            lector.onload = function(e) {
                // Convertir la imagen a base64
                base64Img1 = e.target.result;
                $('#firma1').attr('src', base64Img1);
                
                // Aquí puedes realizar más acciones, como enviar el archivo mediante AJAX
            };

            lector.readAsDataURL(archivo);
        } else {
            console.error("No se ha seleccionado ningún archivo.");
        }
    });

    $("#btnSubir2").click(function(){

        var archivo = $('#imagen2')[0].files[0];

        if (archivo) {
            var lector = new FileReader();

            lector.onload = function(e) {
                // Convertir la imagen a base64
                base64Img2 = e.target.result;
                $('#firma2').attr('src', base64Img2);
                // Aquí puedes realizar más acciones, como enviar el archivo mediante AJAX
            };

            lector.readAsDataURL(archivo);
        } else {
            console.error("No se ha seleccionado ningún archivo.");
        }
    });

    $("#btnComparar").click(function(){

        console.log("comparar")

        var settings = {
            "url": "https://base64.ai/api/signature",
            "method": "POST",
            "timeout": 10000,
            "crossDomain": true, // Agregar esta línea para habilitar CORS
            "headers": {
                "Content-Type": "application/json",
                "Authorization": "ApiKey 2404145860314@ingenieria.usac.edu.gt:47d2aee3-95bf-43f4-a3ab-0d5e258d5153",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE"
            },
            "data": JSON.stringify({
                "document": base64Img1,
                "queryDocument": base64Img2
            }),
        };
        
        $.ajax(settings).done(function (response) {
            console.log(response);
        });
        
    })

});