'use strict';
// Clientes Controller

app.controller("ClientesCtrl", function($scope, $state, $modal, $modalStack, ngToast, auth, TypingFactory, BasesFactory, resources_POST, resources_GET){

  //get id de autenticado
  var myid = $scope.status = auth.profileID;

  //get values LN factory
  $scope.Typing = TypingFactory;
  $scope.dataBases = BasesFactory;

  $scope.$on('cargaListas', function(event){

    //get lista de clientes
    var linea = "";
    if($state.current.name == "bases.clients")
      linea = $scope.dataBases.linea;
    else if($state.current.name == "typing.clients")
      linea = $scope.Typing.linea;   

    $scope.getListaClientes = { Linea: linea, Cliente: "", Activo:""};
    $scope.option = "rp_listaClienteAtento";

    resources_POST.post($scope.option, $scope.getListaClientes)
    .then(function(data){
      $scope.listaClienteAtentoResult = data;
    })
    .catch(function(data, status){
      console.error("Error en resources_POST ", status, data);
      var msg = ngToast.create({
        content: "Error en resources_POST " + status + data,
        className:  "danger"
      });
    })
    .finally(function(){
      console.log("Finaliza llamada a resources_POST");
    });

    //get lista de lineas de negocio
    $scope.getListaLineas = { Linea: linea, Activo:""};
    $scope.option = "rp_listaLineaNegocio";

    resources_POST.post($scope.option, $scope.getListaLineas)
    .then(function(data){
      $scope.listaLineaNegocioResult = data;
    })
    .catch(function(data, status){
      console.error("Error en resources_POST ", status, data);
      var msg = ngToast.create({
        content: "Error en resources_POST " + status + data,
        className:  "danger"
      });
    })
    .finally(function(){
      console.log("Finaliza llamada a resources_POST");
    });
  });

  $scope.$emit('cargaListas');

  //se muestra modal para crear cliente
  $scope.CreateClient = function(){
    var modalInstance = $modal.open({
      templateUrl: 'ModalCreate_Client.html',
      controller: 'ModalCreate_ClientController',
      resolve: {
        listaLineaNegocioResult: function () {
          return $scope.listaLineaNegocioResult;
        }
      }
    });

     modalInstance.result.then(function(){
      $scope.$emit('cargaListas');
    });
  };

  //se muestra modal para editar cliente
  $scope.openEdit = function(linea, cliente, activo){
    //consultamos los datos del clienteId al que se le dio click para editar
    $scope.getClientData = {Linea: linea, Cliente: cliente, Activo:activo};
    $scope.option = "rp_listaClienteAtento";
    
    resources_POST.post($scope.option, $scope.getClientData)
    .then(function(data){
      $scope.clienteAtentoResult = data;

      var modalInstance = $modal.open({
        templateUrl: 'ModalEdit_Client.html',
        controller: 'ModalEdit_ClientController',
        resolve: {
          client: function () {
          return $scope.clienteAtentoResult;
          }
        }
      });

      modalInstance.result.then(function(){
        $scope.$emit('cargaListas');
      });
    })
    .catch(function(data, status){
      console.error("Error en resources_POST ", status, data);
      var msg = ngToast.create({
        content: "Error en resources_POST " + status + data,
        className:  "danger"
      });
    })
    .finally(function(){
      console.log("Finaliza llamada a resources_POST");
    });
  };

  //Selected cliente
  $scope.selected = function(clienteAtentoId, cliente){

    //add LN factory
    $scope.Typing.clienteAtentoId = clienteAtentoId;
    $scope.Typing.cliente = cliente;


    $scope.dataBases.clienteAtentoId = clienteAtentoId;
    $scope.dataBases.cliente = cliente;

    if($state.current.name == "bases.clients")
      $state.go('bases.services');
    else if($state.current.name == "typing.clients")
      $state.go('typing.services');
  };

  $scope.StateReload = function(){
    $state.reload();

  };

});

app.controller("ModalCreate_ClientController", function($scope, $modalInstance, ngToast, auth, listaLineaNegocioResult, resources_POST, resources_GET){

  //get id de autenticado
  var myid = $scope.status = auth.profileID;
  $scope.listaLineaNegocioResult = listaLineaNegocioResult;

  $scope.addClient = { Id: "0", LineaId: listaLineaNegocioResult[0].lineaNegocioId, Cliente: "", Activo: "",  UserId: myid };
  $scope.option = "rp_mantClienteAtento";

  //funcion que agrega un cliente nuevo a la base
  $scope.AddClient = function(){
    
    resources_POST.post($scope.option, $scope.addClient)
    .then(function(data){
      if(data == 'Error'){
        ngToast.create('EL cliente no ha sido creado, revisa tus datos requeridos');
        console.warn("ClientesCtrl > AddClient > mantClienteAtento >>> ERROR WS");
      }
      else{
        var cliente_checked = angular.isNumber(data[0].Column1);
        if(cliente_checked == true){
          ngToast.create('El cliente fue creado con exito');
          console.info("ClientesCtrl > AddClient > mantClienteAtento >>> Ok");
          $modalInstance.close();
        }
        else{
          ngToast.create('EL cliente no ha sido creado');
          $scope.result = data;
          console.warn("ClientesCtrl > AddClient > mantClienteAtento >>> CLIENTE NO CREADO");
        }
      }
    })
    .catch(function(data, status){
      console.error("Error en resources_POST ", status, data);
      var msg = ngToast.create({
        content: "Error en resources_POST " + status + data,
        className:  "danger"
      });
    })
    .finally(function(){
      console.log("Finaliza llamada a resources_POST");
      $modalInstance.close();
    });
  };

  $scope.CloseLines = function()
  {
    $modalInstance.close();
  };

});

//controlador para la tabla de lista de clientes
app.controller("ModalEdit_ClientController", function($scope, $modalInstance, ngToast, auth, client, resources_POST, resources_GET){
  //get id de autenticado
  var myid = $scope.status = auth.profileID;

  $scope.editClient = { Id: client[0].clienteAtentoId, LineaId: client[0].lineaNegocioId, Cliente: client[0].cliente, Activo: client[0].activo,  UserId: myid };
  $scope.option = "rp_mantClienteAtento";

  $scope.client = client;

  $scope.EditClient = function () {
     
    resources_POST.post($scope.option, $scope.editClient)
    .then(function(data){
      if(data == 'Error'){
        ngToast.create('EL cliente no ha sido editado, revisa tus datos requeridos');
        console.warn("ModalEdit_ClientController > EditClient > mantClienteAtento >>> ERROR WS");
      }
      else{
        var cliente_checked = angular.isNumber(data[0].Column1);
        if(cliente_checked == true){
          ngToast.create('El cliente fue editado con exito');
          console.info("ModalEdit_ClientController > EditClient > mantClienteAtento >>> Ok");
          $modalInstance.close();
        }
        else{
          ngToast.create('EL cliente no ha sido editado');
          $scope.result = data;
          console.warn("ModalEdit_ClientController > EditClient > mantClienteAtento >>> CLIENTE NO EDITADO");
        }
      }
    })
    .catch(function(data, status){
      console.error("Error en resources_POST ", status, data);
      var msg = ngToast.create({
        content: "Error en resources_POST " + status + data,
        className:  "danger"
      });
    })
    .finally(function(){
      console.log("Finaliza llamada a resources_POST");
    });
  };

  $scope.CloseLines = function()
  {
    $modalInstance.close();
  };

});
