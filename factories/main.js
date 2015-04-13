'use strict';

/*
* @ngdoc function
* @name Camuapp.Factories:Main
* @description
* # Main
* Factories Camuapp
*/

app.factory('auth',function(){
  return { user:"", profile:"", profileID:"" };
});

app.factory('TypingFactory',function(){
  return { lineaNegocioId:"", linea:"", clienteAtentoId: "", cliente: "", serviciosId: "", servicio: "", canalesId: "", canal: "", skillsId: "", skill: "" };
});

app.factory("BasesFactory",function(){
  return { lineaNegocioId:"", linea:"", clienteAtentoId: "", cliente: "", serviciosId: "", servicio: "", canalesId: "", canal: "", skillsId: "", skill: "" };
});

/*
app.factory('listline', function($http) {

  var getListBusiness = {
    op: "listaLineaNegocio",
    Linea: "",
    Activo: ""
  }

  function internalFunctionHandle() {
    return $http({
      method: 'POST',
      url: 'api/rest.php',
      data : $.param(getListBusiness),
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).then(function(resp){
      retObj.data = resp.data
      return resp.data;
      console.log("fffff");
    });
  }

  var retObj = {
    externalFunctionHandle: internalFunctionHandle
  }

  return retObj;

});
*/


app.factory('listline', function($http){

  var getListBusiness = {
    op: "listaLineaNegocio",
    Linea: "",
    Activo: ""
  }

  function internalFunctionHandle(){
    var getDataPromise = $http({
      method: 'POST',
      url: 'api/rest.php',
      data : $.param(getListBusiness),
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    getDataPromise.then(function(resp){
      retObj.data = resp.data
    })
    return getDataPromise;
  }

  var retObj = {
    externalFunctionHandle: internalFunctionHandle
  }

  internalFunctionHandle()
  return retObj;

});

app.factory("taskStorage", function() {
  var DEMO_TASKS, STORAGE_ID;
  return STORAGE_ID = "tasks", DEMO_TASKS = '[]', {
    get: function() {
      return JSON.parse(localStorage.getItem(STORAGE_ID) || DEMO_TASKS)
    },
    put: function(tasks) {
      return localStorage.setItem(STORAGE_ID, JSON.stringify(tasks))
    }
  }
});

app.factory("localize", function($http, $rootScope, $window){

  var localize;
  return localize = {
    url: void 0,
    resourceFileLoaded: !1,
    successCallback: function(data) {
      return localize.dictionary = data, localize.resourceFileLoaded = !0, $rootScope.$broadcast("localizeResourcesUpdated")
    },
    setUrl: function(value) {
      return localize.url = value, localize.initLocalizedResources()
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

});

app.factory('httpp', function($http, $q) {
  return{

    post: function(parameters){

      var deferred = $q.defer();

      $http({
        method : 'POST',
        url : 'api/rest.php',
        data : $.param(parameters),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
      .success(deferred.resolve)
      .error(function(data, status, headers, config){
        deferred.reject("Error el el HTTP en la llamada: " + config.data)
      });

      return deferred.promise;
    }
  }

});


