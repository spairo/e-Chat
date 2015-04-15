'use strict';

// Channels Controller

app.controller('ChannelsCtrl', function($scope, $state, $http, $modal, $modalStack, ngToast, auth, TypingFactory, BasesFactory, resources_POST){

  //get values LN factory
  $scope.Typing = TypingFactory;
  $scope.dataBases = BasesFactory;

   //Get Channels list
  $scope.$on('LoadList', function(event){

      $scope.parameters = { Canal: "", Activo: "" };
      $scope.option = "rp_listaCanales";

      resources_POST.post($scope.option, $scope.parameters)
      .then(function(data){
          $scope.getChannels = data;
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

  //Modal, Create, Edit

  var myid = $scope.status = auth.profileID;

  $scope.CreateChannel = function(){

    var modalInstance = $modal.open({
      templateUrl: 'ModalCreate.html',
      controller: 'AddChannelCtrl',
      resolve: {
        grid: function(){
          return $scope;
        }
      }
    });

  };

  // Edit channel

  $scope.openedit = function (usuariosId, canal, activo) {

    var modalInstance = $modal.open({
      templateUrl: 'ModalChannelEdit.html',
      controller: 'InstanceChannelCtrl',
      resolve: {
        canaldata: function () {
          return $scope.canaldata = [
            {
              id: usuariosId,
              canal: canal,
              activo: activo,
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

  //Selected channel
  $scope.selected = function(canalesId, canal){

    //add factory
    $scope.Typing.canalesId = canalesId;
    $scope.Typing.canal = canal;

    $scope.dataBases.canalesId = canalesId;
    $scope.dataBases.canal = canal;

    if($state.current.name == "bases.channels")
      $state.go('bases.skills');
    else if($state.current.name == "typing.channels")
      $state.go('typing.skills');
  };

});

app.controller('AddChannelCtrl', function($scope, $http, $modalInstance, $modalStack, ngToast, auth, grid, resources_POST){

  var myid = $scope.status = auth.profileID;

  $scope.parameters = { Id: "0", Canal: "", Activo: "", UserId: myid };
  $scope.option = "rp_mantCanales";

  $scope.AddChannel = function(){

    resources_POST.post($scope.option, $scope.parameters)
    .then(function(data){

        var channel_checked = angular.isNumber(data[0].Column1);

        if(channel_checked == true){

          ngToast.create('El Canal fue Creado con Exito');
          grid.$emit('LoadList');
          $modalStack.dismissAll();

        }else{
          var msg = ngToast.create({
            content: 'Error, EL Canal no fue creado',
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

app.controller('InstanceChannelCtrl', function($scope, $http, $modalInstance, $modalStack, ngToast, canaldata, grid, resources_POST){

  var editdata = canaldata;

  $scope.option = "rp_mantCanales";
  $scope.parameters = { Id: editdata[0].id, Canal: editdata[0].canal, Activo: editdata[0].activo, UserId: editdata[0].myid };

  $scope.EditChannel = function(){

    resources_POST.post($scope.option, $scope.parameters)
    .then(function(data){

        var channel_checked = angular.isNumber(data[0].Column1);

        if(channel_checked == true){

          ngToast.create('El Canal fue Editado con Exito');
          grid.$emit('LoadList');
          $modalStack.dismissAll();

        }else{
          var msg = ngToast.create({
            content: 'Error, EL Canal no fue Editado',
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

  $scope.CloseChannel = function(){ $modalStack.dismissAll(); };

});
