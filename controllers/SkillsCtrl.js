'use strict';

// Skills Controller
app.controller("SkillsCtrl", function($scope, $state, $http, $modal, $modalStack, ngToast, auth, TypingLNFactory, BasesFactory){

  //get id de autenticado
  var myid = $scope.status = auth.profileID;

  //get values LN factory
  $scope.getLN = TypingLNFactory;
  $scope.dataBases = BasesFactory;

  //modelos
  $scope.addSkill = { op: "mantSkills", Id: "0", CanalesId: "", ServiciosId: "", Skill: "", Activo: "",  UserId: myid };

  $scope.$on('cargaListas', function(event){

    var servicio = "";
    var canal = "";
    var cliente = "";
    if($state.current.name == "bases.skills")
    {
      servicio = $scope.dataBases.servicio;
      canal = $scope.dataBases.canal;
      cliente = $scope.dataBases.cliente;
    }
    else if($state.current.name == "typing.skills")
    {
      servicio = $scope.getLN.servicio;
      canal = $scope.getLN.canal;
      cliente = $scope.getLN.cliente;
    }

    //get lista de skills
    $scope.getListaSkills = { op: "listaSkills", Skill: "", Servicio: servicio, Canal: canal, Activo:""};
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
    $scope.getListaCanales = { op: "listaCanales", Canal: canal, Activo:""};
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
    $scope.getListaServicios = { op: "listaServicios", Servicio: servicio, ClienteAtento: cliente, Activo:""};
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

  //Selected servicio
  $scope.selected = function(skillsId, skill){
    $scope.dataBases.skillsId = skillsId;
    $scope.dataBases.skill = skill;


    if($state.current.name == "bases.skills")
      $state.go('bases.bases');
    else if($state.current.name == "typing.skills")
      $state.go('typing.trees');
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