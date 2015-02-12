'use strict';

/*
* @ngdoc function
* @name app webapp.Directives:Main
* @description
* # Main
* Directives of the app
*/

app.factory("taskStorage", function() {
  var DEMO_TASKS, STORAGE_ID;
  return STORAGE_ID = "tasks", DEMO_TASKS = '[ {"title": "Finish homework", "completed": true}, {"title": "Make a call", "completed": true}, {"title": "Build a snowman!", "completed": false}, {"title": "Tango! Tango! Tango!", "completed": false}, {"title": "Play games with friends", "completed": false}, {"title": "Shopping", "completed": false}, {"title": "One more dance", "completed": false}, {"title": "Try Google glass", "completed": false} ]', {
    get: function() {
      return JSON.parse(localStorage.getItem(STORAGE_ID) || DEMO_TASKS)
    },
    put: function(tasks) {
      return localStorage.setItem(STORAGE_ID, JSON.stringify(tasks))
    }
  }
});

app.directive("i18n", function(localize) {
  var i18nDirective;
  return i18nDirective = {
    restrict: "EA",
    updateText: function(ele, input, placeholder) {
      var result;
      return result = void 0, "i18n-placeholder" === input ? (result = localize.getLocalizedString(placeholder), ele.attr("placeholder", result)) : input.length >= 1 ? (result = localize.getLocalizedString(input), ele.text(result)) : void 0
    },
    link: function(scope, ele, attrs) {
      return scope.$on("localizeResourcesUpdated", function() {
        return i18nDirective.updateText(ele, attrs.i18n, attrs.placeholder)
      }), attrs.$observe("i18n", function(value) {
        return i18nDirective.updateText(ele, value, attrs.placeholder)
      })
    }
  }
});

app.directive("customBackground", function() {
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
          case "/pages/signin":
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

});

app.directive("toggleMinNav", function($rootScope) {
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
});

app.directive("collapseNav", function() {
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
});

app.directive("highlightActive", function() {
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
});

app.directive("toggleOffCanvas", function() {
  return {
    restrict: "A",
    link: function(scope, ele) {
      return ele.on("click", function() {
        return $("#app").toggleClass("on-canvas")
      })
    }
  }
});

app.directive("slimScroll", function() {
  return {
    restrict: "A",
    link: function(scope, ele, attrs) {
      return ele.slimScroll({
        height: attrs.scrollHeight || "100%"
      })
    }
  }
});

app.directive("goBack", function() {
  return {
    restrict: "A",
    controller: ["$scope", "$element", "$window", function($scope, $element, $window) {
      return $element.on("click", function() {
        return $window.history.back()
      })
    }]
  }
});
