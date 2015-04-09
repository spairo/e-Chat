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


app.service("httpTestService",function( $http, $q ) { 
  
  function httppost(parameters) {
   
    var deferredAbort = $q.defer();
     
    var request = $http({
      method : 'POST',
      url : 'api/rest.php',
      data : $.param(parameters),
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' },
      timeout: deferredAbort.promise
    });
     
    var promise = request.then(
      function( response ) {
       
        return( response.data );
       
      },
      function( response ) {
       
        return( $q.reject( "Something went wrong" ) );
       
      }
    );
     
    promise.abort = function() {
     
      deferredAbort.resolve();
     
    };
     
    promise.finally(
      function() {
       
        console.info( "Cleaning up object references." );
         
        promise.abort = angular.noop;
         
        deferredAbort = request = promise = null;
       
      }
    );
     
    return( promise );
   
  }
   
  return({
    httppost: httppost
  });
   
});