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
    return path = $location.path(), _.contains(["/404", "/signin"], path)
  }, $scope.main = {
    brand: "Camu Dash"
  }


});

//Header Controller

app.controller("HeaderCtrl", function($scope, $location, $cookies){

  $scope.logout = function(){

    delete $cookies["usuariocookie"];
    delete $cookies["perfilcookie"];
    delete $cookies["perfilesIdcookie"];

    $location.path('signin');

  };

});

// Nav Controller

app.controller("NavCtrl", function($scope, $rootScope, $timeout, taskStorage, filterFilter, auth, resources_POST){

  //Menu
  /*
  $scope.LoginFactory = auth;
  $scope.LoginFactory.user = "test1";
  $scope.LoginFactory.profile = "test2";
  $scope.LoginFactory.profileID = "test3";
  $scope.LoginFactory.passw = "test4";
*/

  //windows ready
  /*
  $scope.init = function(){

    var user = $scope.status = auth.user;
    var passw = $scope.status = auth.passw;

    $scope.parameters = { User: user, Password: passw };
    $scope.option = "rp_seguridadLogin";

    resources_POST.post($scope.option, $scope.parameters)
    .then(function(data){

      $scope.Menus = data;
      console.log("soy el menu", data);

    })
    .catch(function(data, status){
      var msg = ngToast.create({
        content: 'Opps!, Algo salio mal intenta otra vez',
        className:  'danger'
      });
    })
    .finally(function(){
      //console.log("Finaliza llamada a resources_GET");
    });


  };
  */
  /*

  $timeout(function(){

      var user = $scope.status = auth.user;
      var passw = $scope.status = auth.passw;


      $scope.parameters = { User: user, Password: passw };
      $scope.option = "rp_seguridadLogin";

      resources_POST.post($scope.option, $scope.parameters)
      .then(function(data){

        $scope.Menus = data;
        console.log("soy el menu", data);

      })
      .catch(function(data, status){
        var msg = ngToast.create({
          content: 'Opps!, Algo salio mal intenta otra vez',
          className:  'danger'
        });
      })
      .finally(function(){
        //console.log("Finaliza llamada a resources_GET");
      });

   }, 3000);
   */
  var tasks;
  return tasks = $scope.tasks = taskStorage.get(), $scope.taskRemainingCount = filterFilter(tasks, {
    completed: !1
  }).length, $scope.$on("taskRemaining:changed", function(event, count) {
    return $scope.taskRemainingCount = count
  })

});

app.controller("Nav2Ctrl", function($scope, $rootScope, $timeout, taskStorage, filterFilter, auth, resources_POST){

    $scope.LoginFactory = auth;
    $scope.LoginFactory.user = "test1";
    $scope.LoginFactory.profile = "test2";
    $scope.LoginFactory.profileID = "test3";
    $scope.LoginFactory.passw = "test4";

    $timeout(function(){

        var user = $scope.status = auth.user;
        var passw = $scope.status = auth.passw;


        $scope.parameters = { User: user, Password: passw };
        $scope.option = "rp_seguridadLogin";

        resources_POST.post($scope.option, $scope.parameters)
        .then(function(data){

          $scope.Menus = data;
          console.log("soy el menu", data);

        })
        .catch(function(data, status){
          var msg = ngToast.create({
            content: 'Opps!, Algo salio mal intenta otra vez',
            className:  'danger'
          });
        })
        .finally(function(){
          //console.log("Finaliza llamada a resources_GET");
        });

     }, 3000);

});

// Login Controller

app.controller('LoginCtrl', function($scope, $rootScope, $http, $location, $cookies, ngToast, auth, resources_POST){


  $scope.parameters = { User: "master", Password: "master" };
  $scope.option = "rp_seguridadLogin";

  $scope.login = function(){

    resources_POST.post($scope.option, $scope.parameters)
    .then(function(data){

      if(data == ''){

        var msg = ngToast.create({
          content: 'Usuario o Password no valido',
          className:  'danger'
        });

      }
      else{

        //cookies everywhere
        $scope.LoginFactory = auth;
        $scope.LoginFactory.user = $cookies.usuariocookie = data[0].usuario;
        $scope.LoginFactory.profile = $cookies.perfilcookie = data[0].perfil;
        $scope.LoginFactory.profileID = $cookies.perfilesIdcookie = data[0].perfilesId;
        $scope.LoginFactory.passw = $cookies.perfilesIdcookie = data[0].password;

        $location.path('dashboard');
        console.log("enter", data);

      }
    })
    .catch(function(data, status){
      var msg = ngToast.create({
        content: 'Opps!, Algo salio mal intenta otra vez',
        className:  'danger'
      });
    })
    .finally(function(data){
      //console.log("Finaliza llamada a resources_GET");
    });
  };

});

// Dashboard Controller

app.controller('DashboardCtrl', function($scope, ngToast, auth, resources_POST){

  var myname = $scope.status = auth.user;
  ngToast.create('Bienvenido a Camu ' + myname);
  //ngToast.dismiss();


      var user = $scope.status = auth.user;
      var passw = $scope.status = auth.passw;

      $scope.parameters = { User: user, Password: passw };
      $scope.option = "rp_seguridadLogin";

      resources_POST.post($scope.option, $scope.parameters)
      .then(function(data){

        $scope.Menus = data;
        console.log("soy el menu", data);

      })
      .catch(function(data, status){
        var msg = ngToast.create({
          content: 'Opps!, Algo salio mal intenta otra vez',
          className:  'danger'
        });
      })
      .finally(function(){
        //console.log("Finaliza llamada a resources_GET");
      });

});
