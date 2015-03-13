'use strict';

/*
* @ngdoc function
* @name CamuApp.controller:MainCtrl
* @description
* # MainCtrl
* Controller of the CamuApp
*/

// App Controller
app.controller("AppCtrl", function($scope, $location, auth){

  //get auth
  $scope.status = auth;

  return $scope.isSpecificPage = function(){
    var path;
    return path = $location.path(), _.contains(["/404", "/pages/500", "/signin"], path)
  }, $scope.main = {
    brand: "Camu Dash"
  }

});

// Nav Controller
app.controller("NavCtrl", function($scope, taskStorage, filterFilter) {

  var tasks;
  return tasks = $scope.tasks = taskStorage.get(), $scope.taskRemainingCount = filterFilter(tasks, {
    completed: !1
  }).length, $scope.$on("taskRemaining:changed", function(event, count) {
    return $scope.taskRemainingCount = count
  })

});

// Login Controller

app.controller('LoginCtrl', function($scope, $http, $location, $cookies, auth){

  $scope.access = { op: "SeguridadLogin", User: "", Password: "" };

  $scope.login = function(){

    $http({ method : 'POST', url : 'api/rest.php', data : $.param($scope.access), headers : { 'Content-Type': 'application/x-www-form-urlencoded' } })
    .success(function(data){

      if(data == 'Error'){

        $scope.result = data;
        console.warn("Login Failed");

      }else{

        console.info("Login Done");

        //cookies everywhere
        $scope.LoginFactory = auth;
        $scope.LoginFactory.user = $cookies.usuariocookie = data[0].usuario;
        $scope.LoginFactory.profile = $cookies.perfilcookie = data[0].perfil;
        $scope.LoginFactory.profileID = $cookies.perfilesIdcookie = data[0].perfilesId;

        $location.path('dashboard');
      }

    })
    .error(function(data){
      console.error("Login >>> error");
    })
  };

});

// Dashboard Controller

app.controller('DashboardCtrl', function($scope, ngToast){
  ngToast.create('Bienvenido a Camu');
});

// Users Controller

app.controller("UsersCtrl", function($scope, $http, $location){

  $scope.getUsersList = { op: "ListaUsuario" };

  $http({ method : 'POST', url : 'api/rest.php', data : $.param($scope.getUsersList), headers : { 'Content-Type': 'application/x-www-form-urlencoded' } })
  .success(function(data){

    //$scope.loading = false;
    console.info(data);

    $scope.foo = data;

    console.info('All Users Loaded');

  })
  .error(function(data){
    console.error("All Users >>> Oops");
  })

});

// Clientes Controller
app.controller("ClientesCtrl", function($scope, $http, $modal, $modalStack, ngToast, auth){
  
  //get id de autenticado  
  var myid = $scope.status = auth.profileID;

  //modelos
  $scope.addClient = { op: "mantClienteAtento", Id: "0", LineaId: "", Cliente: "", Activo: "",  UserId: myid };      
  //$scope.editClient = { op: "Mantenimiento_Cliente_Atento", Id: "0", LineaId: "", Cliente: "", Activo: "",  UserId: myid };
  //$scope.disabledClient = { op: "Mantenimiento_Cliente_Atento", Id: "0", LineaId: "", Cliente: "", Activo: "",  UserId: myid };
  

  $scope.$on('cargaListas', function(event){

  //get lista de clientes
  $scope.getListaClientes = { op: "listaClienteAtento", Linea: "", Cliente: "", Activo:""};
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
  })

  //get lista de lineas de negocio
  $scope.getListaLineas = { op: "listaLineaNegocio", Linea: "", Activo:""};
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
  })



  });
  
  

  $scope.$emit('cargaListas');

  //se muestra modal para crear cliente
  $scope.CreateClient = function(){
    var modalInstance = $modal.open({
      templateUrl: 'ModalCreate_Client.html',
      controller: 'ClientesCtrl'
    });
  };

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
      $modalInstance.close();
      return;
    })
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
          },
          scopee: function () {
          return $scope;
          }
        }
      });  

    })
    .error(function(data){
      console.error("ClientesCtrl > openEdit > listaClienteAtento >>> ERROR HTTP");       
    })

   
  };

});

