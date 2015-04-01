'use strict';
// Clientes Controller
app.controller("ClientesCtrl", function($scope, $state, $http, $modal, ngToast, auth, TypingLNFactory, BasesFactory){

  //get id de autenticado
  var myid = $scope.status = auth.profileID;

  //get values LN factory
  $scope.getLN = TypingLNFactory;
  $scope.dataBases = BasesFactory;

  $scope.$on('cargaListas', function(event){

    //get lista de clientes
    var linea = "";
    if($state.current.name == "bases.clients")
      linea = $scope.dataBases.linea;
    else if($state.current.name == "typing.clients")
      linea = $scope.getLN.linea;

    $scope.getListaClientes = { op: "listaClienteAtento", Linea: linea, Cliente: "", Activo:""};

    $http({
      method : 'POST',
      url : 'api/rest.php',
      data : $.param($scope.getListaClientes),
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){
      $scope.listaClienteAtentoResult = data;
      console.info("ClientesCtrl > getListaClientes >>> OK");
    })
    .error(function(data){
      console.error("ClientesCtrl > getListaClientes >>> ERROR HTTP");
      var msg = ngToast.create({
        content: 'Error al cargar la lista de clientes; Detalles: ClientesCtrl > getListaClientes >>> ERROR HTTP',
        className:  'danger'
      });
    })

    //get lista de lineas de negocio
    $scope.getListaLineas = { op: "listaLineaNegocio", Linea: linea, Activo:""};

    $http({
      method : 'POST',
      url : 'api/rest.php',
      data : $.param($scope.getListaLineas),
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){
      $scope.listaLineaNegocioResult = data;
      console.info("ClientesCtrl > getListaLineas >>> OK");
    })
    .error(function(data){
      console.error("ClientesCtrl > getListaLineas >>> ERROR HTTP");
      var msg = ngToast.create({
        content: 'Error al cargar la lista de Lineas de Negocio; Detalles: ClientesCtrl > getListaLineas >>> ERROR HTTP',
        className:  'danger'
      });
    })
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
    $scope.getClientData = { op: "listaClienteAtento", Linea: linea, Cliente: cliente, Activo:activo};
    //$scope.getListaClientes = { op: "listaClienteAtento", Linea: "", Cliente: "", Activo:""};
    $http({
      method : 'POST',
      url : 'api/rest.php',
      data : $.param($scope.getClientData),
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){
      $scope.clienteAtentoResult = data;
      console.info("ClientesCtrl > openEdit > listaClienteAtento >>> OK");

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
    .error(function(data){
      console.error("ClientesCtrl > openEdit > listaClienteAtento >>> ERROR HTTP");
      var msg = ngToast.create({
        content: 'Error al cargar los datos del cliente; Detalles: ClientesCtrl > openEdit > listaClienteAtento >>> ERROR HTTP',
        className:  'danger'
      });
    })
  };

  //Selected cliente
  $scope.selected = function(clienteAtentoId, cliente){

    //TypingService.addItem(lineaNegocioId, linea);

    //add LN factory
    $scope.TypingLN = TypingLNFactory;
    $scope.TypingLN.clienteAtentoId = clienteAtentoId;
    $scope.TypingLN.cliente = cliente;


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

app.controller("ModalCreate_ClientController", function($scope, $http, $modalInstance, ngToast, auth, listaLineaNegocioResult){

  //get id de autenticado
  var myid = $scope.status = auth.profileID;
  $scope.listaLineaNegocioResult = listaLineaNegocioResult;

  $scope.addClient = { op: "mantClienteAtento", Id: "0", LineaId: listaLineaNegocioResult[0].lineaNegocioId, Cliente: "", Activo: "",  UserId: myid };

  //funcion que agrega un cliente nuevo a la base
  $scope.AddClient = function(){
    $http({
      method : 'POST',
      url : 'api/rest.php',
      data : $.param($scope.addClient),
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){

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

      return;
    })
    .error(function(data){
      console.error("ClientesCtrl > AddClient > mantClienteAtento >>> ERROR HTTP");
      var msg = ngToast.create({
        content: 'Error al Crear el Cliente; Detalles: ClientesCtrl > AddClient > mantClienteAtento >>> ERROR HTTP',
        className:  'danger'
      });
      $modalInstance.close();
    })
  };

  $scope.CloseLines = function()
  {
    $modalInstance.close();
  };

});

//controlador para la tabla de lista de clientes
app.controller("ModalEdit_ClientController", function($scope, $http, $modalInstance, ngToast, auth, client){
  //get id de autenticado
  var myid = $scope.status = auth.profileID;

  $scope.editClient = { op: "mantClienteAtento", Id: client[0].clienteAtentoId, LineaId: client[0].lineaNegocioId, Cliente: client[0].cliente, Activo: client[0].activo,  UserId: myid };

  $scope.client = client;

  $scope.EditClient = function () {
     $http({
      method : 'POST',
      url : 'api/rest.php',
      data : $.param($scope.editClient),
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){

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

      return;
    })
    .error(function(data){
      console.error("ModalEdit_ClientController > EditClient > mantClienteAtento >>> ERROR HTTP");
      var msg = ngToast.create({
        content: 'Error al Editar el Cliente; Detalles: ModalEdit_ClientController > EditClient > mantClienteAtento >>> ERROR HTTP',
        className:  'danger'
      });
      $modalInstance.close();
    })
  };

  $scope.CloseLines = function()
  {
    $modalInstance.close();
  };

});