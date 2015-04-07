'use strict';

//Typing Controller

app.controller("TypingCtrl", function($scope, $http, $state, $modal, $modalStack, ngToast, auth, TypingFactory){

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

    $scope.CreateTyping = function(skillsId, skillTipologiasIdSup){

      var modalInstance = $modal.open({
        templateUrl: 'ModalCreate.html',
        controller: 'TypingAddCtrl',
        resolve: {
          data: function () {
            return $scope.data = [
              {
                skillid: skillsId,
                IdSup: skillTipologiasIdSup,
                myid: myid,
              }
            ]
          },
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
      //data.length = 0;
      $state.go('typing.lines');
    };

});

app.controller("TypingAddCtrl", function($scope, $http, $modal, $modalStack, ngToast, auth, TypingFactory, data , grid){

    var myid = $scope.status = auth.profileID;
    $scope.typing = TypingFactory;

    $scope.addTy = {
      op: "mantTipologias",
      Id: "0",
      IdSup: data[0].IdSup,
      SkillId: data[0].skillid,
      Tipologia: "",
      Nivel: "",
      Activo: "",
      UserId: myid
    };

    $scope.AddTyping = function(){

      $http({
        method: 'POST',
        url: 'api/rest.php',
        data: $.param($scope.addTy),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
      .success(function(data){

        var channel_checked = angular.isNumber(data[0].Column1);

        if(channel_checked == true){

          ngToast.create('El Tipologia fue creada con exito');
          $scope.$emit('LoadList');
          $modalStack.dismissAll();

        }else{
          var msg = ngToast.create({
            content: 'Error, La Tipologia no fue creada',
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
