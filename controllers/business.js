'use strict';

//Business Lines Controller

app.controller('BusinessCtrl', function($scope, $state, $http, $modal, $modalStack, ngToast, auth, TypingFactory, BasesService, BasesFactory, resources_POST){

  $scope.$on('LoadList', function(event){

      $scope.parameters = { Linea: "", Activo: "" };
      $scope.option = "rp_listaLineaNegocio";

      resources_POST.post($scope.option, $scope.parameters)
      .then(function(data){
          $scope.getBusiness = data;
      })
      .catch(function(data, status){
         var msg = ngToast.create({
           content: "Opps!, Algo salio mal intenta otra vez",
           className: "danger"
         });
      })
      .finally(function(){});

  });

  $scope.$emit('LoadList');

  // Create

  var myid = $scope.status = auth.profileID;

  $scope.CreateBusiness = function(){

    var modalInstance = $modal.open({
      templateUrl: 'ModalCreate.html',
      controller: 'AddLineCtrl',
      resolve: {
        gri: function(){
          return $scope;
        }
      }
    });

  };

  // Edit Line

  $scope.openedit = function(lineaNegocioId, linea, Descripcion, activo){

    var modalInstance = $modal.open({
      templateUrl: 'ModalEditLines.html',
      controller: 'InstanceLinesCtrl',
      resolve: {
        linesdata: function (){
          return $scope.linesdata = [
            {
              id: lineaNegocioId,
              linea: linea,
              descripcion: Descripcion,
              activo: activo,
              myid: myid
            }
          ]
        },
        grid: function(){
          return $scope;
        }
      }
    });

  };

  //Selected Line

  $scope.selected = function(lineaNegocioId, linea){

    //add factory
    $scope.Typing = TypingFactory;
    $scope.Typing.lineaNegocioId = lineaNegocioId;
    $scope.Typing.linea = linea;

    //add factory
    $scope.dataBases = BasesFactory;
    $scope.dataBases.lineaNegocioId = lineaNegocioId;
    $scope.dataBases.linea = linea;

    if($state.current.name == "bases.lines")
      $state.go('bases.clients');
    else if($state.current.name == "typing.lines")
      $state.go('typing.clients');

  };

});

app.controller('AddLineCtrl', function($scope, $http, $modalInstance, ngToast, auth, gri, resources_POST){
  //$modalInstance, $modalStack, ngToast, auth, gri

  var myid = $scope.status = auth.profileID;

  $scope.parameters = { Id: "0", Linea: "", Activo: "", Descripcion: "", UserId: myid };
  $scope.option = "rp_mantLineaNegocio";

  $scope.AddBusiness = function(){

      resources_POST.post($scope.option, $scope.parameters)
      .then(function(data){

          var line_checked = angular.isNumber(data[0].Column1);

          if(line_checked == true){

            ngToast.create('Línea de Negocio creada con exito');
            gri.$emit('LoadList');
            $scope.$apply;
            $modalInstance.close();

          }else{
            var msg = ngToast.create({
              content: 'Error, La Línea de Negocio no fue creada',
              className:  'danger'
            });
          }

      })
      .catch(function(data, status){
         var msg = ngToast.create({
           content: "Opps!, Algo salio mal intenta otra vez",
           className: "danger"
         });
      })
      .finally(function(){});
  };

});

app.controller('InstanceLinesCtrl', function($scope, $http, $modalInstance, $modalStack, ngToast, linesdata, grid, resources_POST){

  var editdata = linesdata;

  $scope.parameters = {
    Id: editdata[0].id,
    Linea: editdata[0].linea,
    Descripcion: editdata[0].descripcion,
    Activo: editdata[0].activo,
    UserId: editdata[0].myid
  };

  $scope.option = "rp_mantLineaNegocio";

  $scope.EditLines = function(){

      resources_POST.post($scope.option, $scope.parameters)
      .then(function(data){

          var line_checked = angular.isNumber(data[0].Column1);

          if(line_checked == true){

            ngToast.create('La Línea de Negocio fue Editada con Exito');
            grid.$emit('LoadList');
            $modalStack.dismissAll();

          }else{
            var msg = ngToast.create({
              content: 'Error, La Línea de Negocio no fue Editada',
              className:	'danger'
            });
          }

      })
      .catch(function(data, status){
         var msg = ngToast.create({
           content: "Opps!, Algo salio mal intenta otra vez",
           className: "danger"
         });
      })
      .finally(function(){});

  };

  $scope.CloseLines = function(){ $modalStack.dismissAll(); };

});
