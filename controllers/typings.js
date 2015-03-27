//Typing Controller

app.controller("TypingCtrl", function($scope, $http, TypingLNFactory){

    $scope.getLN = TypingLNFactory;

});
