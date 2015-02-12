'use strict';

/*
* @ngdoc function
* @name grtd webapp.controller:MainCtrl
* @description
* # MainCtrl
* Controller of the CamuApp
*/

// Main Controller

app.controller('MainCtrl', function($scope, $location){

  //Mobile
  $scope.navbarCollapsed = true;

  // path
  $scope.currentPath = $location.path();

});

app.controller("DashboardCtrl", function($scope, $location){

});

app.controller("AppCtrl", function($scope, $location) {

  return $scope.isSpecificPage = function() {
    var path;
    return path = $location.path(), _.contains(["/404", "/pages/500", "/pages/login", "/pages/signin", "/pages/signin1", "/pages/signin2", "/pages/signup", "/pages/signup1", "/pages/signup2", "/pages/forgot", "/pages/lock-screen"], path)
  }, $scope.main = {
    brand: "e-Chat",
    name: "Agente 1"
  }

});

app.controller("NavCtrl", function($scope, taskStorage, filterFilter) {

  var tasks;
  return tasks = $scope.tasks = taskStorage.get(), $scope.taskRemainingCount = filterFilter(tasks, {
    completed: !1
  }).length, $scope.$on("taskRemaining:changed", function(event, count) {
    return $scope.taskRemainingCount = count
  })

});
