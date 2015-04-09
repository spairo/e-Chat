'use strict';

app.controller("TypingFormCtrl", function($scope, $state, TypingFactory){

    $scope.typing = TypingFactory;

    $scope.clear = function(){
      //data.length = 0;
      TypingFactory.lineaNegocioId = "";
      TypingFactory.linea = "";
      TypingFactory.clienteAtentoId = "";
      TypingFactory.cliente = "";
      TypingFactory.serviciosId = "";
      TypingFactory.servicio = ""; 
      TypingFactory.canalesId = "";
      TypingFactory.canal = "";
      TypingFactory.skillsId = "";
      TypingFactory.skill = "";
      
      $state.go('typing.lines');

    };

});

//Typing Controller
app.controller("TypingCtrl", function($scope, $http, $state, $modal, $modalStack, ngToast, auth, TypingFactory){

    var myid = $scope.status = auth.profileID;
    $scope.typing = TypingFactory;
    var skillsId = TypingFactory.skillsId;

    //list
    $scope.$on('LoadList', function(event){

      $http({
        method : 'POST',
        url : 'api/rest.php',
        data : $.param($scope.getListChannels = { op: "listaTipologias", Tipologia: "", Skill: $scope.typing.skill, Nivel: "", Activo: "" }),
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

    //NewSubTyping

    $scope.newSubItem = function(){
      alert("add child");
    };

    $scope.remove = function(){
      alert("remove this");
    };

    //selected

    $scope.selected = function(lineaNegocioId, linea){
      alert("Creando");
    };

    $scope.clear = function(){
      //data.length = 0;
      TypingFactory.lineaNegocioId = "";
      TypingFactory.linea = "";
      TypingFactory.clienteAtentoId = "";
      TypingFactory.cliente = "";
      TypingFactory.serviciosId = "";
      TypingFactory.servicio = ""; 
      TypingFactory.canalesId = "";
      TypingFactory.canal = "";
      TypingFactory.skillsId = "";
      TypingFactory.skill = "";
      
      $state.go('typing.lines');

    };

});

app.controller("TypingAddCtrl", function($scope, $http, $modal, $modalStack, ngToast, auth, TypingFactory, grid){

    var myid = $scope.status = auth.profileID;
    var skillsId = TypingFactory.skillsId;


    $scope.addTy = {
      op: "mantTipologias",
      Id: "0",
      IdSup: "0",
      SkillId: skillsId,
      Tipologia: "",
      Nivel: "0",
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
          grid.$emit('LoadList');
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
