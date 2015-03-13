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

  $scope.status = auth;

  return $scope.isSpecificPage = function(){
    var path;
    return path = $location.path(), _.contains(["/404", "/pages/500", "/signin"], path)
  }, $scope.main = {
    brand: "Camu Dash"
  }

  $scope.bye = function(){

    alert("bye");

  };

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

app.controller('LoginCtrl', function($scope, $http, $location, $cookies, ngToast, auth){

  $scope.access = { op: "seguridadLogin", User: "", Password: "" };

  $scope.login = function(){

    $http({ method : 'POST', url : 'api/rest.php', data : $.param($scope.access), headers : { 'Content-Type': 'application/x-www-form-urlencoded' } })
    .success(function(data){

      if(data == 'Error'){

        var msg = ngToast.create({
          content: 'Usuario o Password no valido',
          className:	'danger'
        });
        console.warn("Login Failed");

      }else{

        console.info("Login Done");

        //cookies everywhere
        $scope.LoginFactory = auth;
        $scope.LoginFactory.user = $cookies.usuariocookie = data[0].usuario;
        $scope.LoginFactory.profile = $cookies.perfilcookie = data[0].perfil;
        $scope.LoginFactory.profileID = $cookies.perfilesIdcookie = data[0].perfilesId;

        $location.path('dashboard');
        console.log(data);
      }

    })
    .error(function(data){
      var msg = ngToast.create({
        content: 'Opps!, Algo salio mal intenta otra vez',
        className:	'danger'
      });
      console.error("Login >>> error");
    })
  };

});

// Dashboard Controller

app.controller('DashboardCtrl', function($scope, ngToast, auth){

  var myname = $scope.status = auth.user;
  ngToast.create('Bienvenido a Camu ' + myname);

  //ngToast.dismiss();

});

// Services Controller

