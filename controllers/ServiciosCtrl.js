'use strict';
// Servicios Controller
app.controller("ServiciosCtrl", function($scope, $state, $http, $modal, ngToast, auth, TypingLNFactory, BasesFactory){

  //get id de autenticado
  var myid = $scope.status = auth.profileID;

  //get values LN factory
  $scope.getLN = TypingLNFactory;
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
    $http({
      method : 'POST',
      url : 'api/rest.php',
      data : $.param($scope.getListaServicios),
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){
      $scope.listaServiciosResult = data;
      console.info("ServiciosCtrl > getListaServicios >>> OK");
    })
    .error(function(data){
      console.error("ServiciosCtrl > getListaServicios >>> ERROR HTTP");
    })

    //get lista de clientes
    $scope.getListaClientes = { op: "listaClienteAtento", Linea: linea, Cliente: cliente, Activo:""};
    $http({
      method : 'POST',
      url : 'api/rest.php',
      data : $.param($scope.getListaClientes),
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){
      $scope.listaClienteAtentoResult = data;
      console.info("ServiciosCtrl > getListaClientes >>> OK");
    })
    .error(function(data){
      console.error("ServiciosCtrl > getListaClientes >>> ERROR HTTP");
    })

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

    $http({
      method : 'POST',
      url : 'api/rest.php',
      data : $.param($scope.getServiceData),
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){
      $scope.servicioResult = data;
      console.info("ServiciosCtrl > openEdit > listaServicios >>> OK");

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
    .error(function(data){
      console.error("ServiciosCtrl > openEdit > listaServicios >>> ERROR HTTP");
    })
  };

  //Selected servicio
  $scope.selected = function(serviciosId, servicio){
    $scope.dataBases.serviciosId = serviciosId;
    $scope.dataBases.servicio = servicio;


    if($state.current.name == "bases.services")
      $state.go('bases.channels');
    else if($state.current.name == "typing.services")
      $state.go('typing.channels');
  };

});

//controlador para model de creacion de servicios
app.controller("ModalCreate_ServicioController", function($scope, $http, $modalInstance, ngToast, auth, listaClienteAtentoResult){

  //get id de autenticado
  var myid = $scope.status = auth.profileID;
  $scope.listaClienteAtentoResult = listaClienteAtentoResult;

    $scope.addServicio = { op: "mantServicio", id: "0", cliAteId: listaClienteAtentoResult[0].clienteAtentoId, Servicio: "", Activo: "",  UserId: myid };

  //funcion que agrega un servicio nuevo a la base
  $scope.AddServicio = function(){
    $http({
      method : 'POST',
      url : 'api/rest.php',
      data : $.param($scope.addServicio),
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){

      if(data == 'Error'){
        ngToast.create('EL servicio no ha sido creado, revisa tus datos requeridos');
        console.warn("ServiciosCtrl > AddServicio > mantServicio >>> ERROR WS");
      }
      else{
        var servicio_checked = angular.isNumber(data[0].Column1);
        if(servicio_checked == true){
          ngToast.create('El servicio fue creado con exito');
          console.info("ServiciosCtrl > AddServicio > mantServicio >>> Ok");
          $modalInstance.close();
        }
        else{
          ngToast.create('EL servicio no ha sido creado');
          $scope.result = data;
          console.warn("ServiciosCtrl > AddServicio > mantServicio >>> SERVICIO NO CREADO");
        }
      }

      return;
    })
    .error(function(data){
      console.error("ServiciosCtrl > AddServicio > mantServicio >>> ERROR HTTP");
      return;
    })
  };

  $scope.CloseLines = function()
  {
    $modalInstance.close();
  };

});

//controlador para model de edicion de servicios
app.controller("ModalEdit_ServiciosController", function($scope, $http, $modalInstance, ngToast, auth, service){
  //get id de autenticado
  var myid = $scope.status = auth.profileID;

  $scope.editServicio = { op: "mantServicio", id: service[0].serviciosId, cliAteId: service[0].clienteAtentoId, Servicio: service[0].servicio, Activo: service[0].activo,  UserId: myid };

  $scope.service = service;

  $scope.EditServicio = function () {
     $http({
      method : 'POST',
      url : 'api/rest.php',
      data : $.param($scope.editServicio),
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){

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

      return;
    })
    .error(function(data){
      console.error("ModalEdit_ServiciosController > EditServicio > mantServicios >>> ERROR HTTP");
      $modalInstance.close();
      return;
    })
  };

  $scope.CloseLines = function()
  {
    $modalInstance.close();
  };

});