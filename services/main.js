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
