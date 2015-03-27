'use strict';

/*
* @ngdoc function
* @name CamuApp.controller:MainCtrl
* @description
* # MainCtrl
* Controller of the CamuApp
*/

// App Controller
app.controller("AppCtrl", function($scope, $location, auth){

  $scope.status = auth;

  return $scope.isSpecificPage = function(){
    var path;
    return path = $location.path(), _.contains(["/404", "/pages/500", "/signin"], path)
  }, $scope.main = {
    brand: "Camu Dash"
  }

  $scope.bye = function(){

    alert("bye");

  };

});

//Header Controller

app.controller("HeaderCtrl", function($scope, $location, $cookies){

  $scope.logout = function(){

    //$cookies.remove("usuariocookie");
    //$cookies.remove("perfilcookie");
    //$cookies.remove("perfilesIdcookie");
    $location.path('signin');

  };

});

// Nav Controller
app.controller("NavCtrl", function($scope, taskStorage, filterFilter) {

  var tasks;
  return tasks = $scope.tasks = taskStorage.get(), $scope.taskRemainingCount = filterFilter(tasks, {
    completed: !1
  }).length, $scope.$on("taskRemaining:changed", function(event, count) {
    return $scope.taskRemainingCount = count
  })

});

// Login Controller

app.controller('LoginCtrl', function($scope, $http, $location, $cookies, ngToast, auth){

  $scope.access = { op: "seguridadLogin", User: "", Password: "" };

  $scope.login = function(){

    $http({ method : 'POST', url : 'api/rest.php', data : $.param($scope.access), headers : { 'Content-Type': 'application/x-www-form-urlencoded' } })
    .success(function(data){

      if(data == 'Error'){

        var msg = ngToast.create({
          content: 'Usuario o Password no valido',
          className:	'danger'
        });
        console.warn("Login Failed");

      }else{

        console.info("Login Done");

        //cookies everywhere
        $scope.LoginFactory = auth;
        $scope.LoginFactory.user = $cookies.usuariocookie = data[0].usuario;
        $scope.LoginFactory.profile = $cookies.perfilcookie = data[0].perfil;
        $scope.LoginFactory.profileID = $cookies.perfilesIdcookie = data[0].perfilesId;

        $location.path('dashboard');
        console.log(data);
      }

    })
    .error(function(data){
      var msg = ngToast.create({
        content: 'Opps!, Algo salio mal intenta otra vez',
        className:	'danger'
      });
      console.error("Login >>> error");
    })
  };

});

// Dashboard Controller

app.controller('DashboardCtrl', function($scope, ngToast, auth){

  var myname = $scope.status = auth.user;
  ngToast.create('Bienvenido a Camu ' + myname);
  //ngToast.dismiss();

});

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

// Users Controller

