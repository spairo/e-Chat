/**
* @ngdoc overview
* @name CamuApp
* @description CamuApp 2.0
* @created By Atento
* # CamuApp
*
* Main module of the application.
*/
'use strict';

var app = angular.module("app",
  [
    "ui.router",
    "ngSanitize",
    "ngAnimate",
    "ui.bootstrap",
    "ngCookies",
    "ngToast",
    "treeControl",
    "angular-loading-bar",
    "dialogs.main"
  ]
)

app.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider

    .state('pages/blank', {
      url: '/pages/blank',
      templateUrl: 'views/pages/blank.html',
    })
    .state('pages/grid', {
      url: '/pages/grid',
      templateUrl: 'views/pages/grid.html',
    })
    .state('signin', {
      url: '/signin',
      templateUrl: 'views/signin.html',
    })
    .state('dashboard', {
      url: '/dashboard',
      templateUrl: 'views/dashboard.html',
    })
    .state('catalogs/services', {
      url: '/catalogs/services',
      templateUrl: 'views/services.html',
    })
    .state('catalogs/profiles', {
      url: '/catalogs/profiles',
      templateUrl: 'views/profiles.html',
    })
    .state('catalogs/users', {
      url: '/catalogs/users',
      templateUrl: 'views/users.html',
    })
    .state('catalogs/centers', {
      url: '/catalogs/centers',
      templateUrl: 'views/centers.html',
    })
    .state('catalogs/channels', {
      url: '/catalogs/channels',
      templateUrl: 'views/channels.html',
    })
    .state('catalogs/business', {
      url: '/catalogs/business',
      templateUrl: 'views/channels.html',
    })
    .state('catalogs/clients', {
      url: '/catalogs/clients',
      templateUrl: 'views/clients.html',
    })
    .state('catalogs/bases', {
      url: '/catalogs/bases',
      templateUrl: 'views/bases.html',
    })
    .state('catalogs/skills', {
      url: '/catalogs/skills',
      templateUrl: 'views/skills.html',
    })
    .state('typing', {
      url: '/typing',
      templateUrl: 'views/typing.html',
    })

       //Multi Typing

       .state('typing.lines', {
           url: '/lines',
           templateUrl: 'views/typing-line.html'
       })
       .state('typing.customers', {
           url: '/customers',
           templateUrl: 'views/typing-customers.html'
       })
       .state('typing.services', {
           url: '/services',
           templateUrl: 'views/typing-services.html'
       })
       .state('typing.channels', {
           url: '/channels',
           templateUrl: 'views/typing-channels.html'
      })

    .state('bases', {
      url: '/bases',
      templateUrl: 'views/bases/bases.html',
    })

       //Multi Bases

       .state('bases.lines', {
           url: '/lines',
           templateUrl: 'views/bases/bases-line.html'
       })
       .state('bases.clients', {
           url: '/clients',
           templateUrl: 'views/bases/bases-clients.html'
       })
       .state('bases.services', {
           url: '/services',
           templateUrl: 'views/bases/bases-services.html'
       })
       .state('bases.channels', {
           url: '/channels',
           templateUrl: 'views/bases/bases-channels.html'
       })
       .state('bases.skills', {
           url: '/skills',
           templateUrl: 'views/bases/bases-skills.html'
       })
       .state('bases.bases', {
           url: '/bases/bases',
           templateUrl: 'views/bases/bases-bases.html'
       });

    // catch all route
    $urlRouterProvider.otherwise('/signin');
})

app.config(['ngToastProvider', function(ngToast){
    ngToast.configure({
      verticalPosition: 'top',
      horizontalPosition: 'right',
      maxNumber: 6
    });
}]);
