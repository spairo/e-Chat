'use strict';

/*
* @ngdoc function
* @name grtd webapp.controller:MainCtrl
* @description
* # MainCtrl
* Controller of the CamuApp
*/

// Main Controller

(function() {
  "use strict";


}).call(this),

  function() {
    "use strict";

    angular.module("app.page.ctrls", []).controller("invoiceCtrl", ["$scope", "$window", function($scope) {

      return $scope.printInvoice = function() {
        var originalContents, popupWin, printContents;
        return printContents = document.getElementById("invoice").innerHTML, originalContents = document.body.innerHTML, popupWin = window.open(), popupWin.document.open(), popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="styles/main.css" /></head><body onload="window.print()">' + printContents + "</html>"), popupWin.document.close()
      }

    }])

  }.call(this),

  function() {

    angular.module("app.directives", []).directive("imgHolder", [function() {
      return {
        restrict: "A",
        link: function(scope, ele) {
          return Holder.run({
            images: ele[0]
          })
        }
      }
    }]).directive("customBackground", function() {
      return {
        restrict: "A",
        controller: ["$scope", "$element", "$location", function($scope, $element, $location) {
          var addBg, path;
          return path = function() {
            return $location.path()
          }, addBg = function(path) {
            switch ($element.removeClass("body-home body-special body-tasks body-lock"), path) {
              case "/":
                return $element.addClass("body-home");
                case "/404":
                  case "/pages/500":
                    case "/":
                      case "/pages/signup":
                        case "/pages/forgot":
                          return $element.addClass("body-special");
                          case "/pages/lock-screen":
                            return $element.addClass("body-special body-lock");
                            case "/tasks":
                              return $element.addClass("body-tasks")
                            }
                          }, addBg($location.path()), $scope.$watch(path, function(newVal, oldVal) {
                            return newVal !== oldVal ? addBg($location.path()) : void 0
                          })
                        }]
                      }
                    }).directive("uiColorSwitch", [function() {
                      return {
                        restrict: "A",
                        link: function(scope, ele) {
                          return ele.find(".color-option").on("click", function(event) {
                            var $this, hrefUrl, style;
                            if ($this = $(this), hrefUrl = void 0, style = $this.data("style"), "loulou" === style) hrefUrl = "styles/main.css", $('link[href^="styles/main"]').attr("href", hrefUrl);
                            else {
                              if (!style) return !1;
                              style = "-" + style, hrefUrl = "styles/main" + style + ".css", $('link[href^="styles/main"]').attr("href", hrefUrl)
                            }
                            return event.preventDefault()
                          })
                        }
                      }
                    }]).directive("toggleMinNav", ["$rootScope", function($rootScope) {
                      return {
                        restrict: "A",
                        link: function(scope, ele) {
                          var $content, $nav, $window, Timer, app, updateClass;
                          return app = $("#app"), $window = $(window), $nav = $("#nav-container"), $content = $("#content"), ele.on("click", function(e) {
                            return app.hasClass("nav-min") ? app.removeClass("nav-min") : (app.addClass("nav-min"), $rootScope.$broadcast("minNav:enabled")), e.preventDefault()
                          }), Timer = void 0, updateClass = function() {
                            var width;
                            return width = $window.width(), 768 > width ? app.removeClass("nav-min") : void 0
                          }, $window.resize(function() {
                            var t;
                            return clearTimeout(t), t = setTimeout(updateClass, 300)
                          })
                        }
                      }
                    }]).directive("collapseNav", [function() {
                      return {
                        restrict: "A",
                        link: function(scope, ele) {
                          var $a, $aRest, $lists, $listsRest, app;
                          return $lists = ele.find("ul").parent("li"), $lists.append('<i class="fa fa-caret-right icon-has-ul"></i>'), $a = $lists.children("a"), $listsRest = ele.children("li").not($lists), $aRest = $listsRest.children("a"), app = $("#app"), $a.on("click", function(event) {
                            var $parent, $this;
                            return app.hasClass("nav-min") ? !1 : ($this = $(this), $parent = $this.parent("li"), $lists.not($parent).removeClass("open").find("ul").slideUp(), $parent.toggleClass("open").find("ul").stop().slideToggle(), event.preventDefault())
                          }), $aRest.on("click", function() {
                            return $lists.removeClass("open").find("ul").slideUp()
                          }), scope.$on("minNav:enabled", function() {
                            return $lists.removeClass("open").find("ul").slideUp()
                          })
                        }
                      }
                    }]).directive("highlightActive", [function() {
                      return {
                        restrict: "A",
                        controller: ["$scope", "$element", "$attrs", "$location", function($scope, $element, $attrs, $location) {
                          var highlightActive, links, path;
                          return links = $element.find("a"), path = function() {
                            return $location.path()
                          }, highlightActive = function(links, path) {
                            return path = "#" + path, angular.forEach(links, function(link) {
                              var $li, $link, href;
                              return $link = angular.element(link), $li = $link.parent("li"), href = $link.attr("href"), $li.hasClass("active") && $li.removeClass("active"), 0 === path.indexOf(href) ? $li.addClass("active") : void 0
                            })
                          }, highlightActive(links, $location.path()), $scope.$watch(path, function(newVal, oldVal) {
                            return newVal !== oldVal ? highlightActive(links, $location.path()) : void 0
                          })
                        }]
                      }
                    }]).directive("toggleOffCanvas", [function() {
                      return {
                        restrict: "A",
                        link: function(scope, ele) {
                          return ele.on("click", function() {
                            return $("#app").toggleClass("on-canvas")
                          })
                        }
                      }
                    }]).directive("goBack", [function() {
                      return {
                        restrict: "A",
                        controller: ["$scope", "$element", "$window", function($scope, $element, $window) {
                          return $element.on("click", function() {
                            return $window.history.back()
                          })
                        }]
                      }
                    }])
  }.call(this),

////
  function() {

    "use strict";

    angular.module("app.controllers", []).controller("AppCtrl", ["$scope", "$location", function($scope, $location) {

      return $scope.isSpecificPage = function() {
        var path;
        return path = $location.path(), _.contains(["/404", "/pages/500", "/pages/login", "/pages/signin"], path)

      }, $scope.main = { // default vars
        brand: "e-Chat",
        name: "Agente 1"
      }

    }])
    .controller("NavCtrl", ["$scope", function($scope) {


    }])
    .controller("DashboardCtrl", ["$scope", function() {

    }])
    .controller("FooCtrl", ["$scope", function() {

    	alert("soy foo controller");

    }])
    .controller("LoginCtrl", ["$scope", function() {

		    $scope.access = { op: "Login", User: "", Password: "" };

        $scope.login = function(){

          $http({
            method : 'POST',
            url : 'api/rest.php',
            data : $.param($scope.access),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
          })
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

    }])
  }.call(this);
