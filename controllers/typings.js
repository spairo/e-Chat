'use strict';
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
//Typing Controller

app.controller("TypingCtrl", function($scope, $http, $modal, $modalStack, ngToast, auth, TypingFactory){

    var myid = $scope.status = auth.profileID;
    $scope.typing = TypingFactory;

    //list
    $scope.$on('LoadList', function(event){

      $http({
        method : 'POST',
        url : 'api/rest.php',
        data : $.param($scope.getListChannels = { op: "listaTipologias", Tipologia: "", Skill: "", Nivel: "", Activo: "" }),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
      .success(function(data){
        $scope.getTypes = data;
      })
      .error(function(data){
        var msg = ngToast.create({
          content: 'Opps!, Algo salio mal intenta otra vez',
          className:	'danger'
        });
      })

    });

    $scope.$emit('LoadList');

    //create

    $scope.CreateTyping = function(){

      var modalInstance = $modal.open({
        templateUrl: 'ModalCreate.html',
        controller: 'TypingAddCtrl',
        resolve: {
          grid: function(){
            return $scope;
          }
        }
      });

    };

    //selected

    $scope.selected = function(lineaNegocioId, linea){
      alert("Creando");
    };

    $scope.clear = function(){
      data.length = 0;
    };

});

app.controller("TypingAddCtrl", function($scope, $http, $modal, $modalStack, ngToast, auth, TypingFactory, grid){

    var myid = $scope.status = auth.profileID;
    $scope.typing = TypingFactory;

    $scope.AddTyping = function(){
        alert("ading element");
    };

    //$scope.addCha = { op: "mantCanales", Id: "0", Canal: "", Activo: "", UserId: myid };

    $scope.AddTyping2 = function(){

      $http({
        method: 'POST',
        url: 'api/rest.php',
        data: $.param($scope.addCha),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
      .success(function(data){

        var channel_checked = angular.isNumber(data[0].Column1);

        if(channel_checked == true){

          ngToast.create('El Canal fue creado con exito');
          $scope.$emit('LoadList');
          $modalStack.dismissAll();

        }else{
          var msg = ngToast.create({
            content: 'Error, EL Canal no fue creado',
            className:	'danger'
          });
        }

      })
      .error(function(data){
        var msg = ngToast.create({
          content: 'Opps!, Algo salio mal intenta otra vez',
          className:	'danger'
        });
      })

    };

});
