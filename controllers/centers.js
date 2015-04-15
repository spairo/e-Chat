'use strict';

// Centers Controller

app.controller('CentersCtrl', function($scope, $http, $modal, $modalStack, ngToast, auth, resources_POST){

  //Get List

  $scope.$on('LoadCenterList', function(event){

    $scope.parameters = { Centro: "", Activo: "" };
    $scope.option = "rp_listaCentros";

    resources_POST.post($scope.option, $scope.parameters)
    .then(function(data){
      $scope.getCenters = data;
    })
    .catch(function(data, status){
       var msg = ngToast.create({
         content: "Opps!, Algo salio mal intenta otra vez",
         className: "danger"
       });
    })
    .finally(function(){});

  });

  $scope.$emit('LoadCenterList');

  //Modal, Create, Edit

  var myid = $scope.status = auth.profileID;

  $scope.CreateCenter = function(){

    var modalInstance = $modal.open({
      templateUrl: 'ModalCreate.html',
      controller: 'AddCenterCtrl',
      resolve: {
        grid: function(){
          return $scope;
        }
      }
    });

  };

  // Edit Center

  $scope.openedit = function (centrosId, centro, activo) {

    var idcenter = centrosId;

    $scope.getCenterProfile = { op: "listaCentros", Centro: centro, Activo: activo };

    $http({
       method : 'POST',
       url : 'api/rest.php',
       data : $.param($scope.getCenterProfile),
       headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){

        $scope.centerResult = data;

        var modalInstance = $modal.open({
          templateUrl: 'ModalEdit.html',
          controller: 'InstanceCenterCtrl',
          resolve: {
            centerdata: function(){
              return $scope.centerResult;
            },
            idcenter: function(){
              return idcenter;
            },
            grid: function(){
              return $scope;
            }

          }
        });

    })
    .error(function(data){
      var msg = ngToast.create({
        content: 'Opps!, Algo salio mal intenta otra vez',
        className:	'danger'
      });
    })

  };

});

app.controller('AddCenterCtrl', function($scope, $http, $modal, $modalStack, ngToast, auth, grid, resources_POST){

  var myid = $scope.status = auth.profileID;

  $scope.parameters = { Id: "0", Centro: "", Activo: "", UserId: myid };
  $scope.option = "rp_mantCentros";

  $scope.AddCenter = function(){

    resources_POST.post($scope.option, $scope.parameters)
    .then(function(data){

      var center_checked = angular.isNumber(data[0].Column1);

      if(center_checked == true){

        ngToast.create('El Centro fue agregado con exito');
        grid.$emit('LoadCenterList');
        $modalStack.dismissAll();

      }else{
        var msg = ngToast.create({
          content: 'Error, EL Centro no fue creado',
          className:	'danger'
        });
      }

    })
    .catch(function(data, status){
       var msg = ngToast.create({
         content: "Error httpp " + status + data,
         className: "danger"
       });
    })
    .finally(function(){});

  };

});

app.controller('InstanceCenterCtrl', function($scope, $http, $modalInstance, $modalStack, ngToast, auth, centerdata, idcenter, grid, resources_POST){

  var myid = $scope.status = auth.profileID;
  var idcenter = idcenter;
  var editdata = centerdata;

  $scope.parameters = { Id: idcenter, Centro: editdata[0].centro, Activo: editdata[0].activo, UserId: myid };
  $scope.option = "rp_mantCentros";

  $scope.EditCenter = function(){

    resources_POST.post($scope.option, $scope.parameters)
    .then(function(data){

      var center_checked = angular.isNumber(data[0].Column1);

      if(center_checked == true){

        ngToast.create('El Centro fue Editado con Exito');
        grid.$emit('LoadCenterList');
        $modalStack.dismissAll();

      }else{
        var msg = ngToast.create({
          content: 'Error, EL Centro no fue Editado',
          className:	'danger'
        });
      }

    })
    .catch(function(data, status){
       var msg = ngToast.create({
         content: "Error httpp " + status + data,
         className: "danger"
       });
    })
    .finally(function(){});

  };

  $scope.CloseCenter = function(){ $modalStack.dismissAll(); };

});
