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

//Header Controller

app.controller("HeaderCtrl", function($scope, $location, $cookies){

  $scope.logout = function(){

    //$cookies.remove("usuariocookie");
    //$cookies.remove("perfilcookie");
    //$cookies.remove("perfilesIdcookie");
    $location.path('signin');

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
    })
  };

});

// Dashboard Controller

app.controller('DashboardCtrl', function($scope, ngToast, auth){

  var myname = $scope.status = auth.user;
  ngToast.create('Bienvenido a Camu ' + myname);
  //ngToast.dismiss();

});