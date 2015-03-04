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

  /*******/

  /*$scope.$on('$locationChangeStart', function(event) {

    var answer = confirm("Are you sure you want to leave this page?");

    if (!answer) {
      event.preventDefault();
    }
  });*/

  /*******/

  return $scope.isSpecificPage = function(){
    var path;
    return path = $location.path(), _.contains(["/404", "/pages/500", "/signin"], path)
  }, $scope.main = {
    brand: "e-Chat Dash"
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

app.controller('DashboardCtrl', function($scope){});

// Services Controller

app.controller('ServicesCtrl', function($scope, $http){

    $scope.getSerDef = { op: "getServicesDef", serviceId: "MLSegurosUniversal" };

    $http({ method : 'POST', url : 'api/rest.php', data : $.param($scope.getSerDef), headers : { 'Content-Type': 'application/x-www-form-urlencoded' } })
    .success(function(data){
      $scope.loading = false;
      $scope.getAllServiceDef = data;
      console.info('All Services Ok');
    })
    .error(function(data){
      console.error("All Services >>> Oops");
    })

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