app.controller('ServicesCtrl', function($scope, $http, ngToast){

  $scope.getListaServicios = { op: "2" };

  $http({
    method : 'POST',
    url : 'api/rest.php',
    data : $.param($scope.getListaServicios),
    headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
  .success(function(data){

    $scope.getServices = data;
    console.log(data);

  })
  .error(function(data){
    var msg = ngToast.create({
      content: 'Opps!, Algo salio mal intenta otra vez',
      className:	'danger'
    });
  })

});

// Users Controller

app.controller("UsersCtrl", function($scope, $http, $modal, $modalStack, ngToast, auth){

  $http({
    method : 'POST',
    url : 'api/rest.php',
    data : $.param($scope.getUsersList = { op: "listaUsuario", servicioId: "0", skillId: "0", perfilId: "0" }),
    headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
  .success(function(data){
    $scope.getUsers = data;
  })
  .error(function(data){
    var msg = ngToast.create({
      content: 'Opps!, Algo salio mal intenta otra vez',
      className:	'danger'
    });
    console.error("All Users >>> Oops");
  })

  // Create/Modal/Settings/Roles Users

  var myid = $scope.status = auth.profileID;

  if(myid == 1){
    $scope.roloptions = [
      { name: 'SuperAdmin2', value: '1' },
      { name: 'Administrador', value: '2' },
      { name: 'TAM LN', value: '3' },
      { name: 'Gerente', value: '4' },
      { name: 'Supervisor', value: '5' },
      { name: 'BackOffice', value: '6' },
      { name: 'Agente', value: '7' }
    ];
  }else if(myid == 2){
    $scope.roloptions = [
      { name: 'Administrador', value: '2' },
      { name: 'TAM LN', value: '3' },
      { name: 'Gerente', value: '4' },
      { name: 'Supervisor', value: '5' },
      { name: 'BackOffice', value: '6' },
      { name: 'Agente', value: '7' }
    ];
  }
  else if(myid == 3){
    $scope.roloptions = [
      { name: 'TAM LN', value: '3' },
      { name: 'Gerente', value: '4' },
      { name: 'Supervisor', value: '5' },
      { name: 'BackOffice', value: '6' },
      { name: 'Agente', value: '7' }
    ];
  }
  else if(myid == 4){
    $scope.roloptions = [
      { name: 'Gerente', value: '4' },
      { name: 'Supervisor', value: '5' },
      { name: 'BackOffice', value: '6' },
      { name: 'Agente', value: '7' }
    ];
  }
  else if(myid == 5){
    $scope.roloptions = [
      { name: 'Supervisor', value: '5' },
      { name: 'BackOffice', value: '6' },
      { name: 'Agente', value: '7' }
    ];
  }
  else if(myid == 6){
    $scope.roloptions = [
      { name: 'BackOffice', value: '6' },
      { name: 'Agente', value: '7' }
    ];
  }
  else if(myid == 7){
    $scope.roloptions = [
      { name: 'Agente', value: '7' }
    ];
  }
  else{
    var msg = ngToast.create({
      content: 'Alerta , No puedes crear Usuarios',
      className:	'warning'
    });
  }


  $scope.addU = { op: "mantUsuarios", Id: "0", Nombre: "", Apellidos: "", User: "", Password: "", perfilId: "", Sexo: "", Activo: "", UserModificacion: myid };

  $scope.CreateUser = function(){

    var modalInstance = $modal.open({
      templateUrl: 'ModalCreate.html',
      controller: 'UsersCtrl'
    });

  };

  // Add User

  $scope.AddUsers = function(){

    $http({
      method: 'POST',
      url: 'api/rest.php',
      data: $.param($scope.addU),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){

      var user_checked = angular.isNumber(data[0].Column1);

      if(user_checked == true){

        $modalStack.dismissAll();
        ngToast.create('El Usuario fue creado con exito');

      }else{
        var msg = ngToast.create({
          content: 'Error, EL usuario no fue creado',
          className:	'danger'
        });
        return;
      }

    })
    .error(function(data){
      var msg = ngToast.create({
        content: 'Opps!, Algo salio mal intenta otra vez',
        className:	'danger'
      });
    })

  };

  // Edit User

  $scope.openedit = function (usuariosId) {

    var modalInstance = $modal.open({
      templateUrl: 'ModalEdit.html',
      controller: 'ModalInstanceCtrl',
      resolve: {
        fifi: function () {
          return $scope.fifi = usuariosId;
        }
      }
    });

  };

  $scope.EditUser = function(usuariosId){

      //alert(usuariosId);
      //console.log("fuaaaa", usuariosId);


      /*
      $scope.subF = 0;
      var subcasesface = u1;

      $http({
        method: 'POST',
        url: 'api/rest.php',
        data: $.param($scope.findInfoT = { op: 'getHistorialCasoFb', caseID: subcasesface }),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
      .success(function(data, status){
        $scope.subF = 1;
        $scope.subcaseF = data;
        console.info("Get Sub Cases Facebook >>>", status);
      })
      .error(function(data, status){
        console.error("Get Sub Cases Facebook >>>", status, "Oops!");
      })
      */
  };

  $scope.EraseUser = function() {

    var msg = ngToast.create({
      content: 'No puedes Eliminar Usuarios',
      className:	'danger'
    });

  };

  $scope.cancel = function () {
    $modalStack.dismiss('cancel');
  };

});

app.controller('ModalInstanceCtrl', function ($scope, $modalInstance, fifi) {

  $scope.fifi = fifi;

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

});

//Centers Controller

app.controller('CentersCtrl', function($scope, $http, ngToast){

  $scope.getListCanales = { op: "listaCentros" };

  $http({
    method : 'POST',
    url : 'api/rest.php',
    data : $.param($scope.getListCanales),
    headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
  .success(function(data){

    $scope.getChannels = data;
    console.log(data);

  })
  .error(function(data){
    var msg = ngToast.create({
      content: 'Opps!, Algo salio mal intenta otra vez',
      className:	'danger'
    });
  })

});

//Channels Controller

app.controller('ChannelsCtrl', function($scope, $http, $modal, $modalStack, ngToast, auth){

  $http({
    method : 'POST',
    url : 'api/rest.php',
    data : $.param($scope.getListChannels = { op: "listaCanales", Canal: "", Activo: "" }),
    headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
  .success(function(data){
    $scope.getChannels = data;
  })
  .error(function(data){

    var msg = ngToast.create({
      content: 'Opps!, Algo salio mal intenta otra vez',
      className:	'danger'
    });

  })

  //Modal, Create, Edit

  var myid = $scope.status = auth.profileID;

  $scope.CreateChannel = function(){

    var modalInstance = $modal.open({
      templateUrl: 'ModalCreate.html',
      controller: 'ChannelsCtrl'
    });

  };

  $scope.addCha = { op: "mantCanales", Id: "0", Canal: "", Activo: "", UserId: myid };

  $scope.AddChannel = function(){

    $http({
      method: 'POST',
      url: 'api/rest.php',
      data: $.param($scope.addCha),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){

      var channel_checked = angular.isNumber(data[0].Column1);

      if(channel_checked == true){

        $modalStack.dismissAll();
        ngToast.create('El Canal fue creado con exito');

      }else{
        var msg = ngToast.create({
          content: 'Error, EL Canal no fue creado',
          className:	'danger'
        });
        return;
      }

    })
    .error(function(data){
      var msg = ngToast.create({
        content: 'Opps!, Algo salio mal intenta otra vez',
        className:	'danger'
      });
    })

  };


});
