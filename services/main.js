'use strict';

/*
* @ngdoc function
* @name Camuapp.Services:Main
* @description
* # Main
* Services Camuapp
*/

// Typing Service

app.service('TypingService', function(){

  var itemList = [];

  var addItem = function(newObj, name){
      itemList.length = 0;
      itemList.push(newObj, name);
  }

  var getItem = function(){
      return itemList;
  }

  return {
    addItem: addItem,
    getItem: getItem
  };

});

// Bases Service

app.service('BasesService', function(){

  var itemList = [];

  var addItem = function(newObj, name){
      itemList.length = 0;
      itemList.push(newObj, name);
  }

  var getItem = function(){
      return itemList;
  }

  return {
    addItem: addItem,
    getItem: getItem
  };

});

<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
app.service("resources_POST",function($http, $q) {
  return{

    post: function(option, parameters){

      var deferred = $q.defer();

      var url = "http://172.18.149.21/Servicios/REST.svc/"+option;

      $http({
        method : "POST",
        url : url,
        data: JSON.stringify(parameters)
      })
      .success(deferred.resolve)
      .error(function(data, status, headers, config){
        deferred.reject("Error el el HTTP en la llamada: " + config.data)
      });

      return deferred.promise;
    }
  }

});

app.service("resources_GET",function($http, $q) {
 return{
    get: function(option, parameters){

      var deferred = $q.defer();

      var url = "http://172.18.149.21/Servicios/REST.svc/"+option;

      $http({
        method : "GET",
        url : url,
        data: JSON.stringify(parameters)
      })
      .success(deferred.resolve)
      .error(function(data, status, headers, config){
        deferred.reject("Error el el HTTP en la llamada: " + config.data)
      });

      return deferred.promise;
    }
  }

});
