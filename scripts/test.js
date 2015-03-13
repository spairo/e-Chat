
var values = { op: "mantUsuarios", Id: "10", Nombre: "esdgdgsdf", Apellidos: "aklsjdlkh", User: "fooooooogghy", Password: "123", perfilId: "7", Sexo: "M", Activo: "1", UserModificacion: "1" };

$.ajax({
        url: "api/rest.php",
        type: "post",
        data: values,
        success: function(){
            alert("success");
        },
        error:function(){
            alert("failure");
        }
});
