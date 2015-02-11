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
  angular.module("app.chart.ctrls", []).controller("chartCtrl", ["$scope", function($scope) {
    return $scope.easypiechart = {
      percent: 65,
      options: {
        animate: {
          duration: 1e3,
          enabled: !0
        },
        barColor: "#31C0BE",
        lineCap: "round",
        size: 180,
        lineWidth: 5
      }
    }, $scope.easypiechart2 = {
      percent: 35,
      options: {
        animate: {
          duration: 1e3,
          enabled: !0
        },
        barColor: "#66B5D7",
        lineCap: "round",
        size: 180,
        lineWidth: 10
      }
    }, $scope.easypiechart3 = {
      percent: 68,
      options: {
        animate: {
          duration: 1e3,
          enabled: !0
        },
        barColor: "#60CD9B",
        lineCap: "square",
        size: 180,
        lineWidth: 20,
        scaleLength: 0
      }
    }, $scope.gaugeChart1 = {
      data: {
        maxValue: 3e3,
        animationSpeed: 40,
        val: 1375
      },
      options: {
        lines: 12,
        angle: 0,
        lineWidth: .47,
        pointer: {
          length: .6,
          strokeWidth: .03,
          color: "#000000"
        },
        limitMax: "false",
        colorStart: "#A3C86D",
        colorStop: "#A3C86D",
        strokeColor: "#E0E0E0",
        generateGradient: !0,
        percentColors: [
          [0, "#60CD9B"],
          [1, "#60CD9B"]
        ]
      }
    }, $scope.gaugeChart2 = {
      data: {
        maxValue: 3e3,
        animationSpeed: 45,
        val: 1200
      },
      options: {
        lines: 12,
        angle: 0,
        lineWidth: .47,
        pointer: {
          length: .6,
          strokeWidth: .03,
          color: "#464646"
        },
        limitMax: "true",
        colorStart: "#7ACBEE",
        colorStop: "#7ACBEE",
        strokeColor: "#F1F1F1",
        generateGradient: !0,
        percentColors: [
          [0, "#66B5D7"],
          [1, "#66B5D7"]
        ]
      }
    }, $scope.gaugeChart3 = {
      data: {
        maxValue: 3e3,
        animationSpeed: 50,
        val: 1100
      },
      options: {
        lines: 12,
        angle: 0,
        lineWidth: .47,
        pointer: {
          length: .6,
          strokeWidth: .03,
          color: "#464646"
        },
        limitMax: "true",
        colorStart: "#FF7857",
        colorStop: "#FF7857",
        strokeColor: "#F1F1F1",
        generateGradient: !0,
        percentColors: [
          [0, "#E87352"],
          [1, "#E87352"]
        ]
      }
    }
  }]).controller("flotChartCtrl.realtime", ["$scope", function() {}]).controller("sparklineCtrl", ["$scope", function($scope) {

  }])
}).call(this),
  function() {
    "use strict";
    angular.module("app.chart.directives", []).directive("gaugeChart", [function() {
      return {
        restrict: "A",
        scope: {
          data: "=",
          options: "="
        },
        link: function(scope, ele) {
          var data, gauge, options;
          return data = scope.data, options = scope.options, gauge = new Gauge(ele[0]).setOptions(options), gauge.maxValue = data.maxValue, gauge.animationSpeed = data.animationSpeed, gauge.set(data.val)
        }
      }
    }]).directive("flotChart", [function() {
      return {
        restrict: "A",
        scope: {
          data: "=",
          options: "="
        },
        link: function(scope, ele) {
          var data, options, plot;
          return data = scope.data, options = scope.options, plot = $.plot(ele[0], data, options)
        }
      }
    }]).directive("flotChartRealtime", [function() {
      return {
        restrict: "A",
        link: function(scope, ele) {
          var data, getRandomData, plot, totalPoints, update, updateInterval;
          return data = [], totalPoints = 300, getRandomData = function() {
            var i, prev, res, y;
            for (data.length > 0 && (data = data.slice(1)); data.length < totalPoints;) prev = data.length > 0 ? data[data.length - 1] : 50, y = prev + 10 * Math.random() - 5, 0 > y ? y = 0 : y > 100 && (y = 100), data.push(y);
            for (res = [], i = 0; i < data.length;) res.push([i, data[i]]), ++i;
            return res
          }, update = function() {
            plot.setData([getRandomData()]), plot.draw(), setTimeout(update, updateInterval)
          }, data = [], totalPoints = 300, updateInterval = 200, plot = $.plot(ele[0], [getRandomData()], {
            series: {
              lines: {
                show: !0,
                fill: !0
              },
              shadowSize: 0
            },
            yaxis: {
              min: 0,
              max: 100
            },
            xaxis: {
              show: !1
            },
            grid: {
              hoverable: !0,
              borderWidth: 1,
              borderColor: "#eeeeee"
            },
            colors: ["#5BDDDC"]
          }), update()
        }
      }
    }]).directive("sparkline", [function() {
      return {
        restrict: "A",
        scope: {
          data: "=",
          options: "="
        },
        link: function(scope, ele) {
          var data, options, sparkResize, sparklineDraw;
          return data = scope.data, options = scope.options, sparkResize = void 0, sparklineDraw = function() {
            return ele.sparkline(data, options)
          }, $(window).resize(function() {
            return clearTimeout(sparkResize), sparkResize = setTimeout(sparklineDraw, 200)
          }), sparklineDraw()
        }
      }
    }]).directive("morrisChart", [function() {
      return {
        restrict: "A",
        scope: {
          data: "="
        },
        link: function(scope, ele, attrs) {
          var colors, data, func, options;
          switch (data = scope.data, attrs.type) {
            case "line":
              return colors = void 0 === attrs.lineColors || "" === attrs.lineColors ? null : JSON.parse(attrs.lineColors), options = {
                element: ele[0],
                data: data,
                xkey: attrs.xkey,
                ykeys: JSON.parse(attrs.ykeys),
                labels: JSON.parse(attrs.labels),
                lineWidth: attrs.lineWidth || 2,
                lineColors: colors || ["#0b62a4", "#7a92a3", "#4da74d", "#afd8f8", "#edc240", "#cb4b4b", "#9440ed"]
              }, new Morris.Line(options);
            case "area":
              return colors = void 0 === attrs.lineColors || "" === attrs.lineColors ? null : JSON.parse(attrs.lineColors), options = {
                element: ele[0],
                data: data,
                xkey: attrs.xkey,
                ykeys: JSON.parse(attrs.ykeys),
                labels: JSON.parse(attrs.labels),
                lineWidth: attrs.lineWidth || 2,
                lineColors: colors || ["#0b62a4", "#7a92a3", "#4da74d", "#afd8f8", "#edc240", "#cb4b4b", "#9440ed"],
                behaveLikeLine: attrs.behaveLikeLine || !1,
                fillOpacity: attrs.fillOpacity || "auto",
                pointSize: attrs.pointSize || 4
              }, new Morris.Area(options);
            case "bar":
              return colors = void 0 === attrs.barColors || "" === attrs.barColors ? null : JSON.parse(attrs.barColors), options = {
                element: ele[0],
                data: data,
                xkey: attrs.xkey,
                ykeys: JSON.parse(attrs.ykeys),
                labels: JSON.parse(attrs.labels),
                barColors: colors || ["#0b62a4", "#7a92a3", "#4da74d", "#afd8f8", "#edc240", "#cb4b4b", "#9440ed"],
                stacked: attrs.stacked || null
              }, new Morris.Bar(options);
            case "donut":
              return colors = void 0 === attrs.colors || "" === attrs.colors ? null : JSON.parse(attrs.colors), options = {
                element: ele[0],
                data: data,
                colors: colors || ["#0B62A4", "#3980B5", "#679DC6", "#95BBD7", "#B0CCE1", "#095791", "#095085", "#083E67", "#052C48", "#042135"]
              }, attrs.formatter && (func = new Function("y", "data", attrs.formatter), options.formatter = func), new Morris.Donut(options)
          }
        }
      }
    }])
  }.call(this),
  function() {
    "use strict";
    angular.module("app.ui.form.ctrls", []).controller("TagsDemoCtrl", ["$scope", function($scope) {
      return $scope.tags = ["foo", "bar"]
    }]).controller("DatepickerDemoCtrl", ["$scope", function($scope) {
      return $scope.today = function() {
        return $scope.dt = new Date
      }, $scope.today(), $scope.showWeeks = !0, $scope.toggleWeeks = function() {
        return $scope.showWeeks = !$scope.showWeeks
      }, $scope.clear = function() {
        return $scope.dt = null
      }, $scope.disabled = function(date, mode) {
        return "day" === mode && (0 === date.getDay() || 6 === date.getDay())
      }, $scope.toggleMin = function() {
        var _ref;
        return $scope.minDate = null != (_ref = $scope.minDate) ? _ref : {
          "null": new Date
        }
      }, $scope.toggleMin(), $scope.open = function($event) {
        return $event.preventDefault(), $event.stopPropagation(), $scope.opened = !0
      }, $scope.dateOptions = {
        "year-format": "'yy'",
        "starting-day": 1
      }, $scope.formats = ["dd-MMMM-yyyy", "yyyy/MM/dd", "shortDate"], $scope.format = $scope.formats[0]
    }]).controller("TimepickerDemoCtrl", ["$scope", function($scope) {
      return $scope.mytime = new Date, $scope.hstep = 1, $scope.mstep = 15, $scope.options = {
        hstep: [1, 2, 3],
        mstep: [1, 5, 10, 15, 25, 30]
      }, $scope.ismeridian = !0, $scope.toggleMode = function() {
        return $scope.ismeridian = !$scope.ismeridian
      }, $scope.update = function() {
        var d;
        return d = new Date, d.setHours(14), d.setMinutes(0), $scope.mytime = d
      }, $scope.changed = function() {
        return void 0
      }, $scope.clear = function() {
        return $scope.mytime = null
      }
    }])
  }.call(this),
  function() {
    angular.module("app.ui.form.directives", []).directive("uiRangeSlider", [function() {
      return {
        restrict: "A",
        link: function(scope, ele) {
          return ele.slider()
        }
      }
    }]).directive("uiFileUpload", [function() {
      return {
        restrict: "A",
        link: function(scope, ele) {
          return ele.bootstrapFileInput()
        }
      }
    }]).directive("uiSpinner", [function() {
      return {
        restrict: "A",
        compile: function(ele) {
          return ele.addClass("ui-spinner"), {
            post: function() {
              return ele.spinner()
            }
          }
        }
      }
    }]).directive("uiWizardForm", [function() {
      return {
        link: function(scope, ele) {
          return ele.steps()
        }
      }
    }])
  }.call(this),
  function() {
    "use strict";
    angular.module("app.form.validation", []).controller("signinCtrl", ["$scope", function($scope) {

      var original;
      return $scope.user = {
        email: "",
        password: ""
      }, $scope.showInfoOnSubmit = !1, original = angular.copy($scope.user), $scope.revert = function() {
        return $scope.user = angular.copy(original), $scope.form_signin.$setPristine()
      }, $scope.canRevert = function() {
        return !angular.equals($scope.user, original) || !$scope.form_signin.$pristine
      }, $scope.canSubmit = function() {
        return $scope.form_signin.$valid && !angular.equals($scope.user, original)
      }, $scope.submitForm = function() {
        return $scope.showInfoOnSubmit = !0, $scope.revert()
      }

    }])
  }.call(this),
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
    "use strict";
    angular.module("app.ui.ctrls", []).controller("NotifyCtrl", ["$scope", "logger", function($scope, logger) {
      return $scope.notify = function(type) {
        switch (type) {
          case "info":
            return logger.log("Heads up! This alert needs your attention, but it's not super important.");
          case "success":
            return logger.logSuccess("Well done! You successfully read this important alert message.");
          case "warning":
            return logger.logWarning("Warning! Best check yo self, you're not looking too good.");
          case "error":
            return logger.logError("Oh snap! Change a few things up and try submitting again.")
        }
      }
    }]).controller("AlertDemoCtrl", ["$scope", function($scope) {
      return $scope.alerts = [{
        type: "success",
        msg: "Well done! You successfully read this important alert message."
      }, {
        type: "info",
        msg: "Heads up! This alert needs your attention, but it is not super important."
      }, {
        type: "warning",
        msg: "Warning! Best check yo self, you're not looking too good."
      }, {
        type: "danger",
        msg: "Oh snap! Change a few things up and try submitting again."
      }], $scope.addAlert = function() {
        var num, type;
        switch (num = Math.ceil(4 * Math.random()), type = void 0, num) {
          case 0:
            type = "info";
            break;
          case 1:
            type = "success";
            break;
          case 2:
            type = "info";
            break;
          case 3:
            type = "warning";
            break;
          case 4:
            type = "danger"
        }
        return $scope.alerts.push({
          type: type,
          msg: "Another alert!"
        })
      }, $scope.closeAlert = function(index) {
        return $scope.alerts.splice(index, 1)
      }
    }]).controller("ProgressDemoCtrl", ["$scope", function($scope) {
      return $scope.max = 200, $scope.random = function() {
        var type, value;
        value = Math.floor(100 * Math.random() + 10), type = void 0, type = 25 > value ? "success" : 50 > value ? "info" : 75 > value ? "warning" : "danger", $scope.showWarning = "danger" === type || "warning" === type, $scope.dynamic = value, $scope.type = type
      }, $scope.random()
    }]).controller("AccordionDemoCtrl", ["$scope", function($scope) {
      $scope.oneAtATime = !0, $scope.groups = [{
        title: "Dynamic Group Header - 1",
        content: "Dynamic Group Body - 1"
      }, {
        title: "Dynamic Group Header - 2",
        content: "Dynamic Group Body - 2"
      }, {
        title: "Dynamic Group Header - 3",
        content: "Dynamic Group Body - 3"
      }], $scope.items = ["Item 1", "Item 2", "Item 3"], $scope.status = {
        isFirstOpen: !0,
        isFirstOpen1: !0,
        isFirstOpen2: !0,
        isFirstOpen3: !0,
        isFirstOpen4: !0,
        isFirstOpen5: !0,
        isFirstOpen6: !0
      }, $scope.addItem = function() {
        var newItemNo;
        newItemNo = $scope.items.length + 1, $scope.items.push("Item " + newItemNo)
      }
    }]).controller("CollapseDemoCtrl", ["$scope", function($scope) {
      return $scope.isCollapsed = !1
    }]).controller("ModalDemoCtrl", ["$scope", "$modal", "$log", function($scope, $modal, $log) {
      $scope.items = ["item1", "item2", "item3"], $scope.open = function() {
        var modalInstance;
        modalInstance = $modal.open({
          templateUrl: "myModalContent.html",
          controller: "ModalInstanceCtrl",
          resolve: {
            items: function() {
              return $scope.items
            }
          }
        }), modalInstance.result.then(function(selectedItem) {
          $scope.selected = selectedItem
        }, function() {
          $log.info("Modal dismissed at: " + new Date)
        })
      }
    }]).controller("ModalInstanceCtrl", ["$scope", "$modalInstance", "items", function($scope, $modalInstance, items) {
      $scope.items = items, $scope.selected = {
        item: $scope.items[0]
      }, $scope.ok = function() {
        $modalInstance.close($scope.selected.item)
      }, $scope.cancel = function() {
        $modalInstance.dismiss("cancel")
      }
    }]).controller("PaginationDemoCtrl", ["$scope", function($scope) {
      return $scope.totalItems = 64, $scope.currentPage = 4, $scope.maxSize = 5, $scope.setPage = function(pageNo) {
        return $scope.currentPage = pageNo
      }, $scope.bigTotalItems = 175, $scope.bigCurrentPage = 1
    }]).controller("TabsDemoCtrl", ["$scope", function($scope) {
      return $scope.tabs = [{
        title: "Dynamic Title 1",
        content: "Dynamic content 1.  Consectetur adipisicing elit. Nihil, quidem, officiis, et ex laudantium sed cupiditate voluptatum libero nobis sit illum voluptates beatae ab. Ad, repellendus non sequi et at."
      }, {
        title: "Disabled",
        content: "Dynamic content 2.  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nihil, quidem, officiis, et ex laudantium sed cupiditate voluptatum libero nobis sit illum voluptates beatae ab. Ad, repellendus non sequi et at.",
        disabled: !0
      }], $scope.navType = "pills"
    }]).controller("TreeDemoCtrl", ["$scope", function($scope) {
      return $scope.list = [{
        id: 1,
        title: "Item 1",
        items: []
      }, {
        id: 2,
        title: "Item 2",
        items: [{
          id: 21,
          title: "Item 2.1",
          items: [{
            id: 211,
            title: "Item 2.1.1",
            items: []
          }, {
            id: 212,
            title: "Item 2.1.2",
            items: []
          }]
        }, {
          id: 22,
          title: "Item 2.2",
          items: [{
            id: 221,
            title: "Item 2.2.1",
            items: []
          }, {
            id: 222,
            title: "Item 2.2.2",
            items: []
          }]
        }]
      }, {
        id: 3,
        title: "Item 3",
        items: []
      }, {
        id: 4,
        title: "Item 4",
        items: [{
          id: 41,
          title: "Item 4.1",
          items: []
        }]
      }, {
        id: 5,
        title: "Item 5",
        items: []
      }, {
        id: 6,
        title: "Item 6",
        items: []
      }, {
        id: 7,
        title: "Item 7",
        items: []
      }], $scope.selectedItem = {}, $scope.options = {}, $scope.remove = function(scope) {
        scope.remove()
      }, $scope.toggle = function(scope) {
        scope.toggle()
      }, $scope.newSubItem = function(scope) {
        var nodeData;
        nodeData = scope.$modelValue, nodeData.items.push({
          id: 10 * nodeData.id + nodeData.items.length,
          title: nodeData.title + "." + (nodeData.items.length + 1),
          items: []
        })
      }
    }]).controller("MapDemoCtrl", ["$scope", "$http", "$interval", function($scope, $http, $interval) {
      var i, markers;
      for (markers = [], i = 0; 8 > i;) markers[i] = new google.maps.Marker({
        title: "Marker: " + i
      }), i++;
      $scope.GenerateMapMarkers = function() {
        var d, lat, lng, loc, numMarkers;
        for (d = new Date, $scope.date = d.toLocaleString(), numMarkers = Math.floor(4 * Math.random()) + 4, i = 0; numMarkers > i;) lat = 43.66 + Math.random() / 100, lng = -79.4103 + Math.random() / 100, loc = new google.maps.LatLng(lat, lng), markers[i].setPosition(loc), markers[i].setMap($scope.map), i++
      }, $interval($scope.GenerateMapMarkers, 2e3)
    }])
  }.call(this),
  function() {
    "use strict";
    angular.module("app.ui.directives", []).directive("uiTime", [function() {
      return {
        restrict: "A",
        link: function(scope, ele) {
          var checkTime, startTime;
          return startTime = function() {
            var h, m, s, t, time, today;
            return today = new Date, h = today.getHours(), m = today.getMinutes(), s = today.getSeconds(), m = checkTime(m), s = checkTime(s), time = h + ":" + m + ":" + s, ele.html(time), t = setTimeout(startTime, 500)
          }, checkTime = function(i) {
            return 10 > i && (i = "0" + i), i
          }, startTime()
        }
      }
    }]).directive("uiWeather", [function() {
      return {
        restrict: "A",
        link: function(scope, ele, attrs) {
          var color, icon, skycons;
          return color = attrs.color, icon = Skycons[attrs.icon], skycons = new Skycons({
            color: color,
            resizeClear: !0
          }), skycons.add(ele[0], icon), skycons.play()
        }
      }
    }])
  }.call(this),
  function() {
    "use strict";
    angular.module("app.ui.services", []).factory("logger", [function() {
      var logIt;
      return toastr.options = {
        closeButton: !0,
        positionClass: "toast-bottom-right",
        timeOut: "3000"
      }, logIt = function(message, type) {
        return toastr[type](message)
      }, {
        log: function(message) {
          logIt(message, "info")
        },
        logWarning: function(message) {
          logIt(message, "warning")
        },
        logSuccess: function(message) {
          logIt(message, "success")
        },
        logError: function(message) {
          logIt(message, "error")
        }
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
    }]).directive("slimScroll", [function() {
      return {
        restrict: "A",
        link: function(scope, ele, attrs) {
          return ele.slimScroll({
            height: attrs.scrollHeight || "100%"
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
  function() {
    "use strict";
    angular.module("app.localization", []).factory("localize", ["$http", "$rootScope", "$window", function($http, $rootScope, $window) {
      var localize;
      return localize = {
        language: "",
        url: void 0,
        resourceFileLoaded: !1,
        successCallback: function(data) {
          return localize.dictionary = data, localize.resourceFileLoaded = !0, $rootScope.$broadcast("localizeResourcesUpdated")
        },
        setLanguage: function(value) {
          return localize.language = value.toLowerCase().split("-")[0], localize.initLocalizedResources()
        },
        setUrl: function(value) {
          return localize.url = value, localize.initLocalizedResources()
        },
        buildUrl: function() {
          return localize.language || (localize.language = ($window.navigator.userLanguage || $window.navigator.language).toLowerCase(), localize.language = localize.language.split("-")[0]), "i18n/resources-locale_" + localize.language + ".js"
        },
        initLocalizedResources: function() {
          var url;
          return url = localize.url || localize.buildUrl(), $http({
            method: "GET",
            url: url,
            cache: !1
          }).success(localize.successCallback).error(function() {
            return $rootScope.$broadcast("localizeResourcesUpdated")
          })
        },
        getLocalizedString: function(value) {
          var result, valueLowerCase;
          return result = void 0, localize.dictionary && value ? (valueLowerCase = value.toLowerCase(), result = "" === localize.dictionary[valueLowerCase] ? value : localize.dictionary[valueLowerCase]) : result = value, result
        }
      }
    }]).directive("i18n", ["localize", function(localize) {
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
    }]).controller("LangCtrl", ["$scope", "localize", function($scope, localize) {//Borrar

      return $scope.lang = "English", $scope.setLang = function(lang) {
        switch (lang) {
          case "English":
            localize.setLanguage("EN-US");
            break;
          case "Español":
            localize.setLanguage("ES-ES");
            break;
          case "日本語":
            localize.setLanguage("JA-JP");
            break;
          case "中文":
            localize.setLanguage("ZH-TW");
            break;
          case "Deutsch":
            localize.setLanguage("DE-DE");
            break;
          case "français":
            localize.setLanguage("FR-FR");
            break;
          case "Italiano":
            localize.setLanguage("IT-IT");
            break;
          case "Portugal":
            localize.setLanguage("PT-BR");
            break;
          case "Русский язык":
            localize.setLanguage("RU-RU");
            break;
          case "한국어":
            localize.setLanguage("KO-KR")
        }
        return $scope.lang = lang
      }, $scope.getFlag = function() {
        var lang;
        switch (lang = $scope.lang) {
          case "English":
            return "flags-american";
          case "Español":
            return "flags-spain";
          case "日本語":
            return "flags-japan";
          case "中文":
            return "flags-china";
          case "Deutsch":
            return "flags-germany";
          case "français":
            return "flags-france";
          case "Italiano":
            return "flags-italy";
          case "Portugal":
            return "flags-portugal";
          case "Русский язык":
            return "flags-russia";
          case "한국어":
            return "flags-korea"
        }
      }

    }])
  }.call(this),
  function() {
    "use strict";
    angular.module("app.controllers", []).controller("AppCtrl", ["$scope", "$location", function($scope, $location) {
      return $scope.isSpecificPage = function() {
        var path;
        return path = $location.path(), _.contains(["/404", "/pages/500", "/pages/login", "/pages/signin", "/pages/signin1", "/pages/signin2", "/pages/signup", "/pages/signup1", "/pages/signup2", "/pages/forgot", "/pages/lock-screen"], path)
      }, $scope.main = {
        brand: "e-Chat",
        name: "Agente 1"
      }
    }]).controller("NavCtrl", ["$scope", "taskStorage", "filterFilter", function($scope, taskStorage, filterFilter) {
      var tasks;
      return tasks = $scope.tasks = taskStorage.get(), $scope.taskRemainingCount = filterFilter(tasks, {
        completed: !1
      }).length, $scope.$on("taskRemaining:changed", function(event, count) {
        return $scope.taskRemainingCount = count
      })
    }]).controller("DashboardCtrl", ["$scope", function() {

    }]).controller("FooCtrl", ["$scope", function() {

    	alert("soy foo controller");

    }]).controller("LoginCtrl", ["$scope", function() {

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
