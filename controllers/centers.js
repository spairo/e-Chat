
// Centers Controller

app.controller('CentersCtrl', function($scope, $http, $modal, $modalStack, ngToast, auth){

  //Get Center List

  $scope.$on('LoadCenterList', function(event){

    $http({
      method : 'POST',
      url : 'api/rest.php',
      data : $.param($scope.getListChannels = { op: "listaCentros", Centro: "", Activo: "" }),
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){
      $scope.getCenters = data;
    })
    .error(function(data){
      var msg = ngToast.create({
        content: 'Opps!, Algo salio mal intenta otra vez',
        className:	'danger'
      });
    })


  });

  $scope.$emit('LoadCenterList');

  //Modal, Create, Edit

  var myid = $scope.status = auth.profileID;

  $scope.CreateCenter = function(){

    var modalInstance = $modal.open({
      templateUrl: 'ModalCreate.html',
      controller: 'CentersCtrl'
    });

  };

  $scope.addCen = { op: "mantCentros", Id: "0", Centro: "", Activo: "", UserId: myid };

  $scope.AddCenter = function(){

    $http({
      method: 'POST',
      url: 'api/rest.php',
      data: $.param($scope.addCen),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){

      var center_checked = angular.isNumber(data[0].Column1);

      if(center_checked == true){

        ngToast.create('El Centro fue agregado con exito');
        $scope.$emit('LoadCenterList');
        $modalStack.dismissAll();

      }else{
        var msg = ngToast.create({
          content: 'Error, EL Centro no fue creado',
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

app.controller('InstanceCenterCtrl', function($scope, $http, $modalInstance, $modalStack, ngToast, auth, centerdata, idcenter, grid){

  var myid = $scope.status = auth.profileID;
  var idcenter = idcenter;
  var editdata = centerdata;

  $scope.EditCe = { op: "mantCentros", Id: idcenter, Centro: editdata[0].centro, Activo: editdata[0].activo, UserId: myid };

  $scope.EditCenter = function(){

    $http({
      method: 'POST',
      url: 'api/rest.php',
      data: $.param($scope.EditCe),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){

      var channel_checked = angular.isNumber(data[0].Column1);

      if(channel_checked == true){

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
    .error(function(data){
      var msg = ngToast.create({
        content: 'Opps!, Algo salio mal intenta otra vez',
        className:	'danger'
      });
    })

  };

  $scope.CloseCenter = function(){ $modalStack.dismissAll(); };

});
