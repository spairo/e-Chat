'use strict';

/*
* @ngdoc function
* @name grtd webapp.controller:MainCtrl
* @description
* # MainCtrl
* Controller of the CamuApp
*/

// App Controller

app.controller("AppCtrl", function($scope, $location){

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
    return path = $location.path(), _.contains(["/404", "/pages/500", "/signin", "/pages/signin"], path)
  }, $scope.main = {
    brand: "e-Chat Dash",
    name: "Master"
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

app.controller('LoginCtrl', function($scope, $http, $location) {

  $scope.access = { op: "Login", User: "", Password: "" };

  $scope.login = function(){

    $http({ method : 'POST', url : 'api/rest.php', data : $.param($scope.access), headers : { 'Content-Type': 'application/x-www-form-urlencoded' } })
    .success(function(data){

      $scope.fer = data;

      if(data != 'Error'){

        $location.path('dashboard');
        console.info("Entro");

      }else{

        $scope.fer = data;
        console.error("No entro");
        //location.path('dashboard');
      }

    })
    .error(function(data){
      console.info("Login >>> error");
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

app.controller("UsersCtrl", function($scope, $location){

});
