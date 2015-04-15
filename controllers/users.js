'use strict';

// Users Controller

app.controller("UsersCtrl", function($scope, $http, $modal, $modalStack, ngToast, auth, resources_POST){

  $scope.$on('LoadList', function(event){

      $scope.parameters = { Usuario: "", Servicio: "", Skill: "", Perfil: "", activo: "" };
      $scope.option = "rp_listaUsuario";

      resources_POST.post($scope.option, $scope.parameters)
      .then(function(data){
        $scope.getUsers = data;
      })
      .catch(function(data, status){
         var msg = ngToast.create({
           content: "Opps! Algo salio mal Intenta Otra vez" + status,
           className: "danger"
         });
      });

  });

  $scope.$emit('LoadList');

  // Create/Modal/Settings/Roles Users

  var myid = $scope.status = auth.profileID;

  if(myid == 1){
    $scope.roloptions = [
      { name: 'SuperAdmin2', value: '1' },
      { name: 'Administrador', value: '2' },
      { name: 'TAM LN', value: '3' },
      { name: 'Gerente', value: '4' },
      { name: 'Supervisor', value: '5' },
      { name: 'BackOffice', value: '6' },
      { name: 'Agente', value: '7' }
    ];
  }else if(myid == 2){
    $scope.roloptions = [
      { name: 'Administrador', value: '2' },
      { name: 'TAM LN', value: '3' },
      { name: 'Gerente', value: '4' },
      { name: 'Supervisor', value: '5' },
      { name: 'BackOffice', value: '6' },
      { name: 'Agente', value: '7' }
    ];
  }
  else if(myid == 3){
    $scope.roloptions = [
      { name: 'TAM LN', value: '3' },
      { name: 'Gerente', value: '4' },
      { name: 'Supervisor', value: '5' },
      { name: 'BackOffice', value: '6' },
      { name: 'Agente', value: '7' }
    ];
  }
  else if(myid == 4){
    $scope.roloptions = [
      { name: 'Gerente', value: '4' },
      { name: 'Supervisor', value: '5' },
      { name: 'BackOffice', value: '6' },
      { name: 'Agente', value: '7' }
    ];
  }
  else if(myid == 5){
    $scope.roloptions = [
      { name: 'Supervisor', value: '5' },
      { name: 'BackOffice', value: '6' },
      { name: 'Agente', value: '7' }
    ];
  }
  else if(myid == 6){
    $scope.roloptions = [
      { name: 'BackOffice', value: '6' },
      { name: 'Agente', value: '7' }
    ];
  }
  else if(myid == 7){
    $scope.roloptions = [
      { name: 'Agente', value: '7' }
    ];
  }
  else{
    var msg = ngToast.create({
      content: 'Alerta , No puedes crear Usuarios',
      className:	'warning'
    });
  }

  // Add User

  $scope.CreateUser = function(){

    var modalInstance = $modal.open({
      templateUrl: 'ModalCreate.html',
      controller: 'addUserCtrl',
      resolve: {
        grid: function(){
          return $scope;
        }
      }
    });

  };

  // Edit User

  $scope.openedit = function (usuariosId, perfilesId, perfil, nombres, apellidos, usuario, password, sexo, servicio, activo) {

      var modalInstance = $modal.open({
        templateUrl: 'ModalEdit.html',
        controller: 'InstanceUserCtrl',
        resolve: {

          userdatas: function(){
            return $scope.userdatas = [
              {
                id: usuariosId,
                name: nombres,
                lastname: apellidos,
                sex: sexo,
                profile: perfil,
                profileid : perfilesId,
                user: usuario,
                pass: password,
                service: servicio,
                active: activo,
                myid: myid
              }
            ];
          },
          grid: function(){
            return $scope;
          }
        }
      });
  };

});

