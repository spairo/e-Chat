'use strict';
// Skills Controller

app.controller("SkillsCtrl", function($scope, $state, $modal, $modalStack, ngToast, auth, TypingFactory, BasesFactory, httpp){

  //get id de autenticado
  var myid = $scope.status = auth.profileID;

  //get values LN factory
  $scope.Typing = TypingFactory;
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
      servicio = $scope.Typing.servicio;
      canal = $scope.Typing.canal;
      cliente = $scope.Typing.cliente;
    }

    //get lista de skills
    $scope.getListaSkills = { op: "listaSkills", Skill: "", Servicio: servicio, Canal: canal, Activo:""};
    
    httpp.post($scope.getListaSkills)
    .then(function(data){
      $scope.listaSkillsResult = data;
    })
    .catch(function(data, status){
      console.error("Error en httpp ", status, data);
      var msg = ngToast.create({
        content: "Error en httpp " + status + data,
        className:  "danger"
      });
    })
    .finally(function(){
      console.log("Finaliza llamada a httpp");
    });

    //get lista de canales
    $scope.getListaCanales = { op: "listaCanales", Canal: canal, Activo:""};
    
    httpp.post($scope.getListaCanales)
    .then(function(data){
      $scope.listaCanalesResult = data;
    })
    .catch(function(data, status){
      console.error("Error en httpp ", status, data);
      var msg = ngToast.create({
        content: "Error en httpp " + status + data,
        className:  "danger"
      });
    })
    .finally(function(){
      console.log("Finaliza llamada a httpp");
    });

    //get lista de servicios
    $scope.getListaServicios = { op: "listaServicios", Servicio: servicio, ClienteAtento: cliente, Activo:""};
    
    httpp.post($scope.getListaServicios)
    .then(function(data){
      $scope.listaServiciosResult = data;
    })
    .catch(function(data, status){
      console.error("Error en httpp ", status, data);
      var msg = ngToast.create({
        content: "Error en httpp " + status + data,
        className:  "danger"
      });
    })
    .finally(function(){
      console.log("Finaliza llamada a httpp");
    });

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

    httpp.post($scope.getSkillData)
    .then(function(data){
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
    .catch(function(data, status){
      console.error("Error en httpp ", status, data);
      var msg = ngToast.create({
        content: "Error en httpp " + status + data,
        className:  "danger"
      });
    })
    .finally(function(){
      console.log("Finaliza llamada a httpp");
    });
  };

  //Selected servicio
  $scope.selected = function(skillsId, skill){

    //add LN factory
    $scope.Typing.skillsId = skillsId;
    $scope.Typing.skill = skill;

    $scope.dataBases.skillsId = skillsId;
    $scope.dataBases.skill = skill;

    if($state.current.name == "bases.skills")
      $state.go('bases.bases');
    else if($state.current.name == "typing.skills")
      $state.go('typing.trees');

  };

  $scope.StateReload = function(){
    $state.reload();

  };

});

//controlador para el modal agregar skill
app.controller("ModalCreate_SkillController", function($scope, $modalInstance, ngToast, auth, listaCanalesResult, listaServiciosResult, httpp){

  //get id de autenticado
  var myid = $scope.status = auth.profileID;
  $scope.listaCanalesResult = listaCanalesResult;
  $scope.listaServiciosResult = listaServiciosResult;

  $scope.addSkill = { op: "mantSkills", Id: "0", CanalesId: listaCanalesResult[0].canalesId, ServiciosId: listaServiciosResult[0].serviciosId, Skill: "", Activo: "",  UserId: myid };

  //funcion que agrega un skill nuevo a la base
  $scope.AddSkill = function(){
    
    httpp.post($scope.addSkill)
    .then(function(data){
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
    })
    .catch(function(data, status){
      console.error("Error en httpp ", status, data);
      var msg = ngToast.create({
        content: "Error en httpp " + status + data,
        className:  "danger"
      });
    })
    .finally(function(){
      console.log("Finaliza llamada a httpp");
      $modalInstance.close();
    });

  };

  $scope.CloseLines = function()
  {
    $modalInstance.close();
  };

});

//controlador para el modal editar skill
app.controller("ModalEdit_SkillController", function($scope, $modalInstance, ngToast, auth, skill, httpp){
  //get id de autenticado
  var myid = $scope.status = auth.profileID;

  $scope.editSkill = { op: "mantSkills", Id: skill[0].skillsId, CanalesId: skill[0].canalesId, ServiciosId: skill[0].serviciosId, Skill: skill[0].skill, Activo: skill[0].activo,  UserId: myid };

  $scope.skill = skill;

  $scope.EditSkill = function () {
     
    httpp.post($scope.editSkill)
    .then(function(data){
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
    })
    .catch(function(data, status){
      console.error("Error en httpp ", status, data);
      var msg = ngToast.create({
        content: "Error en httpp " + status + data,
        className:  "danger"
      });
    })
    .finally(function(){
      console.log("Finaliza llamada a httpp");
      $modalInstance.close();
    });

  };

  $scope.CloseLines = function()
  {
    $modalInstance.close();
  };

});
