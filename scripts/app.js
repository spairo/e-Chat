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

'use strict';

  angular.module("app", ["ngRoute", "ui.router", "ngAnimate", "ui.bootstrap", "easypiechart", "mgo-angular-wizard", "textAngular", "ui.tree", "ngMap", "ngTagsInput", "app.ui.ctrls", "app.ui.directives", "app.ui.services", "app.controllers", "app.directives", "app.form.validation", "app.ui.form.ctrls", "app.ui.form.directives", "app.tables", "app.map", "app.task", "app.localization", "app.chart.ctrls", "app.chart.directives", "app.page.ctrls"]).config(["$routeProvider", function($routeProvider) {
      
      return $routeProvider.when("/", {
        redirectTo: "/dashboard"
      }).when("/dashboard", {
        templateUrl: "views/dashboard.html"
      }).when("/pages/signin", {
        templateUrl: "views/pages/signin.html"
      }).when("/pages/blank", {
        templateUrl: "views/pages/blank.html"
      }).otherwise({
        redirectTo: "/pages/signin"
      })
      
  }])
