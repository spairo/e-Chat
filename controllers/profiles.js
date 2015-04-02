'use strict';

// Profiles Controller

app.controller("ProfilesCtrl", function($scope, $http, $modal, $modalStack, ngToast, auth){

  $scope.$on('LoadList', function(event){

      $http({
        method : 'POST',
        url : 'api/rest.php',
        data : $.param($scope.getProfileList = { op: "listaPerfiles", Perfil: "", Activo: "" }),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
      .success(function(data){
        $scope.getProfiles = data;
      })
      .error(function(data){
        var msg = ngToast.create({
          content: 'Opps! Algo salio mal Intenta Otra vez',
          className:	'danger'
        });
      })

  });

  $scope.$emit('LoadList');

  // Create/Modal

  var myid = $scope.status = auth.profileID;

  $scope.CreateProfile = function(){

    var modalInstance = $modal.open({
      templateUrl: 'ModalCreate.html',
      controller: 'ProfilesCtrl'
    });

  };

  $scope.addProfile = { op: "mantPerfiles", Id: "0", Perfil:"", Descripcion: "", Activo: "", UserId: myid };

  $scope.AddProf = function(){

    $http({
      method: 'POST',
      url: 'api/rest.php',
      data: $.param($scope.addProfile),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){

      var profile_checked = angular.isNumber(data[0].Column1);

      if(profile_checked == true){

        ngToast.create('El Perfil fue agregado con exito');
        $scope.$emit('LoadList');
        $modalStack.dismissAll();

      }else{
        var msg = ngToast.create({
          content: 'Error, EL Perfil no fue creado',
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

  //Edit Profile

  $scope.openedit = function (perfilesId, perfil, descripcion, activo) {

    var modalInstance = $modal.open({
      templateUrl: 'ModalProfileEdit.html',
      controller: 'InstanceProfileCtrl',
      resolve: {
        profiledata: function () {
          return $scope.profiledata = [
            {
              id: perfilesId,
              perfil: perfil,
              descripcion: descripcion,
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

});

app.controller('InstanceProfileCtrl', function($scope, $http, $modalInstance, $modalStack, ngToast, profiledata, grid){

  var editdata = profiledata;

  $scope.EditPro = { op: "mantPerfiles", Id: editdata[0].id, Perfil: editdata[0].perfil, Descripcion: editdata[0].descripcion, Activo: editdata[0].activo, UserId: editdata[0].myid };

  $scope.EditProfile = function(){

    $http({
      method: 'POST',
      url: 'api/rest.php',
      data: $.param($scope.EditPro),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){

      var profile_checked = angular.isNumber(data[0].Column1);

      if(profile_checked == true){

        ngToast.create('El Perfil fue Editado con Exito');
        grid.$emit('LoadList');
        $modalStack.dismissAll();

      }else{
        var msg = ngToast.create({
          content: 'Error, EL Perfil no fue Editado',
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

  $scope.CloseProfile = function(){ $modalStack.dismissAll(); };

});
