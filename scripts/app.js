/*
* @ngdoc overview
* @name CamuApp
* @description CamuApp 2.0
* @created By Atento
* # CamuApp
*
* Main module of the application.
*/

'use strict';

var app = angular.module('app', ["ui.router", "ngAnimate", "ui.bootstrap"]);

app.config(function($stateProvider, $urlRouterProvider){

  $stateProvider
  .state('login', {
    url: '/login',
    templateUrl: 'views/login.html',
  })
  .state('dashboard', {
    url: '/dashboard',
    templateUrl: 'views/dashboard.html',
  })
  .state('signin', {
    url: '/pages/signin',
    templateUrl: 'views/pages/signin.html',
  })
  //default
  $urlRouterProvider.otherwise('/login');

});

/*
angular.module("app", ["ngRoute", "ui.router", "ngAnimate", "ui.bootstrap", "app.controllers", "app.directives", "app.task", "app.localization"])

  .config(["$routeProvider", function($routeProvider) {

      return $routeProvider.when("/", {
        redirectTo: "/dashboard"
      })
      .when("/dashboard", {
        templateUrl: "views/dashboard.html"
      })
      .when("/pages/signin", {
        templateUrl: "views/pages/signin.html"
      })
      .when("/pages/blank", {
        templateUrl: "views/pages/blank.html"
      })
      .when('catalogs/services',{
        templateUrl: 'views/services.html'
      })
      .otherwise({
        redirectTo: "/pages/signin"
      })

  }])
*/
