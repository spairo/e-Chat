'use strict';

// Profiles Controller

app.controller("ProfilesCtrl", function($scope, $http, $modal, $modalStack, ngToast, auth, resources_POST){

  $scope.$on('LoadList', function(event){

    $scope.parameters = { Perfil: "", Activo: "" };
    $scope.option = "rp_listaPerfiles";

    resources_POST.post($scope.option, $scope.parameters)
    .then(function(data){
      $scope.getProfiles = data;
    })
    .catch(function(data, status){
       var msg = ngToast.create({
         content: "Opps! Algo salio mal Intenta Otra vez" + status,
         className: "danger"
       });
    });

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

  $scope.parameters = { Id: "0", Perfil:"", Descripcion: "", Activo: "", UserId: myid };
  $scope.option = "rp_mantPerfiles";

  $scope.AddProf = function(){

      resources_POST.post($scope.option, $scope.parameters)
      .then(function(data){

        var profile_checked = angular.isNumber(data[0].Column1);

        if(profile_checked == true){

          ngToast.create('El Perfil fue Agregado con Exito');
          $scope.$emit('LoadList');
          $modalStack.dismissAll();

        }else{
          var msg = ngToast.create({
            content: 'Error, EL Perfil no fue creado',
            className:	'danger'
          });
        }

      })
      .catch(function(data, status){
         var msg = ngToast.create({
           content: "Opps! Algo salio mal Intenta Otra vez" + status,
           className: "danger"
         });
      });

  };

  //Edit Profile

  $scope.openedit = function (perfilesId, perfil, descripcion, activo){

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

  $scope.parameters = { Id: editdata[0].id, Perfil: editdata[0].perfil, Descripcion: editdata[0].descripcion, Activo: editdata[0].activo, UserId: editdata[0].myid };
  $scope.option = "rp_mantPerfiles";

  $scope.EditProfile = function(){

    resources_POST.post($scope.option, $scope.parameters)
    .then(function(data){

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
    .catch(function(data, status){
       var msg = ngToast.create({
         content: "Opps! Algo salio mal Intenta Otra vez" + status,
         className: "danger"
       });
    });

  };

  $scope.CloseProfile = function(){ $modalStack.dismissAll(); };

});
