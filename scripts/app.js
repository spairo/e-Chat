'use strict';

/**
* @ngdoc overview
* @name CamuApp
* @description CamuApp 2.0
* @created By Atento
* # CamuApp
*
* Main module of the application.
*/

var app = angular.module("app", ["ngRoute", "ngSanitize", "ngAnimate", "ui.bootstrap", "ngCookies", "ngToast", "angular-loading-bar", "ngMaterial"])

app.config(["$routeProvider", function($routeProvider) {

      return $routeProvider.when("/", {
        redirectTo: "/signin"
      })
      .when("/signin", {
        templateUrl: "views/signin.html"
      })
      .when("/dashboard", {
        templateUrl: "views/dashboard.html"
      })
      .when("/pages/blank", {
        templateUrl: "views/pages/blank.html"
      })
      .when('/catalogs/services',{
        templateUrl: 'views/services.html'
      })
      .when('/catalogs/users',{
        templateUrl: 'views/users.html'
      })
      .otherwise({
        redirectTo: "/signin"
      })

}]);

app.config(['ngToastProvider', function(ngToast) {
    ngToast.configure({
      verticalPosition: 'top',
      horizontalPosition: 'right',
      maxNumber: 6
    });
}]);