app.controller("UsersCtrl", function($scope, $http, $modal, $modalStack, ngToast, auth){

  $scope.$on('LoadList', function(event){

      $http({
        method : 'POST',
        url : 'api/rest.php',
        data : $.param($scope.getUsersList = { op: "listaUsuario", Usuario: "", Servicio: "", Skill: "", Perfil: "", activo: "" }),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
      .success(function(data){
        $scope.getUsers = data;
      })
      .error(function(data){
        var msg = ngToast.create({
          content: 'Opps! Algo salio mal Intenta Otra vez',
          className:	'danger'
        });
      })

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

  $scope.CreateUser = function(){

    var modalInstance = $modal.open({
      templateUrl: 'ModalCreate.html',
      controller: 'UsersCtrl'
    });

  };

  // Add User

  $scope.addU = { op: "mantUsuarios", Id: "0", Nombre: "", Apellidos: "", Usuario: "", Password: "", PerfilId: "", Sexo: "", Activo: "", UserIdModif: myid };

  $scope.AddUsers = function(){

    $http({
      method: 'POST',
      url: 'api/rest.php',
      data: $.param($scope.addU),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){

      var user_checked = angular.isNumber(data[0].Column1);

      if(user_checked == true){

        ngToast.create('El Usuario fue creado con Exito');
        $scope.$emit('LoadList');
        $modalStack.dismissAll();

      }else{
        var msg = ngToast.create({
          content: 'Error, EL Usuario no fue Creado',
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

  // Edit User

  $scope.openedit = function (usuariosId, perfilesId, perfil, nombres, apellidos, usuario, password, sexo, servicio, activo) {

      var modalInstance = $modal.open({
        templateUrl: 'ModalEdit.html',
        controller: 'InstanceUserCtrl',
        resolve: {

          userdatas: function () {
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

app.controller('InstanceUserCtrl', function ($scope, $http, $modalInstance, $modalStack, ngToast, auth, userdatas, grid){

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

  $scope.EditUs = {
    op: "mantUsuarios",
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

  $scope.EditUser = function(usuariosId){

      $http({
        method: 'POST',
        url: 'api/rest.php',
        data: $.param($scope.EditUs),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
      .success(function(data){

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
      .error(function(data){
        var msg = ngToast.create({
          content: 'Opps!, Algo salio mal intenta otra vez',
          className:	'danger'
        });
      })
  };

  $scope.CloseUser = function(){ $modalStack.dismissAll(); };

});

//Centers Controller

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

//Channels Controller

app.controller('ChannelsCtrl', function($scope, $state, $http, $modal, $modalStack, ngToast, auth, TypingLNFactory, BasesFactory){

   //Get Channels list
  $scope.$on('LoadList', function(event){

    $http({
      method : 'POST',
      url : 'api/rest.php',
      data : $.param($scope.getListChannels = { op: "listaCanales", Canal: "", Activo: "" }),
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){
      $scope.getChannels = data;
    })
    .error(function(data){
      var msg = ngToast.create({
        content: 'Opps!, Algo salio mal intenta otra vez',
        className:	'danger'
      });
    })
   });

   $scope.$emit('LoadList');

  //Modal, Create, Edit

  var myid = $scope.status = auth.profileID;

  $scope.CreateChannel = function(){

    var modalInstance = $modal.open({
      templateUrl: 'ModalCreate.html',
      controller: 'ChannelsCtrl'
    });

  };

  $scope.addCha = { op: "mantCanales", Id: "0", Canal: "", Activo: "", UserId: myid };

  $scope.AddChannel = function(){

    $http({
      method: 'POST',
      url: 'api/rest.php',
      data: $.param($scope.addCha),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){

      var channel_checked = angular.isNumber(data[0].Column1);

      if(channel_checked == true){

        ngToast.create('El Canal fue creado con exito');
        $scope.$emit('LoadList');
        $modalStack.dismissAll();


      }else{
        var msg = ngToast.create({
          content: 'Error, EL Canal no fue creado',
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
    $scope.dataBases.canalesId = canalesId;
    $scope.dataBases.canal = canal;

    if($state.current.name == "bases.channels")
      $state.go('bases.skills');
    else if($state.current.name == "typing.channels")
      $state.go('typing.skills');
  };

});

app.controller('InstanceChannelCtrl', function($scope, $http, $modalInstance, $modalStack, ngToast, canaldata, grid){

  var editdata = canaldata;

  $scope.EditCha = { op: "mantCanales", Id: editdata[0].id, Canal: editdata[0].canal, Activo: editdata[0].activo, UserId: editdata[0].myid };

  $scope.EditChannel = function(){

    $http({
      method: 'POST',
      url: 'api/rest.php',
      data: $.param($scope.EditCha),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){

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
    .error(function(data){
      var msg = ngToast.create({
        content: 'Opps!, Algo salio mal intenta otra vez',
        className:	'danger'
      });
    })


  };

  $scope.CloseChannel = function(){ $modalStack.dismissAll(); };

});

//Business Lines Controller

app.controller('BusinessCtrl', function ($scope, $state, $http, $modal, $modalStack, ngToast, auth, TypingService, TypingLNFactory, BasesService, BasesFactory){

  //Get Centers list
  //$scope.getBusiness = listline.data;

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
          className:	'danger'
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

    TypingService.addItem(lineaNegocioId, linea);

    //add LN factory
    $scope.TypingLN = TypingLNFactory;
    $scope.TypingLN.id = lineaNegocioId;
    $scope.TypingLN.linea = linea;

    BasesService.addItem(lineaNegocioId, linea);

    //add LN factory
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

//Typing Controller

app.controller("TypingCtrl", function($scope, $http, TypingService, TypingLNFactory){

    //$scope.items = TypingService.getItem();

    $scope.getLN = TypingLNFactory;

});









