'use strict';
// Skills Controller

app.controller("SkillsCtrl", function($scope, $state, $http, $modal, $modalStack, ngToast, auth, TypingFactory, BasesFactory){

  //get id de autenticado
  var myid = $scope.status = auth.profileID;

  //get values LN factory
  $scope.getLN = TypingFactory;
  $scope.dataBases = BasesFactory;

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
      var msg = ngToast.create({
        content: 'Error al cargar la lista de skills; Detalles: SkillsCtrl > getListaSkills >>> ERROR HTTP',
        className:  'danger'
      });
      $modalInstance.close();
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
      var msg = ngToast.create({
        content: 'Error al cargar la lista de canales; Detalles: SkillsCtrl > getListaCanales >>> ERROR HTTP',
        className:  'danger'
      });
      $modalInstance.close();
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
      var msg = ngToast.create({
        content: 'Error al cargar la lista de servicios; Detalles: SkillsCtrl > getListaServicios >>> ERROR HTTP',
        className:  'danger'
      });
      $modalInstance.close();
    })
  });

  $scope.$emit('cargaListas');

  //se muestra modal para crear skill
  $scope.CreateSkill = function(){
    var modalInstance = $modal.open({
      templateUrl: 'ModalCreate_Skill.html',
      controller: 'ModalCreate_SkillController',
      resolve: {
        listaCanalesResult: function () {
          return $scope.listaCanalesResult;
        },
        listaServiciosResult: function () {
          return $scope.listaServiciosResult;
        }
      }
    });

    modalInstance.result.then(function(){
      $scope.$emit('cargaListas');
    });
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
          }
        }
      });

      modalInstance.result.then(function(){
        $scope.$emit('cargaListas');
      });

    })
    .error(function(data){
      console.error("SkillsCtrl > openEdit > listaSkills >>> ERROR HTTP");
      var msg = ngToast.create({
        content: 'Error al cargar el skill seleccionado; Detalles: SkillsCtrl > openEdit > listaSkills >>> ERROR HTTP',
        className:  'danger'
      });
      $modalInstance.close();
    })
  };

  //Selected servicio
  $scope.selected = function(skillsId, skill){

    //add LN factory
    $scope.Typing = TypingFactory;
    $scope.Typing.skillsId = skillsId;
    $scope.Typing.skill = skill;

    $scope.dataBases.skillsId = skillsId;
    $scope.dataBases.skill = skill;

    if($state.current.name == "bases.skills")
      $state.go('bases.bases');
    else if($state.current.name == "typing.skills")
      $state.go('typing.trees');

  };

});

//controlador para el modal agregar skill
app.controller("ModalCreate_SkillController", function($scope, $http, $modalInstance, ngToast, auth, listaCanalesResult, listaServiciosResult){

  //get id de autenticado
  var myid = $scope.status = auth.profileID;
  $scope.listaCanalesResult = listaCanalesResult;
  $scope.listaServiciosResult = listaServiciosResult;

  $scope.addSkill = { op: "mantSkills", Id: "0", CanalesId: listaCanalesResult[0].canalesId, ServiciosId: listaServiciosResult[0].serviciosId, Skill: "", Activo: "",  UserId: myid };

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
        console.warn("ModalCreate_SkillController > AddSkill > mantSkills >>> ERROR WS");
      }
      else{
        var skill_checked = angular.isNumber(data[0].Column1);
        if(skill_checked == true){
          ngToast.create('El skill fue creado con exito');
          console.info("ModalCreate_SkillController > AddSkill > mantSkills >>> Ok");
          $modalInstance.close();
        }
        else{
          ngToast.create('EL skill no ha sido creado');
          $scope.result = data;
          console.warn("ModalCreate_SkillController > AddSkill > mantSkills >>> SKILL NO CREADO");
        }
      }

      return;
    })
    .error(function(data){
      console.error("ModalCreate_SkillController > AddSkill > mantSkills >>> ERROR HTTP");
      var msg = ngToast.create({
        content: 'Error al Crear el Skill; Detalles: ModalCreate_SkillController > AddSkill > mantSkills >>> ERROR HTTP',
        className:  'danger'
      });
      $modalInstance.close();
    })
  };

  $scope.CloseLines = function()
  {
    $modalInstance.close();
  };

});

//controlador para el modal editar skill
app.controller("ModalEdit_SkillController", function($scope, $http, $modalInstance, ngToast, auth, skill){
  //get id de autenticado
  var myid = $scope.status = auth.profileID;

  $scope.editSkill = { op: "mantSkills", Id: skill[0].skillsId, CanalesId: skill[0].canalesId, ServiciosId: skill[0].serviciosId, Skill: skill[0].skill, Activo: skill[0].activo,  UserId: myid };

  $scope.skill = skill;

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
      var msg = ngToast.create({
        content: 'Error al Editar el Skill; Detalles: ModalEdit_SkillController > EditSkill > mantSkills >>> ERROR HTTP',
        className:  'danger'
      });
      $modalInstance.close();
    })
  };

  $scope.CloseLines = function()
  {
    $modalInstance.close();
  };

});
