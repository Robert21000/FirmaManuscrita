$(document).ready(function(){

    $('#btnCreditos').click(function() {

        $.ajax({
            url: 'http://18.118.135.233:3000/api/Creditos',
            type: 'GET',
            dataType: 'json', // Especificar el tipo de datos que esperas recibir
            success: function(data) {
                // La función que se ejecuta si la solicitud es exitosa
                $('#valorCreditos').text(data.creditos);
                // Aquí puedes manipular los datos recibidos, actualizar la interfaz, etc.
            },
            error: function(xhr, status, error) {
                // La función que se ejecuta si hay un error en la solicitud
                console.error('Error en la solicitud:', status, error);
            }
        });
    })
})