app.controller('addUserCtrl', function ($scope, $http, $modalInstance, $modalStack, ngToast, auth, grid, resources_POST){

  var myid = $scope.status = auth.profileID;

  if(myid == 1){
    $scope.roloptions = [
      { name: 'SuperAdmin2', value: '1' },
      { name: 'Administrador', value: '2' },
      { name: 'TAM LN', value: '3' },
      { name: 'Gerente', value: '4' },
      { name: 'Supervisor', value: '5' },
      { name: 'BackOffice', value: '6' },
      { name: 'Agente', value: '7' }
    ];
  }else if(myid == 2){
    $scope.roloptions = [
      { name: 'Administrador', value: '2' },
      { name: 'TAM LN', value: '3' },
      { name: 'Gerente', value: '4' },
      { name: 'Supervisor', value: '5' },
      { name: 'BackOffice', value: '6' },
      { name: 'Agente', value: '7' }
    ];
  }
  else if(myid == 3){
    $scope.roloptions = [
      { name: 'TAM LN', value: '3' },
      { name: 'Gerente', value: '4' },
      { name: 'Supervisor', value: '5' },
      { name: 'BackOffice', value: '6' },
      { name: 'Agente', value: '7' }
    ];
  }
  else if(myid == 4){
    $scope.roloptions = [
      { name: 'Gerente', value: '4' },
      { name: 'Supervisor', value: '5' },
      { name: 'BackOffice', value: '6' },
      { name: 'Agente', value: '7' }
    ];
  }
  else if(myid == 5){
    $scope.roloptions = [
      { name: 'Supervisor', value: '5' },
      { name: 'BackOffice', value: '6' },
      { name: 'Agente', value: '7' }
    ];
  }
  else if(myid == 6){
    $scope.roloptions = [
      { name: 'BackOffice', value: '6' },
      { name: 'Agente', value: '7' }
    ];
  }
  else if(myid == 7){
    $scope.roloptions = [
      { name: 'Agente', value: '7' }
    ];
  }
  else{
    var msg = ngToast.create({
      content: 'Alerta , No puedes crear Usuarios',
      className:	'warning'
    });
  }

  $scope.option = "mantUsuarios";
  $scope.parameters = { op: "mantUsuarios", Id: "0", Nombre: "", Apellidos: "", Usuario: "", Password: "", PerfilId: "", Sexo: "", Activo: "", UserIdModif: myid };

  $scope.AddUsers = function(){

      resources_POST.post($scope.option, $scope.parameters)
      .then(function(data){

          var user_checked = angular.isNumber(data[0].Column1);

          if(user_checked == true){

            ngToast.create('El Usuario fue creado con Exito');
            grid.$emit('LoadList');
            $modalStack.dismissAll();

          }else{
            var msg = ngToast.create({
              content: 'Error, EL Usuario no fue Creado',
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

});

app.controller('InstanceUserCtrl', function ($scope, $http, $modalInstance, $modalStack, ngToast, auth, userdatas, grid, resources_POST){

  var myid = $scope.status = auth.profileID;

  if(myid == 1){
    $scope.roloptions = [
      { name: 'SuperAdmin2', value: '1' },
      { name: 'Administrador', value: '2' },
      { name: 'TAM LN', value: '3' },
      { name: 'Gerente', value: '4' },
      { name: 'Supervisor', value: '5' },
      { name: 'BackOffice', value: '6' },
      { name: 'Agente', value: '7' }
    ];
  }else if(myid == 2){
    $scope.roloptions = [
      { name: 'Administrador', value: '2' },
      { name: 'TAM LN', value: '3' },
      { name: 'Gerente', value: '4' },
      { name: 'Supervisor', value: '5' },
      { name: 'BackOffice', value: '6' },
      { name: 'Agente', value: '7' }
    ];
  }
  else if(myid == 3){
    $scope.roloptions = [
      { name: 'TAM LN', value: '3' },
      { name: 'Gerente', value: '4' },
      { name: 'Supervisor', value: '5' },
      { name: 'BackOffice', value: '6' },
      { name: 'Agente', value: '7' }
    ];
  }
  else if(myid == 4){
    $scope.roloptions = [
      { name: 'Gerente', value: '4' },
      { name: 'Supervisor', value: '5' },
      { name: 'BackOffice', value: '6' },
      { name: 'Agente', value: '7' }
    ];
  }
  else if(myid == 5){
    $scope.roloptions = [
      { name: 'Supervisor', value: '5' },
      { name: 'BackOffice', value: '6' },
      { name: 'Agente', value: '7' }
    ];
  }
  else if(myid == 6){
    $scope.roloptions = [
      { name: 'BackOffice', value: '6' },
      { name: 'Agente', value: '7' }
    ];
  }
  else if(myid == 7){
    $scope.roloptions = [
      { name: 'Agente', value: '7' }
    ];
  }
  else{
    var msg = ngToast.create({
      content: 'Alerta , No puedes crear Usuarios',
      className:	'warning'
    });
  }

  $scope.option = "rp_mantUsuarios";

  $scope.parameters = {
    Id: userdatas[0].id,
    PerfilId: userdatas[0].profileid,
    Nombre: userdatas[0].name,
    Apellidos: userdatas[0].lastname,
    Sexo: userdatas[0].sex,
    Usuario: userdatas[0].user,
    Password: userdatas[0].pass,
    Activo: userdatas[0].active,
    UserIdModif: userdatas[0].myid
  };

  $scope.EditUser = function(){

      resources_POST.post($scope.option, $scope.parameters)
      .then(function(data){

          var user_checked = angular.isNumber(data[0].Column1);

          if(user_checked == true){

            ngToast.create('El Usuario fue Editado con Exito');
            grid.$emit('LoadList');
            $modalStack.dismissAll();

          }else{
            var msg = ngToast.create({
              content: 'Error, EL Usuario no fue editado',
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

  $scope.CloseUser = function(){ $modalStack.dismissAll(); };

});
