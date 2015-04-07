'use strict';
// Servicios Controller

app.controller("ServiciosCtrl", function($scope, $state, $modal, $modalStack, ngToast, auth, TypingFactory, BasesFactory, httpp){

  //get id de autenticado
  var myid = $scope.status = auth.profileID;

  //get values LN factory
  $scope.getLN = TypingFactory;
  $scope.dataBases = BasesFactory;

  $scope.$on('cargaListas', function(event){

    var cliente = "";
    var linea = "";
    if($state.current.name == "bases.services")
    {
      cliente = $scope.dataBases.cliente;
      linea = $scope.dataBases.linea;
    }
    else if($state.current.name == "typing.services")
    {
      cliente = $scope.getLN.cliente;
      linea = $scope.dataBases.linea;
    }

    //get lista de servicios
    $scope.getListaServicios = { op: "listaServicios", Servicio: "", ClienteAtento: cliente, Activo:""};
    
    httpp.post($scope.getListaServicios)
    .then(function(data){
      $scope.listaServiciosResult = data;
    })
    .catch(function(data, status){
      console.error("Error en httpp ", status, data);
      var msg = ngToast.create({
        content: "Error en httpp " + status + data,
        className:  "danger"
      });
    })
    .finally(function(){
      console.log("Finaliza llamada a httpp");
    });

    //get lista de clientes
    $scope.getListaClientes = { op: "listaClienteAtento", Linea: linea, Cliente: cliente, Activo:""};
    
    httpp.post($scope.getListaClientes)
    .then(function(data){
      $scope.listaClienteAtentoResult = data;
    })
    .catch(function(data, status){
      console.error("Error en httpp ", status, data);
      var msg = ngToast.create({
        content: "Error en httpp " + status + data,
        className:  "danger"
      });
    })
    .finally(function(){
      console.log("Finaliza llamada a httpp");
    });

  });

  $scope.$emit('cargaListas');

  //se muestra modal para crear servicio
  $scope.CreateServicio = function(){
    var modalInstance = $modal.open({
      templateUrl: 'ModalCreate_Servicio.html',
      controller: 'ModalCreate_ServicioController',
      resolve: {
        listaClienteAtentoResult: function () {
          return $scope.listaClienteAtentoResult;
        }
      }
    });

    modalInstance.result.then(function(){
      $scope.$emit('cargaListas');
    });
  };

  //se muestra modal para editar servicio
  $scope.openEdit = function(servicio, cliente, activo){
    //consultamos los datos del servicio al que se le dio click para editar
    $scope.getServiceData = { op: "listaServicios", Servicio: servicio, ClienteAtento: cliente, Activo:activo};

    httpp.post($scope.getServiceData)
    .then(function(data){
      $scope.servicioResult = data;

      var modalInstance = $modal.open({
        templateUrl: 'ModalEdit_Servicio.html',
        controller: 'ModalEdit_ServiciosController',
        resolve: {
          service: function () {
          return $scope.servicioResult;
          }
        }
      });

      modalInstance.result.then(function(){
        $scope.$emit('cargaListas');
      });
    })
    .catch(function(data, status){
      console.error("Error en httpp ", status, data);
      var msg = ngToast.create({
        content: "Error en httpp " + status + data,
        className:  "danger"
      });
    })
    .finally(function(){
      console.log("Finaliza llamada a httpp");
    });
  };

  //Selected servicio
  $scope.selected = function(serviciosId, servicio){

    //add LN factory
    $scope.Typing = TypingFactory;
    $scope.Typing.serviciosId = serviciosId;
    $scope.Typing.servicio = servicio;

    $scope.dataBases.serviciosId = serviciosId;
    $scope.dataBases.servicio = servicio;


    if($state.current.name == "bases.services")
      $state.go('bases.channels');
    else if($state.current.name == "typing.services")
      $state.go('typing.channels');
  };

  $scope.StateReload = function(){
    $state.reload();

  };

});

//controlador para model de creacion de servicios
app.controller("ModalCreate_ServicioController", function($scope, $modalInstance, ngToast, auth, listaClienteAtentoResult, httpp){

  //get id de autenticado
  var myid = $scope.status = auth.profileID;
  $scope.listaClienteAtentoResult = listaClienteAtentoResult;

    $scope.addServicio = { op: "mantServicio", id: "0", cliAteId: listaClienteAtentoResult[0].clienteAtentoId, Servicio: "", Activo: "",  UserId: myid };

  //funcion que agrega un servicio nuevo a la base
  $scope.AddServicio = function(){
    
    httpp.post($scope.addServicio)
    .then(function(data){
      if(data == 'Error'){
        ngToast.create('EL servicio no ha sido creado, revisa tus datos requeridos');
        console.warn("ModalCreate_ServicioController > AddServicio > mantServicio >>> ERROR WS");
      }
      else{
        var servicio_checked = angular.isNumber(data[0].Column1);
        if(servicio_checked == true){
          ngToast.create('El servicio fue creado con exito');
          console.info("ModalCreate_ServicioController > AddServicio > mantServicio >>> Ok");
          $modalInstance.close();
        }
        else{
          ngToast.create('EL servicio no ha sido creado');
          $scope.result = data;
          console.warn("ModalCreate_ServicioController > AddServicio > mantServicio >>> SERVICIO NO CREADO");
        }
      }
    })
    .catch(function(data, status){
      console.error("Error en httpp ", status, data);
      var msg = ngToast.create({
        content: "Error en httpp " + status + data,
        className:  "danger"
      });
    })
    .finally(function(){
      console.log("Finaliza llamada a httpp");
      $modalInstance.close();
    });

  };

  $scope.CloseLines = function()
  {
    $modalInstance.close();
  };

});

//controlador para model de edicion de servicios
app.controller("ModalEdit_ServiciosController", function($scope, $modalInstance, ngToast, auth, service, httpp){
  //get id de autenticado
  var myid = $scope.status = auth.profileID;

  $scope.editServicio = { op: "mantServicio", id: service[0].serviciosId, cliAteId: service[0].clienteAtentoId, Servicio: service[0].servicio, Activo: service[0].activo,  UserId: myid };

  $scope.service = service;

  $scope.EditServicio = function () {
     
    httpp.post($scope.editServicio)
    .then(function(data){
      if(data == 'Error'){
        ngToast.create('EL servicio no ha sido editado, revisa tus datos requeridos');
        console.warn("ModalEdit_ServiciosController > EditServicio > mantServicios >>> ERROR WS");
      }
      else{
        var servicio_checked = angular.isNumber(data[0].Column1);
        if(servicio_checked == true){
          ngToast.create('El servicio fue editado con exito');
          console.info("ModalEdit_ServiciosController > EditServicio > mantServicios >>> Ok");
          $modalInstance.close();
        }
        else{
          ngToast.create('EL servicio no ha sido editado');
          $scope.result = data;
          console.warn("ModalEdit_ServiciosController > EditServicio > mantServicios >>> SERVICIO NO EDITADO");
        }
      }
    })
    .catch(function(data, status){
      console.error("Error en httpp ", status, data);
      var msg = ngToast.create({
        content: "Error en httpp " + status + data,
        className:  "danger"
      });
    })
    .finally(function(){
      console.log("Finaliza llamada a httpp");
      $modalInstance.close();
    });

  };

  $scope.CloseLines = function()
  {
    $modalInstance.close();
  };

});
