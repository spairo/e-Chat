'use strict';
<<<<<<< Updated upstream
//Business Lines Controller

app.controller("BusinessCtrl", function($scope, $state, $http, $modal, $modalStack, ngToast, auth, TypingLNFactory, BasesFactory){
=======

//Business Lines Controller

app.controller('BusinessCtrl', function ($scope, $state, $http, $modal, $modalStack, ngToast, auth, TypingFactory, BasesService, BasesFactory){

>>>>>>> Stashed changes
  //Get Centers list
  //$scope.getBusiness = listline.data;
  $scope.Paso1_Linea = "";

  $scope.$on('LoadList', function(event){

      //$scope.getBusiness = listline.data;

      $http({
        method : 'POST',
        url : 'api/rest.php',
        data : $.param($scope.getListBusiness = { op: "listaLineaNegocio", Linea: "", Activo: "" }),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
      .success(function(data){
        $scope.getBusiness = data;
      })
      .error(function(data){
        var msg = ngToast.create({
          content: 'Opps!, Algo salio mal intenta otra vez',
          className:  'danger'
        });
      })

  });

  $scope.$emit('LoadList');

  //Modal, Create, Edit

  var myid = $scope.status = auth.profileID;

  $scope.CreateBusiness = function(){

    var modalInstance = $modal.open({
      templateUrl: 'ModalCreate.html',
      controller: 'BusinessCtrl'
    });

  };

  $scope.addLine = { op: "mantLineaNegocio", Id: "0", Linea: "", Activo: "", Descripcion: "", UserId: myid };

  $scope.AddBusiness = function(){

    $http({
      method: 'POST',
      url: 'api/rest.php',
      data: $.param($scope.addLine),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){

      var line_checked = angular.isNumber(data[0].Column1);

      if(line_checked == true){

        ngToast.create('Línea de Negocio creada con exito');
        $scope.$emit('LoadList');
        $scope.$apply;
        $modalStack.dismissAll();

      }else{
        var msg = ngToast.create({
          content: 'Error, La Línea de Negocio no fue creada',
          className:  'danger'
        });
      }

    })
    .error(function(data){
      var msg = ngToast.create({
        content: 'Opps!, Algo salio mal intenta otra vez',
        className:  'danger'
      });
    })
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

<<<<<<< Updated upstream
    //TypingService.addItem(lineaNegocioId, linea);
=======
    console.log("router > ", $state.current.name);

    //add factory
>>>>>>> Stashed changes

    $scope.Typing = TypingFactory;
    $scope.Typing.lineaNegocioId = lineaNegocioId;
    $scope.Typing.linea = linea;

<<<<<<< Updated upstream
    //add LN factory
=======
    //add factory

>>>>>>> Stashed changes
    $scope.dataBases = BasesFactory;
    $scope.dataBases.lineaNegocioId = lineaNegocioId;
    $scope.dataBases.linea = linea;

    if($state.current.name == "bases.lines")
      $state.go('bases.clients');
    else if($state.current.name == "typing.lines")
      $state.go('typing.clients');

  };

});


app.controller('InstanceLinesCtrl', function($scope, $http, $modalInstance, $modalStack, ngToast, linesdata, grid){

  var editdata = linesdata;

  $scope.EditLine = {
    op: "mantLineaNegocio",
    Id: editdata[0].id,
    Linea: editdata[0].linea,
    Descripcion: editdata[0].descripcion,
    Activo: editdata[0].activo,
    UserId: editdata[0].myid
  };

  $scope.EditLines = function(){

    $http({
      method: 'POST',
      url: 'api/rest.php',
      data: $.param($scope.EditLine),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){

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
    .error(function(data){
      var msg = ngToast.create({
        content: 'Opps!, Algo salio mal intenta otra vez',
        className:	'danger'
      });
    })

  };

  $scope.CloseLines = function(){ $modalStack.dismissAll(); };

});