//controlador para la tabla de lista de clientes
app.controller("ModalEdit_ClientController", function($scope, $http, $modalInstance, ngToast, auth, client, scopee){
  //get id de autenticado  
  var myid = $scope.status = auth.profileID;

  $scope.editClient = { op: "mantClienteAtento", Id: client[0].clienteAtentoId, LineaId: client[0].lineaNegocioId, Cliente: client[0].cliente, Activo: client[0].activo,  UserId: myid };

  //get lista de lineas de negocio
  $scope.getListaLineas = { op: "listaLineaNegocio", Linea: "", Activo:""};
  $http({ 
    method : 'POST', 
    url : 'api/rest.php', 
    data : $.param($scope.getListaLineas), 
    headers : { 'Content-Type': 'application/x-www-form-urlencoded' } 
  })
  .success(function(data){
    $scope.listaLineaNegocioResult = data;
    
    angular.forEach($scope.listaLineaNegocioResult, function(item) {
      if(client[0].lineaNegocioId == item.lineaNegocioId)
        $scope.selectedOption = item;  
    });    
    
    console.info("ModalEdit_ClientController > getListaLineas >>> OK");       
  })
  .error(function(data){
    console.error("ModalEdit_ClientController > getListaLineas >>> ERROR HTTP");       
  })

  $scope.client = client;

  $scope.changedValueLine=function(item){
    $scope.editClient.LineaId = item.lineaNegocioId;
  } 
    
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
          scopee.$emit('cargaListas');
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
      $modalInstance.close();
      return;
    })     
  };

});


// Services Controller
app.controller('ServicesCtrl', function($scope, $http, $modal, $modalStack, ngToast, auth){

   /*$scope.getSerDef = { op: "getServicesDef", serviceId: "MLSegurosUniversal" };

    $http({ method : 'POST', url : 'api/rest.php', data : $.param($scope.getSerDef), headers : { 'Content-Type': 'application/x-www-form-urlencoded' } })
    .success(function(data){
      $scope.loading = false;
      $scope.getAllServiceDef = data;
      console.info('All Services Ok');
    })
    .error(function(data){
      console.error("All Services >>> Oops");
    })*/

  //get id de autenticado  
  var myid = $scope.status = auth.profileID;

  //modelos
  /*$scope.addService = { op: "Mantenimiento_Cliente_Atento", Id: "0", LineaId: "", Cliente: "", Activo: "",  UserId: myid };
  $scope.editService = { op: "Mantenimiento_Cliente_Atento", Id: "0", LineaId: "", Cliente: "", Activo: "",  UserId: myid };
  $scope.disabledService = { op: "Mantenimiento_Cliente_Atento", Id: "0", LineaId: "", Cliente: "", Activo: "",  UserId: myid };*/

  //get lista de servicios  
  $scope.getListaServicios = { op: "ListaServicios", Servicio: "metlife", Skill: "metlife", Perfil:"1"};
  $http({ 
    method : 'POST', 
    url : 'api/rest.php', 
    data : $.param($scope.getListaServicios), 
    headers : { 'Content-Type': 'application/x-www-form-urlencoded' } 
  })
  .success(function(data){
    $scope.listaServiciosResult = data;
    console.info("ServicesCtrl > getListaServicios >>> ERROR WS");       
  })
  .error(function(data){
    console.error("ServicesCtrl > getListaServicios >>> ERROR HTTP");       
  })

  //se muestra modal par acrear cliente
  $scope.CreateService = function(){
    var modalInstance = $modal.open({
      templateUrl: 'ModalCreate_Service.html',
      controller: 'ServicesCtrl'
    });
  };
/*
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
         //$scope.result = data;
        ngToast.create('EL cliente no ha sido creado, revisa tus datos requeridos');
        console.warn("ClientesCtrl > AddClient > Mantenimiento_Cliente_Atento >>> ERROR WS");        
      }
      else{
        var cliente_checked = angular.isNumber(data[0].Column1);
        if(cliente_checked == true){
          ngToast.create('El cliente fue creado con exito');
          console.info("ClientesCtrl > AddClient > Mantenimiento_Cliente_Atento >>> Ok");
        }
        else{
          ngToast.create('EL cliente no ha sido creado');
          $scope.result = data;
          console.warn("ClientesCtrl > AddClient > Mantenimiento_Cliente_Atento >>> CLIENTE NO CREADO");
        }
      }

      return;
    })
    .error(function(data){
      console.error("ClientesCtrl > AddClient > Mantenimiento_Cliente_Atento >>> ERROR HTTP");
      $modalInstance.close();
      return;
    })
  };


  //funcion que edita un cliente en la base
  $scope.EditClient = function(){
    
  };

  //funcion que edita un cliente en la base
  $scope.DisabledClient = function(){
    
  };*/

});