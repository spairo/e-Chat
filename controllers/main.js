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

  $scope.openedit = function (usuariosId, perfil, nombres, apellidos, usuario, password, sexo, servicio) {

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
                user: usuario,
                pass: password,
                service: servicio,
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

app.controller('InstanceUserCtrl', function ($scope, $http, $modalInstance, $modalStack, ngToast, userdatas, grid){


  $scope.EditUs = { op: "mantUsuarios", Id: userdatas[0].id, PerfilId: userdatas[0].profile, Nombre: userdatas[0].name, Apellidos: userdatas[0].lastname, Sexo: userdatas[0].sex, Usuario: userdatas[0].user, Password: userdatas[0].pass, Activo: userdatas[0].activo, UserIdModif: userdatas[0].myid };

  $scope.EditUser = function(usuariosId){

      $http({
        method: 'POST',
        url: 'api/rest.php',
        data: $.param($scope.EditUs),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
      .success(function(data){


      })
      .error(function(data){
        var msg = ngToast.create({
          content: 'Opps!, Algo salio mal intenta otra vez',
          className:	'danger'
        });
      })

  };

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

});

//Channels Controller

app.controller('ChannelsCtrl', function($scope, $http, $modal, $modalStack, ngToast, auth){

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

});

//Business Lines Controller
app.controller('BusinessCtrl', function ($scope, $http, $modal, $modalStack, ngToast, auth){

  //Get Centers list

  $scope.$on('LoadList', function(event){

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

});

app.controller('InstanceLinesCtrl', function($scope, $http, $modalInstance, $modalStack, ngToast, linesdata, grid){

  var editdata = linesdata;

  $scope.EditLine = { op: "mantLineaNegocio", Id: editdata[0].id, Linea: editdata[0].linea, Descripcion: editdata[0].descripcion, Activo: editdata[0].activo, UserId: editdata[0].myid };

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

});

// Clientes Controller
app.controller("ClientesCtrl", function($scope, $http, $modal, $modalStack, ngToast, auth){

  //get id de autenticado
  var myid = $scope.status = auth.profileID;

  //modelos
  $scope.addClient = { op: "mantClienteAtento", Id: "0", LineaId: "", Cliente: "", Activo: "",  UserId: myid };
  //$scope.editClient = { op: "Mantenimiento_Cliente_Atento", Id: "0", LineaId: "", Cliente: "", Activo: "",  UserId: myid };
  //$scope.disabledClient = { op: "Mantenimiento_Cliente_Atento", Id: "0", LineaId: "", Cliente: "", Activo: "",  UserId: myid };

  $scope.$on('cargaListas', function(event){

    //get lista de clientes
    $scope.getListaClientes = { op: "listaClienteAtento", Linea: "", Cliente: "", Activo:""};
    $http({
      method : 'POST',
      url : 'api/rest.php',
      data : $.param($scope.getListaClientes),
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){
      $scope.listaClienteAtentoResult = data;
      console.info("ClientesCtrl > getListaClientes >>> OK");
    })
    .error(function(data){
      console.error("ClientesCtrl > getListaClientes >>> ERROR HTTP");
    })

    //get lista de lineas de negocio
    $scope.getListaLineas = { op: "listaLineaNegocio", Linea: "", Activo:""};
    $http({
      method : 'POST',
      url : 'api/rest.php',
      data : $.param($scope.getListaLineas),
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){
      $scope.listaLineaNegocioResult = data;
      console.info("ClientesCtrl > getListaLineas >>> OK");
    })
    .error(function(data){
      console.error("ClientesCtrl > getListaLineas >>> ERROR HTTP");
    })
  });

  $scope.$emit('cargaListas');

  //$scope.search = {Linea:"", Cliente:"", Activo:""};


  //se muestra modal para crear cliente
  $scope.CreateClient = function(){
    var modalInstance = $modal.open({
      templateUrl: 'ModalCreate_Client.html',
      controller: 'ClientesCtrl'
    });
  };

  //funcion que agrega un cliente nuevo a la base
  $scope.AddClient = function(){
    $http({
      method : 'POST',
      url : 'api/rest.php',
      data : $.param($scope.addClient),
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){

      if(data == 'Error'){
        ngToast.create('EL cliente no ha sido creado, revisa tus datos requeridos');
        console.warn("ClientesCtrl > AddClient > mantClienteAtento >>> ERROR WS");
      }
      else{
        var cliente_checked = angular.isNumber(data[0].Column1);
        if(cliente_checked == true){
          ngToast.create('El cliente fue creado con exito');
          console.info("ClientesCtrl > AddClient > mantClienteAtento >>> Ok");
          $scope.$emit('cargaListas');
          $modalStack.dismissAll();
        }
        else{
          ngToast.create('EL cliente no ha sido creado');
          $scope.result = data;
          console.warn("ClientesCtrl > AddClient > mantClienteAtento >>> CLIENTE NO CREADO");
        }
      }

      return;
    })
    .error(function(data){
      console.error("ClientesCtrl > AddClient > mantClienteAtento >>> ERROR HTTP");
      return;
    })
  };

  //se muestra modal para editar cliente
  $scope.openEdit = function(linea, cliente, activo){
    //consultamos los datos del clienteId al que se le dio click para editar
    $scope.getClientData = { op: "listaClienteAtento", Linea: linea, Cliente: cliente, Activo:activo};
    //$scope.getListaClientes = { op: "listaClienteAtento", Linea: "", Cliente: "", Activo:""};
    $http({
      method : 'POST',
      url : 'api/rest.php',
      data : $.param($scope.getClientData),
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){
      $scope.clienteAtentoResult = data;
      console.info("ClientesCtrl > openEdit > listaClienteAtento >>> OK");

      var modalInstance = $modal.open({
        templateUrl: 'ModalEdit_Client.html',
        controller: 'ModalEdit_ClientController',
        resolve: {
          client: function () {
          return $scope.clienteAtentoResult;
          },
          scopee: function () {
          return $scope;
          }
        }
      });

    })
    .error(function(data){
      console.error("ClientesCtrl > openEdit > listaClienteAtento >>> ERROR HTTP");
    })
  };

  $scope.CloseLines = function()
  { 
    $modalStack.dismissAll(); 
  };

});

//controlador para la tabla de lista de clientes
app.controller("ModalEdit_ClientController", function($scope, $http, $modalInstance, ngToast, auth, client, scopee){
  //get id de autenticado
  var myid = $scope.status = auth.profileID;

  $scope.editClient = { op: "mantClienteAtento", Id: client[0].clienteAtentoId, LineaId: client[0].lineaNegocioId, Cliente: client[0].cliente, Activo: client[0].activo,  UserId: myid };

  //get lista de lineas de negocio
  $scope.getListaLineas = { op: "listaLineaNegocio", Linea: "", Activo:""};
  $http({
    method : 'POST',
    url : 'api/rest.php',
    data : $.param($scope.getListaLineas),
    headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
  .success(function(data){
    $scope.listaLineaNegocioResult = data;

    angular.forEach($scope.listaLineaNegocioResult, function(item) {
      if(client[0].lineaNegocioId == item.lineaNegocioId)
        $scope.selectedOption = item;
    });

    console.info("ModalEdit_ClientController > getListaLineas >>> OK");
  })
  .error(function(data){
    console.error("ModalEdit_ClientController > getListaLineas >>> ERROR HTTP");
  })

  $scope.client = client;

  $scope.changedValueLine=function(item){
    $scope.editClient.LineaId = item.lineaNegocioId;
  }

  $scope.EditClient = function () {
     $http({
      method : 'POST',
      url : 'api/rest.php',
      data : $.param($scope.editClient),
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){

      if(data == 'Error'){
        ngToast.create('EL cliente no ha sido editado, revisa tus datos requeridos');
        console.warn("ModalEdit_ClientController > EditClient > mantClienteAtento >>> ERROR WS");
      }
      else{
        var cliente_checked = angular.isNumber(data[0].Column1);
        if(cliente_checked == true){
          ngToast.create('El cliente fue editado con exito');
          console.info("ModalEdit_ClientController > EditClient > mantClienteAtento >>> Ok");
          scopee.$emit('cargaListas');
          $modalInstance.close();
        }
        else{
          ngToast.create('EL cliente no ha sido editado');
          $scope.result = data;
          console.warn("ModalEdit_ClientController > EditClient > mantClienteAtento >>> CLIENTE NO EDITADO");
        }
      }

      return;
    })
    .error(function(data){
      console.error("ModalEdit_ClientController > EditClient > mantClienteAtento >>> ERROR HTTP");
      $modalInstance.close();
      return;
    })
  };

  $scope.CloseLines = function()
  { 
    //$modalInstance.dismissAll(); 
    $modalInstance.close(); 
  };

});

// Servicios Controller
app.controller("ServiciosCtrl", function($scope, $http, $modal, $modalStack, ngToast, auth){

  //get id de autenticado
  var myid = $scope.status = auth.profileID;

  //modelos
  $scope.addServicio = { op: "mantServicio", id: "0", cliAteId: "", Servicio: "", Activo: "",  UserId: myid };

  $scope.$on('cargaListas', function(event){

    //get lista de servicios
    $scope.getListaServicios = { op: "listaServicios", Servicio: "", ClienteAtento: "", Activo:""};
    $http({
      method : 'POST',
      url : 'api/rest.php',
      data : $.param($scope.getListaServicios),
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){
      $scope.listaServiciosResult = data;
      console.info("ServiciosCtrl > getListaServicios >>> OK");
    })
    .error(function(data){
      console.error("ServiciosCtrl > getListaServicios >>> ERROR HTTP");
    })

    //get lista de clientes
    $scope.getListaClientes = { op: "listaClienteAtento", Linea: "", Cliente: "", Activo:""};
    $http({
      method : 'POST',
      url : 'api/rest.php',
      data : $.param($scope.getListaClientes),
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){
      $scope.listaClienteAtentoResult = data;
      console.info("ServiciosCtrl > getListaClientes >>> OK");
    })
    .error(function(data){
      console.error("ServiciosCtrl > getListaClientes >>> ERROR HTTP");
    })

  });

  $scope.$emit('cargaListas');

  //se muestra modal para crear servicio
  $scope.CreateServicio = function(){
    var modalInstance = $modal.open({
      templateUrl: 'ModalCreate_Servicio.html',
      controller: 'ServiciosCtrl'
    });
  };

  //funcion que agrega un servicio nuevo a la base
  $scope.AddServicio = function(){
    $http({
      method : 'POST',
      url : 'api/rest.php',
      data : $.param($scope.addServicio),
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){

      if(data == 'Error'){
        ngToast.create('EL servicio no ha sido creado, revisa tus datos requeridos');
        console.warn("ServiciosCtrl > AddServicio > mantServicio >>> ERROR WS");
      }
      else{
        var servicio_checked = angular.isNumber(data[0].Column1);
        if(servicio_checked == true){
          ngToast.create('El servicio fue creado con exito');
          console.info("ServiciosCtrl > AddServicio > mantServicio >>> Ok");
          $scope.$emit('cargaListas');
          $modalStack.dismissAll();
        }
        else{
          ngToast.create('EL servicio no ha sido creado');
          $scope.result = data;
          console.warn("ServiciosCtrl > AddServicio > mantServicio >>> SERVICIO NO CREADO");
        }
      }

      return;
    })
    .error(function(data){
      console.error("ServiciosCtrl > AddServicio > mantServicio >>> ERROR HTTP");
      return;
    })
  };

  //se muestra modal para editar servicio
  $scope.openEdit = function(servicio, cliente, activo){
    //consultamos los datos del servicio al que se le dio click para editar
    $scope.getServiceData = { op: "listaServicios", Servicio: servicio, ClienteAtento: cliente, Activo:activo};

    $http({
      method : 'POST',
      url : 'api/rest.php',
      data : $.param($scope.getServiceData),
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){
      $scope.servicioResult = data;
      console.info("ServiciosCtrl > openEdit > listaServicios >>> OK");

      var modalInstance = $modal.open({
        templateUrl: 'ModalEdit_Servicio.html',
        controller: 'ModalEdit_ServiciosController',
        resolve: {
          service: function () {
          return $scope.servicioResult;
          },
          scopee: function () {
          return $scope;
          }
        }
      });

    })
    .error(function(data){
      console.error("ServiciosCtrl > openEdit > listaServicios >>> ERROR HTTP");
    })
  };

  $scope.CloseLines = function()
  { 
    $modalStack.dismissAll(); 
  };

});

//controlador para model de edicion de servicios
app.controller("ModalEdit_ServiciosController", function($scope, $http, $modalInstance, ngToast, auth, service, scopee){
  //get id de autenticado
  var myid = $scope.status = auth.profileID;

  $scope.editServicio = { op: "mantServicio", id: service[0].serviciosId, cliAteId: service[0].clienteAtentoId, Servicio: service[0].servicio, Activo: service[0].activo,  UserId: myid };

  //get lista de lineas de negocio
  $scope.getListaClientes = { op: "listaClienteAtento", Linea: "", Cliente: "", Activo:""};
  $http({
    method : 'POST',
    url : 'api/rest.php',
    data : $.param($scope.getListaClientes),
    headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
  .success(function(data){
    $scope.listaClienteAtentoResult = data;

    angular.forEach($scope.listaClienteAtentoResult, function(item) {
      if(service[0].clienteAtentoId == item.clienteAtentoId)
        $scope.selectedOption = item;
    });

    console.info("ModalEdit_ServiciosController > getListaClientes >>> OK");
  })
  .error(function(data){
    console.error("ModalEdit_ServiciosController > getListaClientes >>> ERROR HTTP");
  })

  $scope.service = service;

  $scope.changedValueCliente=function(item){
    $scope.editServicio.cliAteId = item.clienteAtentoId;
  }

  $scope.EditServicio = function () {
     $http({
      method : 'POST',
      url : 'api/rest.php',
      data : $.param($scope.editServicio),
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){

      if(data == 'Error'){
        ngToast.create('EL servicio no ha sido editado, revisa tus datos requeridos');
        console.warn("ModalEdit_ServiciosController > EditServicio > mantServicios >>> ERROR WS");
      }
      else{
        var servicio_checked = angular.isNumber(data[0].Column1);
        if(servicio_checked == true){
          ngToast.create('El servicio fue editado con exito');
          console.info("ModalEdit_ServiciosController > EditServicio > mantServicios >>> Ok");
          scopee.$emit('cargaListas');
          $modalInstance.close();
        }
        else{
          ngToast.create('EL servicio no ha sido editado');
          $scope.result = data;
          console.warn("ModalEdit_ServiciosController > EditServicio > mantServicios >>> SERVICIO NO EDITADO");
        }
      }

      return;
    })
    .error(function(data){
      console.error("ModalEdit_ServiciosController > EditServicio > mantServicios >>> ERROR HTTP");
      $modalInstance.close();
      return;
    })
  };

  $scope.CloseLines = function()
  { 
    $modalInstance.close(); 
  };

});

// BasesCtrl Controller
app.controller("BasesCtrl", function($scope, $http, $modal, $modalStack, ngToast, auth){

  //get id de autenticado
  var myid = $scope.status = auth.profileID;

  $scope.tableRowExpanded = false;
  $scope.tableRowIndexExpandedCurr = "";
  $scope.tableRowIndexExpandedPrev = "";
  $scope.nombreExpanded = "";
  $scope.getBase2 = false;

  $scope.Fecha_Ini = "";
  $scope.Fecha_Fin = "";
    
  $scope.baseDataCollapseFn = function () {
    $scope.baseDataCollapse = [];
      for (var i = 0; i < $scope.listaBasesResult.length; i += 1) {
        $scope.baseDataCollapse.push(false);
      }
  };

  $scope.$on('cargaListas', function(event){

    //get lista de bases
    $scope.getListaBases = { op: "listaBases", Skill: "", Base: "", Activo:""};
    $http({
      method : 'POST',
      url : 'api/rest.php',
      data : $.param($scope.getListaBases),
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){
      $scope.listaBasesResult = data;
      console.info("BasesCtrl > getListaBases >>> OK");
    })
    .error(function(data){
      console.error("BasesCtrl > getListaBases >>> ERROR HTTP");
    })  

    //get lista de skills
    $scope.getListaSkills = { op: "listaSkills", Skill: "", Servicio: "", Canal: "", Activo:""};
    $http({
      method : 'POST',
      url : 'api/rest.php',
      data : $.param($scope.getListaSkills),
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){
      $scope.listaSkillsResult = data;
      console.info("BasesCtrl > getListaSkills >>> OK");
    })
    .error(function(data){
      console.error("BasesCtrl > getListaSkills >>> ERROR HTTP");
    })  

  });

  $scope.$emit('cargaListas');

  //se muestra modal para crear base
  $scope.CreateBase = function(){
    var modalInstance = $modal.open({
      templateUrl: 'ModalCreate_Base.html',
      controller: 'BasesCtrl'
    });
  };

  $scope.addBase = { op: "mantBases", Id: "0", SkillId: "", NombreBase: "", Descripcion: "", FechaIni: "", FechaFin: "", Activo: "",  UserIdModif: myid };

  //funcion que agrega una base nueva a la base de datos
  $scope.AddBase = function(){    
    var dd = $scope.Fecha_Ini.getDate();
    var mm = $scope.Fecha_Ini.getMonth()+1;
    var yyyy = $scope.Fecha_Ini.getFullYear();
    if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} 
    $scope.addBase.FechaIni = yyyy+"-"+mm+"-"+dd;

    dd = $scope.Fecha_Fin.getDate();
    mm = $scope.Fecha_Fin.getMonth()+1;
    yyyy = $scope.Fecha_Fin.getFullYear();
    if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} 
    $scope.addBase.FechaFin = yyyy+"-"+mm+"-"+dd;

    $http({
      method : 'POST',
      url : 'api/rest.php',
      data : $.param($scope.addBase),
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){

      if(data == 'Error'){
        ngToast.create('La base no ha sido creada, revisa tus datos requeridos');
        console.warn("BasesCtrl > AddServicio > mantServicio >>> ERROR WS");
      }
      else{
        var servicio_checked = angular.isNumber(data[0].Column1);
        if(servicio_checked == true){
          ngToast.create('La base fue creada con exito');
          console.info("BasesCtrl > AddServicio > mantServicio >>> Ok");
          $scope.$emit('cargaListas');
          $modalStack.dismissAll();
        }
        else{
          ngToast.create('La base no ha sido creada');
          $scope.result = data;
          console.warn("BasesCtrl > AddServicio > mantServicio >>> BASE NO CREADA");
        }
      }

      return;
    })
    .error(function(data){
      console.error("BasesCtrl > AddServicio > mantServicio >>> ERROR HTTP");
      return;
    })
  };

  //se muestra modal para editar una base
  $scope.openEdit = function(skill, nombre, activo){
    //consultamos los datos de la base a la que se le dio click para editar
    $scope.getBaseData = { op: "listaBases", Skill: skill, Base: nombre, Activo: activo};

    $http({
      method : 'POST',
      url : 'api/rest.php',
      data : $.param($scope.getBaseData),
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){
      $scope.baseResult = data;
      console.info("BasesCtrl > openEdit > getBaseData >>> OK");

      var modalInstance = $modal.open({
        templateUrl: 'ModalEdit_Base.html',
        controller: 'ModalEdit_BaseController',
        resolve: {
          base: function () {
          return $scope.baseResult;
          },
          scopee: function () {
          return $scope;
          }
        }
      });

    })
    .error(function(data){
      console.error("BasesCtrl > openEdit > getBaseData >>> ERROR HTTP");
    })
  };


  $scope.selectTableRow = function (index, nombre) {
    $scope.listaBasesCamposResult = null;

    if (typeof $scope.baseDataCollapse === 'undefined') {
      $scope.baseDataCollapseFn();
    }

    if ($scope.tableRowExpanded === false && $scope.tableRowIndexExpandedCurr === "" && $scope.nombreExpanded === "") {
      $scope.tableRowIndexExpandedPrev = "";
      $scope.tableRowExpanded = true;
      $scope.tableRowIndexExpandedCurr = index;
      $scope.nombreExpanded = nombre;
      $scope.baseDataCollapse[index] = true;
      $scope.getBase2 = true;
    } 
    else 
      if ($scope.tableRowExpanded === true) {
        if ($scope.tableRowIndexExpandedCurr === index && $scope.nombreExpanded === nombre) {
          $scope.tableRowExpanded = false;
          $scope.tableRowIndexExpandedCurr = "";
          $scope.nombreExpanded = "";
          $scope.baseDataCollapse[index] = false;
          $scope.getBase2 = false;
        } 
        else {
          $scope.tableRowIndexExpandedPrev = $scope.tableRowIndexExpandedCurr;
          $scope.tableRowIndexExpandedCurr = index;
          $scope.nombreExpanded = nombre;
          $scope.baseDataCollapse[$scope.tableRowIndexExpandedPrev] = false;
          $scope.baseDataCollapse[$scope.tableRowIndexExpandedCurr] = true;
          $scope.getBase2 = true;
        }
      }

    if($scope.getBase2 = true)
    {
      //get lista de bases
      $scope.getListaBasesCampos = { op: "listaBasesCampos", Base: nombre};
      $http({
        method : 'POST',
        url : 'api/rest.php',
        data : $.param($scope.getListaBasesCampos),
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
      .success(function(data){
        $scope.listaBasesCamposResult = data;
        console.info("BasesCtrl > getListaBasesCampos >>> OK");
      })
      .error(function(data){
        console.error("BasesCtrl > getListaBasesCampos >>> ERROR HTTP");
      })  
    }
  };  

  $scope.CloseLines = function()
  { 
    $modalStack.dismissAll(); 
  };

});

//controlador para model de edicion de bases
app.controller("ModalEdit_BaseController", function($scope, $http, $modalInstance, ngToast, auth, base, scopee){
  //get id de autenticado
  var myid = $scope.status = auth.profileID;

  $scope.editBase = { op: "mantBases", Id: base[0].skillsBasesId, SkillId: base[0].skillsId, NombreBase: base[0].nombre, Descripcion: base[0].descripcion, FechaIni: base[0].fechaInicio, FechaFin: base[0].fechaFin, Activo: base[0].activo,  UserId: myid };

  //get lista de skills
  $scope.getListaSkills = { op: "listaSkills", Skill: "", Servicio: "", Canal: "", Activo:""};
  $http({
    method : 'POST',
    url : 'api/rest.php',
    data : $.param($scope.getListaSkills),
    headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
  .success(function(data){
    $scope.listaSkillsResult = data;

    angular.forEach($scope.listaSkillsResult, function(item) {
      if(base[0].skillsId == item.skillsId)
        $scope.selectedOption = item;
    });

    console.info("ModalEdit_BaseController > getListaSkills >>> OK");
  })
  .error(function(data){
    console.error("ModalEdit_BaseController > getListaSkills >>> ERROR HTTP");
  })  

  $scope.base = base;

  $scope.changedValueSkill=function(item){
    $scope.editBase.SkillId = item.skillsId;
  }

  $scope.EditBase = function () {
     $http({
      method : 'POST',
      url : 'api/rest.php',
      data : $.param($scope.editBase),
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){

      if(data == 'Error'){
        ngToast.create('La base no ha sido editada, revisa tus datos requeridos');
        console.warn("ModalEdit_BaseController > EditBase > mantServicios >>> ERROR WS");
      }
      else{
        var servicio_checked = angular.isNumber(data[0].Column1);
        if(servicio_checked == true){
          ngToast.create('La base fue editada con exito');
          console.info("ModalEdit_BaseController > EditBase > mantServicios >>> Ok");
          scopee.$emit('cargaListas');
          $modalInstance.close();
        }
        else{
          ngToast.create('La base no ha sido editada');
          $scope.result = data;
          console.warn("ModalEdit_BaseController > EditBase > mantServicios >>> BASE NO EDITADA");
        }
      }

      return;
    })
    .error(function(data){
      console.error("ModalEdit_BaseController > EditBase > mantServicios >>> ERROR HTTP");
      $modalInstance.close();
      return;
    })
  };

   $scope.CloseLines = function()
  { 
    $modalInstance.close(); 
  };

});

// Skills Controller
app.controller("SkillsCtrl", function($scope, $http, $modal, $modalStack, ngToast, auth){

  //get id de autenticado
  var myid = $scope.status = auth.profileID;

  //modelos
  $scope.addSkill = { op: "mantSkills", Id: "0", CanalesId: "", ServiciosId: "", Skill: "", Activo: "",  UserId: myid };

  $scope.$on('cargaListas', function(event){

    //get lista de skills
    $scope.getListaSkills = { op: "listaSkills", Skill: "", Servicio: "", Canal: "", Activo:""};
    $http({
      method : 'POST',
      url : 'api/rest.php',
      data : $.param($scope.getListaSkills),
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){
      $scope.listaSkillsResult = data;
      console.info("SkillsCtrl > getListaSkills >>> OK");
    })
    .error(function(data){
      console.error("SkillsCtrl > getListaSkills >>> ERROR HTTP");
    })

    //get lista de canales
    $scope.getListaCanales = { op: "listaCanales", Canal: "", Activo:""};
    $http({
      method : 'POST',
      url : 'api/rest.php',
      data : $.param($scope.getListaCanales),
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){
      $scope.listaCanalesResult = data;
      console.info("SkillsCtrl > getListaCanales >>> OK");
    })
    .error(function(data){
      console.error("SkillsCtrl > getListaCanales >>> ERROR HTTP");
    })

    //get lista de servicios
    $scope.getListaServicios = { op: "listaServicios", Servicio: "", ClienteAtento: "", Activo:""};
    $http({
      method : 'POST',
      url : 'api/rest.php',
      data : $.param($scope.getListaServicios),
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){
      $scope.listaServiciosResult = data;
      console.info("SkillsCtrl > getListaServicios >>> OK");
    })
    .error(function(data){
      console.error("SkillsCtrl > getListaServicios >>> ERROR HTTP");
    })
  });

  $scope.$emit('cargaListas');

  //se muestra modal para crear skill
  $scope.CreateSkill = function(){
    var modalInstance = $modal.open({
      templateUrl: 'ModalCreate_Skill.html',
      controller: 'SkillsCtrl'
    });
  };

  //funcion que agrega un skill nuevo a la base
  $scope.AddSkill = function(){
    $http({
      method : 'POST',
      url : 'api/rest.php',
      data : $.param($scope.addSkill),
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){

      if(data == 'Error'){
        ngToast.create('EL skill no ha sido creado, revisa tus datos requeridos');
        console.warn("SkillsCtrl > AddSkill > mantSkills >>> ERROR WS");
      }
      else{
        var skill_checked = angular.isNumber(data[0].Column1);
        if(skill_checked == true){
          ngToast.create('El skill fue creado con exito');
          console.info("SkillsCtrl > AddSkill > mantSkills >>> Ok");
          $scope.$emit('cargaListas');
          $modalStack.dismissAll();
        }
        else{
          ngToast.create('EL skill no ha sido creado');
          $scope.result = data;
          console.warn("SkillsCtrl > AddSkill > mantSkills >>> SKILL NO CREADO");
        }
      }

      return;
    })
    .error(function(data){
      console.error("SkillsCtrl > AddSkill > mantSkills >>> ERROR HTTP");
      return;
    })
  };

  //se muestra modal para editar skill
  $scope.openEdit = function(skill, servicio, canal, activo){
    //consultamos los datos del skillId al que se le dio click para editar
    $scope.getSkillData = { op: "listaSkills", Skill: skill, Servicio: servicio, Canal: canal, Activo:activo};
    
    $http({
      method : 'POST',
      url : 'api/rest.php',
      data : $.param($scope.getSkillData),
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){
      $scope.skillResult = data;
      console.info("SkillsCtrl > openEdit > listaSkills >>> OK");

      var modalInstance = $modal.open({
        templateUrl: 'ModalEdit_Skill.html',
        controller: 'ModalEdit_SkillController',
        resolve: {
          skill: function () {
          return $scope.skillResult;
          },
          scopee: function () {
          return $scope;
          }
        }
      });

    })
    .error(function(data){
      console.error("SkillsCtrl > openEdit > listaSkills >>> ERROR HTTP");
    })
  };

  $scope.CloseLines = function()
  { 
    $modalStack.dismissAll(); 
  };

});

//controlador para la tabla de lista de skills
app.controller("ModalEdit_SkillController", function($scope, $http, $modalInstance, ngToast, auth, skill, scopee){
  //get id de autenticado
  var myid = $scope.status = auth.profileID;

  $scope.editSkill = { op: "mantSkills", Id: skill[0].skillsId, CanalesId: skill[0].canalesId, ServiciosId: skill[0].serviciosId, Skill: skill[0].skill, Activo: skill[0].activo,  UserId: myid };

  //get lista de canales
  $scope.getListaCanales = { op: "listaCanales", Canal: "", Activo:""};
  $http({
    method : 'POST',
    url : 'api/rest.php',
    data : $.param($scope.getListaCanales),
    headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
  .success(function(data){
    $scope.listaCanalesResult = data;

    angular.forEach($scope.listaCanalesResult, function(item) {
      if(skill[0].canalesId == item.canalesId)
        $scope.selectedCanal = item;
    });

    console.info("ModalEdit_SkillController > getListaCanales >>> OK");
  })
  .error(function(data){
    console.error("ModalEdit_SkillController > getListaCanales >>> ERROR HTTP");
  })

  //get lista de servicios
  $scope.getListaServicios = { op: "listaServicios", Servicio: "", ClienteAtento: "", Activo:""};
  $http({
    method : 'POST',
    url : 'api/rest.php',
    data : $.param($scope.getListaServicios),
    headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
  .success(function(data){
    $scope.listaServiciosResult = data;

    angular.forEach($scope.listaServiciosResult, function(item) {
      if(skill[0].serviciosId == item.serviciosId)
        $scope.selectedServicio = item;
    });

    console.info("ModalEdit_SkillController > getListaServicios >>> OK");
  })
  .error(function(data){
    console.error("ModalEdit_SkillController > getListaServicios >>> ERROR HTTP");
  })

  $scope.skill = skill;

  $scope.changedValueCanal=function(item){
    $scope.editSkill.CanalesId = item.canalesId;
  }

   $scope.changedValueServicio=function(item){
    $scope.editSkill.ServiciosId = item.serviciosId;
  }

  $scope.EditSkill = function () {
     $http({
      method : 'POST',
      url : 'api/rest.php',
      data : $.param($scope.editSkill),
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(data){

      if(data == 'Error'){
        ngToast.create('EL skill no ha sido editado, revisa tus datos requeridos');
        console.warn("ModalEdit_SkillController > EditSkill > mantSkills >>> ERROR WS");
      }
      else{
        var skill_checked = angular.isNumber(data[0].Column1);
        if(skill_checked == true){
          ngToast.create('El skill fue editado con exito');
          console.info("ModalEdit_SkillController > EditSkill > mantSkills >>> Ok");
          scopee.$emit('cargaListas');
          $modalInstance.close();
        }
        else{
          ngToast.create('EL skill no ha sido editado');
          $scope.result = data;
          console.warn("ModalEdit_SkillController > EditSkill > mantSkills >>> CLIENTE NO EDITADO");
        }
      }

      return;
    })
    .error(function(data){
      console.error("ModalEdit_SkillController > EditSkill > mantSkills >>> ERROR HTTP");
      $modalInstance.close();
      return;
    })
  };

  $scope.CloseLines = function()
  { 
    //$modalInstance.dismissAll(); 
    $modalInstance.close(); 
  };

});